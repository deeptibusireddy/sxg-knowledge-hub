# Daily DB Pull (Semi-Manual)

This process pulls data from multiple databases/tables and writes CSV snapshots to `data/` for dashboard refresh prep.

## Why this approach

- Works with mixed permission models because each run uses your current credentials.
- Keeps a dated snapshot (`*_YYYYMMDD.csv`) and a latest alias (`*.csv`).
- Continues on failures so one blocked database does not stop all exports.

## 1) Install Python DB drivers (one-time)

Install only what you use:

```powershell
py -m pip install pyodbc psycopg2-binary
```

If you are only using SQL Server, `pyodbc` is enough.

## 2) Create your config

Use `data_pull_config.example.json` as the template and create `data_pull_config.json` in repo root.

Config supports two connection styles:

- `connect`: single connection string
- `connect_kwargs`: object of keyword args

Environment variable placeholders are supported, for example `${SQL_PASSWORD}`.

## 3) Set credentials in shell

Example (PowerShell):

```powershell
$env:SQL_USER = "your-user"
$env:SQL_PASSWORD = "your-password"
$env:PG_USER = "your-user"
$env:PG_PASSWORD = "your-password"
```

## 4) Run the pull

```powershell
py .\dailydatapull.py --config .\data_pull_config.json
```

Optional:

- `--date 20260402` to force the snapshot suffix
- `--fail-fast` to stop on first failure

## 5) Verify output

After each run:

- CSVs are written to `data/`
- run summary is written to `data/_pull_manifest.json`

The manifest includes successes, failures, row counts, and file paths.

## Suggested daily routine (semi-manual)

1. Open PowerShell and set credentials as environment variables.
2. Run `py .\dailydatapull.py --config .\data_pull_config.json`.
3. Open `data/_pull_manifest.json` and confirm no critical failures.
4. Continue your CSV->JSON conversion flow described in `docs/data-refresh-guide.md`.

## Scheduling option

If needed, create a Windows Task Scheduler job that runs the same command daily.
Use an account that already has required database access.
