// View-model types local to the standalone Content Health Dashboard.
// These are PANEL-LEVEL shapes derived from the shared row-level data
// contract in `src/shared/contentHealth/types.ts`. Do not put canonical
// table-shaped types here — extend the shared module instead.

import type { LobArea, Product } from '../shared/contentHealth/types';

export interface ContentHealthFilter {
  product: Product | 'all';
  lob: LobArea | 'all';
  /** Window in days for time-series and freshness calculations. */
  windowDays: 30 | 90 | 365;
}

export interface KpiSummary {
  coverageDocs: number;
  coverageGapAreas: number;
  staleDocs: number;
  staleSharePct: number;
  qualityIssues: number;
  prsLastWindow: number;
  thumbsRatioPct: number;
  searchMissCount: number;
  /** % of windowed search events that returned a usable result. */
  responseCoveragePct: number;
}

export interface CoverageRow {
  product: Product;
  lob: LobArea;
  docCount: number;
  isGap: boolean;
}

export interface FreshnessBucket {
  label: string;
  count: number;
  /** Inclusive lower bound (days since update). */
  fromDays: number;
  /** Exclusive upper bound, or null for open-ended. */
  toDays: number | null;
}

export interface QualitySignals {
  brokenLinkDocs: number;
  brokenLinksTotal: number;
  missingMetadataDocs: number;
  hardToReadDocs: number;
  totalDocs: number;
}

export interface ThroughputPoint {
  /** ISO-8601 day. */
  date: string;
  prs: number;
  linesChanged: number;
}

export interface ContributorRow {
  author: string;
  prs: number;
  linesChanged: number;
}

export interface FeedbackSummary {
  totalViews: number;
  totalThumbsUp: number;
  totalThumbsDown: number;
  thumbsRatioPct: number;
  topDocs: Array<{ docId: string; title: string; views: number; net: number }>;
}

export interface SearchMissRow {
  query: string;
  occurrences: number;
  lastSeen: string;
}

export interface StaleArticleRow {
  id: string;
  title: string;
  lob: LobArea;
  owner: string;
  lastUpdated: string;
  daysSince: number;
  brokenLinkCount: number;
}

export type LobGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface LobScorecardRow {
  lob: LobArea;
  docs: number;
  coverageScore: number;
  freshnessScore: number;
  qualityScore: number;
  overallScore: number;
  grade: LobGrade;
}

export interface TopPerformerRow {
  docId: string;
  title: string;
  lob: LobArea;
  views: number;
  thumbsUp: number;
  thumbsDown: number;
  ratioPct: number;
}

export interface AgingHeatmap {
  lobs: LobArea[];
  buckets: Array<{ label: string; fromDays: number; toDays: number | null }>;
  /** counts[lobIndex][bucketIndex] */
  counts: number[][];
  max: number;
}

export interface ReadabilityBin {
  label: string;
  /** Inclusive lower bound. */
  fromScore: number;
  /** Exclusive upper bound; null means open-ended (>=). */
  toScore: number | null;
  count: number;
  /** True if this bin is in the "hard to read" range. */
  isHard: boolean;
}

export interface ReadabilityDistribution {
  bins: ReadabilityBin[];
  totalDocs: number;
  hardestDocs: Array<{ id: string; title: string; lob: LobArea; readability: number }>;
}

export interface SearchGapRow {
  lob: LobArea;
  missOccurrences: number;
  missQueries: number;
  docCount: number;
  /** 0–100; higher = bigger gap (lots of misses, few docs). */
  gapScore: number;
}

// ── KM-aligned panels (round 2) ─────────────────────────────────────

export interface AiReadinessSummary {
  totalDocs: number;
  indexedPct: number;
  schemaValidPct: number;
  hasQaBlockPct: number;
  embeddingFreshPct: number;
  evalPassPct: number;
  /** Per-LOB eval pass rate (% of in-scope docs in that LOB with lastAiEval === 'pass'). */
  evalPassByLob: Array<{ lob: LobArea; evalPassPct: number; docs: number }>;
  /** Docs that fail one or more readiness checks. */
  blockedDocs: Array<{
    id: string;
    title: string;
    lob: LobArea;
    issues: string[];
  }>;
}

