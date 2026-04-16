# Power BI DAX Starters

Use these as starting points in powerbi_pull_config.json job daxQuery values.

## Agent Copilot Metrics Commercial_Prod
Dataset ID: 3a470a02-0567-4a1f-86e5-d685e9fa4866

HRR trend shape:

EVALUATE
SUMMARIZECOLUMNS(
  'Date'[MonthShort],
  "HRR", [HRR]
)

AHT by product shape:

EVALUATE
SUMMARIZECOLUMNS(
  'LOB'[Name],
  "Copilot", [AHTCopilotMinutes],
  "NonCopilot", [AHTNonCopilotMinutes]
)

## Actionable_Feedback_Commercial
Dataset ID: eae1f80b-9ed3-45ed-a89c-d7c226b501ac

Feedback distribution shape:

EVALUATE
SUMMARIZECOLUMNS(
  'Feedback'[Theme],
  "Value", [FeedbackCount]
)

## Actionable_Feedback_Consumer
Dataset ID: 0dd76d62-26da-46c2-b3dc-75cb2c3dffd3

Empty results by LOB shape:

EVALUATE
SUMMARIZECOLUMNS(
  'LOB'[Name],
  "Count", [EmptyResultCount]
)

## Content Self-Serve Dashboard
Dataset ID: d2bdd653-3bf7-4dfc-8d4f-d24c9a0fcc20

Ingestion status shape:

EVALUATE
SUMMARIZECOLUMNS(
  'Date'[MonthShort],
  "Ingested", [IngestedCount],
  "Blocked", [BlockedCount],
  "Pending", [PendingCount]
)

Blocked by LOB shape:

EVALUATE
SUMMARIZECOLUMNS(
  'LOB'[Name],
  "Count", [BlockedCount]
)

## BlockedContentDashboard
Dataset ID: d03b0a1e-379d-478c-a5fe-6f9ee28c2abb

Blocked articles table shape:

EVALUATE
SELECTCOLUMNS(
  TOPN(5000, '$FactBlockedArticles', '$FactBlockedArticles'[DateTimeScanned], DESC),
  "Id", '$FactBlockedArticles'[ArticleId],
  "Article", '$FactBlockedArticles'[ArticlePath],
  "LOB", '$FactBlockedArticles'[InfoSource],
  "Owner", BLANK(),
  "Reason", '$FactBlockedArticles'[Status],
  "AgeDays", 0
)

## AIPodSemanticModel
Dataset ID: 44a64562-8364-4b5f-abca-33c95148274a

Recent incidents shape:

EVALUATE
SELECTCOLUMNS(
  TOPN(500, 'incident', 'incident'[createdon], DESC),
  "Id", 'incident'[ticketnumber],
  "LOB", 'incident'[msdfm_supportareapath],
  "Severity", 'incident'[severitycode],
  "Status", 'incident'[statecode],
  "Opened", 'incident'[createdon],
  "Summary", 'incident'[title]
)

Quality by LOB shape:

EVALUATE
SUMMARIZECOLUMNS(
  'LOB'[Name],
  "Jan", [QualityJan],
  "Feb", [QualityFeb],
  "Mar", [QualityMar]
)

## Validation tip

Before enabling a job, run the DAX in DAX Studio or Power BI Desktop first and confirm column names match your expected CSV schema.
