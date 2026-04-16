# Power BI Daily Pull (Semi-Manual)

Use this when your source data lives in Power BI datasets and you want daily CSV snapshots in data.

## Files

- Script: daily_powerbi_pull.py
- Config template: powerbi_pull_config.example.json
- Run manifest output: data/_powerbi_pull_manifest.json

## 1) Create your config

1. Copy powerbi_pull_config.example.json to powerbi_pull_config.json.
2. For each job, set:
   - enabled to true
  - pullAllTables to true for full dataset extraction
  - fileBase to the dataset name you want in filenames

Dataset-specific starter queries are in docs/powerbi-dax-starters.md.

Tip: keep jobs disabled until each query is validated.

## 2) Auth (choose one)

Option A: Azure CLI token (recommended)

1. Run az login
2. Make sure your signed-in account has access to the workspace/datasets
3. Script will fetch token automatically

Option B: Manual access token

1. Set env var POWERBI_ACCESS_TOKEN to a valid bearer token
2. Run script

## 3) Run pull

PowerShell:

py .\daily_powerbi_pull.py --config .\powerbi_pull_config.json

Optional:

- --date 20260402
- --fail-fast

## 4) Output behavior

For each enabled dataset job in pull-all mode:

- dated file per table: fileBase__TableName_YYYYMMDD.csv
- latest alias per table: fileBase__TableName.csv

Example:

- Actionable_Feedback_Commercial__Feedback_20260402.csv
- Actionable_Feedback_Commercial__Feedback.csv

Summary is written to:

- data/_powerbi_pull_manifest.json

## 5) Example DAX starter patterns

Simple table pull:

EVALUATE
TOPN(
  1000,
  'YourTable'
)

Aliased output pull:

EVALUATE
SELECTCOLUMNS(
  'YourTable',
  "Date", [Date],
  "Count", [Count]
)

## Notes

- The script calls executeQueries, so each job needs a datasetId and a DAX query.
- In pull-all mode, table discovery is automatic; if discovery fails for a dataset, set the job `tables` array manually.
- If a query fails for one dataset, other enabled jobs continue unless --fail-fast is used.
