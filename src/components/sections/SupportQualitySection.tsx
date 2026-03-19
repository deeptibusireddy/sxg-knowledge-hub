import { useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import type { SlicerState } from '../../types';
import { answerQualityTrend, emptyResultsByLob, feedbackDistribution } from '../../data/mockCharts';
import { emptyQuerySamplesByLob, feedbackSamplesByCategory } from '../../data/mockDrilldown';
import { DrilldownDrawer } from '../common/DrilldownDrawer';
import type { DrilldownContent } from '../common/DrilldownDrawer';
import { SectionHeader } from '../common/SectionHeader';

const FEEDBACK_COLORS = ['#118dff', '#d83b01', '#a19f9d'];

type BarData = Record<string, string | number>;

const EMPTY_QUERY_COLS = [
  { key: 'query',    header: 'Query' },
  { key: 'count',    header: 'Occurrences' },
  { key: 'lastSeen', header: 'Last Seen' },
];

const FEEDBACK_COLS = [
  { key: 'article', header: 'Article' },
  { key: 'lob',     header: 'LOB' },
  { key: 'score',   header: 'Score' },
  { key: 'cases',   header: 'Cases' },
];

const QUALITY_DAY_COLS = [
  { key: 'metric', header: 'Metric' },
  { key: 'value',  header: 'Value' },
];

interface Props { slicer: SlicerState; }

export function SupportQualitySection({ slicer }: Props) {
  const [drilldown, setDrilldown] = useState<DrilldownContent | null>(null);

  const filteredEmpty = useMemo(() => {
    if (slicer.lob === 'all') return emptyResultsByLob;
    return emptyResultsByLob.filter(d => d.name === slicer.lob);
  }, [slicer.lob]);

  function onEmptyClick(raw: unknown) {
    const d = raw as BarData;
    const name = String(d.name ?? '');
    const count = Number(d.count ?? 0);
    setDrilldown({
      title: `${name} — Top Empty Queries`,
      subtitle: `${count} empty results this period`,
      columns: EMPTY_QUERY_COLS,
      rows: emptyQuerySamplesByLob[name] ?? [],
    });
  }

  function onFeedbackClick(raw: unknown) {
    const d = raw as BarData;
    const name = String(d.name ?? '');
    const value = Number(d.value ?? 0);
    setDrilldown({
      title: `${name} — Feedback Detail`,
      subtitle: `${value}% of all feedback`,
      columns: FEEDBACK_COLS,
      rows: feedbackSamplesByCategory[name] ?? [],
    });
  }

  return (
    <section id="support-quality">
      <DrilldownDrawer content={drilldown} onClose={() => setDrilldown(null)} />
      <SectionHeader
        title="Support Quality"
        subtitle="Answer quality trends, empty result rates, and engineer feedback signals"
      />
      <div className="section-grid">
        {/* Answer Quality Trend */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Answer Quality Score — Last 30 Days <span className="chart-hint">click a point to drill in</span></p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={answerQualityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} width={35} unit="%" />
              <Tooltip formatter={(v) => [`${v ?? 0}%`, 'Quality Score']} />
              <Line type="monotone" dataKey="score" stroke="#118dff" strokeWidth={2}
                dot={{ r: 3, cursor: 'pointer' }}
                activeDot={{ r: 5, cursor: 'pointer',
                  onClick: (_e: unknown, payload: unknown) => {
                    const p = payload as { payload?: { date: string; score: number } };
                    if (!p?.payload) return;
                    setDrilldown({
                      title: `${p.payload.date} — Quality Score Detail`,
                      subtitle: `Score: ${p.payload.score}%`,
                      columns: QUALITY_DAY_COLS,
                      rows: [
                        { id: '1', metric: 'Quality Score',    value: `${p.payload.score}%` },
                        { id: '2', metric: 'vs. 30-day avg',   value: `${p.payload.score - 71 > 0 ? '+' : ''}${p.payload.score - 71}%` },
                        { id: '3', metric: 'Threshold (pass)', value: '70%' },
                        { id: '4', metric: 'Status',           value: p.payload.score >= 70 ? 'Pass ✓' : 'Below threshold ⚠' },
                      ],
                    });
                  }
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Empty Results by LOB */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Empty Results by LOB <span className="chart-hint">click a bar to drill in</span></p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filteredEmpty} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => (v as number)?.toLocaleString() ?? ''} />
              <Bar dataKey="count" fill="#d83b01" radius={[0,4,4,0]} style={{ cursor: 'pointer' }} onClick={onEmptyClick} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback Distribution */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Feedback Distribution <span className="chart-hint">click a segment to drill in</span></p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={feedbackDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                style={{ cursor: 'pointer' }}
                onClick={onFeedbackClick}
              >
                {feedbackDistribution.map((_, i) => (
                  <Cell key={i} fill={FEEDBACK_COLORS[i % FEEDBACK_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v ?? 0}%`, '']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