/**
 * Compares production answer accuracy (from real, windowed answer events) against
 * the offline eval pass rate (point-in-time corpus snapshot). Helps Knowledge
 * leaders spot LOBs where the golden-set evals don't reflect production reality.
 *
 * Note: prodAccuracyPct is windowed; evalPassPct is a corpus snapshot. The Δ is
 * a diagnostic signal, NOT a like-for-like comparison.
 */
export interface ProdVsEvalSummary {
  overall: {
    prodAccuracyPct: number;
    evalPassPct: number;
    deltaPct: number;
    answers: number;
    docs: number;
  };
  byLob: Array<{
    lob: LobArea;
    prodAccuracyPct: number;
    evalPassPct: number;
    deltaPct: number;
    answers: number;
    docs: number;
  }>;
}

export interface AiQualitySummary {
  totalAnswers: number;
  accuracyPct: number;
  meanConfidencePct: number;
  groundedPct: number;
  fallbackPct: number;
  /** Daily accuracy series for trend chart. */
  accuracyTrend: Array<{ date: string; accuracyPct: number; answers: number }>;
  /** Worst-performing LOBs by accuracy. */
  byLob: Array<{ lob: LobArea; accuracyPct: number; answers: number; fallbackPct: number }>;
}

export interface PriorityScenarioRow {
  id: string;
  title: string;
  lob: import('../shared/contentHealth/types').LobArea;
  priority: import('../shared/contentHealth/types').ScenarioPriority;
  status: import('../shared/contentHealth/types').ScenarioStatus;
  linkedDocCount: number;
  lastValidatedAt: string | null;
}

export interface PriorityScenarioSummary {
  rows: PriorityScenarioRow[];
  totals: {
    total: number;
    covered: number;
    draft: number;
    gap: number;
    outdated: number;
    coveragePct: number;
    p0Coverage: { covered: number; total: number };
  };
}

export interface IntakeQueueSummary {
  byState: Record<import('../shared/contentHealth/types').IntakeState, number>;
  slaBreaches: Array<{
    id: string;
    title: string;
    lob: LobArea;
    state: import('../shared/contentHealth/types').IntakeState;
    ageInStateDays: number;
    slaTargetDays: number;
    overBy: number;
  }>;
  total: number;
  breachPct: number;
}

export interface OwnerSbuRow {
  sbu: import('../shared/contentHealth/types').Sbu;
  docs: number;
  staleDocs: number;
  staleSharePct: number;
  qualityIssueDocs: number;
  qualityIssueSharePct: number;
  intakeOpen: number;
  intakeBreaches: number;
}

export interface SelfHelpSummary {
  totalSessions: number;
  resolvedPct: number;
  fallbackPct: number;
  trend: Array<{ date: string; sessions: number; resolvedPct: number }>;
  byLob: Array<{ lob: LobArea; sessions: number; resolvedPct: number }>;
}

export interface SearchAnalyticsSummary {
  totalSearches: number;
  successRatePct: number;
  zeroClickRatePct: number;
  trend: Array<{ date: string; searches: number; successRatePct: number }>;
  byLob: Array<{ lob: LobArea; searches: number; successRatePct: number; zeroClickRatePct: number }>;
}

export interface SourceBreakdownCell {
  lob: LobArea;
  /** Counts per source (in fixed display order). */
  bySource: Record<import('../shared/contentHealth/types').DocSource, number>;
  total: number;
}

export interface SourceBreakdown {
  /** All sources present anywhere in the in-scope corpus, in display order. */
  sources: import('../shared/contentHealth/types').DocSource[];
  rows: SourceBreakdownCell[];
  /** True if any in-scope doc lacked an explicit source field. */
  hasUnknown: boolean;
}

/** Drill-down row shape — minimal columns useful in a doc-list drawer. */
export interface DocDrilldownRow {
  id: string;
  title: string;
  lob: LobArea;
  owner: string;
  lastUpdated: string;
  daysSince: number;
  brokenLinks: number;
  readability: number;
}
