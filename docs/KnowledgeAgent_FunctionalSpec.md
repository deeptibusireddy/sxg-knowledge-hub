# SxG Knowledge Hub – Self-serve/Insights
## Functional Specification: End-to-End User Flows

**Version:** 1.0  
**Status:** Draft – For Engineering Handoff  
**Prototype:** React 18 + TypeScript SPA (`SxG.Knowledge.Hub`)

---

## How to Read This Document

Each section describes one interactive flow as it is **intended to work in production**.

- **Prototype State** tells you what the current prototype already demonstrates.
- **Acceptance Criteria** defines what engineering must deliver — written from the user's perspective.
- **Engineering Notes** flag where real data, APIs, or integrations must be connected; these are intentionally non-prescriptive about implementation approach.

---

## Table of Contents

| # | Flow | Category |
|---|------|----------|
| A1 | Dashboard Multi-Dimension Filtering | Global Filtering |
| B1 | Ingestion Status Over Time Drilldown | Content Health |
| B2 | Blocked Articles by LOB Drilldown | Content Health |
| B3 | Answer Quality Trend Drilldown | Support Quality |
| B4 | Empty Results by LOB Drilldown | Support Quality |
| B5 | Feedback Distribution Drilldown | Support Quality |
| B6 | HRR 12-Month Trend Drilldown | Business Outcomes |
| B7 | AHT by Product Drilldown | Business Outcomes |
| B8 | Escalations by LOB Drilldown | Business Outcomes |
| B9 | Retrieval Success Rate Drilldown | Program Health |
| B10 | Quality Score by LOB Drilldown | Program Health |
| B11 | Incident Volume Drilldown | Program Health |
| B-S | Drilldown Drawer (Shared) | All Sections |
| C1 | Content Fix Resolution Flow | Actionable Insights |
| C2 | ADO Assignment Resolution Flow | Actionable Insights |
| C3 | Bug Filing Resolution Flow | Actionable Insights |
| C4 | Content Request Resolution Flow | Actionable Insights |
| D1 | Add Content (KA Onboarding) | Quick Actions |
| D2 | Remove Content | Quick Actions |
| D3 | Feedback | Quick Actions |
| D4 | Feature Request | Quick Actions |
| D5 | New Partner Onboarding | Quick Actions |
| D6 | Knowledge Bot | Quick Actions |
| E1 | Blocked Articles Table | Data Tables |
| E2 | Recent Incidents Table | Data Tables |
| F1 | Evaluation CSV Upload | Eval Results |
| F2 | Evaluation Analysis Views | Eval Results |
| G1 | Product Switcher | Navigation |

---

## A. Global Filtering

---

### A1 — Dashboard Multi-Dimension Filtering

**Persona:** Any dashboard user (Content Manager, Support Engineer, LOB Leader, Program Leader)  
**Entry Point:** SlicerBar at the top of the dashboard, always visible  

#### User Journey

1. User opens the dashboard. All charts and tables show data for **all** dimensions (default "All" state).
2. User selects a **LOB** from the dropdown (e.g., Azure). All charts, tables, and drilldowns immediately update to show only Azure data.
3. User selects a **LOB Tag** (e.g., Identity & Access) to further narrow results.
4. User selects an **Audience** (Commercial or Consumer) to scope support channel.
5. User selects a **Data Source** (e.g., Evergreen) to scope by content source.
6. User selects a **Business Unit** (e.g., Cloud Platform).
7. User selects a **Date Range** preset: Last 7d, 30d, 90d, or All time. Charts update to reflect only the selected window.
8. If user selects **Custom**, two date pickers appear (From / To). Selecting both dates applies the custom range.
9. User types in the **Content Owner** field to filter by the person responsible for a piece of content.
10. A **"Clear all"** button appears as soon as any filter is active. Clicking it resets all filters to defaults instantly.

#### Intended Behaviour

- All filters are independent; combining them narrows results further (AND logic).
- The Custom To-date picker enforces a minimum equal to the From date (prevents invalid range).
- When filters are active, charts and tables re-render using only matching data.
- The Content Owner filter is applied as a case-insensitive partial match against the owner field on content articles.
- Clearing all filters returns every component to its unfiltered default state.

#### Acceptance Criteria

- [ ] All 8 filter controls render in a single horizontal bar at the top of the dashboard.
- [ ] Selecting any value immediately updates all chart sections and data tables on the page.
- [ ] **LOB dropdown — Initial list for v1 dev:** SCIM, A&I, MW, DAS, Nebula (plus "All"). This list is the agreed starting point for engineering to build against. ⚠️ *A finalised production LOB list must be agreed with the team before go-live. The implementation must support adding new LOBs without code changes (i.e., driven by config or API).*
- [ ] LOB Tag, Audience, Data Source, and Business Unit dropdowns reflect available values from the connected dataset.
- [ ] Selecting "Custom" date range reveals From and To date inputs; selecting both applies the filter.
- [ ] The To date input enforces a minimum value equal to the From date.
- [ ] "Clear all" button is visible only when at least one filter differs from its default value.
- [ ] Clicking "Clear all" resets all filters and re-renders the dashboard in its unfiltered state.
- [ ] **Content Owner** free-text filter matches case-insensitively on partial strings against the `owner` field on content articles. *(Note: this field filters content-level data — blocked articles, ingestion records — not user accounts. Rename from "Owner/Reviewer" to "Content Owner" in the UI.)*
- [ ] When active filters produce no matching results, charts show an empty state (no data message) rather than breaking.

#### Edge Cases

- Selecting a LOB that has no blocked articles shows an empty blocked-articles chart with a "No data for selected filters" message — not a broken chart.
- Switching from Custom back to a preset clears the custom date fields.
- Content Owner filter of a single space character should be treated as empty (no filter applied).

#### Engineering Notes

