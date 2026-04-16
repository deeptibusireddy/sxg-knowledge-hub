/**
 * DataContext — provides all dashboard data with a three-tier priority:
 *   1. Static JSON files in /public/data/ (drop-in replacements, no auth needed)
 *   2. Power BI via Power Automate flow or MSAL (when configured + signed in)
 *   3. Local mock files (always-available fallback)
 *
 * To update with real data: replace any file in public/data/ and refresh.
 * See src/services/staticDataService.ts for the file → field mapping.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useMsal } from '@azure/msal-react';

import { MSAL_CONFIG, POWERBI_WORKSPACE_ID, POWERBI_FLOW_URL, POWERBI_QUERIES } from '../config';
import { executePbiQuery, executeViaFlow, type PbiRow } from '../services/powerBiService';
import { loadAllStaticData } from '../services/staticDataService';

// Mock fallbacks
import { kpiCards as mockKpis } from '../data/mockKpis';
import {
  ingestionStatusOverTime as mockIngestion,
  blockedByLob as mockBlockedByLob,
  answerQualityTrend as mockAnswerQuality,
  emptyResultsByLob as mockEmptyResults,
  feedbackDistribution as mockFeedback,
  hrrTrend as mockHrr,
  ahtByProduct as mockAht,
  escalationsByLob as mockEscalations,
  retrievalSuccessTrend as mockRetrieval,
  qualityByLob as mockQuality,
  incidentVolume as mockIncidents,
} from '../data/mockCharts';
import { blockedArticles as mockBlocked, recentIncidents as mockRecentIncidents } from '../data/mockTables';
import { actionItems as mockActions } from '../data/mockActions';
import { mockEvalDataset } from '../data/mockEvalData';

import type {
  KpiCardData,
  TimePoint,
  CategoryPoint,
  BlockedArticleRow,
  IncidentRow,
  AdoWorkItemRow,
  ActionItem,
  TrendDir,
} from '../types';
import type { EvalDataset } from '../components/sections/EvalResultsSection';

// ── Row → app-type mappers ───────────────────────────────────────────────────

function str(r: PbiRow, col: string): string  { return String(r[`[${col}]`] ?? ''); }
function num(r: PbiRow, col: string): number   { return Number(r[`[${col}]`] ?? 0); }
function bool(r: PbiRow, col: string): boolean { return Boolean(r[`[${col}]`]); }

function mapKpis(rows: PbiRow[]): KpiCardData[] {
  return rows.map(r => ({
    id:           str(r, 'Id'),
    label:        str(r, 'Label'),
    value:        str(r, 'Value'),
    unit:         str(r, 'Unit') || undefined,
    trend:        (str(r, 'Trend') as TrendDir) || 'neutral',
    trendLabel:   str(r, 'TrendLabel'),
    positiveIsUp: bool(r, 'PositiveIsUp'),
  }));
}

function mapTimePoints(rows: PbiRow[], cols: string[]): TimePoint[] {
  return rows.map(r => {
    const pt: TimePoint = { date: str(r, 'Date') };
    for (const c of cols) pt[c] = num(r, c);
    return pt;
  });
}

function mapCategoryPoints(rows: PbiRow[], valueCol: string): CategoryPoint[] {
  return rows.map(r => ({ name: str(r, 'Name'), [valueCol]: num(r, valueCol) }));
}

function mapBlockedArticles(rows: PbiRow[]): BlockedArticleRow[] {
  return rows.map(r => ({
    id:      str(r, 'Id'),
    article: str(r, 'Article'),
    lob:     str(r, 'LOB'),
    owner:   str(r, 'Owner'),
    reason:  str(r, 'Reason'),
    ageDays: num(r, 'AgeDays'),
  }));
}

function mapIncidents(rows: PbiRow[]): IncidentRow[] {
  return rows.map(r => ({
    id:       str(r, 'Id'),
    lob:      str(r, 'LOB'),
    severity: str(r, 'Severity') as IncidentRow['severity'],
    status:   str(r, 'Status')   as IncidentRow['status'],
    opened:   str(r, 'Opened'),
    summary:  str(r, 'Summary'),
  }));
}

// ── Context shape ────────────────────────────────────────────────────────────

export interface DashboardData {
  kpiCards:               KpiCardData[];
  ingestionStatusOverTime: TimePoint[];
  blockedByLob:           CategoryPoint[];
  answerQualityTrend:     TimePoint[];
  emptyResultsByLob:      CategoryPoint[];
  feedbackDistribution:   CategoryPoint[];
  hrrTrend:               TimePoint[];
  ahtByProduct:           CategoryPoint[];
  escalationsByLob:       CategoryPoint[];
  retrievalSuccessTrend:  TimePoint[];
  qualityByLob:           CategoryPoint[];
  incidentVolume:         TimePoint[];
  blockedArticles:        BlockedArticleRow[];
  recentIncidents:        IncidentRow[];
  adoWorkItems:           AdoWorkItemRow[];
  actionItems:            ActionItem[];
  evalDataset:            EvalDataset;
}

interface DataContextValue extends DashboardData {
  loading:   boolean;
  error:     string | null;
  isLive:    boolean;  // true when at least one query fetched live data
  refresh:   () => void;
}

const mockDefaults: DashboardData = {
  kpiCards:                mockKpis,
  ingestionStatusOverTime: mockIngestion,
  blockedByLob:            mockBlockedByLob,
  answerQualityTrend:      mockAnswerQuality,
  emptyResultsByLob:       mockEmptyResults,
  feedbackDistribution:    mockFeedback,
  hrrTrend:                mockHrr,
  ahtByProduct:            mockAht,
  escalationsByLob:        mockEscalations,
  retrievalSuccessTrend:   mockRetrieval,
  qualityByLob:            mockQuality,
  incidentVolume:          mockIncidents,
  blockedArticles:         mockBlocked,
  recentIncidents:         mockRecentIncidents,
  adoWorkItems:            [],
  actionItems:             mockActions,
  evalDataset:             mockEvalDataset,
};

const DataContext = createContext<DataContextValue>({
  ...mockDefaults,
  loading: false,
  error: null,
  isLive: false,
  refresh: () => {},
});

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true when live data can be attempted (flow URL or MSAL). */
function isLiveDataConfigured(): boolean {
  if (POWERBI_FLOW_URL.trim()) return true;
  return Boolean(MSAL_CONFIG.clientId && POWERBI_WORKSPACE_ID);
}

