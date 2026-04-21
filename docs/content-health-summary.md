# Content Health Dashboard — Metric Reference

A panel-by-panel, **metric-by-metric** reference for the dashboard at
`/content-health`, in the order panels appear top-to-bottom.

For each metric: **Value** (what's counted), **Hint** (the subtitle line, if
any), **Color** (when shown), **Use** (what to walk away with).

> Companion to the deeper [`content-health-walkthrough.md`](./content-health-walkthrough.md).
> Today every number is **synthetic**; scope is **AAQ only**.

---

## Header — product pills, scope banner, ownership

- **AAQ / CMSP / AI Native pills:** Product scope selector. CMSP and AI
  Native are disabled — labelled *Out of scope*.
- **Scope banner:** Reminds reviewers the dashboard is AAQ-only.
- **Owner pill:** "Content Health team · synthetic data" — this dashboard is
  *not* the main hub.

## Slicer

- **LOB:** All / Azure / Microsoft 365 / Windows / Surface / Xbox / Intune.
- **Window (days):** Filters time-windowed panels (PRs, feedback, AI quality,
  intake breaches, self-help, search analytics).
- **Take away:** Every panel below re-aggregates from these two controls.

---

## KPI strip (6 tiles)

### 1. Docs in scope
- **Value:** Total docs after applying the LOB filter.
- **Hint:** "*N* thin area(s)" — Product × LOB cells with **< 4 docs**.
- **Color:** Green if zero thin areas, amber otherwise.
- **Use:** How big is the corpus and are any combos thin?

### 2. Stale docs (>180d)
- **Value:** In-scope docs not updated in **> 180 days**.
- **Hint:** That count as a **% of the in-scope corpus**.
- **Color:** Green ≤ 10%, amber 10–25%, red > 25%.
- **Use:** Headline rot indicator.

### 3. Quality issues
- **Value:** **Sum of three defect counts** (a doc with two defects is counted
  twice): broken-link docs + missing-metadata docs + hard-to-read docs
  (Flesch < 50).
- **Color:** Green ≤ 15, amber 16–40, red > 40.
- **Use:** Sizes the editorial backlog.

### 4. Updates merged
- **Value:** PRs **merged in the selected window** (renamed from "Authoring PRs"
  per business feedback — same metric, friendlier label).