- Filter state should be passed as query parameters to all backend data endpoints so server-side filtering is applied (not just client-side array filtering).
- The LOB list must be stored in config or returned by a metadata API endpoint so new LOBs can be added without a code deployment.
- A final agreed production LOB list is a prerequisite before go-live — engineering should build with the v1 list and plan for this to be updated.

---

## B. Chart Drilldowns

---

### B-S — Drilldown Drawer (Shared Component)

**Persona:** Any dashboard user  
**Entry Point:** Clicking any bar, line data point, or pie segment in any chart  

#### User Journey

1. User clicks a chart element (bar, line dot, or pie slice).
2. A panel slides in from the right side of the screen with a semi-transparent backdrop covering the rest of the page.
3. The drawer shows a **title** (e.g., "Blocked Articles – Azure") and optional **subtitle**.
4. A **row count** is displayed (e.g., "4 articles").
5. Data is presented in a table with labelled columns.
6. If rows are present, an **"Export CSV"** button is shown. Clicking it downloads a CSV file named after the drilldown context (e.g., `blocked-articles-azure.csv`).
7. User closes the drawer by clicking the **✕ button**, clicking the backdrop, or pressing **Escape**.

#### Acceptance Criteria

- [ ] Drawer slides in from the right with a smooth animation on open and close.
- [ ] Backdrop dims the rest of the dashboard while the drawer is open.
- [ ] Drawer title and subtitle accurately reflect the chart element clicked.
- [ ] Row count is displayed and matches the number of table rows rendered.
- [ ] Export CSV button is visible only when the table has at least one row.
- [ ] Exported CSV filename is contextual (based on drilldown title/LOB), not generic.
- [ ] Clicking the backdrop closes the drawer.
- [ ] Clicking the ✕ button closes the drawer.
- [ ] Pressing Escape closes the drawer.
- [ ] Empty state message is shown when no detail data is available for the clicked element.

#### Engineering Notes

- Drilldown data should be fetched from the API when the drawer opens (not pre-loaded), with a loading indicator while the request is in flight.
- Error state should display if the drilldown fetch fails, with a retry option.

---

### B1 — Ingestion Status Over Time Drilldown

**Persona:** Content Manager  
**Entry Point:** Click any bar in the "Ingestion Status Over Time" stacked bar chart (Content Health section)  

#### User Journey

1. User views the stacked bar chart showing Ingested, Pending, and Blocked article counts per month.
2. User clicks a specific month's bar stack.
3. Drilldown drawer opens with the title "Ingestion Detail – [Month]".
4. Table shows: Metric | Count (e.g., Ingested: 1,240; Pending: 87; Blocked: 42; Total: 1,369; Block Rate: 3.1%).

#### Acceptance Criteria

- [ ] Clicking any segment of a month's stacked bar opens the drilldown drawer for that month.
- [ ] Drawer title includes the month name and year.
- [ ] Table rows show: Ingested, Pending, Blocked, Total, Block Rate (%).
- [ ] Block Rate is calculated as Blocked / Total × 100 and displayed to one decimal place.
- [ ] Data reflects the selected date range from the SlicerBar.

#### Engineering Notes

- Monthly ingestion breakdown fetched from API by month/year key.

---

### B2 — Blocked Articles by LOB Drilldown

**Persona:** Content Manager  
**Entry Point:** Click a bar in the "Blocked Articles by LOB" horizontal bar chart (Content Health section)  

#### User Journey

1. User views horizontal bar chart showing blocked article counts per LOB.
2. User clicks a LOB bar (e.g., Azure).
3. Drilldown drawer opens: "Blocked Articles – [LOB]".
4. Table shows article-level detail: Article Title | Owner | Block Reason | Age (days).

#### Acceptance Criteria

- [ ] Clicking a LOB bar opens the drilldown for that specific LOB.
- [ ] Table shows one row per blocked article for the selected LOB.
- [ ] Columns: Article Title (links to article source), Owner, Block Reason, Age in days.
- [ ] Chart bar is filtered by the global LOB slicer when "All" is not selected.
- [ ] Article title links open the source article in a new tab.

#### Engineering Notes

- Article-level blocked data fetched from API by LOB filter.

---

### B3 — Answer Quality Trend Drilldown

**Persona:** Support Engineer  
**Entry Point:** Click a data point on the "Answer Quality Score" 30-day line chart (Support Quality section)  

#### User Journey

1. User sees a 30-day line chart with daily average answer quality scores.
2. User clicks a specific day's data point.
3. Drilldown drawer opens: "Quality Detail – [Date]".
4. Table shows: Quality Score | vs. 30-Day Avg | Threshold | Status (Pass / Below Threshold).

#### Acceptance Criteria

- [ ] Clicking any line data point opens the drilldown for that specific date.
- [ ] Drawer shows: score for the day, delta vs. 30-day rolling average, threshold value, and pass/fail status.
- [ ] Pass/fail status is "Pass ✓" if score ≥ threshold, "Below threshold ⚠" if not.
- [ ] 30-day average is calculated dynamically from the dataset (not hardcoded).
- [ ] Threshold value is configurable (not hardcoded to 70%).

#### Engineering Notes

- Quality scores and threshold fetched from API. 30-day rolling average calculated server-side or client-side from the returned dataset.

---

### B4 — Empty Results by LOB Drilldown

**Persona:** Support Engineer  
**Entry Point:** Click a bar in the "Empty Results by LOB" horizontal bar chart (Support Quality section)  

#### User Journey

1. User sees a chart of LOBs ranked by number of queries that returned no results.
2. User clicks a LOB bar.
3. Drilldown drawer opens: "Top Empty Queries – [LOB]".
4. Table shows: Query Text | Occurrences | Last Seen.

#### Acceptance Criteria

- [ ] Clicking a LOB bar opens drilldown for that LOB.
- [ ] Table shows the top empty queries for the selected LOB, sorted by occurrences descending.
- [ ] Columns: Query Text, Occurrences (count), Last Seen (date).
- [ ] Chart respects global LOB slicer filter.

