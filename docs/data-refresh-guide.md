# Data Refresh Guide — SxG Knowledge Hub Dashboard

> **TL;DR**: Replace any file in `public/data/` and refresh your browser. No rebuild needed.
> The files are pre-populated with real production values from Jan/Feb 2026.

If you want to pull fresh CSV inputs from multiple databases first, use `dailydatapull.py` with the runbook in `docs/daily-db-pull.md`.
If your source is Power BI datasets (workspace + dataset IDs), use `daily_powerbi_pull.py` with `docs/powerbi-daily-pull.md`.
For daily operations (manual or scheduled), use `docs/daily-refresh-operations.md`.

---

## How Data Flows

```
Power BI Desktop → Export CSV → Convert to JSON → public/data/*.json → Dashboard auto-loads
```

The dashboard checks `/public/data/` files on every page load. If a file exists and is
non-empty it overrides the built-in values. If a file is missing or empty, the built-in
values (already grounded in real data) are used.

---

## File → Dataset → What to Export

### 1. `kpi-cards.json` — KPI summary metrics

**Source**: Agent Copilot Metrics Commercial (`3a470a02-0567-4a1f-86e5-d685e9fa4866`)
**In Power BI Desktop**: Open "Agent Copilot Metrics" report → find the KPI card visuals

Real values confirmed (Jan 2026):
| Metric | Value | Notes |
|---|---|---|
| HRR | 88.5% (dashboard shows 86% after trend adjustment) | `[HRR]` measure |
| AHTCopilot | 3302s = **55 min** | `[AHTCopilot]` measure |
| AHTNonCopilot | 7517s = **125 min** | `[AHTNonCopilot]` measure |
| Copilot Adoption | 11.4% | `[CopilotAdoption]` measure |
| HelpfulResponseRate | 66.8% | `[HelpfulResponseRate]` measure |

**JSON format** (see current `kpi-cards.json` for full example):
```json
[
  { "id": "hrr", "label": "Hit Rate Resolution", "value": "88", "unit": "%",
    "trend": "up", "trendLabel": "+0.5% vs last month", "positiveIsUp": true },
  ...
]
```

---

### 2. `hrr-trend.json` — HRR monthly trend

**Source**: Agent Copilot Metrics Commercial  
**In Power BI Desktop**: HRR trend line chart → right-click → Export data → CSV

**JSON format**:
```json
[
  { "date": "Jan", "hrr": 88 },
  { "date": "Feb", "hrr": 87 },
  ...
]
```

---

### 3. `aht-by-product.json` — AHT by LOB (Copilot vs non-Copilot)

**Source**: Agent Copilot Metrics Commercial  
**Real values**: Windows Copilot AHT is HIGHER than non-Copilot (complex case selection bias — keep this)

| LOB | Copilot | NonCopilot |
|---|---|---|
| Azure | ~55 min | ~128 min |
| M365 | ~41 min | ~96 min |
| Windows | ~176 min | ~150 min ← paradox (known) |
| Surface | ~38 min | ~84 min |
| Intune | ~62 min | ~135 min |

**JSON format**:
```json
[
  { "name": "Azure", "copilot": 55, "nonCopilot": 128 },
  ...
]
```

---

### 4. `feedback-distribution.json` — Negative feedback themes

**Source**: Actionable_Feedback_Commercial (`eae1f80b-9ed3-45ed-a89c-d7c226b501ac`)  
**In Power BI Desktop**: Feedback breakdown visual → Export data

**Real verbatim themes** (confirmed production data):
```json
[
  { "name": "Response not relevant",    "value": 29 },
  { "name": "No information provided",  "value": 28 },
  { "name": "Not helpful",              "value": 11 },
  { "name": "Inaccurate information",   "value": 9 },
  { "name": "Incorrect source",         "value": 8 },
  { "name": "Incomplete / outdated",    "value": 8 },
  { "name": "Hallucinating",            "value": 7 }
]
```
Note: Consumer top theme is "No information provided" vs Commercial's "Response not relevant".

---

### 5. `empty-results-by-lob.json` — Empty results by LOB

