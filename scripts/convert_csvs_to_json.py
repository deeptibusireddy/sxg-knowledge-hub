#!/usr/bin/env python3
"""Convert daily-pull CSV files into the JSON format the dashboard expects.

Reads mapping rules from scripts/csv_json_mapping.json and writes each
public/data/*.json file. Skips any mapping whose source CSV is missing or empty
(the existing JSON file is left unchanged, so the dashboard keeps showing the
last good data).

Usage (from repo root):
    python scripts/convert_csvs_to_json.py
    python scripts/convert_csvs_to_json.py --mapping scripts/csv_json_mapping.json
    python scripts/convert_csvs_to_json.py --dry-run
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
import traceback
from pathlib import Path
from typing import Any


# ── CLI ──────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Convert CSVs to dashboard JSON files.")
    parser.add_argument(
        "--mapping",
        default="scripts/csv_json_mapping.json",
        help="Path to mapping config (default: scripts/csv_json_mapping.json)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be written without writing any files.",
    )
    return parser.parse_args()


# ── Type coercion ─────────────────────────────────────────────────────────────

def coerce(value: str, type_hint: str) -> Any:
    if type_hint == "number":
        try:
            f = float(value)
            return int(f) if f == int(f) else f
        except (ValueError, TypeError):
            return 0
    if type_hint == "boolean":
        return value.strip().lower() in ("true", "1", "yes")
    return value.strip()


# ── Core conversion ───────────────────────────────────────────────────────────

def convert_csv_to_json(
    source_path: Path,
    column_map: dict[str, str],
    type_hints: dict[str, str],
) -> list[dict[str, Any]]:
    """Read a CSV and return a list of dicts with renamed/coerced columns."""
    rows: list[dict[str, Any]] = []
    with source_path.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for raw_row in reader:
            out_row: dict[str, Any] = {}
            for src_col, dst_key in column_map.items():
                raw_val = raw_row.get(src_col, "").strip()
                hint = type_hints.get(dst_key, "string")
                out_row[dst_key] = coerce(raw_val, hint)
            rows.append(out_row)
    return rows


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> int:
    args = parse_args()
    mapping_path = Path(args.mapping)
    if not mapping_path.exists():
        print(f"Mapping file not found: {mapping_path}", file=sys.stderr)
        return 2

    with mapping_path.open(encoding="utf-8") as f:
        config = json.load(f)

    mappings: list[dict[str, Any]] = config.get("mappings", [])
    if not mappings:
        print("No mappings defined in config.", file=sys.stderr)
        return 2

    ok = 0
    skipped = 0
    failed = 0

    for m in mappings:
        name = m.get("name", "?")
        if not m.get("enabled", True):
            print(f"SKIP {name} (disabled)")
            skipped += 1
            continue

        source_path = Path(m["source_csv"])
        target_path = Path(m["target_json"])
        column_map: dict[str, str] = m.get("columns", {})
        type_hints: dict[str, str] = m.get("types", {})

        if not source_path.exists():
            print(f"SKIP {name} — source not found: {source_path}")
            skipped += 1
            continue

        if source_path.stat().st_size == 0:
            print(f"SKIP {name} — source is empty: {source_path}")
            skipped += 1
            continue

        try:
            rows = convert_csv_to_json(source_path, column_map, type_hints)
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL {name}: {exc}", file=sys.stderr)
            traceback.print_exc(limit=3, file=sys.stderr)
            failed += 1
            continue

        if not rows:
            print(f"SKIP {name} — CSV has no data rows")
            skipped += 1
            continue

        print(f"OK   {name}: {len(rows)} rows → {target_path}")

        if not args.dry_run:
            target_path.parent.mkdir(parents=True, exist_ok=True)
            with target_path.open("w", encoding="utf-8") as f:
                json.dump(rows, f, indent=2, ensure_ascii=False)

        ok += 1

    print(f"\nDone: {ok} converted, {skipped} skipped, {failed} failed.")
    if args.dry_run:
        print("[DRY RUN] No files were written.")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