#### Engineering Notes

- Top empty queries fetched from API by LOB, ordered by frequency.

---

### B5 — Feedback Distribution Drilldown

**Persona:** Program Leader  
**Entry Point:** Click a segment in the "Feedback Distribution" donut chart (Support Quality section)  

#### User Journey

1. User sees a donut chart split into Helpful, Not Helpful, and No Response.
2. User clicks a segment (e.g., Not Helpful).
3. Drilldown drawer opens: "Feedback Detail – [Category]".
4. Table shows: Article | LOB | Feedback Score | Case Count.

#### Acceptance Criteria

- [ ] Clicking each pie segment opens the drilldown for that feedback category.
- [ ] Table shows articles associated with the clicked feedback category.
- [ ] Columns: Article, LOB, Score, Cases.
- [ ] Segment percentages in chart are calculated from real feedback data.

#### Engineering Notes

- Article-level feedback data fetched from API by feedback category.

---

### B6 — HRR 12-Month Trend Drilldown

**Persona:** LOB Leader  
**Entry Point:** Click a data point on the "Hit Rate Resolution" 12-month line chart (Business Outcomes section)  

#### User Journey

1. User sees 12-month HRR trend line (Apr–Mar).
2. User clicks a month's data point.
3. Drilldown opens: "HRR Detail – [Month]".
4. Table shows: HRR % | vs. 30-Day Avg | Threshold | Cases Resolved | Cases Escalated.

#### Acceptance Criteria

- [ ] Clicking a data point opens drilldown for that month.
- [ ] Table shows HRR %, 30-day rolling avg delta, threshold, cases resolved, and cases escalated.
- [ ] A reference line is visible on the chart at the HRR target threshold.
- [ ] Chart Y-axis domain is 60–100% to make changes visually meaningful.

#### Engineering Notes

- Monthly HRR breakdown fetched from API. Threshold is configurable per programme.

---

### B7 — AHT by Product Drilldown

**Persona:** Support Manager  
**Entry Point:** Click a bar group in the "Avg Handle Time by Product" grouped bar chart (Business Outcomes section)  

#### User Journey

1. User sees grouped bars (Prior Month / Current Month) per product area.
2. User clicks a product group (e.g., Azure).
3. Drilldown opens: "AHT Detail – [Product]".
4. Table shows: Subcategory | Current AHT (min) | Prior AHT (min) | Delta.

#### Acceptance Criteria

- [ ] Clicking a product group opens drilldown for that product.
- [ ] Table rows show subcategory-level AHT (e.g., Azure Networking, Azure Identity, Azure Storage).
- [ ] Delta column shows positive (red) or negative (green) values clearly.
- [ ] Chart legend distinguishes Prior Month vs Current Month bars.

#### Engineering Notes

- Subcategory AHT data fetched from API by product and month.

---

### B8 — Escalations by LOB Drilldown

**Persona:** Program Leader  
**Entry Point:** Click a bar in the "Escalations by LOB" horizontal bar chart (Business Outcomes section)  

#### User Journey

1. User sees escalation counts per LOB.
2. User clicks a LOB bar.
3. Drilldown opens: "Escalations – [LOB]".
4. Table shows: Incident ID | Summary | Severity | Status | Opened Date.

#### Acceptance Criteria

- [ ] Clicking a LOB bar opens drilldown for that LOB.
- [ ] Table shows individual escalated incidents for that LOB.
- [ ] Severity shown as a coloured badge: High (red), Medium (orange), Low (yellow).
- [ ] Status shown as a badge: Open, In Review, Resolved.
- [ ] Chart respects global LOB slicer.

---

### B9 — Retrieval Success Rate Drilldown

**Persona:** Program Leader  
**Entry Point:** Click a data point on the "Retrieval Success Rate" 6-month line chart (Program Health section)  

#### User Journey

1. User sees 6-month retrieval success trend line.
2. User clicks a month's data point.
3. Drilldown opens: "Retrieval Detail – [Month]".
4. Table shows: Metric | Value (e.g., Success Rate: 79%, Total Queries: 12,400, Failed Queries: 2,604, Top Failing LOB: Azure).

#### Acceptance Criteria

- [ ] Clicking a data point opens drilldown for that month.
- [ ] Table shows: Success Rate %, Total Queries, Failed Queries, Top Failing LOB.
- [ ] Values are clearly labelled with units.

---

### B10 — Quality Score by LOB Drilldown

**Persona:** LOB Leader  
**Entry Point:** Click a bar group in the "Quality Score by LOB" 3-month grouped bar chart (Program Health section)  

#### User Journey

1. User sees quality scores per LOB for Jan, Feb, Mar as grouped bars.
2. User clicks a LOB group.
3. Drilldown opens: "Quality Detail – [LOB]".
4. Table shows: Metric | Jan | Feb | Mar — plus a "Top Issues" note for the LOB.

#### Acceptance Criteria

- [ ] Clicking a LOB group opens drilldown for that LOB.
- [ ] Table shows per-metric quality scores for the last 3 months.
- [ ] Top Issues for the LOB are displayed below the table (e.g., "Content gaps in Azure Networking").
- [ ] Chart respects global LOB slicer.

---

### B11 — Incident Volume Drilldown

**Persona:** Program Leader  
**Entry Point:** Click a bar in the "Incident Volume by Month" bar chart (Program Health section)  

#### User Journey

1. User sees monthly incident counts.
2. User clicks a month's bar.
3. Drilldown opens: "Incidents – [Month]".
4. Table shows: Incident ID | Summary | Severity | LOB | Status.

#### Acceptance Criteria

- [ ] Clicking a bar opens drilldown for that month.
- [ ] Table lists all incidents that occurred in that month.
- [ ] Severity and Status shown as coloured badges.
- [ ] Incident IDs are links to the incident record (opens in new tab).

