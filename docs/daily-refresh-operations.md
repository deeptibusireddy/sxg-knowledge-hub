# Daily Refresh Operations

This is the operational flow to refresh dashboard data into the data folder every day.

## One-time setup

1. **Power BI pull** — configure `powerbi_pull_config.json` (copy from example), then run `az login`.
2. **Database pull** — configure `data_pull_config.json` (copy from example) with DB credentials.
3. **ADO pull** — configure `ado_pull_config.json` (copy from example), then set your PAT:
   ```powershell
   $env:ADO_PAT = "your-read-only-pat-here"
   ```
   Scope needed: **Work Items (Read)**. Generate at `https://dev.azure.com/<org>/_usersSettings/tokens`.
4. **Azure Static Web Apps deploy token** — set once per session:
   ```powershell
   $env:SWA_DEPLOYMENT_TOKEN = "your-swa-deployment-token"
   ```
   Get the token from the Azure portal → your Static Web App → **Manage deployment token**.

## Manual daily run

From repo root (runs all 6 steps):

```powershell
.\scripts\run_daily_refresh.ps1
```

Dry run (shows what would execute without writing anything):

```powershell
.\scripts\run_daily_refresh.ps1 -DryRun
```

Skip individual steps if needed:

```powershell
.\scripts\run_daily_refresh.ps1 -SkipPowerBI -SkipSql   # only ADO + convert + build + deploy
.\scripts\run_daily_refresh.ps1 -SkipDeploy              # pull + convert + build, but don't push
```

## What the script does

| Step | Script | Output |
|------|--------|--------|
| 1. Power BI pull | `daily_powerbi_pull.py` | `data/*.csv` snapshots |
| 2. Database pull | `dailydatapull.py` | `data/*.csv` snapshots |
| 3. ADO work items | `ado_pull.py` | `public/data/ado-work-items.json` |
| 4. CSV → JSON | `scripts/convert_csvs_to_json.py` | `public/data/*.json` |
| 5. Build | `npm run build` | `dist/` |
| 6. Deploy | `swa deploy` | Live on Azure Static Web Apps |

## Scheduled daily run

Register a Windows Task Scheduler job:

```powershell
.\scripts\register-daily-refresh-task.ps1 -StartTime "07:00"
```

**Note**: The scheduled task runs in the user session, so `ADO_PAT` and `SWA_DEPLOYMENT_TOKEN`
must be set as persistent user environment variables (System Properties → Environment Variables),
not just in your current shell session.

Then verify in Task Scheduler:
- Task exists and is **Enabled**
- Last Run Result is `0x0` (success)
- Next Run Time is correct

## Outputs to check

- `data\_powerbi_pull_manifest.json` — Power BI pull results
- `data\_pull_manifest.json` — DB pull results
- `public/data/*.json` — dashboard data files (updated by convert step)
- `dist/` — built site ready for deploy

## Failure handling

Each step is independent — if one fails, the script continues and reports the exit code.
Fix the failing step and rerun with `-Skip*` flags to skip the steps that already succeeded:

```powershell
# e.g. Power BI and DB already ran OK; only redo ADO onwards:
.\scripts\run_daily_refresh.ps1 -SkipPowerBI -SkipSql
```

