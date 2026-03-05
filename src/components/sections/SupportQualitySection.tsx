import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import type { SlicerState } from '../../types';
import { answerQualityTrend, emptyResultsByLob, feedbackDistribution } from '../../data/mockCharts';
import { SectionHeader } from '../common/SectionHeader';

const FEEDBACK_COLORS = ['#118dff', '#d83b01', '#a19f9d'];

interface Props { slicer: SlicerState; }

export function SupportQualitySection({ slicer }: Props) {
  const filteredEmpty = useMemo(() => {
    if (slicer.lob === 'all') return emptyResultsByLob;
    return emptyResultsByLob.filter(d => d.name === slicer.lob);
  }, [slicer.lob]);

  return (
    <section id="support-quality">
      <SectionHeader
        title="Support Quality"
        subtitle="Answer quality trends, empty result rates, and engineer feedback signals"
      />
      <div className="section-grid">
        {/* Answer Quality Trend */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Answer Quality Score — Last 30 Days</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={answerQualityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={4} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} width={35} unit="%" />
              <Tooltip formatter={(v) => [`${v ?? 0}%`, 'Quality Score']} />
              <Line type="monotone" dataKey="score" stroke="#118dff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Empty Results by LOB */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Empty Results by LOB</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filteredEmpty} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => (v as number)?.toLocaleString() ?? ''} />
              <Bar dataKey="count" fill="#d83b01" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Feedback Distribution */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Feedback Distribution</p>
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