#### Engineering Notes

- Incident list fetched from API by month. Incident link resolves to the incident management system URL.

---

## C. Actionable Insights Resolution Flows

The Actionable Insights sidebar shows prioritised action items grouped by High / Medium / Low priority. Clicking any item opens the Resolution Drawer — a full-panel overlay — with context and a resolution workflow. There are four resolution flow types.

---

### C1 — Content Fix Resolution Flow

**Persona:** Content Manager  
**Entry Point:** Click a High/Medium priority action item with resolution type "Fix Content" in the Actionable Insights sidebar  

#### User Journey

1. Resolution drawer opens showing:
   - **Failing Prompts** panel: the user question, the bot's actual answer, and what content is missing.
   - **Affected Articles** table: each article with its status (Blocked / Outdated / Missing), age in days, block reason, and an "Action Taken" column (initially empty).
2. User reads the failing prompt context to understand the issue.
3. User selects one or more articles using the checkboxes (or the select-all checkbox in the header).
4. User clicks one of the action buttons:
   - **🔓 Unblock** — marks the selected articles as unblocked and initiates the unblocking process.
   - **🗑 Remove Content** — flags selected articles for removal from the knowledge base.
   - **➕ Add Content** — opens the Add Content flow (same as Quick Action D1) pre-filled for the article's LOB.
   - **✏️ Request Content Update** — opens an inline mini-form to create an ADO task for a content update.
   - **🗄 Archive** — flags selected articles for archiving.
5. For each action taken, a timestamped log entry appears in the "Action Taken" column of the article row.
6. **If "Request Content Update" is clicked:**
   - An inline form appears below the article table with fields: Title (pre-filled) and Assign To.
   - User clicks "Create ADO Item". A work item is created and the success card shows the ADO ID and a "View in ADO →" link.
7. User can take actions on multiple articles in one session.
8. User closes the drawer when done.

#### Intended Behaviour

- Each action records a log entry with a timestamp and "You" as the actor.
- A selected article can only have one "active" action at a time; a new action overwrites the previous.
- Clicking "Remove Content" or "Archive" should show a confirmation dialog before proceeding, as these are destructive.
- Unblock triggers the content pipeline to re-evaluate and re-ingest the article.

#### Acceptance Criteria

- [ ] Failing prompts panel shows the question, bot answer, and missing content description.
- [ ] Affected articles table shows: Article Title (link), LOB, Status badge, Age (days), Action Taken.
- [ ] Article Title links open the source article in a new tab.
- [ ] Checkboxes allow individual and select-all selection.
- [ ] Selected article count badge updates in real time.
- [ ] All five action buttons are visible and labelled clearly.
- [ ] Clicking "Remove Content" or "Archive" shows a confirmation dialog before the action is applied.
- [ ] Taking an action on selected articles creates a timestamped entry in the "Action Taken" column.
- [ ] "Request Content Update" shows an inline form with pre-filled Title and an Assign To field.
- [ ] Submitting the inline form creates an ADO work item and returns a real ADO ID shown in a success card.
- [ ] "View in ADO →" link in the success card opens the work item in Azure DevOps in a new tab.

#### Edge Cases

- If no articles are selected, action buttons should be disabled or show a "Select at least one article" prompt.
- If the article URL is unavailable, the link should gracefully fail (e.g., greyed-out, with tooltip "Article not found").

#### Engineering Notes

- Unblock, Remove, Add, and Archive actions must call the content management API.
- ADO work item creation must use the ADO REST API; the "View in ADO" link must resolve to a real work item URL.
- Action log entries should be persisted (not lost on drawer close or page reload).

---

### C2 — ADO Assignment Resolution Flow

**Persona:** Program Leader  
**Entry Point:** Click an action item with resolution type "Create ADO Item" in the Actionable Insights sidebar  

#### User Journey

1. Resolution drawer opens showing:
   - **Affected Queries** panel: a bullet list of the queries driving this action item.
   - **Create ADO Work Item** form, pre-populated from the action item's defaults.
2. Form fields: Title, Type (Bug / Task / User Story), Priority (1–4), Assigned To, Area Path, Tags.
3. User reviews and adjusts the pre-filled values as needed.
4. User clicks **"Create Work Item"**.
5. A success card appears showing the ADO ID, title, assigned-to, and type.
6. A **"View in ADO →"** link opens the new work item in Azure DevOps in a new tab.

#### Acceptance Criteria

- [ ] Affected queries are listed in a clearly readable panel above the form.
- [ ] If no queries are listed, a muted "No affected queries listed." message appears.
- [ ] Form pre-populates Title, Type, Priority, Assigned To, Area Path, and Tags from the action item's default values.
- [ ] All six form fields are editable before submission.
- [ ] Type dropdown options: Bug, Task, User Story.
- [ ] Priority dropdown: 1 – Critical, 2 – High, 3 – Medium, 4 – Low.
- [ ] Submit button is disabled while submission is in progress.
- [ ] Success card shows: ADO ID, Title, Assigned To, Type.
- [ ] "View in ADO →" opens the created work item URL in a new tab.
- [ ] If submission fails, an error message is shown with a retry option.

#### Engineering Notes

- ADO work item creation uses the Azure DevOps REST API. The "View in ADO" URL is the returned work item web URL.

---

### C3 — Bug Filing Resolution Flow

**Persona:** Support Engineer  
**Entry Point:** Click an action item with resolution type "File Bug" in the Actionable Insights sidebar  

#### User Journey

1. Resolution drawer opens with two tabs: **🐛 File Bug** and **🔬 Assign to DS**.
2. If the action has an incident ID, a banner shows it prominently. If there is investigation context, it is shown in a code block.

**Tab: File Bug**
3. User fills: Title, Severity (Critical / High / Medium / Low), Team (PG / SIA Eng / DS), Component, Description.
4. User clicks **"File Bug"**.
5. A success message appears: "Bug #[ID] filed and assigned to [Team] team. Average response: 2 business days."

