# ADO Work Item Pull

The `ado_pull.py` script queries Azure DevOps for work items created from the dashboard
and writes them to `public/data/ado-work-items.json` so stakeholders can track status.

## How it works

1. Reads `ado_pull_config.json` for org URL, project, and filter criteria
2. Uses a WIQL query to find work items matching your area path and/or tag
3. Fetches title, type, state, assignee, created date, and ADO URL for each item
4. Writes directly to `public/data/ado-work-items.json` (baked into the next build)

## Setup

### 1. Create your config

```powershell
Copy-Item ado_pull_config.example.json ado_pull_config.json
```

Edit `ado_pull_config.json`:

```json
{
  "org_url":    "https://dev.azure.com/microsoft",
  "project":    "SxG",
  "pat_env_var": "ADO_PAT",
  "area_path":  "SxG\\Knowledge Hub",
  "tags":       ["sxg-knowledge-hub"],
  "days_back":  90,
  "max_items":  200,
  "output_file": "public/data/ado-work-items.json"
}
```

- **area_path** — work items under this area path are included (backslash-separated)
- **tags** — work items with any of these tags are included (AND'd with area_path)
- **days_back** — only items created in the last N days
- **max_items** — cap on results (WIQL returns newest first)

### 2. Create a Personal Access Token

1. Go to `https://dev.azure.com/<your-org>/_usersSettings/tokens`
2. Click **New Token**
3. Name: `SxG Knowledge Hub dashboard (read-only)`
4. Scope: **Work Items → Read** only
5. Copy the token

### 3. Set the PAT environment variable

For the current session:
```powershell
$env:ADO_PAT = "paste-your-token-here"
```

For persistent use (so the scheduled task can use it):
1. Open System Properties → Advanced → Environment Variables
2. Under **User variables**, add `ADO_PAT` = your token

## Manual run

```powershell
python ado_pull.py
```

Dry run (lists matching items without writing):
```powershell
python ado_pull.py --dry-run
```

## Output format

`public/data/ado-work-items.json`:

```json
[
  {
    "id": "12345",
    "title": "Add Azure LOB content for AI topics",
    "type": "Feature",
    "state": "Active",
    "assignedTo": "Jane Smith",
    "createdDate": "2026-03-15",
    "url": "https://dev.azure.com/microsoft/SxG/_workitems/edit/12345"
  }
]
```

## Dashboard display

The dashboard shows these items in the **ADO Work Items** table (Detailed Data section).
Each ID is a clickable link that opens the work item in ADO. The State column shows
color-coded badges (Active = blue, Resolved = green, Closed = grey, New = grey).

The table is refreshed daily as part of `scripts/run_daily_refresh.ps1`.
