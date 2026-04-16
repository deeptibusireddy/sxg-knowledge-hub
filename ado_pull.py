#!/usr/bin/env python3
"""ADO work item pull for the SxG Knowledge Hub dashboard.

Queries Azure DevOps for work items that were created from the dashboard
(identified by area path and/or tag) and writes them directly to
public/data/ado-work-items.json so the dashboard can display status.

Auth: PAT token — set ADO_PAT environment variable (or pat_env_var in config).
Scope needed: Work Items (Read)
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import json
import os
import sys
import traceback
from pathlib import Path
from typing import Any
from urllib import request, error


# ── CLI ──────────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Pull ADO work items into dashboard JSON.")
    parser.add_argument(
        "--config",
        default="ado_pull_config.json",
        help="Path to config file (default: ado_pull_config.json)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print items found without writing output file.",
    )
    return parser.parse_args()


# ── Auth ─────────────────────────────────────────────────────────────────────

def get_pat(config: dict[str, Any]) -> str:
    env_var = config.get("pat_env_var", "ADO_PAT")
    pat = os.environ.get(env_var, "").strip()
    if not pat:
        raise RuntimeError(
            f"PAT not found. Set the '{env_var}' environment variable "
            f"with a read-only Work Items scope token."
        )
    return pat


def auth_header(pat: str) -> str:
    token = base64.b64encode(f":{pat}".encode()).decode()
    return f"Basic {token}"


# ── ADO REST helpers ──────────────────────────────────────────────────────────

def ado_get(url: str, pat: str) -> Any:
    req = request.Request(url, headers={
        "Authorization": auth_header(pat),
        "Content-Type": "application/json",
    })
    with request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def ado_post(url: str, body: dict[str, Any], pat: str) -> Any:
    data = json.dumps(body).encode()
    req = request.Request(url, data=data, method="POST", headers={
        "Authorization": auth_header(pat),
        "Content-Type": "application/json",
    })
    with request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


# ── WIQL query ────────────────────────────────────────────────────────────────

def build_wiql(config: dict[str, Any]) -> str:
    """Build a WIQL query from config filters (area path, tags, days back)."""
    conditions: list[str] = []

    area_path = config.get("area_path", "").strip()
    if area_path:
        conditions.append(f"[System.AreaPath] UNDER '{area_path}'")

    tags = config.get("tags", [])
    if isinstance(tags, list) and tags:
        for tag in tags:
            conditions.append(f"[System.Tags] CONTAINS '{tag}'")
    elif isinstance(tags, str) and tags.strip():
        conditions.append(f"[System.Tags] CONTAINS '{tags.strip()}'")

    days_back = int(config.get("days_back", 90))
    cutoff = (dt.date.today() - dt.timedelta(days=days_back)).isoformat()
    conditions.append(f"[System.CreatedDate] >= '{cutoff}'")

    where_clause = " AND ".join(conditions) if conditions else "1=1"
    return f"""
        SELECT [System.Id]
        FROM WorkItems
        WHERE {where_clause}
        ORDER BY [System.CreatedDate] DESC
    """.strip()


# ── Fetch + map items ─────────────────────────────────────────────────────────

FIELDS = [
    "System.Id",
    "System.Title",
    "System.WorkItemType",
    "System.State",
    "System.AssignedTo",
    "System.CreatedDate",
    "System.TeamProject",
]


def fetch_work_items(
    org_url: str,
    project: str,
    pat: str,
    wiql: str,
    max_items: int,
) -> list[dict[str, Any]]:
    wiql_url = f"{org_url.rstrip('/')}/{project}/_apis/wit/wiql?api-version=7.1"
    result = ado_post(wiql_url, {"query": wiql}, pat)
    refs = result.get("workItems", [])[:max_items]
    if not refs:
        return []

    ids = ",".join(str(r["id"]) for r in refs)
    fields_param = ",".join(FIELDS)
    batch_url = (
        f"{org_url.rstrip('/')}/{project}/_apis/wit/workItems"
        f"?ids={ids}&fields={fields_param}&api-version=7.1"
    )
    batch = ado_get(batch_url, pat)
    return batch.get("value", [])


def map_item(raw: dict[str, Any], org_url: str, project: str) -> dict[str, Any]:
    fields = raw.get("fields", {})
    item_id = raw.get("id", 0)
    assigned_raw = fields.get("System.AssignedTo", {})
    assigned_to = (
        assigned_raw.get("displayName", "Unassigned")
        if isinstance(assigned_raw, dict)
        else str(assigned_raw or "Unassigned")
    )
    created_raw = fields.get("System.CreatedDate", "")
    created_date = created_raw[:10] if created_raw else ""

    url = (
        f"{org_url.rstrip('/')}/{project}/_workitems/edit/{item_id}"
    )

    return {
        "id": str(item_id),
        "title": fields.get("System.Title", ""),
        "type": fields.get("System.WorkItemType", ""),
        "state": fields.get("System.State", ""),
        "assignedTo": assigned_to,
        "createdDate": created_date,
        "url": url,
    }


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> int:
    args = parse_args()
    config_path = Path(args.config)
    if not config_path.exists():
        print(f"Config file not found: {config_path}", file=sys.stderr)
        print("Copy ado_pull_config.example.json → ado_pull_config.json and fill in your values.", file=sys.stderr)
        return 2

    with config_path.open(encoding="utf-8") as f:
        config: dict[str, Any] = json.load(f)

    org_url = config.get("org_url", "").strip()
    project = config.get("project", "").strip()
    if not org_url or not project:
        print("Config must include 'org_url' and 'project'.", file=sys.stderr)
        return 2

    output_path = Path(config.get("output_file", "public/data/ado-work-items.json"))
    max_items = int(config.get("max_items", 200))

    try:
        pat = get_pat(config)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    wiql = build_wiql(config)

    try:
        raw_items = fetch_work_items(org_url, project, pat, wiql, max_items)
    except error.HTTPError as exc:
        print(f"ADO API error {exc.code}: {exc.read().decode()}", file=sys.stderr)
        return 1
    except Exception as exc:  # noqa: BLE001
        print(f"Failed to fetch work items: {exc}", file=sys.stderr)
        traceback.print_exc(limit=3)
        return 1

    items = [map_item(raw, org_url, project) for raw in raw_items]

    print(f"Found {len(items)} work item(s).")
    for item in items:
        print(f"  [{item['state']:12s}] {item['id']:6s}  {item['title'][:60]}")

    if args.dry_run:
        print("[DRY RUN] No output written.")
        return 0

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    print(f"Written → {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
