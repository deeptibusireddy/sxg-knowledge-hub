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