**Tab: Assign to DS**
6. User fills: Title, Context, Requested By, Priority (1–4).
7. User clicks **"Create Investigation Request"**.
8. A success message appears: "Investigation request [ID] created and assigned to DS team."

#### Acceptance Criteria

- [ ] Tab switcher renders "🐛 File Bug" and "🔬 Assign to DS" tabs; only one tab is active at a time.
- [ ] If the action has an `incidentId`, a banner at the top of the drawer displays it.
- [ ] If the action has `investigationContext`, it is shown in a formatted code block.
- [ ] File Bug tab fields: Title, Severity, Team, Component, Description (all required except Component).
- [ ] Assign to DS tab fields: Title, Context, Requested By, Priority.
- [ ] Submitting either tab shows a success message with the generated ticket ID.
- [ ] Success message for bug filing includes the team name and 2-business-day SLA.
- [ ] If submission fails, an error message with retry is shown.

#### Engineering Notes

- Bug filing integrates with the designated bug tracking system (team-dependent routing: PG / SIA Eng / DS).
- Investigation requests route to the Data Science team's work management system.
- Bug/investigation IDs are returned by the respective system APIs.

---

### C4 — Content Request Resolution Flow

**Persona:** Content Manager  
**Entry Point:** Click an action item with resolution type "Content Request" in the Actionable Insights sidebar  

#### User Journey

1. Resolution drawer opens showing a table of **Unanswered Queries**: Question | LOB (colour chip) | Topic | # Asked.
2. User can click any query row to pre-fill the resolution forms below.
3. Two tabs appear: **➕ Add Content** and **📋 Assign to Investigate**.

**Tab: Add Content**
4. Fields: Content Title, LOB, Topic, Description of Needed Content, Source URL (optional), Upload Document (optional drag-drop).
5. Clicking a query row pre-fills Content Title as "Add content: [Topic] ([LOB])".
6. User clicks **"Create Content Request"**.
7. Success message: "Content addition request [ADO ID] created. LOB lead notified to review and publish."

**Tab: Assign to Investigate**
8. Fields: Title, Assign To, Area Path, Priority, Tags.
9. Clicking a query row pre-fills Title as "[Content Gap] [LOB] – [Topic]: no knowledge for '[question excerpt]'".
10. User clicks **"Create ADO Item"**.
11. Success card shows ADO ID and "View in ADO →" link.

#### Acceptance Criteria

- [ ] Unanswered queries table shows: Question, LOB (colour-coded chip), Topic, # Asked.
- [ ] Clicking a query row pre-fills both the Add Content and Assign to Investigate forms.
- [ ] Add Content form fields: Content Title, LOB, Topic, Description (required), Source URL (optional), File Upload (optional).
- [ ] File upload zone accepts drag-and-drop and click-to-browse; accepted formats: PDF, DOCX, XLSX, TXT.
- [ ] Assign to Investigate form fields: Title, Assign To, Area Path, Priority, Tags.
- [ ] Submitting Add Content creates an ADO content request and shows success message with ADO ID.
- [ ] Submitting Assign to Investigate creates an ADO work item and shows success card with "View in ADO →" link.
- [ ] If the unanswered queries list is empty, a "No unanswered queries listed." message is shown.

#### Engineering Notes

- File upload must persist the document to the content management system (not just stored in memory).
- Both form submissions call the ADO REST API. "View in ADO" links resolve to real work item URLs.

---

## D. Quick Actions

Quick Actions appear as a row of buttons in the dashboard header. Each opens a modal overlay.

---

### D1 — Add Content (Knowledge Agent Onboarding)

**Persona:** Content Manager  
**Entry Point:** "➕ Content Ingestion Request" button in the Quick Actions bar  

#### User Journey

1. Modal opens with descriptive text explaining the onboarding process.
2. A banner with a **"Download Template"** link allows the user to download the Excel onboarding template.
3. User fills the form:
   - **Team / Project Name** (required)
   - **Brief Description of Onboarding Request** (required, textarea)
   - **SxG Project Contacts – PM, Eng, POC** (required)
   - **Agent Type** (required, dropdown: AAQ / KA)
   - **Attach Completed Excel File** (required, .xlsx / .xls)
4. Submit button is disabled until all required fields are filled.
5. User clicks **"Submit Request"**.
6. A success screen confirms: "Your onboarding request has been submitted. The SxG team will follow up within [SLA]."
7. A "Done" button closes the modal.

#### Acceptance Criteria

- [ ] "Download Template" link opens `https://aka.ms/Content_KA_Onboarding` in a new tab.
- [ ] All five fields render; four are required (asterisk-marked).
- [ ] Agent Type dropdown: AAQ, KA.
- [ ] File picker accepts only .xlsx and .xls files; selecting another type shows an error.
- [ ] Selected filename is displayed next to the file picker.
- [ ] Hint text: "Requests without a completed Excel will remain Blocked."
- [ ] Submit button is disabled until all required fields are filled AND a file is attached.
- [ ] Submitting sends the form payload and the attached file to the onboarding intake system.
- [ ] Success screen shows a request reference ID and the expected follow-up SLA.
- [ ] "Done" button closes the modal and resets the form.

#### Engineering Notes

- Form payload + file sent to the Power Automate flow at `config.INGESTION_FLOW_URL`. File should be base64-encoded or multipart form data depending on flow design.
- Success state should display a real request ID returned by the flow.

---

### D2 — Remove Content

**Persona:** Content Manager  
**Entry Point:** "🗑️ Content Removal Request" button in the Quick Actions bar  

#### User Journey

