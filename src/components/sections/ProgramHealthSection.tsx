import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import type { SlicerState } from '../../types';
import { retrievalSuccessTrend, qualityByLob, incidentVolume } from '../../data/mockCharts';
import { SectionHeader } from '../common/SectionHeader';

interface Props { slicer: SlicerState; }

export function ProgramHealthSection({ slicer }: Props) {
  const filteredQuality = useMemo(() => {
    if (slicer.lob === 'all') return qualityByLob;
    return qualityByLob.filter(d => d.name === slicer.lob);
  }, [slicer.lob]);

  return (
    <section id="program-health">
      <SectionHeader
        title="Program Health"
        subtitle="End-to-end retrieval success, cross-LOB quality scores, and incident volume"
      />
      <div className="section-grid">
        {/* Retrieval Success Trend */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Retrieval Success Rate — 6-Month Trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={retrievalSuccessTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} width={35} unit="%" />
              <Tooltip formatter={(v) => [`${v ?? 0}%`, 'Retrieval Success']} />
              <Line type="monotone" dataKey="rate" stroke="#118dff" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quality by LOB */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Quality Score by LOB — Last 3 Months</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filteredQuality} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} width={35} unit="%" />
              <Tooltip formatter={(v) => [`${v ?? 0}%`, '']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="jan" name="Jan" fill="#c8c6c4" radius={[3,3,0,0]} />
              <Bar dataKey="feb" name="Feb" fill="#8764b8" radius={[3,3,0,0]} />
              <Bar dataKey="mar" name="Mar" fill="#118dff" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incident Volume */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Incident Volume by Month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={incidentVolume} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} allowDecimals={false} />
              <Tooltip formatter={(v) => [v, 'Incidents']} />
              <Bar dataKey="count" fill="#d83b01" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
