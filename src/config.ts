/**
 * Power Automate HTTP-trigger flow URL for Power BI data queries.
 *
 * This is the recommended auth method — no Azure AD admin consent required.
 * The flow runs under the flow-owner's Power BI credentials.
 *
 * HOW TO SET UP (one-time, ~10 minutes):
 *   See docs/power-automate-flow-setup.md for step-by-step instructions.
 *
 * Once configured, this takes priority over MSAL direct API calls.
 * Leave empty ('') to use MSAL instead (requires admin consent).
 */
export const POWERBI_FLOW_URL = '';

/**
 * Static demo mode for public sharing.
 *
 * When true:
 * - Dashboard uses synthetic/static data only
 * - Live Power BI fetch is skipped
 * - Auth prompts are hidden
 */
export const STATIC_DEMO_ONLY = true;

/**
 * Azure AD app registration (optional — only needed if POWERBI_FLOW_URL is empty).
 * Grant delegated permission: Power BI Service → Dataset.Read.All
 * Redirect URI (SPA): http://localhost:5173 (dev) + your production URL
 */
export const MSAL_CONFIG = {
  clientId: '7ddfd7b0-a406-4c3d-a987-59048da2ee1c', // SxG Knowledge Hub - Storage (no admin consent required)
  tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
};

/**
 * Azure Data Lake Storage Gen2 — primary data source.
 * Uses Azure Storage user_impersonation scope (user consent only, no admin needed).
 *
 * filesystem: the container name (first path segment after the account)
 * Each path below is the directory within the filesystem containing Parquet files.
 */
export const POWERBI_WORKSPACE_ID = 'a20ce897-3f88-41ed-9e33-67fa2ae68e90';

export const ADLS_CONFIG = {
  account:    'cornerstonevnextadlsprod',
  filesystem: 'cornerstonevnext',
};

/**
 * ADLS paths per data domain.
 * These are directories containing one or more Parquet partition files.
 * Leave empty ('') to fall back to mock data.
 *
 * Path format: everything AFTER the filesystem name in the connection URL.
 * e.g. "/cornerstonevnext/copilotreport/dimlob/" → "copilotreport/dimlob/"
 */
export const ADLS_PATHS: Record<string, string> = {
  /** dimlob dimension — LOB mapping reference */
  dimlob:               'copilotreport/dimlob/dimlob.parquet/',
  /** Consumer copilot feedback interactions */
  feedbackConsumer:     'copilotreport/consumer/copilotfeedback_consumer_finalinteraction/',
  /** AIPod user metrics (retrieval, quality, empty results) */
  aiPodMetrics:         'cornerstone/amt/secured/msdfm_user/msdfm_user.parquet/',
  // Add remaining paths here as you discover them:
  blockedContent:       '',
  agentMetrics:         '',
  ingestionStatus:      '',
};



/**
 * Per-section dataset IDs.
 * Each POWERBI_QUERIES entry references one of these.
 * Leave a dataset ID empty ('') to skip live data for that section (falls back to mock).
 */
export const POWERBI_DATASETS = {
  /** KPIs, HRR trend, AHT, Copilot adoption, escalations — Commercial audience */
  agentMetricsCommercial:    '3a470a02-0567-4a1f-86e5-d685e9fa4866',
  /** KPIs, HRR trend, AHT, Copilot adoption, escalations — Consumer audience */
  agentMetricsConsumer:      'dc97cb0c-e1d1-4357-93b6-7b9169f5d75e',
  /** Feedback distribution, answer quality — Commercial audience */
  feedbackCommercial:        'eae1f80b-9ed3-45ed-a89c-d7c226b501ac',
  /** Feedback distribution, answer quality — Consumer audience */
  feedbackConsumer:          '0dd76d62-26da-46c2-b3dc-75cb2c3dffd3',
  /** Auto case update / AHT reduction outcomes */
  agenticAutoCaseUpdate:     '9a50a464-28dd-4d5d-bbeb-62035c09cee5',
  /** Retrieval success, empty results, program health metrics */
  aiPodSemanticModel:        '44a64562-8364-4b5f-abca-33c95148274a',
  /** Blocked articles list and blocked-by-LOB chart */
  blockedContentDashboard:   'd03b0a1e-379d-478c-a5fe-6f9ee28c2abb',
  /** Ingestion pipeline status over time */
  contentSelfServe:          'd2bdd653-3bf7-4dfc-8d4f-d24c9a0fcc20',
  /** Knowledge harvesting / ingestion metrics */
  knowledgeHarvesting:       '3e42d076-3507-4e3c-8473-e4c35220f654',
};

