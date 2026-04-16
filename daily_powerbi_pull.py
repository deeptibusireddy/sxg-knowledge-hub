#!/usr/bin/env python3
"""Semi-manual daily Power BI dataset pull to CSV files.

This script executes DAX queries against Power BI datasets and writes CSV outputs
into the local data folder so the dashboard refresh process can continue.

Auth options (in priority order):
1) POWERBI_ACCESS_TOKEN env var
2) Azure CLI token from:
   az account get-access-token --resource https://analysis.windows.net/powerbi/api
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import re
import shutil
import time
import subprocess
import sys
import traceback
from urllib import parse
from pathlib import Path
from typing import Any
from urllib import error, request


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run daily Power BI dataset pulls.")
    parser.add_argument(
        "--config",
        default="powerbi_pull_config.json",
        help="Path to config file (default: powerbi_pull_config.json)",
    )
    parser.add_argument(
        "--date",
        default="",
        help="Override run date in YYYYMMDD format (default: today's local date)",
    )
    parser.add_argument(
        "--fail-fast",
        action="store_true",
        help="Stop on first export failure.",
    )
    return parser.parse_args()


def get_access_token(tenant_id: str = "") -> str:
    token = os.environ.get("POWERBI_ACCESS_TOKEN", "").strip()
    if token:
        return token

    az_exe = shutil.which("az") or shutil.which("az.cmd")
    if not az_exe:
        try:
            where_out = subprocess.run(
                ["where.exe", "az"],
                check=True,
                capture_output=True,
                text=True,
            ).stdout
            first = next((line.strip() for line in where_out.splitlines() if line.strip()), "")
            az_exe = first or None
        except Exception:  # noqa: BLE001
            az_exe = None

    if not az_exe:
        raise RuntimeError(
            "Azure CLI (az) is not installed and POWERBI_ACCESS_TOKEN was not provided."
        )

    cmd = [
        az_exe,
        "account",
        "get-access-token",
        "--resource",
        "https://analysis.windows.net/powerbi/api",
        "--query",
        "accessToken",
        "-o",
        "tsv",
    ]
    if tenant_id:
        cmd.extend(["--tenant", tenant_id])
    try:
        result = subprocess.run(
            cmd,
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        stderr = (exc.stderr or "").strip()
        print(
            "Azure CLI token retrieval failed; falling back to built-in device login. "
            f"Details: {stderr}",
            file=sys.stderr,
        )
        return get_access_token_via_device_code(tenant_id)

    token = result.stdout.strip()
    if not token:
        return get_access_token_via_device_code(tenant_id)
    return token


def get_access_token_via_device_code(tenant_id: str = "") -> str:
    tenant = tenant_id or "common"
    client_id = os.environ.get("POWERBI_PUBLIC_CLIENT_ID", "04b07795-8ddb-461a-bbee-02f9e1bf7b46")
    scope = "https://analysis.windows.net/powerbi/api/.default offline_access openid profile"

    device_url = f"https://login.microsoftonline.com/{tenant}/oauth2/v2.0/devicecode"
    token_url = f"https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token"

    device_body = parse.urlencode({"client_id": client_id, "scope": scope}).encode("utf-8")
    device_req = request.Request(
        device_url,
        data=device_body,
        method="POST",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    try:
        with request.urlopen(device_req) as resp:
            device_data = json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Device-code init failed: HTTP {exc.code}: {details}") from exc

    verification_uri = str(device_data.get("verification_uri", "https://login.microsoftonline.com/device"))
    user_code = str(device_data.get("user_code", "")).strip()
    device_code = str(device_data.get("device_code", "")).strip()
    interval = int(device_data.get("interval", 5) or 5)
    expires_in = int(device_data.get("expires_in", 900) or 900)

    if not user_code or not device_code:
        raise RuntimeError("Device-code response missing required fields.")

    print("")
    print("Device login required:")
    print(f"1) Open: {verification_uri}")
    print(f"2) Enter code: {user_code}")
    print("")

    token_deadline = time.time() + expires_in
    token_body_template = {
        "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
        "client_id": client_id,
        "device_code": device_code,
    }

    while time.time() < token_deadline:
        token_body = parse.urlencode(token_body_template).encode("utf-8")
        token_req = request.Request(
            token_url,
            data=token_body,
            method="POST",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        try:
            with request.urlopen(token_req) as resp:
                token_data = json.loads(resp.read().decode("utf-8"))
                access_token = str(token_data.get("access_token", "")).strip()
                if access_token:
                    return access_token
        except error.HTTPError as exc:
            details_raw = exc.read().decode("utf-8", errors="ignore")
            try:
                details_json = json.loads(details_raw)
            except json.JSONDecodeError:
                details_json = {}

            err = str(details_json.get("error", ""))
            if err in {"authorization_pending", "slow_down"}:
                time.sleep(interval + (5 if err == "slow_down" else 0))
                continue
            if err == "expired_token":
                raise RuntimeError("Device code expired before authentication completed.") from exc
            if err == "authorization_declined":
                raise RuntimeError("Device login was declined.") from exc

            raise RuntimeError(f"Device token poll failed: {details_raw}") from exc

    raise RuntimeError("Timed out waiting for device login completion.")


def execute_query(token: str, workspace_id: str, dataset_id: str, dax_query: str) -> list[dict[str, Any]]:
    url = (
        f"https://api.powerbi.com/v1.0/myorg/groups/{workspace_id}"
        f"/datasets/{dataset_id}/executeQueries"
    )
    payload = {
        "queries": [{"query": dax_query}],
        "serializerSettings": {"includeNulls": True},
    }
    body = json.dumps(payload).encode("utf-8")

    req = request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
    )

    try:
        with request.urlopen(req) as resp:
            raw = resp.read().decode("utf-8")
    except error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"HTTP {exc.code}: {details}") from exc

    parsed = json.loads(raw)
    rows = parsed.get("results", [{}])[0].get("tables", [{}])[0].get("rows", [])
    if not isinstance(rows, list):
        raise RuntimeError("Unexpected Power BI response format; 'rows' is not a list.")
    return rows


def normalize_headers(rows: list[dict[str, Any]]) -> list[str]:
    if not rows:
        return []
    headers: list[str] = []
    seen: set[str] = set()
    for row in rows:
        for key in row.keys():
            clean = key.strip("[]")
            if clean not in seen:
                seen.add(clean)
                headers.append(clean)
    return headers


def sanitize_name(value: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", value.strip())
    cleaned = re.sub(r"_+", "_", cleaned).strip("_")
    return cleaned or "unnamed"


def quote_dax_table_name(table_name: str) -> str:
    return "'" + table_name.replace("'", "''") + "'"


def build_pull_table_query(table_name: str, row_limit: int) -> str:
    quoted = quote_dax_table_name(table_name)
    if row_limit > 0:
        return f"EVALUATE TOPN({row_limit}, {quoted})"
    return f"EVALUATE {quoted}"


def discover_tables(
    token: str,
    workspace_id: str,
    dataset_id: str,
    discovery_queries: list[str],
) -> list[str]:
    errors: list[str] = []

    for query in discovery_queries:
        try:
            rows = execute_query(token, workspace_id, dataset_id, query)
        except Exception as exc:  # noqa: BLE001
            errors.append(str(exc))
            continue

        table_names: list[str] = []
        for row in rows:
            raw = (
                row.get("[TableName]")
                or row.get("[Name]")
                or row.get("TableName")
                or row.get("Name")
            )
            if raw is None:
                continue
            table_name = str(raw).strip()
            if table_name and table_name not in table_names:
                table_names.append(table_name)

        if table_names:
            return table_names

    raise RuntimeError(
        "Unable to discover dataset tables automatically. "
        "Set job.tables explicitly in config. "
        f"Discovery errors: {' | '.join(errors) if errors else 'none'}"
    )


def write_csv(path: Path, headers: list[str], rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for row in rows:
            writer.writerow([row.get(f"[{h}]", row.get(h, "")) for h in headers])


def run_export(
    token: str,
    workspace_id: str,
    output_dir: Path,
    run_date: str,
    write_latest_alias: bool,
    job: dict[str, Any],
) -> dict[str, Any]:
    name = str(job.get("name", "unnamed_job"))
    dataset_id = str(job.get("datasetId", "")).strip()
    dax_query = str(job.get("daxQuery", "")).strip()
    file_base = sanitize_name(str(job.get("fileBase", name)).strip())
    pull_all_tables = bool(job.get("pullAllTables", False))
    row_limit = int(job.get("tableRowLimit", 0) or 0)
    configured_tables = job.get("tables", [])
    discovery_queries = job.get(
        "tableDiscoveryQueries",
        [
            "EVALUATE SELECTCOLUMNS(INFO.VIEW.TABLES(), \"TableName\", [Name])",
            "EVALUATE SELECTCOLUMNS(INFO.TABLES(), \"TableName\", [Name])",
        ],
    )

    if not dataset_id:
        raise ValueError(f"Job '{name}' is missing datasetId.")

    if pull_all_tables:
        if not isinstance(configured_tables, list):
            raise ValueError(f"Job '{name}' has invalid 'tables'; expected list.")
        if not isinstance(discovery_queries, list) or not discovery_queries:
            raise ValueError(f"Job '{name}' has invalid 'tableDiscoveryQueries'; expected non-empty list.")

        if configured_tables:
            table_names = [str(t).strip() for t in configured_tables if str(t).strip()]
        else:
            table_names = discover_tables(token, workspace_id, dataset_id, discovery_queries)

        per_table: list[dict[str, Any]] = []
        total_rows = 0

        for table_name in table_names:
            query = build_pull_table_query(table_name, row_limit)
            rows = execute_query(token, workspace_id, dataset_id, query)
            headers = normalize_headers(rows)

            table_base = sanitize_name(table_name)
            dated_file = output_dir / f"{file_base}__{table_base}_{run_date}.csv"
            latest_file = output_dir / f"{file_base}__{table_base}.csv"

            write_csv(dated_file, headers, rows)
            if write_latest_alias:
                write_csv(latest_file, headers, rows)

            total_rows += len(rows)
            per_table.append(
                {
                    "table": table_name,
                    "rows": len(rows),
                    "datedFile": str(dated_file),
                    "latestFile": str(latest_file) if write_latest_alias else None,
                }
            )

        return {
            "name": name,
            "datasetId": dataset_id,
            "mode": "allTables",
            "tableCount": len(per_table),
            "rows": total_rows,
            "tables": per_table,
        }

    if not dax_query:
        raise ValueError(f"Job '{name}' is missing daxQuery.")

    rows = execute_query(token, workspace_id, dataset_id, dax_query)
    headers = normalize_headers(rows)

    dated_file = output_dir / f"{file_base}_{run_date}.csv"
    latest_file = output_dir / f"{file_base}.csv"

    write_csv(dated_file, headers, rows)
    if write_latest_alias:
        write_csv(latest_file, headers, rows)

    return {
        "name": name,
        "datasetId": dataset_id,
        "mode": "singleQuery",
        "rows": len(rows),
        "datedFile": str(dated_file),
        "latestFile": str(latest_file) if write_latest_alias else None,
    }


def main() -> int:
    args = parse_args()

    config_path = Path(args.config)
    if not config_path.exists():
        print(f"Config not found: {config_path}", file=sys.stderr)
        return 2

    run_date = args.date.strip() or dt.date.today().strftime("%Y%m%d")
    if not re.fullmatch(r"\d{8}", run_date):
        print("--date must be YYYYMMDD.", file=sys.stderr)
        return 2

    with config_path.open("r", encoding="utf-8") as f:
        cfg = json.load(f)

    tenant_id = str(cfg.get("tenantId", "")).strip()
    workspace_id = str(cfg.get("workspaceId", "")).strip()
    output_dir = Path(str(cfg.get("outputDir", "data")))
    write_latest_alias = bool(cfg.get("writeLatestAlias", True))
    jobs = cfg.get("jobs", [])

    if not workspace_id:
        print("Config is missing workspaceId.", file=sys.stderr)
        return 2
    if not isinstance(jobs, list) or not jobs:
        print("Config must include a non-empty jobs array.", file=sys.stderr)
        return 2

    try:
        token = get_access_token(tenant_id=tenant_id)
    except Exception as exc:  # noqa: BLE001
        print(str(exc), file=sys.stderr)
        return 1

    started_at = dt.datetime.now().isoformat(timespec="seconds")
    successes: list[dict[str, Any]] = []
    failures: list[dict[str, str]] = []
    skipped: list[dict[str, str]] = []

    for job in jobs:
        name = str(job.get("name", "unnamed_job"))
        enabled = bool(job.get("enabled", True))
        if not enabled:
            skipped.append({"name": name, "reason": "disabled"})
            print(f"SKIP {name}: disabled")
            continue

        try:
            result = run_export(
                token=token,
                workspace_id=workspace_id,
                output_dir=output_dir,
                run_date=run_date,
                write_latest_alias=write_latest_alias,
                job=job,
            )
            successes.append(result)
            if result.get("mode") == "allTables":
                print(
                    f"OK   {name}: {result['tableCount']} tables, "
                    f"{result['rows']} rows total"
                )
            else:
                print(f"OK   {name}: {result['rows']} rows -> {result['datedFile']}")
        except Exception as exc:  # noqa: BLE001
            failures.append(
                {
                    "name": name,
                    "error": str(exc),
                    "traceback": traceback.format_exc(limit=3),
                }
            )
            print(f"FAIL {name}: {exc}", file=sys.stderr)
            if args.fail_fast:
                break

    manifest = {
        "startedAt": started_at,
        "completedAt": dt.datetime.now().isoformat(timespec="seconds"),
        "runDate": run_date,
        "workspaceId": workspace_id,
        "successCount": len(successes),
        "failureCount": len(failures),
        "skippedCount": len(skipped),
        "successes": successes,
        "failures": failures,
        "skipped": skipped,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = output_dir / "_powerbi_pull_manifest.json"
    with manifest_path.open("w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"Manifest written to {manifest_path}")
    return 0 if not failures else 1


if __name__ == "__main__":
    raise SystemExit(main())
