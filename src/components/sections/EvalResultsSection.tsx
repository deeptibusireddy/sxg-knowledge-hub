import { useMemo } from 'react';
import type { SlicerState } from '../../types';
import { SectionHeader } from '../common/SectionHeader';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer, Cell
} from 'recharts';
import './EvalResultsSection.css';

/* ── Types exported so App.tsx / EvalUploader can use them ──────────────── */
export interface EvalRow {
  date: string;
  question: string;
  accuracy: number;
  relevance: number;
  coherence: number;
  fluency: number;
  intent_resolution: number;
  hate_unfairness: number;
  sexual: number;
  violence: number;
  self_harm: number;
  [key: string]: string | number | boolean;
}

export interface EvalDataset {
  fileName: string;
  isMock?: boolean;
  rows: EvalRow[];
  headers: string[];
  numericCols: string[];
  safetycols: string[];
  dateCol: string | null;
  groupCol: string | null;
}

/* ── Constants ──────────────────────────────────────────────────────────── */
const QUALITY_METRICS = [
  { key: 'relevance',        label: 'Relevance' },
  { key: 'coherence',        label: 'Coherence' },
  { key: 'fluency',          label: 'Fluency' },
  { key: 'intent_resolution', label: 'Intent Resolution' },
] as const;

const SAFETY_METRICS = [
  { key: 'hate_unfairness', label: 'Hate / Unfairness' },
  { key: 'sexual',          label: 'Sexual' },
  { key: 'violence',        label: 'Violence' },
  { key: 'self_harm',       label: 'Self Harm' },
] as const;

const THRESHOLD = 3.0;
const COLORS = {
  accuracy:         '#d83b01',
  relevance:        '#118dff',
  coherence:        '#8764b8',
  fluency:          '#107c10',
  intent_resolution:'#12239e',
};

/* ── Helpers ────────────────────────────────────────────────────────────── */
function avg(rows: EvalRow[], key: keyof EvalRow): number {
  const nums = rows.map(r => Number(r[key])).filter(n => !isNaN(n));
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}
function pctAbove(rows: EvalRow[], key: keyof EvalRow): number {
  const nums = rows.map(r => Number(r[key])).filter(n => !isNaN(n));
  return nums.length ? (nums.filter(n => n >= THRESHOLD).length / nums.length) * 100 : 0;
}
function bucket(score: number): 'excellent' | 'very_good' | 'good' | 'poor' {
  if (score >= 4.5) return 'excellent';
  if (score >= 4.0) return 'very_good';
  if (score >= 3.0) return 'good';
  return 'poor';
}

/* ── Main Component ─────────────────────────────────────────────────────── */
interface Props {
  dataset: EvalDataset;
  slicer: SlicerState;
}