/**
 * DAX queries for each data domain.
 *
 * Each entry is { datasetId, query }.
 * - Set datasetId to one of the POWERBI_DATASETS values above.
 * - Leave query as '' to fall back to mock data for that section.
 *
 * Column aliases in SELECTCOLUMNS must match the "[Alias]" keys
 * documented in src/contexts/DataContext.tsx.
 *
 * Example:
 *   EVALUATE SELECTCOLUMNS('IngestionFacts',
 *     "Date",    [MonthLabel],
 *     "Ingested",[IngestedCount],
 *     "Blocked", [BlockedCount],
 *     "Pending", [PendingCount]
 *   )
 */
export const POWERBI_QUERIES: Record<string, { datasetId: string; query: string }> = {
  /** Required cols: [Id] [Label] [Value] [Unit] [Trend] [TrendLabel] [PositiveIsUp] */
  kpis: {
    datasetId: POWERBI_DATASETS.agentMetricsCommercial,
    query: '',
  },

  /** Required cols: [Date] [Ingested] [Blocked] [Pending] */
  ingestionStatusOverTime: {
    datasetId: POWERBI_DATASETS.contentSelfServe,
    query: '',
  },

  /** Required cols: [Name] [Count] */
  blockedByLob: {
    datasetId: POWERBI_DATASETS.blockedContentDashboard,
    query: '',
  },

  /** Required cols: [Date] [Score] */
  answerQualityTrend: {
    datasetId: POWERBI_DATASETS.aiPodSemanticModel,
    query: '',
  },

  /** Required cols: [Name] [Count] */
  emptyResultsByLob: {
    datasetId: POWERBI_DATASETS.aiPodSemanticModel,
    query: '',
  },

  /** Required cols: [Name] [Value] */
  feedbackDistribution: {
    datasetId: POWERBI_DATASETS.feedbackCommercial,
    query: '',
  },

  /** Required cols: [Date] [HRR] */
  hrrTrend: {
    datasetId: POWERBI_DATASETS.agentMetricsCommercial,
    query: '',
  },

  /** Required cols: [Name] [Copilot] [NonCopilot] */
  ahtByProduct: {
    datasetId: POWERBI_DATASETS.agentMetricsCommercial,
    query: '',
  },

  /** Required cols: [Name] [Count] */
  escalationsByLob: {
    datasetId: POWERBI_DATASETS.agentMetricsCommercial,
    query: '',
  },

  /** Required cols: [Date] [Rate] */
  retrievalSuccessTrend: {
    datasetId: POWERBI_DATASETS.aiPodSemanticModel,
    query: '',
  },

  /** Required cols: [Name] [Jan] [Feb] [Mar] */
  qualityByLob: {
    datasetId: POWERBI_DATASETS.aiPodSemanticModel,
    query: '',
  },

  /** Required cols: [Date] [Count] */
  incidentVolume: {
    datasetId: POWERBI_DATASETS.aiPodSemanticModel,
    query: '',
  },

  /** Required cols: [Id] [Article] [LOB] [Owner] [Reason] [AgeDays] */
  blockedArticles: {
    datasetId: POWERBI_DATASETS.blockedContentDashboard,
    query: '',
  },

  /** Required cols: [Id] [LOB] [Severity] [Status] [Opened] [Summary] */
  recentIncidents: {
    datasetId: POWERBI_DATASETS.aiPodSemanticModel,
    query: '',
  },
};

/**
 * App-wide configuration.
 * Replace the placeholder URLs with real Power Automate HTTP trigger endpoints.
 */
export const CONFIG = {
  /**
   * Power Automate HTTP trigger URL for the Give Feedback form.
   * Leave empty to show a "not configured" message in dev.
   * Flow should accept: { category, subject, feedback, rating, alias, submittedAt }
   */
  FEEDBACK_FLOW_URL: '',

  /**
   * Power Automate / Azure Function URL for Feature Request → ADO Task creation.
   * Leave empty to fall back to mailto.
   * Flow should accept the full feature request payload.
   */
  FEATURE_REQUEST_FLOW_URL: '',

  /**
   * Power Automate / Azure Function URL for Content Ingestion → ADO Task creation.
   */
  INGESTION_FLOW_URL: '',

  /**
   * Power Automate / Azure Function URL for Content Removal → ADO Task creation.
   */
  REMOVAL_FLOW_URL: '',

  /**
   * Power Automate / Azure Function URL for New Partner Onboarding → ADO Task creation.
   */
  ONBOARDING_FLOW_URL: '',

  /**
   * Deep link URL for the Teams Knowledge Bot.
   * e.g. https://teams.microsoft.com/l/chat/0/0?users=28:bot-id
   * Leave empty to show "coming soon" state.
   */
  TEAMS_BOT_URL: 'https://teams.microsoft.com/l/app/1ef3c012-7ba0-4e29-b6e7-e724183ab93f?source=app-header-share-entrypoint&templateInstanceId=cc587468-85eb-45e1-929d-06aae6f6d4e5&environment=033fc568-1ab1-ee30-8eb1-1ba1faa87719',
  FEEDBACK_EMAIL: 'SxGCorePM@microsoft.com',
};
