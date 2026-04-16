/**
 * Static JSON data loader.
 *
 * Loads dashboard data from pre-exported JSON files in /public/data/.
 * If a file is missing or empty the caller falls back to mock data.
 *
 * HOW TO UPDATE WITH REAL DATA:
 *   1. Open each Power BI report in Power BI Desktop.
 *   2. Right-click a table visual → "Export data" → CSV (or use DAX Studio).
 *   3. Convert the CSV to JSON (e.g. https://csvjson.com/csv2json).
 *   4. Replace the corresponding file in public/data/.
 *   5. Refresh the browser — no rebuild needed.
 *
 * File → DashboardData field mapping:
 *   kpi-cards.json               → kpiCards
 *   ingestion-status.json        → ingestionStatusOverTime
 *   blocked-by-lob.json          → blockedByLob
 *   answer-quality-trend.json    → answerQualityTrend
 *   empty-results-by-lob.json    → emptyResultsByLob
 *   feedback-distribution.json   → feedbackDistribution
 *   hrr-trend.json               → hrrTrend
 *   aht-by-product.json          → ahtByProduct
 *   escalations-by-lob.json      → escalationsByLob
 *   retrieval-success-trend.json → retrievalSuccessTrend
 *   quality-by-lob.json          → qualityByLob
 *   incident-volume.json         → incidentVolume
 *   blocked-articles.json        → blockedArticles
 *   recent-incidents.json        → recentIncidents
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

async function loadJson<T>(filename: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}/data/${filename}`);
    if (!res.ok) return null;
    const data = await res.json() as T;
    if (Array.isArray(data) && data.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export interface StaticData {
  kpiCards?:               unknown[];
  ingestionStatusOverTime?: unknown[];
  blockedByLob?:           unknown[];
  answerQualityTrend?:     unknown[];
  emptyResultsByLob?:      unknown[];
  feedbackDistribution?:   unknown[];
  hrrTrend?:               unknown[];
  ahtByProduct?:           unknown[];
  escalationsByLob?:       unknown[];
  retrievalSuccessTrend?:  unknown[];
  qualityByLob?:           unknown[];
  incidentVolume?:         unknown[];
  blockedArticles?:        unknown[];
  recentIncidents?:        unknown[];
  adoWorkItems?:           unknown[];
}

export async function loadAllStaticData(): Promise<StaticData> {
  const [
    kpiCards, ingestionStatusOverTime, blockedByLob, answerQualityTrend,
    emptyResultsByLob, feedbackDistribution, hrrTrend, ahtByProduct,
    escalationsByLob, retrievalSuccessTrend, qualityByLob, incidentVolume,
    blockedArticles, recentIncidents, adoWorkItems,
  ] = await Promise.all([
    loadJson<unknown[]>('kpi-cards.json'),
    loadJson<unknown[]>('ingestion-status.json'),
    loadJson<unknown[]>('blocked-by-lob.json'),
    loadJson<unknown[]>('answer-quality-trend.json'),
    loadJson<unknown[]>('empty-results-by-lob.json'),
    loadJson<unknown[]>('feedback-distribution.json'),
    loadJson<unknown[]>('hrr-trend.json'),
    loadJson<unknown[]>('aht-by-product.json'),
    loadJson<unknown[]>('escalations-by-lob.json'),
    loadJson<unknown[]>('retrieval-success-trend.json'),
    loadJson<unknown[]>('quality-by-lob.json'),
    loadJson<unknown[]>('incident-volume.json'),
    loadJson<unknown[]>('blocked-articles.json'),
    loadJson<unknown[]>('recent-incidents.json'),
    loadJson<unknown[]>('ado-work-items.json'),
  ]);

  const result: StaticData = {};
  if (kpiCards)               result.kpiCards               = kpiCards;
  if (ingestionStatusOverTime) result.ingestionStatusOverTime = ingestionStatusOverTime;
  if (blockedByLob)           result.blockedByLob           = blockedByLob;
  if (answerQualityTrend)     result.answerQualityTrend     = answerQualityTrend;
  if (emptyResultsByLob)      result.emptyResultsByLob      = emptyResultsByLob;
  if (feedbackDistribution)   result.feedbackDistribution   = feedbackDistribution;
  if (hrrTrend)               result.hrrTrend               = hrrTrend;
  if (ahtByProduct)           result.ahtByProduct           = ahtByProduct;
  if (escalationsByLob)       result.escalationsByLob       = escalationsByLob;
  if (retrievalSuccessTrend)  result.retrievalSuccessTrend  = retrievalSuccessTrend;
  if (qualityByLob)           result.qualityByLob           = qualityByLob;
  if (incidentVolume)         result.incidentVolume         = incidentVolume;
  if (blockedArticles)        result.blockedArticles        = blockedArticles;
  if (recentIncidents)        result.recentIncidents        = recentIncidents;
  if (adoWorkItems)           result.adoWorkItems           = adoWorkItems;
  return result;
}