export function EvalResultsSection({ dataset }: Props) {
  const rows = dataset.rows as EvalRow[];

  /* accuracy hero stats */
  const accAvg   = useMemo(() => avg(rows, 'accuracy'), [rows]);
  const accPct   = useMemo(() => pctAbove(rows, 'accuracy'), [rows]);

  /* per-metric cards */
  const metricStats = useMemo(() =>
    QUALITY_METRICS.map(m => ({
      ...m,
      avgScore: avg(rows, m.key as keyof EvalRow),
      pctGood:  pctAbove(rows, m.key as keyof EvalRow),
    })), [rows]);

  /* % above threshold bar (all metrics incl accuracy) */
  const thresholdBar = useMemo(() => [
    { name: 'Accuracy',         pct: accPct },
    ...QUALITY_METRICS.map(m => ({ name: m.label, pct: pctAbove(rows, m.key as keyof EvalRow) })),
  ], [rows, accPct]);

  /* daily trend (line chart) */
  const trendData = useMemo(() => {
    const byDate: Record<string, EvalRow[]> = {};
    rows.forEach(r => {
      const d = r.date ?? 'unknown';
      (byDate[d] = byDate[d] ?? []).push(r);
    });
    return Object.entries(byDate).sort(([a],[b]) => a.localeCompare(b)).map(([d, rs]) => ({
      date: d.slice(5),       // MM-DD
      accuracy:          +avg(rs, 'accuracy').toFixed(3),
      relevance:         +avg(rs, 'relevance').toFixed(3),
      coherence:         +avg(rs, 'coherence').toFixed(3),
      fluency:           +avg(rs, 'fluency').toFixed(3),
      intent_resolution: +avg(rs, 'intent_resolution').toFixed(3),
    }));
  }, [rows]);

  /* score distribution for accuracy */
  const distData = useMemo(() => {
    const buckets = { excellent: 0, very_good: 0, good: 0, poor: 0 };
    rows.forEach(r => { buckets[bucket(Number(r.accuracy))]++; });
    const n = rows.length || 1;
    return [
      { name: 'Excellent (4.5-5)', count: buckets.excellent, pct: +(buckets.excellent/n*100).toFixed(1) },
      { name: 'Very Good (4.0-4.4)', count: buckets.very_good, pct: +(buckets.very_good/n*100).toFixed(1) },
      { name: 'Good (3.0-3.9)',    count: buckets.good, pct: +(buckets.good/n*100).toFixed(1) },
      { name: 'Poor (<3.0)',       count: buckets.poor, pct: +(buckets.poor/n*100).toFixed(1) },
    ];
  }, [rows]);

  /* safety summary */
  const safetyStats = useMemo(() =>
    SAFETY_METRICS.map(m => {
      const vals = rows.map(r => Number(r[m.key])).filter(n => !isNaN(n));
      const fails = vals.filter(n => n > 0).length;
      return { ...m, total: vals.length, fails };
    }), [rows]);

  const accBadgeClass = accPct >= 60 ? 'eval-hero__badge--good' : 'eval-hero__badge--warn';

  const DIST_COLORS = ['#107c10','#118dff','#e8b336','#d83b01'];

  return (
    <section className="eval-results">
      <SectionHeader title="Evaluation Results" subtitle={`${rows.length.toLocaleString()} evaluations · ${dataset.isMock ? 'sample data' : dataset.fileName}`} />

      {/* ── Accuracy Hero ───────────────────────────────────────────── */}
      <div className="eval-hero">
        <div className="surface eval-hero__card">
          <span className="eval-hero__label">★ ACCURACY — PRIMARY METRIC</span>
          <div className="eval-hero__value-row">
            <span className="eval-hero__score">{accAvg.toFixed(2)}</span>
            <span className="eval-hero__max">/ 5.0</span>
          </div>
          <div className="eval-hero__threshold-row">
            <span className={`eval-hero__badge ${accBadgeClass}`}>{accPct.toFixed(1)}% above threshold</span>
            <span className="eval-hero__sub">Threshold ≥ {THRESHOLD} · {rows.length} evaluations</span>
          </div>
        </div>
      </div>

      {/* ── Other Metric Cards ──────────────────────────────────────── */}
      <div className="eval-kpi-row">
        {metricStats.map(m => (
          <div key={m.key} className="surface eval-metric-card">
            <span className="eval-metric-card__label">{m.label.toUpperCase()}</span>
            <span className="eval-metric-card__score">
              {m.avgScore.toFixed(2)}<span className="eval-metric-card__max">/5</span>
            </span>
            <span className={`eval-metric-card__pct ${m.pctGood >= 60 ? 'eval-metric-card__pct--good' : 'eval-metric-card__pct--warn'}`}>
              {m.pctGood.toFixed(1)}% ≥ {THRESHOLD}
            </span>
          </div>
        ))}
      </div>

      {/* ── % Above Threshold Bar ───────────────────────────────────── */}
      <div className="section-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 16 }}>
        <div className="surface">
          <div className="chart-wrapper">
            <p className="chart-label">% Above Threshold (≥3.0) by Metric</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={thresholdBar} layout="vertical" margin={{ left: 10, right: 30, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${(v as number).toFixed(1)}%`, '% ≥ 3.0']} />
                <Bar dataKey="pct" radius={[0,4,4,0]}>
                  {thresholdBar.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#d83b01' : '#118dff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Accuracy Score Distribution ───────────────────────────── */}
        <div className="surface">
          <div className="chart-wrapper">
            <p className="chart-label">Accuracy Score Distribution</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={distData} margin={{ left: 10, right: 10, top: 4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v as number} rows`, 'Count']} />
                <Bar dataKey="count" radius={[4,4,0,0]}>
                  {distData.map((_, i) => <Cell key={i} fill={DIST_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Daily Trend Lines ───────────────────────────────────────── */}
      {trendData.length > 1 && (
        <div className="surface" style={{ marginTop: 16 }}>
          <div className="chart-wrapper">
            <p className="chart-label">Daily Average Scores (all metrics)</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ left: 0, right: 24, top: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [(v as number).toFixed(3), '']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="accuracy"          stroke={COLORS.accuracy}          dot={false} strokeWidth={2.5} name="Accuracy" />
                <Line type="monotone" dataKey="relevance"         stroke={COLORS.relevance}         dot={false} strokeWidth={1.5} name="Relevance" />
                <Line type="monotone" dataKey="coherence"         stroke={COLORS.coherence}         dot={false} strokeWidth={1.5} name="Coherence" />
                <Line type="monotone" dataKey="fluency"           stroke={COLORS.fluency}           dot={false} strokeWidth={1.5} name="Fluency" />
                <Line type="monotone" dataKey="intent_resolution" stroke={COLORS.intent_resolution} dot={false} strokeWidth={1.5} name="Intent Resolution" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Content Safety Panel ────────────────────────────────────── */}
      <div className="surface eval-safety">
        <p className="chart-label" style={{ marginBottom: 10 }}>Content Safety</p>
        <div className="eval-safety__grid">
          {safetyStats.map(s => (
            <div key={s.key} className={`eval-safety__item ${s.fails === 0 ? 'eval-safety__item--pass' : 'eval-safety__item--fail'}`}>
              <span className="eval-safety__icon">{s.fails === 0 ? '✔' : '✖'}</span>
              <span className="eval-safety__name">{s.label}</span>
              <span className="eval-safety__count">
                {s.fails === 0 ? 'All passed' : `${s.fails} fail${s.fails > 1 ? 's' : ''}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