- **Color:** Neutral (informational).
- **Use:** "Are we keeping up?" Compare against intake (#10).

### 5. Thumbs ratio
- **Value:** **👍 / (👍 + 👎)** across feedback in the window.
- **Color:** Green ≥ 80%, amber 60–79%, red < 60%.
- **Use:** Customer-perceived quality headline.

### 6. Response coverage
- **Value:** % of in-window search events that returned **at least one
  result** (`hadResult === true`). Replaces the old raw "Search misses" tile —
  Bob's review: "1.7K, is that good or bad?" needed a denominator.
- **Color:** Green ≥ 90%, amber 75–89%, red < 75%.
- **Use:** Headline answer-coverage metric. Raw miss count is still in the
  Search Analytics panel.

---

# Section A · Knowledge hygiene

## Inventory by Product × LOB panel
- **Grid:** Product × LOB → doc count. (Renamed from "Coverage" — Bob/Andy:
  "coverage" should mean *intent* coverage, not doc count.)
- **Thin flag:** Cells with **< 4 docs** are tagged "Thin".
- **Thin list:** Below the grid, an explicit list of all flagged cells.
- **Use:** Spot dangerously thin product/LOB combos.

## Source attribution panel *(new)*
- **Stacked bar per LOB:** Segments show how many in-scope docs come from
  each source (Cornerstone, Learn, Wiki, LLC, GitHub, Other).
- **Use:** Andy's question — "where did the 64 docs come from?" Quickly see
  whether an LOB is dominated by one source or balanced across several, and
  notice obvious gaps (e.g. an LOB with no Learn content).
- **Note:** Today the source field is **synthetic** (seeded random by LOB).
  Once the real ingestion pipeline tags docs with a source, this panel
  becomes real with no dashboard changes.

## Freshness panel
- **Bar chart bins:** `0–30d`, `31–90d`, `91–180d`, `181–365d`, `> 365d` —
  by **days since last update**.
- **Subtitle:** Stale count + stale share (mirrors KPI #2).
- **Click a bar:** Opens a drill-down drawer listing the docs in that
  freshness bucket (id, title, LOB, days since update). CSV export available.
- **Use:** See where rot accumulates, then click to action it.

## Quality signals panel
Three counters over in-scope docs:
- **Broken-link docs** (and total broken-link count across them).
- **Missing-metadata docs** (`hasMetadata === false`).
- **Hard-to-read docs** (Flesch reading-ease **< 50**).
- **Click a row:** Opens a drill-down drawer listing the offending docs.
- **Use:** Pick the editorial sprint target, then click straight into the list.

## Authoring throughput panel
- **Daily line chart:** Updates merged per day in the window.
- **Top 6 contributors table:** Updates count + total lines changed, sorted by
  updates count.
- **Use:** "Are we keeping up, and who's doing the work?"

## LOB health scorecard
- **Per-LOB row:** doc count, **coverage score**, **freshness score**,
  **quality score**, **overall score (0–100)**, and an **A–F grade pill**.
- **Coverage score:** `docs_in_lob / largest_lob_in_scope × 100` (relative,
  not absolute).
- **Freshness score:** `(1 − stale/total) × 100`.
- **Quality score:** `(1 − issues/total) × 100` where "issues" = doc with any
  of broken link / missing meta / Flesch < 50.
- **Overall:** `0.3·coverage + 0.4·freshness + 0.3·quality`. Freshness is
  weighted highest because stale = highest AI grounding risk.
- **Grade:** A ≥ 85, B ≥ 70, C ≥ 55, D ≥ 40, else F.
- **Sort:** Best score first.
- **Use:** Bring this to each SBU lead 1:1.

## Readability distribution panel
- **Histogram bins (Flesch reading-ease):**
  `0–29 (very hard)`, `30–49 (hard)`, `50–69 (standard)`, `70–100 (easy)`.
- **Hardest docs table:** Bottom 5 docs by readability score.
- **Use:** Prioritize a plain-language pass — clearer text also improves AI
  grounding.

## Document aging heatmap (wide)
- **Grid:** LOB rows × age-bucket columns (same buckets as Freshness).
- **Color scale:** Younger = blue, older = red; intensity scaled to the
  hottest cell in view.
- **Click a cell:** Opens a drill-down drawer listing the docs in that
  LOB × age-bucket. CSV export available.
- **Use:** Pair with the Scorecard — bad grade + heavy red tail = top
  candidate for an editorial sprint.

---

# Section B · AI readiness & quality

## AI readiness panel
Five percentage tiles over in-scope docs (`Doc.ai`):
- **Indexed in AI store** (`indexedInAiStore`).
- **Schema valid** (`schemaValid`).
- **Has Q&A block** (`hasQaBlock`).
- **Embedding fresh** (`embeddingAgeDays ≤ 30`).
- **Last AI eval = pass** (`lastAiEval === 'pass'`).

Plus an **AI-blocked docs** table:
- **Definition:** Doc with **≥ 2 readiness issues** (issues = "not indexed",
  "schema invalid", "no Q&A block", "embedding *N*d old", "eval failed", or
  "never evaluated").
- **Sort:** Most issues first; top 8 shown.
- **Use:** Target all five tiles ≥ 80% before high-stakes AI use; the table
  is your concrete to-do list.

## AI quality panel
Tiles + trend + worst-LOB table over `aiAnswers` events in the window:
- **Total answers** (sample size).
- **Answer accuracy %** — mean of `accuracy` (offline-eval-judged).
- **Mean confidence %** — mean of `confidence` (model self-reported).
- **Grounded %** — share of answers that cited at least one source doc.
- **Human fallback %** — share that escalated to a human.
- **Accuracy trend chart:** Mean accuracy per day.
- **Worst LOBs table:** Per-LOB accuracy, answer count, and fallback %,
  sorted **lowest accuracy first**.
- **Use:** Watch for **confidence > accuracy** (overconfident AI). Worst-LOB
  table = which content needs work.

---

# Section C · Lifecycle (intake → retire)

## Intake & review queue (wide)
- **State counts:** `Pending`, `In review`, `Blocked`, `Published` (from
  `IntakeRequest.state`).
- **Breach %:** Open requests (non-published) past their state's SLA, as a %
  of all open requests.
- **SLA breaches table:** Top 6 worst (highest *over-by* days), with state,
  LOB, age in state, target, and over-by.
- **Use:** Is the lifecycle moving? Chase the breach list weekly.

## Priority scenarios (wide)
- **Header callout:** **P0 covered / P0 total** — the headline AI-safety
  number on the dashboard.
- **Status counts:** `gap`, `outdated`, `draft`, `covered`.
- **Coverage %:** `covered / total`.
- **Scenario table:** Sorted **gaps first**, then outdated → draft → covered;
  within each status sorted P0 → P1 → P2.
- **Use:** This is the KM-curated registry; the gaps-first sort *is* the
  to-do list.

## Stale / at-risk articles (wide)
- **Table:** Top 12 in-scope docs with `daysSince > 180`, sorted oldest
  first. Columns: title, LOB, owner, days since update, broken-link count.
- **Use:** Send directly to owners as their refresh list.

---

# Section D · Cross-team & outcomes

## Owner / SBU rollup (wide)
One row per SBU in scope. Columns:
- **Docs** — total in-scope.
- **Stale docs** + **stale share %** (> 180d).
- **Quality issue docs** + **issue share %** (any of broken link / missing
  meta / Flesch < 50).
- **Intake open** — non-published requests for this SBU (all-time, not
  windowed).
- **Intake breaches** — open requests past SLA.
- **Sort:** Combined risk score
  `staleSharePct + qualityIssueSharePct + intakeBreaches × 5`. Breaches are
  weighted heavily so even small breach counts surface.
- **Use:** The SBU at the top is who to call this week — your influence-
  without-authority artifact.

## Self-help resolution success
Tiles + trend + worst LOBs over `selfHelp` sessions in the window:
- **Total sessions** (sample size).
- **Resolved without help %** — `resolved === true`.
- **Escalated to human %** — `fellBackToHuman === true`.
- **Trend chart:** Daily resolved %.
- **Worst LOBs table:** Per-LOB sessions + resolved %, sorted lowest first.
- **Use:** The headline outcome metric — proves whether KB investment is
  improving self-service over time.

## Search analytics
Tiles + trend + worst LOBs over `searchEvents` in the window:
- **Total searches** (sample size).
- **Successful searches %** — `hadResult === true`.
- **Zero-click rate %** — had a result but the user **didn't click** any.
- **Trend chart:** Daily success rate.
- **Worst LOBs table:** Per-LOB searches, success rate, zero-click rate,
  sorted lowest success first.
- **Use:** A high zero-click rate is a silent quality killer — content
  exists but is unfindable or untrusted.

## Top performing docs
- **Eligibility:** Doc must have **≥ 100 views** in the window.
- **Sort:** **👍 ratio** desc, then views desc as tiebreaker. Top 6.
- **Columns:** title, LOB, views, 👍, 👎, ratio %.
- **Caveat:** High views ≠ quality; the view threshold + ratio mitigates but
  doesn't eliminate this.
- **Use:** Canonical examples to evangelize and learn from.

## Search-miss → coverage gap (wide)
For each LOB, joins **search-miss volume** with **doc count**:
- **Miss occurrences / queries:** Search-miss events keyword-mapped to a LOB
  (e.g., "intune"/"compliance" → Intune). Each miss is assigned to the first
  matching LOB.
- **Doc count:** Docs in that LOB in current scope.
- **Gap score (0–100):**
  `(missOcc / maxMissOcc) × (1 / (1 + docCount/5)) × 100`.
  Higher misses + lower coverage = higher score.
- **Sort:** Highest gap score first.
- **Use:** Demand-driven backlog — "users are asking; we don't have it."

## Feedback & usage (wide)
Drill-down companion to #14, #15, and the KPI strip:
- **Totals:** views, 👍, 👎, ratio %.
- **Top viewed docs (5):** docId, title, views, net (👍 − 👎), sorted by
  views.
- **Top search misses (8):** query, occurrences, last-seen date — raw,
  un-mapped (the same data feeds the gap map above).
- **Use:** Drill into specific content / queries behind the headline trends.

---

## 15-minute walkthrough order

1. **KPI strip + AAQ scope banner** — set the level.
2. **Section A** — Coverage → LOB Scorecard (the "scoreboard" framing).
3. **Section B** — spend the most time here; this is the central success
   metric for a KM role.
4. **Section C** — Intake kanban → Priority Scenarios (P0 headline) → Stale
   list.
5. **Section D** — Owner/SBU rollup, then Self-help and Search analytics as
   downstream outcomes.