1. Modal opens with descriptive text.
2. User fills the form:
   - **Team / Project Name** (required)
   - **Agent Type** (required, dropdown: AAQ / KA)
   - **Urgency** (dropdown: Normal / High – outdated or inaccurate / Urgent – harmful or sensitive content)
   - **Reason for Removal** (required, textarea)
   - **Article ID(s) / URL(s)** (required OR file upload — one of the two must be provided, textarea, "Paste one article per line")
   - **Upload a List** (optional, .xlsx / .xls / .csv)
3. User must provide either the articles textarea OR a file upload.
4. User clicks **"Submit Removal Request"**.
5. Success screen: "Your removal request has been submitted. The KA team will review within 2 business days."

#### Acceptance Criteria

- [ ] All form fields render as specified.
- [ ] Urgency dropdown: Normal, High – outdated or inaccurate, Urgent – harmful or sensitive content.
- [ ] Selecting "Urgent – harmful or sensitive content" triggers a confirmation dialog warning the user of the urgency before proceeding.
- [ ] Submit is enabled only when Team, Reason, and either Articles textarea or file upload are filled.
- [ ] File accepts .xlsx, .xls, .csv only.
- [ ] Submitting sends form payload to the removal intake system.
- [ ] Success screen shows a request reference ID.

#### Engineering Notes

- Form + article list/file sent to `config.REMOVAL_FLOW_URL`. Urgent requests should trigger a higher-priority routing path in the flow.

---

### D3 — Feedback

**Persona:** Any user  
**Entry Point:** "💬 Give Feedback" button in the Quick Actions bar  

#### User Journey

1. Modal opens.
2. User fills the form:
   - **Category** (required, dropdown: Content Quality / Knowledge Gap / Dashboard/UX / Data Accuracy / Article Feedback / Other)
   - **Subject** (required, text)
   - **Your Feedback** (required, textarea)
   - **Rating** (optional, 1–5 stars — interactive star widget)
   - **Your Name / Alias** (optional, "Leave blank to submit anonymously")
3. User clicks **"Send Feedback"**.
4. Success screen: "Thank you! Your feedback has been sent to the SxG Knowledge team."
5. If submission fails, an error message is shown with a Retry button.

#### Acceptance Criteria

- [ ] Category dropdown lists all six categories.
- [ ] Star rating widget: hovering highlights stars up to the hovered index; clicking locks the rating; clicking the same star again deselects it.
- [ ] Submit button shows "Sending…" and is disabled while the request is in flight.
- [ ] If `config.FEEDBACK_FLOW_URL` is configured, payload is POSTed to that URL.
- [ ] If `config.FEEDBACK_FLOW_URL` is empty, the form opens a pre-filled mailto link to `config.FEEDBACK_EMAIL` as a fallback.
- [ ] Payload includes: category, subject, feedback text, rating (null if not selected), alias ("Anonymous" if blank), timestamp.
- [ ] Success screen is shown after submission.
- [ ] Error state with Retry option if submission fails.

---

### D4 — Feature Request

**Persona:** Any user  
**Entry Point:** "🚀 Feature Request" button in the Quick Actions bar  

#### User Journey

1. Modal opens with a structured 5-section form.
2. Sections: **The Ask** | **Value & Impact** | **Problem & Solution** | **Planning** | **Stakeholders**
3. Only **Title** and **One-Sentence Description** (The Ask section) are required.
4. All remaining 11 fields are optional but encouraged.
5. User clicks **"Submit Feature Request"**.
6. Success screen: "Your feature request has been submitted. The SxG team will review it during sprint planning."

#### Form Fields

| Section | Field | Required |
|---------|-------|----------|
| The Ask | Title | ✅ |
| The Ask | One-Sentence Description | ✅ |
| Value & Impact | KR Accrual | Optional |
| Value & Impact | Value Proposition | Optional |
| Value & Impact | Why Now | Optional |
| Problem & Solution | Experience Today | Optional |
| Problem & Solution | Use Case | Optional |
| Problem & Solution | Dream State | Optional |
| Planning | Target Timeline | Optional |
| Planning | Dependencies | Optional |
| Planning | Costing | Optional |
| Stakeholders | Capability Ask Source | Optional |

#### Acceptance Criteria

- [ ] All 13 fields render across 5 labelled sections.
- [ ] Only Title and One-Sentence Description are required; form is submittable with just these two.
- [ ] If `config.FEATURE_REQUEST_FLOW_URL` is configured, full payload is POSTed.
- [ ] If not configured, a pre-filled mailto opens with all field values in the email body.
- [ ] Success screen confirms submission and mentions sprint planning review.
- [ ] Form data is not lost if the user accidentally scrolls (single-page modal, all fields visible with scroll).

---

### D5 — New Partner Onboarding

**Persona:** New integration partner (team adopting the Knowledge Agent API)  
**Entry Point:** "🌐 New Partner Onboarding" button in the Quick Actions bar  

#### User Journey

1. Modal opens with explanatory text for new partners only.
2. User fills the form:
   - **Team Name** (required)
   - **Preferred Calling Method** (required, radio card): "Execute CoPilot and Wait (V2)" or "SxG MCP Server"
   - **Purpose & Where It Will Be Used** (required, textarea)
   - **MCS Org Name** (optional)
   - Conditional: If **V2** selected → **NPA Account** field appears
   - Conditional: If **MCP** selected → **MCP Access Obtained?** dropdown appears (No / Yes)
   - **Environment** (dropdown: Pre-Production / Production)
   - **Expected Requests per Second (RPS)** (number input, min: 1)
3. User clicks **"Submit Onboarding Request"**.
4. Success screen: "Your onboarding request has been submitted. The SxG team will follow up to discuss next steps."

#### Acceptance Criteria

