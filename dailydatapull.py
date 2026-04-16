#!/usr/bin/env python3
"""Daily data pull utility for dashboard CSV refreshes.

This script reads a JSON config file that defines one or more database
connections and one or more exports. Each export writes:
1. a dated snapshot file: <base>_<YYYYMMDD>.csv
2. a latest alias file:   <base>.csv (optional)

The goal is a semi-manual but repeatable daily pull with minimal code changes.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import importlib
import json
import os
import re
import sys
import traceback
from pathlib import Path
from typing import Any


ENV_PATTERN = re.compile(r"\$\{([A-Za-z_][A-Za-z0-9_]*)\}")


def parse_args() -> argparse.Namespace:
	parser = argparse.ArgumentParser(description="Pull data from multiple DBs into CSV files.")
	parser.add_argument(
		"--config",
		default="data_pull_config.json",
		help="Path to JSON config file (default: data_pull_config.json)",
	)
	parser.add_argument(
		"--date",
		default="",
		help="Override run date in YYYYMMDD format (default: today's local date)",
	)
	parser.add_argument(
		"--fail-fast",
		action="store_true",
		help="Stop on first export failure instead of continuing.",
	)
	return parser.parse_args()


def expand_env(value: Any) -> Any:
	if isinstance(value, dict):
		return {k: expand_env(v) for k, v in value.items()}
	if isinstance(value, list):
		return [expand_env(item) for item in value]
	if isinstance(value, str):
		return ENV_PATTERN.sub(lambda m: os.environ.get(m.group(1), ""), value)
	return value


def load_config(config_path: Path) -> dict[str, Any]:
	with config_path.open("r", encoding="utf-8") as f:
		raw = json.load(f)
	return expand_env(raw)


def build_query(export_cfg: dict[str, Any]) -> str:
	if "query" in export_cfg and export_cfg["query"].strip():
		return str(export_cfg["query"])

	table_name = export_cfg.get("table", "").strip()
	if not table_name:
		raise ValueError("Each export must include either 'query' or 'table'.")

	columns = export_cfg.get("columns", ["*"])
	if not isinstance(columns, list) or not columns:
		raise ValueError("'columns' must be a non-empty list when 'table' is used.")

	col_clause = ", ".join(str(c) for c in columns)
	query = f"SELECT {col_clause} FROM {table_name}"

	filters = export_cfg.get("where", "").strip()
	if filters:
		query += f" WHERE {filters}"

	order_by = export_cfg.get("order_by", [])
	if order_by:
		if not isinstance(order_by, list):
			raise ValueError("'order_by' must be a list.")
		query += " ORDER BY " + ", ".join(str(item) for item in order_by)

	return query


def connect(connection_cfg: dict[str, Any]):
	module_name = connection_cfg.get("module", "").strip()
	if not module_name:
		raise ValueError("Connection is missing 'module' field.")

	db_module = importlib.import_module(module_name)

	if "connect" in connection_cfg:
		connect_arg = connection_cfg["connect"]
		return db_module.connect(connect_arg)

	connect_kwargs = connection_cfg.get("connect_kwargs", {})
	if not isinstance(connect_kwargs, dict):
		raise ValueError("'connect_kwargs' must be an object.")
	return db_module.connect(**connect_kwargs)


def write_csv(path: Path, headers: list[str], rows: list[tuple[Any, ...]]) -> None:
	path.parent.mkdir(parents=True, exist_ok=True)
	with path.open("w", encoding="utf-8", newline="") as f:
		writer = csv.writer(f)
		writer.writerow(headers)
		writer.writerows(rows)


def run_export(
	export_cfg: dict[str, Any],
	connections: dict[str, Any],
	output_dir: Path,
	run_date: str,
	write_latest_alias: bool,
) -> dict[str, Any]:
	name = export_cfg.get("name", "unnamed_export")
	conn_key = export_cfg.get("connection", "")
	if conn_key not in connections:
		raise KeyError(f"Export '{name}' references unknown connection '{conn_key}'.")

	file_base = export_cfg.get("file_base", name)
	file_ext = export_cfg.get("file_extension", "csv")
	dated_path = output_dir / f"{file_base}_{run_date}.{file_ext}"
	latest_path = output_dir / f"{file_base}.{file_ext}"

	query = build_query(export_cfg)
	conn = connections[conn_key]
	cursor = conn.cursor()
	try:
		cursor.execute(query)
		headers = [col[0] for col in cursor.description]
		rows = cursor.fetchall()
	finally:
		cursor.close()

	write_csv(dated_path, headers, rows)
	if write_latest_alias:
		write_csv(latest_path, headers, rows)

	return {
		"name": name,
		"connection": conn_key,
		"rows": len(rows),
		"dated_file": str(dated_path),
		"latest_file": str(latest_path) if write_latest_alias else None,
	}


def main() -> int:
	args = parse_args()
	config_path = Path(args.config)
	if not config_path.exists():
		print(f"Config file not found: {config_path}", file=sys.stderr)
		return 2

	run_date = args.date.strip() or dt.date.today().strftime("%Y%m%d")
	if not re.fullmatch(r"\d{8}", run_date):
		print("--date must be in YYYYMMDD format.", file=sys.stderr)
		return 2

	cfg = load_config(config_path)
	output_dir = Path(cfg.get("output_dir", "data"))
	write_latest_alias = bool(cfg.get("write_latest_alias", True))

	connections_cfg = cfg.get("connections", {})
	exports_cfg = cfg.get("exports", [])
	if not isinstance(connections_cfg, dict) or not connections_cfg:
		print("Config must include a non-empty 'connections' object.", file=sys.stderr)
		return 2
	if not isinstance(exports_cfg, list) or not exports_cfg:
		print("Config must include a non-empty 'exports' array.", file=sys.stderr)
		return 2

	connections: dict[str, Any] = {}
	for key, conn_cfg in connections_cfg.items():
		try:
			connections[key] = connect(conn_cfg)
		except Exception as exc:  # noqa: BLE001
			print(f"Connection failed for '{key}': {exc}", file=sys.stderr)
			if args.fail_fast:
				return 1

	if not connections:
		print("No database connections available; aborting.", file=sys.stderr)
		return 1

	started_at = dt.datetime.now().isoformat(timespec="seconds")
	successes: list[dict[str, Any]] = []
	failures: list[dict[str, str]] = []

	for export_cfg in exports_cfg:
		export_name = str(export_cfg.get("name", "unnamed_export"))
		try:
			result = run_export(
				export_cfg=export_cfg,
				connections=connections,
				output_dir=output_dir,
				run_date=run_date,
				write_latest_alias=write_latest_alias,
			)
			successes.append(result)
			print(f"OK   {result['name']}: {result['rows']} rows -> {result['dated_file']}")
		except Exception as exc:  # noqa: BLE001
			failures.append(
				{
					"name": export_name,
					"error": str(exc),
					"traceback": traceback.format_exc(limit=3),
				}
			)
			print(f"FAIL {export_name}: {exc}", file=sys.stderr)
			if args.fail_fast:
				break

	for conn in connections.values():
		try:
			conn.close()
		except Exception:  # noqa: BLE001
			pass

	manifest = {
		"started_at": started_at,
		"completed_at": dt.datetime.now().isoformat(timespec="seconds"),
		"run_date": run_date,
		"success_count": len(successes),
		"failure_count": len(failures),
		"successes": successes,
		"failures": failures,
	}

	output_dir.mkdir(parents=True, exist_ok=True)
	manifest_path = output_dir / "_pull_manifest.json"
	with manifest_path.open("w", encoding="utf-8") as f:
		json.dump(manifest, f, indent=2)

	print(f"Manifest written to {manifest_path}")
	return 0 if not failures else 1


if __name__ == "__main__":
	raise SystemExit(main())
