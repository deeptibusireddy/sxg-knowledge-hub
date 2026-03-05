import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import type { SlicerState } from '../../types';
import { hrrTrend, ahtByProduct, escalationsByLob } from '../../data/mockCharts';
import { SectionHeader } from '../common/SectionHeader';

interface Props { slicer: SlicerState; }

export function BusinessOutcomesSection({ slicer }: Props) {
  const filteredEscalations = useMemo(() => {
    if (slicer.lob === 'all') return escalationsByLob;
    return escalationsByLob.filter(d => d.name === slicer.lob);
  }, [slicer.lob]);

  return (
    <section id="business-outcomes">
      <SectionHeader
        title="Business Outcomes"
        subtitle="Hit Rate Resolution, Average Handle Time, and escalation trends by LOB"
      />
      <div className="section-grid">
        {/* HRR Trend */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Hit Rate Resolution — 12-Month Trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hrrTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 90]} tick={{ fontSize: 11 }} width={35} unit="%" />
              <Tooltip formatter={(v) => [`${v ?? 0}%`, 'HRR']} />
              <Line type="monotone" dataKey="hrr" stroke="#107c10" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AHT by Product */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Avg Handle Time by Product Area (min)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ahtByProduct} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} domain={[0, 14]} />
              <Tooltip formatter={(v) => [`${v ?? 0} min`, '']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="prior"   name="Prior Month" fill="#c8c6c4" radius={[3,3,0,0]} />
              <Bar dataKey="current" name="Current"     fill="#118dff" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Escalations by LOB */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Escalations by LOB</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filteredEscalations} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => (v as number)?.toLocaleString() ?? ''} />
              <Bar dataKey="count" fill="#ca5010" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
