// Canonical row-level data contract for Content Health.
//
// These types are JOINTLY OWNED by the Hub team and the Content Health team.
// They model the underlying data tables (Power BI dataset / parquet / API)
// that both surfaces will eventually consume.
//
// See src/shared/contentHealth/README.md for the "When real data lands"
// handoff notes. Schema changes here REQUIRE sign-off from both teams.

export type Product = 'AAQ' | 'CMSP' | 'AI Native';

export type LobArea =
  | 'Azure'
  | 'Microsoft 365'
  | 'Windows'
  | 'Surface'
  | 'Xbox'
  | 'Intune';

/** A single piece of content (article, doc, kb page) tracked in the system. */
export interface Doc {
  id: string;
  title: string;
  product: Product;
  lob: LobArea;
  owner: string;
  /** ISO-8601 date of last meaningful update. */
  lastUpdated: string;
  /** ISO-8601 date the doc was originally published. */
  publishedAt: string;
  wordCount: number;
  hasMetadata: boolean;
  brokenLinkCount: number;
  /** Flesch reading ease (0–100). Higher = easier to read. */
  readability: number;
}

/** Authoring/PR activity row. */
export interface AuthoringEvent {
  id: string;
  /** ISO-8601 date the PR merged. */
  mergedAt: string;
  author: string;
  product: Product;
  lob: LobArea;
  /** Lines changed (additions + deletions). */
  size: number;
}

/** Per-doc-per-day usage row (already aggregated by day in the fixture). */
export interface FeedbackEvent {
  docId: string;
  /** ISO-8601 date (day granularity). */
  date: string;
  views: number;
  thumbsUp: number;
  thumbsDown: number;
}

/** Search query that returned no useful result. */
export interface SearchMiss {
  query: string;
  occurrences: number;
  /** ISO-8601 date last seen. */
  lastSeen: string;
}

/** Bundle of all shared fixtures, exported by `fixtures.ts`. */
export interface ContentHealthDataset {
  docs: Doc[];
  authoring: AuthoringEvent[];
  feedback: FeedbackEvent[];
  searchMisses: SearchMiss[];
  /** ISO-8601 timestamp the dataset was generated. */
  generatedAt: string;
}