type MaybeRows = PbiRow[] | null;

/**
 * Run a single named query.
 * Prefers the Power Automate flow (no admin consent needed).
 * Falls back to direct MSAL call if flow URL is not set.
 * Returns null when neither is configured or the query string is empty.
 */
async function tryQuery(
  instance: ReturnType<typeof useMsal>['instance'],
  queryName: string,
  cfg: { datasetId: string; query: string },
): Promise<MaybeRows> {
  if (!cfg.query.trim()) return null;

  if (POWERBI_FLOW_URL.trim()) {
    return executeViaFlow(POWERBI_FLOW_URL, queryName, cfg.datasetId, cfg.query);
  }

  if (!cfg.datasetId.trim()) return null;
  return executePbiQuery(instance, cfg.datasetId, cfg.query);
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: ReactNode }) {
  const { instance, accounts } = useMsal();
  const [data, setData]       = useState<DashboardData>(mockDefaults);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [isLive, setIsLive]   = useState(false);
  const [tick, setTick]       = useState(0);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  // Load static JSON files from /public/data/ on first mount.
  // Any file that exists and is non-empty overrides the corresponding mock.
  useEffect(() => {
    loadAllStaticData().then(static_ => {
      if (Object.keys(static_).length === 0) return;
      setData(prev => ({
        ...prev,
        ...(static_.kpiCards               && { kpiCards:               static_.kpiCards               as DashboardData['kpiCards'] }),
        ...(static_.ingestionStatusOverTime && { ingestionStatusOverTime: static_.ingestionStatusOverTime as DashboardData['ingestionStatusOverTime'] }),
        ...(static_.blockedByLob           && { blockedByLob:           static_.blockedByLob           as DashboardData['blockedByLob'] }),
        ...(static_.answerQualityTrend     && { answerQualityTrend:     static_.answerQualityTrend     as DashboardData['answerQualityTrend'] }),
        ...(static_.emptyResultsByLob      && { emptyResultsByLob:      static_.emptyResultsByLob      as DashboardData['emptyResultsByLob'] }),
        ...(static_.feedbackDistribution   && { feedbackDistribution:   static_.feedbackDistribution   as DashboardData['feedbackDistribution'] }),
        ...(static_.hrrTrend               && { hrrTrend:               static_.hrrTrend               as DashboardData['hrrTrend'] }),
        ...(static_.ahtByProduct           && { ahtByProduct:           static_.ahtByProduct           as DashboardData['ahtByProduct'] }),
        ...(static_.escalationsByLob       && { escalationsByLob:       static_.escalationsByLob       as DashboardData['escalationsByLob'] }),
        ...(static_.retrievalSuccessTrend  && { retrievalSuccessTrend:  static_.retrievalSuccessTrend  as DashboardData['retrievalSuccessTrend'] }),
        ...(static_.qualityByLob           && { qualityByLob:           static_.qualityByLob           as DashboardData['qualityByLob'] }),
        ...(static_.incidentVolume         && { incidentVolume:         static_.incidentVolume         as DashboardData['incidentVolume'] }),
        ...(static_.blockedArticles        && { blockedArticles:        static_.blockedArticles        as DashboardData['blockedArticles'] }),
        ...(static_.recentIncidents        && { recentIncidents:        static_.recentIncidents        as DashboardData['recentIncidents'] }),
        ...(static_.adoWorkItems           && { adoWorkItems:           static_.adoWorkItems           as DashboardData['adoWorkItems'] }),
      }));
      setIsLive(true);
    });
  }, []);

  useEffect(() => {
    const authenticated = POWERBI_FLOW_URL.trim() ? true : accounts.length > 0;
    if (!isLiveDataConfigured() || !authenticated) {
      return; // keep whatever static data loaded above
    }

    setLoading(true);
    setError(null);

    const q = POWERBI_QUERIES;

    Promise.allSettled([
      tryQuery(instance, 'kpis',                    q.kpis),
      tryQuery(instance, 'ingestionStatusOverTime',  q.ingestionStatusOverTime),
      tryQuery(instance, 'blockedByLob',             q.blockedByLob),
      tryQuery(instance, 'answerQualityTrend',       q.answerQualityTrend),
      tryQuery(instance, 'emptyResultsByLob',        q.emptyResultsByLob),
      tryQuery(instance, 'feedbackDistribution',     q.feedbackDistribution),
      tryQuery(instance, 'hrrTrend',                 q.hrrTrend),
      tryQuery(instance, 'ahtByProduct',             q.ahtByProduct),
      tryQuery(instance, 'escalationsByLob',         q.escalationsByLob),
      tryQuery(instance, 'retrievalSuccessTrend',    q.retrievalSuccessTrend),
      tryQuery(instance, 'qualityByLob',             q.qualityByLob),
      tryQuery(instance, 'incidentVolume',           q.incidentVolume),
      tryQuery(instance, 'blockedArticles',          q.blockedArticles),
      tryQuery(instance, 'recentIncidents',          q.recentIncidents),
    ]).then(results => {
      const [
        kpisR, ingestionR, blockedLobR, qualityTrendR, emptyR,
        feedbackR, hrrR, ahtR, escalR, retrievalR, qualLobR,
        incidentR, blockedArtR, incidentsR,
      ] = results;

      const safeRows = (r: PromiseSettledResult<MaybeRows>): MaybeRows =>
        r.status === 'fulfilled' ? r.value : null;

      const errors = results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map(r => String(r.reason?.message ?? r.reason));

      let anyLive = false;
      const patch: Partial<DashboardData> = {};

      function live<T>(rows: MaybeRows, mapper: (r: PbiRow[]) => T, fallback: T): T {
        if (rows === null) return fallback;
        anyLive = true;
        return mapper(rows);
      }

      patch.kpiCards               = live(safeRows(kpisR),        mapKpis,                               mockDefaults.kpiCards);
      patch.ingestionStatusOverTime= live(safeRows(ingestionR),   r => mapTimePoints(r, ['Ingested','Blocked','Pending']), mockDefaults.ingestionStatusOverTime);
      patch.blockedByLob           = live(safeRows(blockedLobR),  r => mapCategoryPoints(r, 'Count'),   mockDefaults.blockedByLob);
      patch.answerQualityTrend     = live(safeRows(qualityTrendR),r => mapTimePoints(r, ['Score']),      mockDefaults.answerQualityTrend);
      patch.emptyResultsByLob      = live(safeRows(emptyR),       r => mapCategoryPoints(r, 'Count'),   mockDefaults.emptyResultsByLob);
      patch.feedbackDistribution   = live(safeRows(feedbackR),    r => mapCategoryPoints(r, 'Value'),   mockDefaults.feedbackDistribution);
      patch.hrrTrend               = live(safeRows(hrrR),         r => mapTimePoints(r, ['HRR']),       mockDefaults.hrrTrend);
      patch.ahtByProduct           = live(safeRows(ahtR),         r => r.map(row => ({
        name: str(row, 'Name'), copilot: num(row, 'Copilot'), nonCopilot: num(row, 'NonCopilot'),
      })),                                                                                               mockDefaults.ahtByProduct);
      patch.escalationsByLob       = live(safeRows(escalR),       r => mapCategoryPoints(r, 'Count'),   mockDefaults.escalationsByLob);
      patch.retrievalSuccessTrend  = live(safeRows(retrievalR),   r => mapTimePoints(r, ['Rate']),      mockDefaults.retrievalSuccessTrend);
      patch.qualityByLob           = live(safeRows(qualLobR),     r => r.map(row => ({
        name: str(row, 'Name'), jan: num(row, 'Jan'), feb: num(row, 'Feb'), mar: num(row, 'Mar'),
      })),                                                                                               mockDefaults.qualityByLob);
      patch.incidentVolume         = live(safeRows(incidentR),    r => mapTimePoints(r, ['Count']),     mockDefaults.incidentVolume);
      patch.blockedArticles        = live(safeRows(blockedArtR),  mapBlockedArticles,                   mockDefaults.blockedArticles);
      patch.recentIncidents        = live(safeRows(incidentsR),   mapIncidents,                         mockDefaults.recentIncidents);

      setData(prev => ({ ...prev, ...patch }));
      setIsLive(anyLive);
      setLoading(false);
      if (errors.length > 0) setError(errors.join(' | '));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance, accounts, tick]);

  return (
    <DataContext.Provider value={{ ...data, loading, error, isLive, refresh }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  return useContext(DataContext);
}