- [ ] Radio card group renders two options with titles and descriptions.
- [ ] Selecting V2 shows the NPA Account field; selecting MCP shows MCP Access Obtained dropdown.
- [ ] NPA Account and MCP Access fields are hidden when the other calling method is selected.
- [ ] Environment dropdown: Pre-Production, Production.
- [ ] RPS input is numeric with a minimum of 1; entering 0 or negative is blocked.
- [ ] Submit enabled only when required fields (Team Name, Calling Method, Purpose) are filled.
- [ ] Payload includes all fields, with conditional NPA/MCP fields included or excluded based on selection.
- [ ] If `config.ONBOARDING_FLOW_URL` is configured, payload POSTed to that URL; otherwise mailto fallback.
- [ ] Success screen confirms submission and mentions follow-up.

---

### D6 — Knowledge Bot

**Persona:** Any user seeking self-service support  
**Entry Point:** "🤖 Knowledge Bot" button in the Quick Actions bar  

#### User Journey

1. Modal opens showing the Knowledge Bot overview.
2. If the Teams bot URL is configured, an **"Open in Teams ↗"** button is shown.
3. User clicks "Open in Teams ↗". The Teams app opens in a new tab and the modal closes.
4. If the Teams bot URL is not configured, the modal shows a "Teams integration in progress — check back soon." message.

#### Acceptance Criteria

- [ ] Modal shows the bot name, a description of its capabilities, and a list of example questions users can ask.
- [ ] If `config.TEAMS_BOT_URL` is configured, "Open in Teams ↗" button is shown and opens the URL in a new tab.
- [ ] Clicking "Open in Teams ↗" also closes the modal.
- [ ] If `config.TEAMS_BOT_URL` is empty, the coming-soon message is shown instead of the button.
- [ ] Example questions list is maintained/updated to reflect the bot's current capabilities.

#### Engineering Notes

- The Teams bot itself is a separate Azure Bot Service implementation. This modal is purely a launcher/marketing surface.
- The bot URL may change over time; it should be managed in `config.TEAMS_BOT_URL` or a remote config service.

---

## E. Data Tables

---

### E1 — Blocked Articles Table

**Persona:** Content Manager  
**Entry Point:** "Top Blocked Articles" table in the Tables section of the dashboard  

#### User Journey

1. User navigates to the Tables section. The Blocked Articles table renders with filtered data based on the global SlicerBar LOB selection.
2. Table shows up to N rows; if more exist, pagination controls appear.
3. User can click a column header to sort ascending/descending.
4. User clicks **"↓ Export CSV (N)"** button to download the visible rows as a CSV file.
5. If no rows match the current filters, an empty state message is shown.

#### Acceptance Criteria

- [ ] Table columns: Article Title (link), LOB, Owner, Block Reason, Age (days, shown as e.g. "14d").
- [ ] Article Title is a clickable link opening the source article in a new tab.
- [ ] Table data is filtered by the global LOB slicer.
- [ ] Export CSV button label includes row count: "↓ Export CSV (N)".
- [ ] Export CSV button is disabled when no rows are present.
- [ ] Clicking Export CSV downloads a file named `blocked-articles.csv` containing the visible rows.
- [ ] Empty state message: "No blocked articles for selected filters."
- [ ] Table supports column sorting (click header to toggle asc/desc).
- [ ] Table supports pagination for large datasets (page size configurable).

#### Engineering Notes

- Table data fetched from API with LOB filter parameter. Pagination parameters (page, pageSize) sent to API.
- Sort order sent to API as a sort parameter so server-side sorting is used for large datasets.

---

### E2 — Recent Incidents Table

**Persona:** Support Engineer / Program Leader  
**Entry Point:** "Recent Incidents" table in the Tables section  

#### User Journey

1. Table renders filtered by global LOB slicer.
2. Severity column shows colour-coded badges (High = red, Medium = orange, Low = yellow).
3. Status column shows badges (Open = blue, In Review = yellow, Resolved = green).
4. User sorts or exports as with the Blocked Articles table.

#### Acceptance Criteria

- [ ] Table columns: Incident ID, LOB, Severity (badge), Status (badge), Opened (date), Summary.
- [ ] Incident ID is a link to the incident record in the incident management system (opens new tab).
- [ ] Severity badges: High (red background), Medium (orange), Low (yellow).
- [ ] Status badges: Open (blue), In Review (yellow/amber), Resolved (green).
- [ ] Table is filtered by global LOB slicer.
- [ ] Export CSV downloads `incidents.csv` with visible rows.
- [ ] Empty state: "No incidents for selected filters."
- [ ] Table supports sorting and pagination.
- [ ] Opened date shows a human-readable format (e.g., "Mar 14, 2026").

---

## F. Evaluation Results

---

### F1 — Evaluation CSV Upload

**Persona:** Data Scientist / Program Leader  
**Entry Point:** EvalUploader component in the Evaluation Results section  

#### User Journey

1. User sees a styled drop zone labelled "Drop your eval CSV here or **click to browse**".
2. User either drags a CSV file onto the zone or clicks it to open the file browser.
3. The file is validated: must be a .csv file; must have at least one header row and one data row.
4. The parser auto-detects:
   - **Numeric columns:** Columns where ≥80% of values in the first 20 rows are numbers.
   - **Safety columns:** Columns named `hate_unfairness`, `sexual`, `violence`, `self_harm`.
   - **Date column:** Column containing YYYY-MM-DD formatted values.
   - **Group column:** Low-cardinality string column (2–20 unique values).
5. On successful parse, all analysis views update with the new dataset.
6. If parsing fails (invalid format, missing required columns), an error message is shown inline.

#### Expected CSV Columns

| Column | Type | Required |
|--------|------|----------|
| date | YYYY-MM-DD | ✅ |
| question | string | ✅ |
| accuracy | float (0–5) | ✅ |
| relevance | float (0–5) | ✅ |
| coherence | float (0–5) | ✅ |
| fluency | float (0–5) | ✅ |
| intent_resolution | float (0–5) | ✅ |
| hate_unfairness | 0 or 1 | ✅ |
| sexual | 0 or 1 | ✅ |
| violence | 0 or 1 | ✅ |
| self_harm | 0 or 1 | ✅ |