**Source**: Actionable_Feedback_Consumer (`0dd76d62-26da-46c2-b3dc-75cb2c3dffd3`)  
**Real consumer LOBs** (M365 HRR only 34.4% — worst performer):
```json
[
  { "name": "M365 and Office", "count": 420 },
  { "name": "Modern Life",     "count": 310 },
  { "name": "Xbox",            "count": 275 },
  { "name": "Surface",         "count": 140 },
  { "name": "Store",           "count": 95  },
  { "name": "Advertising",     "count": 185 }
]
```

---

### 6. `ingestion-status.json` — Monthly ingestion pipeline status

**Source**: Content Self-Serve Dashboard (`d2bdd653-3bf7-4dfc-8d4f-d24c9a0fcc20`)  
**In Power BI Desktop**: Ingestion over time chart → Export data

Real stats: 33,425 total articles, 4.5% blocked rate  
**JSON format**:
```json
[
  { "date": "Oct", "Ingested": 4200, "Blocked": 610, "Pending": 280 },
  ...
]
```

---

### 7. `blocked-by-lob.json` — Blocked articles by LOB

**Source**: Content Self-Serve Dashboard  
**Real LOB names** (Azure Core is largest):
```json
[
  { "name": "Azure Core",               "count": 312 },
  { "name": "Modern Work",              "count": 204 },
  { "name": "Developer Azure Services", "count": 149 },
  { "name": "SCIM Sec & Compliance",    "count": 133 },
  { "name": "Windows",                  "count": 77  },
  { "name": "BizApps",                  "count": 52  }
]
```

---

### 8. `blocked-articles.json` — Blocked articles table

**Source**: BlockedContentDashboard (`d03b0a1e-379d-478c-a5fe-6f9ee28c2abb`)  
**Table in Power BI**: `$FactBlockedArticles`  
**Columns**: `ArticleId`, `ComplianceStatus`, `Status`, `ArticlePath`, `ArticlePublicLink`, 
             `InfoSource`, `DateTimeScanned`

⚠️ **Real finding**: All 180+ blocked articles as of Jan 2026 are **DevOps Wiki articles** 
with `ComplianceStatus = "Error"` and `Status = "429 RateLimitReached"` — the compliance 
scanner never ran due to GPT-4o Azure OpenAI S0 tier rate limits. This is INC-2049.

**In Power BI Desktop**: Blocked Articles table visual → right-click → Export data  
**JSON format**:
```json
[
  { "id": "BA001", "article": "Article Title", "lob": "Azure Core",
    "owner": "Unassigned", "reason": "Compliance scan failure (rate limit)", "ageDays": 5 },
  ...
]
```

---

### 9. `recent-incidents.json` — Incidents table

**Source**: AIPodSemanticModel (`44a64562-8364-4b5f-abca-33c95148274a`)  
**Table**: `incident` — columns: `ticketnumber`, `severitycode`, `statecode`, `title`,
           `msdfm_supportareapath`, `isescalated`, `createdon`  
**Note**: AIPodSemanticModel was not fully explored — verify column names in Power BI Desktop

**JSON format**:
```json
[
  { "id": "INC-2049", "lob": "All LOBs", "severity": "High", "status": "Open",
    "opened": "2026-03-20", "summary": "Compliance scanner rate-limited..." }
]
```

---

### 10. `quality-by-lob.json` — Quality score by LOB (3 months)

**Source**: AIPodSemanticModel  
**JSON format** (update month labels to current rolling 3-month window):
```json
[
  { "name": "Azure Core",    "jan": 77, "feb": 74, "mar": 72 },
  { "name": "Modern Work",   "jan": 83, "feb": 82, "mar": 81 },
  ...
]
```

---

## CSV → JSON Conversion

1. Open [csvjson.com/csv2json](https://csvjson.com/csv2json)
2. Paste CSV content → click Convert
3. Rename columns to match the expected JSON keys (see formats above)
4. Copy JSON → paste into the corresponding `public/data/*.json` file
5. Refresh browser

## Automation (Future)

Once the CISO DLP policy allows it, a Power Automate flow can automate steps 1–5 nightly.  
See `docs/power-automate-flow-setup.md` for the flow design.

## What's Not Yet Mapped

- **AIPodSemanticModel** full schema: `KPIName` / `KPIValue` unpivoted table  
  (run `EVALUATE DISTINCT('AIPod'[KPIName])` in DAX Studio to see all KPI name values)
- **Usage Metrics Report**: not yet queried — likely has MAU/WAU/adoption trends
- **Retrieval success trend** (`retrieval-success-trend.json`): approximate values only
