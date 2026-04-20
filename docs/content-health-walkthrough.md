# Content Health Dashboard — Walkthrough Guide

A panel-by-panel reference for the standalone dashboard at
**`/content-health`** (live: <https://deeptibusireddy.github.io/sxg-knowledge-hub/content-health>).

This document is structured for two audiences:

- **🧭 For business / Knowledge Manager review** — what the panel tells you and
  what action it should drive.
- **🔧 For engineering review** — where the data comes from in code, how it is
  computed, and what real source it should be wired to next.

> **Data status.** Every number on the dashboard today is **synthetic**, generated
> by `src/shared/contentHealth/fixtures.ts` from a single seeded PRNG so values
> are stable across renders. The data contract (`src/shared/contentHealth/types.ts`)
> is the handoff point — when real telemetry lands, only the loader behind that
> contract changes; no panel code is touched.

---

## Table of contents

1. [Header & global controls](#header--global-controls)
2. [KPI strip](#kpi-strip)
3. **Section A · Knowledge hygiene**
   - [Coverage](#1-coverage)
   - [Freshness](#2-freshness)
   - [Quality signals](#3-quality-signals)
   - [Authoring throughput](#4-authoring-throughput)
   - [LOB health scorecard](#5-lob-health-scorecard)
   - [Readability distribution](#6-readability-distribution)
   - [Document aging heatmap](#7-document-aging-heatmap)
4. **Section B · AI readiness & quality**
   - [AI readiness](#8-ai-readiness)
   - [AI quality](#9-ai-quality)
5. **Section C · Lifecycle (intake → retire)**
   - [Intake & review queue](#10-intake--review-queue)
   - [Priority scenarios](#11-priority-scenarios)
   - [Stale / at-risk articles](#12-stale--at-risk-articles)
6. **Section D · Cross-team & outcomes**
   - [Owner / SBU rollup](#13-owner--sbu-rollup)
   - [Self-help resolution success](#14-self-help-resolution-success)
   - [Search analytics](#15-search-analytics)
   - [Top performing docs](#16-top-performing-docs)
   - [Search-miss → coverage gap](#17-search-miss--coverage-gap)
   - [Feedback & usage](#18-feedback--usage)
7. [Appendix — data contract & wiring plan](#appendix--data-contract--wiring-plan)

---

## Header & global controls

**🧭 Business**
- The header marks the dashboard as **owned by the Content Health team** (separate from the main hub).
- A scope banner makes explicit that today's data covers **AAQ only**; CMSP and AI Native are intentionally out of scope until those products' content pipelines mature.
- The slicer (LOB · Window) re-aggregates **every panel** below — use it to drive a focused conversation (e.g., "Show me Intune over the last 30 days").

**🔧 Engineering**
- Component: `src/contentHealth/ContentHealthApp.tsx`
- Slicer state: `ContentHealthFilter = { product, lob, windowDays }` in `src/contentHealth/types.ts`
- The `Back to Hub` link routes to `/`; the route itself is registered in the hub's `src/App.tsx` (`<Route path="/content-health" />`).

---

## KPI strip

Six at-a-glance tiles above the panels:

| Tile | What it shows | Where it comes from |
|---|---|---|
| Coverage docs | Total docs in current scope | `selectKpis().coverageDocs` |
| Coverage gaps | Product × LOB cells with < 4 docs | `selectKpis().coverageGapAreas` |
| Stale docs | Docs older than 180 days since last update | `selectKpis().staleDocs` + `staleSharePct` |
| Quality issues | Docs with broken links + missing metadata + hard-to-read | `selectKpis().qualityIssues` |
| PRs in window | Authoring PRs merged in the slicer window | `selectKpis().prsLastWindow` |
| 👍 ratio | Positive / total feedback in window | `selectKpis().thumbsRatioPct` |

**🧭 Business** — These are the leadership-readable headlines. Set targets here first (e.g., "Stale share < 10%, AI eval pass > 80%").
**🔧 Engineering** — All values flow through `selectKpis(filter)` in `selectors.ts`. Wire-up is one function.

---

# Section A · Knowledge hygiene

The **table-stakes** view: are our docs current, complete, and well-written?

## 1. Coverage

**🧭 Business**
- A heatmap-style grid of **product × LOB → doc count**.
- Cells with **< 4 docs** are flagged as gaps and listed below the grid.
- Use this to answer: *"Which product/LOB combinations are dangerously thin?"*
- ⚠️ **Limitation**: "Coverage" today is a doc count, not a measure of *priority scenarios validated*. The Priority Scenarios panel (#11) is the real KM-grade view.

**🔧 Engineering**
- Selector: `selectCoverage(filter)` in `selectors.ts`
- Source: `contentHealthDataset.docs`, grouped by `product|lob`
- Threshold: `isGap = docCount < 4` (constant; should become a per-LOB target when real data lands).
- Component: `components/CoveragePanel.tsx`

---

## 2. Freshness

**🧭 Business**
- Bar chart of doc counts bucketed by **days since last update** (0–30, 31–90, 91–180, 181–365, > 365).
- Subtitle calls out **stale share** (> 180 d).
- Drives the simple question: *"Where is rot accumulating?"*

**🔧 Engineering**
- Selector: `selectFreshness(filter)`
- Stale threshold constant: `STALE_THRESHOLD_DAYS = 180` in `selectors.ts`
- Visualization: Recharts `BarChart` with green→red palette
- Component: `components/FreshnessPanel.tsx`

---

## 3. Quality signals

**🧭 Business**
- Three editorial-quality counters:
  - **Broken-link docs** + total broken-link count
  - **Missing-metadata docs**
  - **Hard-to-read docs** (Flesch < 50)
- Each tile is colored by severity (bad / warn / neutral).
- Useful for picking what an editorial sprint should attack first.
- ⚠️ **Limitation**: "Missing metadata" is one boolean today. A real implementation should break it down by required field (owner, audience, AI tags, etc.).

**🔧 Engineering**
- Selector: `selectQualitySignals(filter)`
- Constants: `HARD_TO_READ_THRESHOLD = 50` (Flesch reading-ease)
- Component: `components/QualitySignalsPanel.tsx`

---

## 4. Authoring throughput

**🧭 Business**
- Daily line chart of PRs merged + table of **top 6 contributors** (PRs and lines changed).
- Answers *"Are we keeping up?"* and *"Who is doing the work?"*
- A flat or declining throughput line is an early warning that intake will back up (see panel #10).

**🔧 Engineering**
- Selector: `selectThroughput(filter)`
- Source: `contentHealthDataset.authoring` (`AuthoringEvent[]` — synthetic PR merges)
- Component: `components/AuthoringThroughputPanel.tsx`
- Real-data wiring: replace `authoring` with a loader from your KB git/azure-repos history.

---

## 5. LOB health scorecard

**🧭 Business**
- A composite **0–100 score per LOB** with an **A–F grade** pill.
- Weights: **30% coverage · 40% freshness · 30% quality**. Freshness is weighted highest because stale content is the highest-risk content for AI grounding.
- Use this in 1:1s with each SBU lead — it is the most immediately legible "scoreboard" view.

**🔧 Engineering**
- Selector: `selectLobScorecards(filter)`
- Coverage subscore is normalized against the **largest LOB** in scope, so this is a relative-to-peers view, not absolute.
- Grade thresholds: A ≥ 85, B ≥ 70, C ≥ 55, D ≥ 40, F < 40.
- Component: `components/LobScorecardPanel.tsx`

---

## 6. Readability distribution

**🧭 Business**
- Histogram of Flesch reading-ease bins (very-hard / hard / standard / easy) + a "hardest docs" table.
- Helps prioritize a **plain-language pass**, which directly improves AI grounding (LLMs handle clearer source text more reliably).

**🔧 Engineering**
- Selector: `selectReadability(filter)`
- Bins are static; thresholds match standard Flesch ranges.
- Component: `components/ReadabilityDistributionPanel.tsx`

---

## 7. Document aging heatmap

**🧭 Business**
- A **LOB × age-bucket** grid. Rightmost (stale) columns use a red palette; younger buckets use blue.
- One look reveals which LOBs have a "tail of stale content."
- Pair with #5 — if a LOB has a poor scorecard *and* a heavy right tail here, it's the top candidate for an editorial sprint.

**🔧 Engineering**
- Selector: `selectAgingHeatmap(filter)`
- Always renders all LOBs unless the LOB slicer is set to a single LOB.
- Component: `components/AgingHeatmapPanel.tsx`

---

# Section B · AI readiness & quality

**The most important section for the KM job description.** This is what proves the knowledge base is making AI better.

## 8. AI readiness

**🧭 Business**
- 5 percentage tiles answering: **is each doc safe for an AI agent to ground on?**
  - Indexed in AI store
  - Schema valid
  - Has a structured Q&A block
  - Embedding fresh (≤ 30 days)
  - Last AI eval = pass
- A table of **AI-blocked docs** (≥ 2 readiness issues) so you have a concrete to-do list.
- A KM should target **all five tiles ≥ 80%** before relying on the corpus for high-stakes AI workflows.

**🔧 Engineering**
- Selector: `selectAiReadiness(filter)`
- Source fields live on `Doc.ai` (`AiReadiness` interface in `shared/contentHealth/types.ts`).
- `EMBEDDING_FRESH_DAYS = 30` constant.
- "Blocked" = doc with ≥ 2 failed checks.
- Component: `components/AiReadinessPanel.tsx`
- **Real-data wiring**: hook to whatever pipeline produces AI-store ingestion logs and offline eval results. The fields are intentionally simple booleans/integers so any source can fill them.

---

## 9. AI quality

**🧭 Business**
- 4 tiles + trend chart + a "worst LOBs" table:
  - **Answer accuracy** (offline-eval-judged)
  - **Mean confidence** (model self-reported)
  - **Grounded %** (cited at least one source doc)
  - **Human fallback %** (escalated to a human)
- A KM should monitor the **divergence** between *confidence* and *accuracy* — if confidence is high but accuracy lags, the AI is overconfident on its own knowledge gaps.
- The worst-LOBs table is the bridge from "AI is bad" to "this LOB's content needs work."

**🔧 Engineering**
- Selector: `selectAiQuality(filter)`
- Source: `contentHealthDataset.aiAnswers` (`AiAnswerEvent[]`)
- Synthetic correlation: grounded answers have intentionally higher accuracy, mirroring real behavior — when the loader is real, this should still hold.
- Component: `components/AiQualityPanel.tsx`
- **Real-data wiring**: connect to your AI eval harness output. Each event needs `accuracy` (eval), `confidence` (model), `sourceDocIds` (citations), `fellBackToHuman` (escalation).

---

# Section C · Lifecycle (intake → retire)

The **operational** view: what is flowing through the lifecycle right now, and what is stuck?

## 10. Intake & review queue

**🧭 Business**
- A **kanban-style** count for each state: Pending · In review · Blocked · Published (in the window).
- Subtitle highlights the **% of open requests past their SLA**.
- A breaches table lists the worst offenders so you can chase them in your weekly review.
- Drives the question: *"Is the lifecycle moving, or are we backing up?"*

**🔧 Engineering**
- Selector: `selectIntakeQueue(filter)`
- Source: `contentHealthDataset.intake` (`IntakeRequest[]`)
- SLA targets per state are constants in `fixtures.ts` (`pending: 3d, in_review: 5d, blocked: 7d`); these should be tunable when real.
- Component: `components/IntakeQueuePanel.tsx`
- **Real-data wiring**: connect to your intake system (Forms, ADO work items, GitHub Issues, etc.).

---

## 11. Priority scenarios

**🧭 Business**
- The "real" coverage view: a **registry of scenarios** the KM is accountable for, each with a status (covered / draft / outdated / gap) and a P0/P1/P2 priority pill.
- Header callout: **P0 covered / P0 total** — the single most important number on the dashboard for AI safety.
- Sorted gaps-first so the table itself is the to-do list.

**🔧 Engineering**
- Selector: `selectPriorityScenarios(filter)`
- Source: `contentHealthDataset.priorityScenarios` (`PriorityScenario[]`)
- The scenario list is a **curated registry** — even when real data lands, this list is human-maintained (KM owns it).
- Component: `components/PriorityScenariosPanel.tsx`

---

## 12. Stale / at-risk articles

**🧭 Business**
- An action-oriented table of the **top 12 stalest in-scope docs** — title, LOB, owner, days since update, broken-link count.
- Designed to be sent directly to owners ("here's your refresh list").

**🔧 Engineering**
- Selector: `selectStaleArticles(filter)`
- Filters docs with `daysSince > STALE_THRESHOLD_DAYS`, sorts desc, top 12.
- Component: `components/StaleArticlesPanel.tsx`

---

# Section D · Cross-team & outcomes

The **influence-without-authority** view: who owes me what, and what is the downstream impact?

## 13. Owner / SBU rollup

**🧭 Business**
- One row per **SBU** (Cloud + AI, Modern Work, Devices, Gaming, Security, Industry).
- Columns: docs, stale, stale %, quality issues, issue %, intake open, **intake breaches**.
- Sorted by **combined risk score** so the SBU at the top is the one to call this week.
- This is where a KM operationalizes the JD's "influence without authority" — bring this table to a leadership stand-up.

**🔧 Engineering**
- Selector: `selectOwnerSbu(filter)`
- LOB → SBU mapping is in `fixtures.ts` (`LOB_TO_SBU`); will move to a metadata service when real.
- Risk score: `staleSharePct + qualityIssueSharePct + intakeBreaches × 5` (intake breaches weighted heavily).
- Component: `components/OwnerSbuRolloutPanel.tsx`

---

## 14. Self-help resolution success

**🧭 Business**
- 2 tiles + trend chart + worst LOBs:
  - **Resolved without help %** — the headline outcome metric for the KM JD
  - **Escalated to human %**
- Trend tells you whether your KB investments are improving partner / engineer self-service over time.

**🔧 Engineering**
- Selector: `selectSelfHelp(filter)`
- Source: `contentHealthDataset.selfHelp` (`SelfHelpSession[]`) — synthetic data deliberately trends *up* over the window so the chart shows realistic improvement.
- Component: `components/SelfHelpResolutionPanel.tsx`
- **Real-data wiring**: connect to your support / self-service telemetry pipeline.

---

## 15. Search analytics

**🧭 Business**
- 2 tiles + trend chart + worst LOBs:
  - **Successful searches %** (results above relevance threshold)
  - **Zero-click rate %** (results shown but none clicked → titles/summaries are misleading or irrelevant)
- A high zero-click rate is a **silent quality killer** — content exists but is unfindable or untrusted.

**🔧 Engineering**
- Selector: `selectSearchAnalytics(filter)`
- Source: `contentHealthDataset.searchEvents` (`SearchEvent[]`)
- Component: `components/SearchAnalyticsPanel.tsx`
- **Real-data wiring**: wire to your search telemetry (e.g., the AAQ search index event stream).

---

## 16. Top performing docs

**🧭 Business**
- Best-feedback-ratio docs with at least 100 views in the window — your **canonical examples** to evangelize and learn from.
- ⚠️ **Caveat**: high views alone is not a quality signal (a confusing doc can be high-traffic). Ratio + threshold mitigates but doesn't eliminate this.

**🔧 Engineering**
- Selector: `selectTopPerformers(filter)`, threshold `TOP_PERFORMER_MIN_VIEWS = 100`
- Sort: `ratioPct desc, views desc` (tiebreaker)
- Component: `components/TopPerformersPanel.tsx`

---

## 17. Search-miss → coverage gap

**🧭 Business**
- For each LOB: **search-miss volume** vs **doc count in scope** → **gap score** (0–100).
- High gap score = users are asking but we don't have content. This is your **demand-driven backlog**.
- ⚠️ **Today**: keyword-heuristic mapping. Real implementation needs the search index's classifier.

**🔧 Engineering**
- Selector: `selectSearchGapMap(filter)`
- Mapping: `LOB_KEYWORDS` constant in `selectors.ts` (8–10 keywords per LOB).
- Score formula: `(missOcc / maxOcc) × (1 / (1 + docCount/5)) × 100`
- Component: `components/SearchGapMapPanel.tsx`

---

## 18. Feedback & usage

**🧭 Business**
- The traditional content engagement view: total views, 👍 / 👎 totals, ratio, top-viewed docs, and the raw top-search-misses table.
- Useful as a **drill-down** companion to panels #14, #15, and #17.

**🔧 Engineering**
- Selector: `selectFeedback(filter)` + `selectSearchMisses()`
- Source: `contentHealthDataset.feedback` + `searchMisses`
- Component: `components/FeedbackUsagePanel.tsx`

---

## Appendix — data contract & wiring plan

### File map

| Concern | Path | Owned by |
|---|---|---|
| Row-level data contract | `src/shared/contentHealth/types.ts` | Hub + Content Health (jointly) |
| Synthetic fixtures (TODO: replace) | `src/shared/contentHealth/fixtures.ts` | Hub + Content Health (jointly) |
| Panel view-models | `src/contentHealth/types.ts` | Content Health |
| Aggregations | `src/contentHealth/selectors.ts` | Content Health |
| Panels | `src/contentHealth/components/*` | Content Health |
| Page shell | `src/contentHealth/ContentHealthApp.tsx` | Content Health |
| Hub touchpoint (route + link) | `src/App.tsx` | Hub |

### Handoff: when real data lands

The contract is intentionally narrow so the loader is the only thing that changes:

1. Replace `contentHealthDataset` export in `fixtures.ts` with an async loader that returns the same `ContentHealthDataset` shape.
2. Add a tiny loading state to `ContentHealthApp.tsx` (already partially in place via the `Suspense` boundary in `App.tsx`).
3. No panel or selector code needs to change.

### Required upstream sources (real-data plan)

| Entity | Source candidate |
|---|---|
| `Doc` (incl. `ai`) | KB store + AI ingestion pipeline + offline eval results |
| `AuthoringEvent` | Git history (ADO repos / GitHub) |
| `FeedbackEvent` | KB analytics |
| `SearchMiss` / `SearchEvent` | Search index event stream |
| `AiAnswerEvent` | AI eval harness output |
| `PriorityScenario` | Curated registry (KM-owned) |
| `IntakeRequest` | Intake system (Forms / ADO / Issues) |
| `SelfHelpSession` | Support / self-service telemetry |

---

## Cheat sheet — what to highlight in a 15-minute walkthrough

1. **Open with the KPI strip + the AAQ scope banner** — set the level.
2. **Section A** — quick tour: Coverage, then jump to LOB Scorecard for the "scoreboard" framing.
3. **Section B** — spend the most time here. AI readiness tiles + AI quality trend = *the JD's central success metric*.
4. **Section C** — Intake kanban (lifecycle is moving), Priority Scenarios (P0 status is the headline), Stale list (the to-do).
5. **Section D** — Owner/SBU rollup is your influence-without-authority artifact; Self-help and Search analytics are the downstream outcomes.
6. **Close** with the wiring plan in the appendix — answers the inevitable "is this real data?" question and shows the path to production.
