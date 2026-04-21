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

/** SBU / team that owns a body of content. */
export type Sbu =
  | 'Cloud + AI'
  | 'Modern Work'
  | 'Devices'
  | 'Gaming'
  | 'Security'
  | 'Industry';

/** Per-doc AI-readiness signals — does this asset feed AI agents safely? */
export interface AiReadiness {
  indexedInAiStore: boolean;
  schemaValid: boolean;
  hasQaBlock: boolean;
  /** Days since the embedding for this doc was last refreshed. */
  embeddingAgeDays: number;
  lastAiEval: 'pass' | 'fail' | 'never';
}

/** Where the doc was ingested from. Optional so loaders can backfill safely. */
export type DocSource =
  | 'Cornerstone'
  | 'Learn'
  | 'Wiki'
  | 'LLC'
  | 'GitHub'
  | 'Other';

/** A single piece of content (article, doc, kb page) tracked in the system. */
export interface Doc {
  id: string;
  title: string;
  product: Product;
  lob: LobArea;
  owner: string;
  /** SBU / team accountable for this doc (rollup level above owner). */
  sbu: Sbu;
  /** ISO-8601 date of last meaningful update. */
  lastUpdated: string;
  /** ISO-8601 date the doc was originally published. */
  publishedAt: string;
  wordCount: number;
  hasMetadata: boolean;
  brokenLinkCount: number;
  /** Flesch reading ease (0–100). Higher = easier to read. */
  readability: number;
  ai: AiReadiness;
  /**
   * Where this doc was ingested from. Optional for backward compatibility —
   * loaders that don't yet emit a source will be treated as 'Other' by
   * downstream selectors.
   */
  source?: DocSource;
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
  /** Optional classifier output (real classifier, not heuristic). */
  classifiedLob?: LobArea;
}

/** A single search interaction (real or synthetic). */
export interface SearchEvent {
  /** ISO-8601 date. */
  date: string;
  lob: LobArea;
  /** Did the search return at least one result above the relevance threshold? */
  hadResult: boolean;
  /** Did the user click a result? */
  clicked: boolean;
}

/** A single AI-agent answer attempt; ground truth comes from offline eval. */
export interface AiAnswerEvent {
  id: string;
  /** ISO-8601 date. */
  date: string;
  lob: LobArea;
  /** Doc IDs the answer cited. Empty if ungrounded. */
  sourceDocIds: string[];
  /** 0–1; eval-judged accuracy of the answer. */
  accuracy: number;
  /** 0–1; model self-reported confidence. */
  confidence: number;
  /** True if the answer cited at least one source doc. */
  grounded: boolean;
  /** True if the agent escalated to a human (low confidence or unsupported). */
  fellBackToHuman: boolean;
}

export type ScenarioStatus = 'covered' | 'draft' | 'gap' | 'outdated';
export type ScenarioPriority = 'P0' | 'P1' | 'P2';

/** A priority support scenario the KM is accountable for keeping AI-ready. */
export interface PriorityScenario {
  id: string;
  title: string;
  lob: LobArea;
  priority: ScenarioPriority;
  status: ScenarioStatus;
  /** Number of validated docs linked to this scenario. */
  linkedDocCount: number;
  /** ISO-8601 date the scenario was last validated against current behavior. */
  lastValidatedAt: string | null;
}

export type IntakeState = 'pending' | 'in_review' | 'blocked' | 'published';

/** A knowledge intake/refresh request flowing through the lifecycle. */
export interface IntakeRequest {
  id: string;
  title: string;
  lob: LobArea;
  sbu: Sbu;
  requester: string;
  state: IntakeState;
  /** Days the request has been sitting in its current state. */
  ageInStateDays: number;
  /** SLA target for time-in-state, in days. */
  slaTargetDays: number;
}

/** A self-help session (engineer or partner-facing). */
export interface SelfHelpSession {
  id: string;
  date: string;
  lob: LobArea;
  resolved: boolean;
  fellBackToHuman: boolean;
}

/** Bundle of all shared fixtures, exported by `fixtures.ts`. */
export interface ContentHealthDataset {
  docs: Doc[];
  authoring: AuthoringEvent[];
  feedback: FeedbackEvent[];
  searchMisses: SearchMiss[];
  searchEvents: SearchEvent[];
  aiAnswers: AiAnswerEvent[];
  priorityScenarios: PriorityScenario[];
  intake: IntakeRequest[];
  selfHelp: SelfHelpSession[];
  /** ISO-8601 timestamp the dataset was generated. */
  generatedAt: string;
}
