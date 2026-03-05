import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Cell
} from 'recharts';
import type { SlicerState } from '../../types';
import { ingestionStatusOverTime, blockedByLob } from '../../data/mockCharts';
import { SectionHeader } from '../common/SectionHeader';
import './ContentHealthSection.css';

const LOBS_ORDER = ['Azure', 'Microsoft 365', 'Windows', 'Surface', 'Xbox', 'Intune'];
void LOBS_ORDER; // referenced in filter order

interface Props { slicer: SlicerState; }

export function ContentHealthSection({ slicer }: Props) {
  const filteredBlocked = useMemo(() => {
    if (slicer.lob === 'all') return blockedByLob;
    return blockedByLob.filter(d => d.name === slicer.lob);
  }, [slicer.lob]);

  return (
    <section id="content-health">
      <SectionHeader
        title="Content Health"
        subtitle="Ingestion pipeline status, blocked articles, and metadata coverage across LOBs"
        id="content-health"
      />
      <div className="section-grid">
        {/* Ingestion Status Over Time */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Ingestion Status Over Time</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ingestionStatusOverTime} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={45} tickFormatter={v => `${(v/1000).toFixed(1)}k`} />
              <Tooltip formatter={(v) => (v as number)?.toLocaleString() ?? ''} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Ingested" stackId="a" fill="#118dff" radius={[0,0,0,0]} />
              <Bar dataKey="Pending"  stackId="a" fill="#e8b336" radius={[0,0,0,0]} />
              <Bar dataKey="Blocked"  stackId="a" fill="#d83b01" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Blocked by LOB */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Blocked Articles by LOB</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={filteredBlocked} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => (v as number)?.toLocaleString() ?? ''} />
              <Bar dataKey="count" radius={[0,4,4,0]}>
                {(slicer.lob === 'all' ? blockedByLob : filteredBlocked).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

const COLORS = ['#118dff','#0078d4','#12239e','#8764b8','#ca5010','#107c10'];