#### Acceptance Criteria

- [ ] Drop zone accepts .csv files via drag-and-drop and click-to-browse.
- [ ] Drop zone shows a visual highlight (border, background change) while a file is dragged over it.
- [ ] Only .csv files are accepted; other file types show an error: "Please upload a .csv file."
- [ ] Files with no data rows (header only) show an error: "No data rows found in file."
- [ ] Successful parse clears any previous error and updates all analysis views.
- [ ] Quoted CSV fields with embedded commas are parsed correctly.
- [ ] Maximum accepted file size: 50 MB (files larger than this show a user-friendly error).
- [ ] Column auto-detection results are used to drive the analysis views (not hardcoded column names).

---

### F2 — Evaluation Analysis Views

**Persona:** Data Scientist / Program Leader  
**Entry Point:** Evaluation Results section (auto-populated with mock data until a CSV is uploaded)  

#### Sub-view: Accuracy Hero

- Displays the mean accuracy score across all evaluation rows (e.g., "3.45 / 5.0").
- Displays the percentage of rows where accuracy ≥ threshold (default: 3.0) as a badge.
- Badge is green if ≥ 60%, red if < 60%.
- Shows: "Threshold ≥ 3.0 · [N] evaluations".

**AC:** Accuracy average and threshold % are calculated dynamically from the uploaded/mock dataset.

---

#### Sub-view: Eval Dip Alert Banner

- When a sustained drop in daily accuracy is detected, a banner appears showing: date range, score drop (e.g., "3.41 → 3.06"), and root cause category (e.g., "34% of low-scoring queries fall in Azure Networking").
- Banner links to the corresponding actionable insight in the sidebar.

**AC:**
- [ ] Dip detection is data-driven (not hardcoded): algorithm identifies date ranges where the rolling average drops more than a configurable threshold (e.g., 0.2 pts) sustained over 3+ days.
- [ ] Banner is hidden when no dip is present in the data.
- [ ] Banner CTA scrolls to or highlights the corresponding actionable insight.

#### Engineering Notes

- Dip detection algorithm and configurable sensitivity should be implemented server-side or as a client-side analytics function, replacing the current hardcoded EVAL_DIP constant.

---

#### Sub-view: Per-Metric Quality Cards

- Displays one card per quality metric: Relevance, Coherence, Fluency, Intent Resolution.
- Each card: metric name, average score (e.g., "3.67 / 5"), % above threshold (badge, green/red).

**AC:** All values calculated dynamically from dataset. Threshold is shared with the Accuracy Hero threshold (configurable).

---

#### Sub-view: % Above Threshold Bar Chart

- Horizontal bar chart showing the % of responses meeting the threshold for each metric (Accuracy + 4 quality metrics).
- Accuracy bar uses a distinct colour; quality metric bars use a shared colour.

**AC:** Chart data is computed from the dataset. Chart updates when a new CSV is uploaded.

---

#### Sub-view: Score Distribution Bar Chart

- Vertical bar chart bucketing accuracy scores: Excellent (4.5–5.0), Very Good (4.0–4.4), Good (3.0–3.9), Poor (< 3.0).
- Each bucket shows row count.

**AC:** Buckets computed from dataset. Bucket boundaries are clearly labelled.

---

#### Sub-view: Daily Trend Lines

- Multi-line chart plotting average scores by date for: Accuracy (thick, distinct colour) + Relevance, Coherence, Fluency, Intent Resolution.
- X-axis: date (MM-DD); Y-axis: score (0–5).
- Dip period (if detected) is highlighted with vertical reference lines and a "⚠ Dip" label.

**AC:**
- [ ] All 5 metric lines rendered with distinct visual styles.
- [ ] X-axis dates are auto-scaled to the date range present in the dataset.
- [ ] Dip reference lines appear only when a dip is detected.
- [ ] Tooltip on hover shows date and all metric values for that day.

---

#### Sub-view: Content Safety Panel

- Grid of 4 safety metric cards: Hate/Unfairness, Sexual, Violence, Self Harm.
- Each card shows: total entries evaluated, number of failures (value > 0), failure %.
- Green "✓ All passed" if 0 failures. Red "N fail(s)" if failures exist.

**AC:** Safety metrics computed dynamically. Panel shows an "All metrics passed" banner if all four metrics have zero failures.

---

## G. Navigation

---

### G1 — Product Switcher (AAQ / CMSP / AI Native)

**Persona:** Any dashboard user  
**Entry Point:** Three pill buttons in the dashboard header  

#### User Journey

1. Dashboard loads with **AAQ** as the default selected product. Header is styled in AAQ blue (#0078d4).
2. User clicks **CMSP** pill. Header updates to CMSP purple (#5c2d91). All charts, KPIs, and tables reload with CMSP-specific data.
3. User clicks **AI Native** pill. Header updates to green (#107c10). All sections reload with AI Native data.
4. The active pill shows a filled background, coloured border, and a small dot indicator.

#### Acceptance Criteria

- [ ] Three pill buttons render: AAQ, CMSP, AI Native.
- [ ] Active pill is visually distinct: filled background, matching border, dot indicator.
- [ ] Clicking a pill updates the header colour scheme to the product's brand colour.
- [ ] Clicking a pill updates ALL chart data, KPI values, and table rows to reflect the selected product's dataset.
- [ ] A loading indicator is shown while product-specific data is being fetched.
- [ ] Product-specific LOB options in the SlicerBar update to reflect the available LOBs for the selected product.
- [ ] The selected product is persisted in the URL (e.g., `?product=cmsp`) so sharing the URL preserves the view.

#### Engineering Notes

- Product selection must be passed to all backend API calls as a product/tenant parameter.
- Different products may have different available LOBs, data sources, and audiences — the SlicerBar options must be fetched per product.
- Selected product should also be stored in localStorage for persistence across sessions.

---

*End of Functional Specification*
