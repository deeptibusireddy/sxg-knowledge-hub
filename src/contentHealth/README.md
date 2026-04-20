# Content Health Dashboard (sub-project)

Standalone surface mounted at **`/content-health`**, owned end-to-end by the
Content Health team.

## Boundary

Anything inside `src/contentHealth/` is owned by this team. The hub team
owns everything outside it (with the exception of `src/shared/contentHealth/`
which is **jointly owned**).

The only hub-side touchpoints are:

- A `<Link>` button in the hub header pointing here.
- A `<Route path="/content-health" />` registration in `src/App.tsx`.
- The `react-router-dom` runtime dependency.

## Data

This view does **not** invent its own mock data. It consumes the shared
contract:

- Schema: `src/shared/contentHealth/types.ts`
- Fixtures: `src/shared/contentHealth/fixtures.ts`

Aggregation into panel-level view-models lives in `selectors.ts` here.

> **Do not introduce parallel mocks in this folder.** If you need new
> fields, extend `src/shared/contentHealth/` instead. See that folder's
> README for the "When real data lands" handoff plan — the swap from
> fixtures to a real loader happens in **one place** and lights up both
> surfaces (this dashboard and the in-hub `ContentHealthSection`).

## Layout

```
ContentHealthApp.tsx        Page shell (header, slicer, KPI strip, panels)
ContentHealthApp.css        Page styles
types.ts                    Panel view-model types (local)
selectors.ts                Aggregations over shared fixtures
components/                 KPI strip, slicer, and 11 panels:
                              · Coverage              · Freshness
                              · Quality signals       · Authoring throughput
                              · LOB health scorecard  · Readability distribution
                              · Top performing docs   · Document aging heatmap
                              · Stale / at-risk       · Search-miss → coverage gap
                              · Feedback & usage
__tests__/                  Smoke render test
```

## Local dev

`npm run dev`, then open `/content-health`. The "← Back to Hub" link in the
page header returns to `/`.
