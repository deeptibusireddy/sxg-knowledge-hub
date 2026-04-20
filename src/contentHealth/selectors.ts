// Aggregations over the shared row-level fixtures into panel view-models.
// The hub team is welcome to read fixtures directly; this file represents
// the content-health team's preferred way of slicing them.

import { contentHealthDataset } from '../shared/contentHealth/fixtures';
import type {
  Doc,
  AuthoringEvent,
  FeedbackEvent,
  LobArea,
} from '../shared/contentHealth/types';
import type {
  AgingHeatmap,
  ContentHealthFilter,
  ContributorRow,
  CoverageRow,
  FeedbackSummary,
  FreshnessBucket,
  KpiSummary,
  LobGrade,
  LobScorecardRow,
  QualitySignals,
  ReadabilityBin,
  ReadabilityDistribution,
  SearchGapRow,
  SearchMissRow,
  StaleArticleRow,
  ThroughputPoint,
  TopPerformerRow,
} from './types';

const PRODUCTS = ['AAQ', 'CMSP', 'AI Native'] as const;
const LOBS = ['Azure', 'Microsoft 365', 'Windows', 'Surface', 'Xbox', 'Intune'] as const;

const REFERENCE_DATE = new Date(contentHealthDataset.generatedAt);

function daysSince(iso: string): number {
  const ms = REFERENCE_DATE.getTime() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function withinWindow(iso: string, windowDays: number): boolean {
  return daysSince(iso) < windowDays;
}

function filterDocs(filter: ContentHealthFilter): Doc[] {
  return contentHealthDataset.docs.filter(
    (d) =>
      (filter.product === 'all' || d.product === filter.product) &&
      (filter.lob === 'all' || d.lob === filter.lob),
  );
}

function filterAuthoring(filter: ContentHealthFilter): AuthoringEvent[] {
  return contentHealthDataset.authoring.filter(
    (a) =>
      (filter.product === 'all' || a.product === filter.product) &&
      (filter.lob === 'all' || a.lob === filter.lob) &&
      withinWindow(a.mergedAt, filter.windowDays),
  );
}

function filterFeedback(filter: ContentHealthFilter, docs: Doc[]): FeedbackEvent[] {
  const docIds = new Set(docs.map((d) => d.id));
  return contentHealthDataset.feedback.filter(
    (f) => docIds.has(f.docId) && withinWindow(f.date, filter.windowDays),
  );
}

const STALE_THRESHOLD_DAYS = 180;
const HARD_TO_READ_THRESHOLD = 50;

export function selectCoverage(filter: ContentHealthFilter): CoverageRow[] {
  const docs = filterDocs(filter);
  const counts = new Map<string, number>();
  for (const d of docs) counts.set(`${d.product}|${d.lob}`, (counts.get(`${d.product}|${d.lob}`) ?? 0) + 1);

  const rows: CoverageRow[] = [];
  for (const product of PRODUCTS) {
    if (filter.product !== 'all' && filter.product !== product) continue;
    for (const lob of LOBS) {
      if (filter.lob !== 'all' && filter.lob !== lob) continue;
      const docCount = counts.get(`${product}|${lob}`) ?? 0;
      rows.push({ product, lob, docCount, isGap: docCount < 4 });
    }
  }
  return rows;
}

export function selectFreshness(filter: ContentHealthFilter): FreshnessBucket[] {
  const docs = filterDocs(filter);
  const buckets: FreshnessBucket[] = [
    { label: '0–30d', fromDays: 0, toDays: 30, count: 0 },
    { label: '31–90d', fromDays: 31, toDays: 90, count: 0 },
    { label: '91–180d', fromDays: 91, toDays: 180, count: 0 },
    { label: '181–365d', fromDays: 181, toDays: 365, count: 0 },
    { label: '> 365d', fromDays: 366, toDays: null, count: 0 },
  ];
  for (const d of docs) {
    const age = daysSince(d.lastUpdated);
    const b = buckets.find((x) => age >= x.fromDays && (x.toDays === null || age <= x.toDays));
    if (b) b.count++;
  }
  return buckets;
}

export function selectQualitySignals(filter: ContentHealthFilter): QualitySignals {
  const docs = filterDocs(filter);
  let brokenLinkDocs = 0;
  let brokenLinksTotal = 0;
  let missingMetadataDocs = 0;
  let hardToReadDocs = 0;
  for (const d of docs) {
    if (d.brokenLinkCount > 0) {
      brokenLinkDocs++;
      brokenLinksTotal += d.brokenLinkCount;
    }
    if (!d.hasMetadata) missingMetadataDocs++;
    if (d.readability < HARD_TO_READ_THRESHOLD) hardToReadDocs++;
  }
  return {
    brokenLinkDocs,
    brokenLinksTotal,
    missingMetadataDocs,
    hardToReadDocs,
    totalDocs: docs.length,
  };
}

export function selectThroughput(filter: ContentHealthFilter): {
  series: ThroughputPoint[];
  contributors: ContributorRow[];
} {
  const events = filterAuthoring(filter);
  const byDay = new Map<string, { prs: number; linesChanged: number }>();
  const byAuthor = new Map<string, { prs: number; linesChanged: number }>();
  for (const e of events) {
    const day = byDay.get(e.mergedAt) ?? { prs: 0, linesChanged: 0 };
    day.prs++;
    day.linesChanged += e.size;
    byDay.set(e.mergedAt, day);

    const a = byAuthor.get(e.author) ?? { prs: 0, linesChanged: 0 };
    a.prs++;
    a.linesChanged += e.size;
    byAuthor.set(e.author, a);
  }
  const series = [...byDay.entries()]
    .map(([date, v]) => ({ date, prs: v.prs, linesChanged: v.linesChanged }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const contributors = [...byAuthor.entries()]
    .map(([author, v]) => ({ author, prs: v.prs, linesChanged: v.linesChanged }))
    .sort((a, b) => b.prs - a.prs)
    .slice(0, 6);
  return { series, contributors };
}

export function selectFeedback(filter: ContentHealthFilter): FeedbackSummary {
  const docs = filterDocs(filter);
  const docTitle = new Map(docs.map((d) => [d.id, d.title] as const));
  const events = filterFeedback(filter, docs);

  let totalViews = 0;
  let totalThumbsUp = 0;
  let totalThumbsDown = 0;
  const perDoc = new Map<string, { views: number; up: number; down: number }>();

  for (const e of events) {
    totalViews += e.views;
    totalThumbsUp += e.thumbsUp;
    totalThumbsDown += e.thumbsDown;
    const cur = perDoc.get(e.docId) ?? { views: 0, up: 0, down: 0 };
    cur.views += e.views;
    cur.up += e.thumbsUp;
    cur.down += e.thumbsDown;
    perDoc.set(e.docId, cur);
  }

  const thumbsTotal = totalThumbsUp + totalThumbsDown;
  const thumbsRatioPct = thumbsTotal === 0 ? 0 : Math.round((totalThumbsUp / thumbsTotal) * 1000) / 10;

  const topDocs = [...perDoc.entries()]
    .map(([docId, v]) => ({
      docId,
      title: docTitle.get(docId) ?? docId,
      views: v.views,
      net: v.up - v.down,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return { totalViews, totalThumbsUp, totalThumbsDown, thumbsRatioPct, topDocs };
}

export function selectSearchMisses(): SearchMissRow[] {
  return contentHealthDataset.searchMisses.slice(0, 8).map((m) => ({
    query: m.query,
    occurrences: m.occurrences,
    lastSeen: m.lastSeen,
  }));
}

const STALE_LIMIT = 12;

export function selectStaleArticles(filter: ContentHealthFilter): StaleArticleRow[] {
  const docs = filterDocs(filter);
  return docs
    .map((d) => ({
      id: d.id,
      title: d.title,
      lob: d.lob,
      owner: d.owner,
      lastUpdated: d.lastUpdated,
      daysSince: daysSince(d.lastUpdated),
      brokenLinkCount: d.brokenLinkCount,
    }))
    .filter((r) => r.daysSince > STALE_THRESHOLD_DAYS)
    .sort((a, b) => b.daysSince - a.daysSince)
    .slice(0, STALE_LIMIT);
}

function gradeFromScore(score: number): LobGrade {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

export function selectLobScorecards(filter: ContentHealthFilter): LobScorecardRow[] {
  const docs = filterDocs({ ...filter, lob: 'all' });
  const byLob = new Map<LobArea, Doc[]>();
  for (const d of docs) {
    const arr = byLob.get(d.lob) ?? [];
    arr.push(d);
    byLob.set(d.lob, arr);
  }
  // Use total doc count across in-scope LOBs as the coverage benchmark, so
  // a LOB with very few docs (vs. its peers) gets a low coverage score.
  const allCounts = LOBS.map((l) => byLob.get(l)?.length ?? 0);
  const maxLobCount = Math.max(1, ...allCounts);

  const rows: LobScorecardRow[] = [];
  for (const lob of LOBS) {
    if (filter.lob !== 'all' && filter.lob !== lob) continue;
    const lobDocs = byLob.get(lob) ?? [];
    const total = lobDocs.length;
    const coverageScore = Math.round((total / maxLobCount) * 100);
    const stale = lobDocs.filter((d) => daysSince(d.lastUpdated) > STALE_THRESHOLD_DAYS).length;
    const freshnessScore = total === 0 ? 0 : Math.round((1 - stale / total) * 100);
    const issues = lobDocs.filter(
      (d) => d.brokenLinkCount > 0 || !d.hasMetadata || d.readability < HARD_TO_READ_THRESHOLD,
    ).length;
    const qualityScore = total === 0 ? 0 : Math.round((1 - issues / total) * 100);
    const overall = total === 0
      ? 0
      : Math.round(coverageScore * 0.3 + freshnessScore * 0.4 + qualityScore * 0.3);
    rows.push({
      lob,
      docs: total,
      coverageScore,
      freshnessScore,
      qualityScore,
      overallScore: overall,
      grade: gradeFromScore(overall),
    });
  }
  return rows.sort((a, b) => b.overallScore - a.overallScore);
}

const TOP_PERFORMER_MIN_VIEWS = 100;

export function selectTopPerformers(filter: ContentHealthFilter): TopPerformerRow[] {
  const docs = filterDocs(filter);
  const docMeta = new Map(docs.map((d) => [d.id, d] as const));
  const events = filterFeedback(filter, docs);
  const perDoc = new Map<string, { views: number; up: number; down: number }>();
  for (const e of events) {
    const cur = perDoc.get(e.docId) ?? { views: 0, up: 0, down: 0 };
    cur.views += e.views;
    cur.up += e.thumbsUp;
    cur.down += e.thumbsDown;
    perDoc.set(e.docId, cur);
  }
  const rows: TopPerformerRow[] = [];
  for (const [docId, v] of perDoc) {
    const meta = docMeta.get(docId);
    if (!meta || v.views < TOP_PERFORMER_MIN_VIEWS) continue;
    const total = v.up + v.down;
    const ratioPct = total === 0 ? 0 : Math.round((v.up / total) * 1000) / 10;
    rows.push({
      docId,
      title: meta.title,
      lob: meta.lob,
      views: v.views,
      thumbsUp: v.up,
      thumbsDown: v.down,
      ratioPct,
    });
  }
  // Sort by ratio first, then views as tiebreaker (best signal of quality).
  return rows
    .sort((a, b) => b.ratioPct - a.ratioPct || b.views - a.views)
    .slice(0, 6);
}

export function selectAgingHeatmap(filter: ContentHealthFilter): AgingHeatmap {
  const docs = filterDocs({ ...filter, lob: 'all' });
  const buckets: AgingHeatmap['buckets'] = [
    { label: '0–30d',   fromDays: 0,   toDays: 30 },
    { label: '31–90d',  fromDays: 31,  toDays: 90 },
    { label: '91–180d', fromDays: 91,  toDays: 180 },
    { label: '181–365d', fromDays: 181, toDays: 365 },
    { label: '> 365d',  fromDays: 366, toDays: null },
  ];
  const lobs: LobArea[] = filter.lob === 'all' ? [...LOBS] : [filter.lob];
  const counts: number[][] = lobs.map(() => buckets.map(() => 0));
  for (const d of docs) {
    const li = lobs.indexOf(d.lob);
    if (li < 0) continue;
    const age = daysSince(d.lastUpdated);
    const bi = buckets.findIndex((b) => age >= b.fromDays && (b.toDays === null || age <= b.toDays));
    if (bi >= 0) counts[li][bi]++;
  }
  const max = Math.max(1, ...counts.flat());
  return { lobs, buckets, counts, max };
}

const READABILITY_BINS: Array<Omit<ReadabilityBin, 'count'>> = [
  { label: '0–29 (very hard)', fromScore: 0,  toScore: 30,   isHard: true  },
  { label: '30–49 (hard)',     fromScore: 30, toScore: 50,   isHard: true  },
  { label: '50–69 (standard)', fromScore: 50, toScore: 70,   isHard: false },
  { label: '70–100 (easy)',    fromScore: 70, toScore: null, isHard: false },
];

export function selectReadability(filter: ContentHealthFilter): ReadabilityDistribution {
  const docs = filterDocs(filter);
  const bins: ReadabilityBin[] = READABILITY_BINS.map((b) => ({ ...b, count: 0 }));
  for (const d of docs) {
    const b = bins.find((x) => d.readability >= x.fromScore && (x.toScore === null || d.readability < x.toScore));
    if (b) b.count++;
  }
  const hardestDocs = [...docs]
    .sort((a, b) => a.readability - b.readability)
    .slice(0, 5)
    .map((d) => ({ id: d.id, title: d.title, lob: d.lob, readability: d.readability }));
  return { bins, totalDocs: docs.length, hardestDocs };
}

// Heuristic mapping from search-miss query keywords to LOB. Real implementation
// would use the search index's classifier; this is good enough for the demo.
const LOB_KEYWORDS: Record<LobArea, string[]> = {
  'Azure':         ['azure', 'b2b', 'tenant'],
  'Microsoft 365': ['m365', 'license', 'sku', 'partner'],
  'Windows':       ['windows', 'firmware'],
  'Surface':       ['surface'],
  'Xbox':          ['xbox'],
  'Intune':        ['intune', 'compliance'],
};

export function selectSearchGapMap(filter: ContentHealthFilter): SearchGapRow[] {
  const docs = filterDocs({ ...filter, lob: 'all' });
  const docCountByLob = new Map<LobArea, number>();
  for (const d of docs) docCountByLob.set(d.lob, (docCountByLob.get(d.lob) ?? 0) + 1);

  const missesByLob = new Map<LobArea, { occ: number; q: number }>();
  for (const m of contentHealthDataset.searchMisses) {
    const q = m.query.toLowerCase();
    for (const lob of LOBS) {
      if (LOB_KEYWORDS[lob].some((kw) => q.includes(kw))) {
        const cur = missesByLob.get(lob) ?? { occ: 0, q: 0 };
        cur.occ += m.occurrences;
        cur.q += 1;
        missesByLob.set(lob, cur);
        break;
      }
    }
  }

  const rows: SearchGapRow[] = LOBS.map((lob) => {
    const m = missesByLob.get(lob) ?? { occ: 0, q: 0 };
    const docCount = docCountByLob.get(lob) ?? 0;
    return { lob, missOccurrences: m.occ, missQueries: m.q, docCount, gapScore: 0 };
  });
  // Gap score: higher misses + lower coverage → bigger gap, normalised 0..100.
  const maxOcc = Math.max(1, ...rows.map((r) => r.missOccurrences));
  for (const r of rows) {
    const missNorm = r.missOccurrences / maxOcc;          // 0..1
    const coverPenalty = 1 / (1 + r.docCount / 5);        // shrinks as docs grow
    r.gapScore = Math.round(missNorm * coverPenalty * 100);
  }
  return rows.sort((a, b) => b.gapScore - a.gapScore);
}

export function selectKpis(filter: ContentHealthFilter): KpiSummary {
  const coverage = selectCoverage(filter);
  const docs = filterDocs(filter);
  const stale = docs.filter((d) => daysSince(d.lastUpdated) > STALE_THRESHOLD_DAYS).length;
  const quality = selectQualitySignals(filter);
  const { series } = selectThroughput(filter);
  const prs = series.reduce((s, p) => s + p.prs, 0);
  const fb = selectFeedback(filter);

  return {
    coverageDocs: docs.length,
    coverageGapAreas: coverage.filter((r) => r.isGap).length,
    staleDocs: stale,
    staleSharePct: docs.length === 0 ? 0 : Math.round((stale / docs.length) * 1000) / 10,
    qualityIssues: quality.brokenLinkDocs + quality.missingMetadataDocs + quality.hardToReadDocs,
    prsLastWindow: prs,
    thumbsRatioPct: fb.thumbsRatioPct,
    searchMissCount: contentHealthDataset.searchMisses.reduce((s, m) => s + m.occurrences, 0),
  };
}
