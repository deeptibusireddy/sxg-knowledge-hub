# Content Health Dashboard — Business Summary

A quick, **non-technical** tour of the Content Health dashboard
(`/content-health`). For each panel: *what it shows* and *what you should walk
away with*.

> Companion to the deeper [`content-health-walkthrough.md`](./content-health-walkthrough.md),
> which adds engineering and data-source details. Today every number is
> **synthetic** — scope is **AAQ only**.

---

## Header & slicer

- **Shows:** Owner (Content Health team), AAQ-only scope banner, and a
  **LOB · Window** slicer that re-aggregates every panel below.
- **Take away:** Use the slicer to focus the conversation (e.g., "Intune, last
  30 days").

## KPI strip (6 tiles)

- **Shows:** Coverage docs · Coverage gaps · Stale docs · Quality issues · PRs
  in window · 👍 ratio.
- **Take away:** The leadership headline. Set targets here first
  (e.g., stale share < 10%, 👍 ratio > 80%).

---

# Section A · Knowledge hygiene
*Are our docs current, complete, and well-written?*

### 1. Coverage
- **Shows:** Product × LOB grid of doc counts; cells with < 4 docs flagged as gaps.
- **Take away:** Which product/LOB combos are dangerously thin.

### 2. Freshness
- **Shows:** Doc counts bucketed by age (0–30, 31–90, 91–180, 181–365, 365+ days).
- **Take away:** Where rot is accumulating; the "stale share" headline.

### 3. Quality signals
- **Shows:** Counts of docs with broken links, missing metadata, or hard-to-read prose.
- **Take away:** What an editorial sprint should attack first.

### 4. Authoring throughput
- **Shows:** Daily PRs merged + top 6 contributors.
- **Take away:** Are we keeping up, and who's doing the work?

### 5. LOB health scorecard
- **Shows:** 0–100 composite score + A–F grade per LOB
  (30% coverage / 40% freshness / 30% quality).
- **Take away:** The "scoreboard" view to bring to each SBU lead 1:1.

### 6. Readability distribution
- **Shows:** Flesch reading-ease histogram + the hardest-to-read docs.
- **Take away:** Prioritize a plain-language pass — clearer text also improves AI grounding.

### 7. Document aging heatmap
- **Shows:** LOB × age-bucket grid; red on the right = stale tail.
- **Take away:** Pair with #5 — bad scorecard + heavy red tail = top sprint candidate.

---

# Section B · AI readiness & quality
*Is the KB actually making AI better?*

### 8. AI readiness
- **Shows:** 5 % tiles (indexed, schema valid, has Q&A, embedding fresh, last
  eval pass) + a list of AI-blocked docs.
- **Take away:** Target all five tiles ≥ 80% before trusting AI for high-stakes
  workflows. The blocked list is your to-do.

### 9. AI quality
- **Shows:** Answer accuracy, mean confidence, grounded %, human-fallback %,
  trend chart, worst LOBs.
- **Take away:** Watch for **confidence > accuracy** (overconfident AI). Worst
  LOBs table = where to fix content.

---

# Section C · Lifecycle (intake → retire)
*Is the pipeline moving, or stuck?*

### 10. Intake & review queue
- **Shows:** Kanban counts (Pending / In review / Blocked / Published) + SLA
  breaches.
- **Take away:** Whether new content is flowing; chase the breaches list weekly.

### 11. Priority scenarios
- **Shows:** KM-curated scenario registry with status (covered / draft /
  outdated / gap) and P0/P1/P2 priority. Header callout: **P0 covered / total**.
- **Take away:** The single most important number on the dashboard for AI
  safety. Gaps-first sort = your to-do list.

### 12. Stale / at-risk articles
- **Shows:** Top 12 stalest in-scope docs with owner + days since update.
- **Take away:** Send directly to owners as their refresh list.

---

# Section D · Cross-team & outcomes
*Who owes me what, and what's the downstream impact?*

### 13. Owner / SBU rollup
- **Shows:** One row per SBU with docs, stale %, quality issues, intake
  breaches, sorted by combined risk score.
- **Take away:** The SBU at the top is the one to call this week — your
  influence-without-authority artifact for leadership stand-ups.

### 14. Self-help resolution success
- **Shows:** Resolved-without-help % and escalated-to-human %, plus trend.
- **Take away:** The headline outcome metric — proves whether KB investment is
  improving partner/engineer self-service over time.

### 15. Search analytics
- **Shows:** Successful-search % and zero-click rate, plus worst LOBs.
- **Take away:** A high zero-click rate is a silent quality killer — content
  exists but is unfindable or untrusted.

### 16. Top performing docs
- **Shows:** Best feedback-ratio docs with ≥ 100 views.
- **Take away:** Canonical examples to evangelize and learn from.

### 17. Search-miss → coverage gap
- **Shows:** LOB-level gap score combining search misses with current doc count.
- **Take away:** Your **demand-driven backlog** — users are asking for content
  we don't have.

### 18. Feedback & usage
- **Shows:** Total views, 👍/👎 totals + ratio, top-viewed docs, raw
  top-search-misses.
- **Take away:** Drill-down companion to #14, #15, and #17.

---

## 15-minute walkthrough order

1. **KPI strip + AAQ scope banner** — set the level.
2. **Section A** — Coverage → LOB Scorecard (the "scoreboard" framing).
3. **Section B** — spend the most time here; this is the central success metric.
4. **Section C** — Intake kanban → Priority Scenarios (P0 headline) → Stale list.
5. **Section D** — Owner/SBU rollup, then Self-help and Search analytics as
   downstream outcomes.
