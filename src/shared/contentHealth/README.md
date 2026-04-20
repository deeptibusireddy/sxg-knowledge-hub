# Shared Content Health data contract

This folder is the **single source of truth** for the data shapes that power
the Content Health surfaces in this repo.

It is **jointly owned** by the Hub team and the Content Health team. Schema
changes in `types.ts` require sign-off from both teams.

## Files

- `types.ts` — canonical row-level types (`Doc`, `AuthoringEvent`,
  `FeedbackEvent`, `SearchMiss`, `ContentHealthDataset`). These are intended
  to mirror the underlying tables in the real data source.
- `fixtures.ts` — synthetic, deterministic rows used for the demo today.
  Carries a `TODO(real-data):` marker.

## Consumers

- `src/contentHealth/` — the standalone Content Health Dashboard at
  `/content-health`. Aggregates rows into panel view-models via its local
  `selectors.ts`.
- `src/components/sections/ContentHealthSection.tsx` — the in-hub Content
  Health card. Currently uses hub-local mock data; will migrate to this
  module without breaking changes.

## When real data lands — engineering handoff

The whole point of this layer is to make the swap to real data a **single
edit in one file**. Here is the contract:

1. **`types.ts` is the schema contract.** When Power BI / parquet / API
   shapes are finalized, reconcile them here first. Both UIs depend on these
   types directly, so the TypeScript compiler will surface every consumer
   that needs an update.
2. **Replace `fixtures.ts` with a real loader.** Suggested shape:
   ```ts
   // src/shared/contentHealth/loader.ts (new)
   export function useContentHealthDataset(): {
     data: ContentHealthDataset | null;
     loading: boolean;
     error: Error | null;
   };
   ```
   Backed by `src/services/powerBiService.ts` (Power BI), or a parquet fetch
   using `parquet-wasm` (already a dependency), or a REST call. The hook
   must return the **same `ContentHealthDataset` shape** that
   `fixtures.ts` exports today.
3. **Switch consumers from the static export to the hook** in one PR:
   - `src/contentHealth/ContentHealthApp.tsx`
   - (eventually) `src/components/sections/ContentHealthSection.tsx`
4. **Delete `fixtures.ts`** (or keep it behind `import.meta.env.DEV` for
   Storybook-style local iteration).

Both surfaces light up from the same swap. No parallel mocks. No drift.

## Rules

- Do **not** introduce a parallel mock dataset elsewhere in the repo. If you
  need additional fields, extend `types.ts` and `fixtures.ts` here.
- Do **not** put UI logic in this folder — only data shapes and synthetic
  rows. Aggregation/selectors belong in the consuming surface.
- Keep `fixtures.ts` deterministic (seeded PRNG) so screenshots and tests
  remain stable.
