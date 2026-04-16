import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, Cell
} from 'recharts';
import type { SlicerState } from '../../types';
import { useData } from '../../contexts/DataContext';
import { blockedArticlesByLob, ingestionByMonth } from '../../data/mockDrilldown';
import { DrilldownDrawer } from '../common/DrilldownDrawer';
import type { DrilldownContent } from '../common/DrilldownDrawer';
import { SectionHeader } from '../common/SectionHeader';
import './ContentHealthSection.css';

const LOBS_ORDER = ['Azure', 'Microsoft 365', 'Windows', 'Surface', 'Xbox', 'Intune'];
void LOBS_ORDER;

interface Props { slicer: SlicerState; }

type BarData = Record<string, string | number>;

const BLOCKED_COLS = [
  { key: 'article', header: 'Article' },
  { key: 'owner',   header: 'Owner' },
  { key: 'reason',  header: 'Block Reason' },
  { key: 'ageDays', header: 'Age' },
];

const INGESTION_COLS = [
  { key: 'metric', header: 'Metric' },
  { key: 'count',  header: 'Value' },
];

const COLORS = ['#118dff','#0078d4','#12239e','#8764b8','#ca5010','#107c10'];

export function ContentHealthSection({ slicer }: Props) {
  const { ingestionStatusOverTime, blockedByLob } = useData();
  const [drilldown, setDrilldown] = useState<DrilldownContent | null>(null);

  const filteredBlocked = useMemo(() => {
    if (slicer.lob === 'all') return blockedByLob;
    return blockedByLob.filter(d => d.name === slicer.lob);
  }, [slicer.lob]);

  function onIngestionClick(raw: unknown) {
    const d = raw as BarData;
    const date = String(d.date ?? '');
    setDrilldown({
      title: `${date} — Ingestion Breakdown`,
      subtitle: 'Monthly ingestion pipeline summary',
      columns: INGESTION_COLS,
      rows: ingestionByMonth[date] ?? [],
    });
  }

  function onBlockedClick(raw: unknown) {
    const d = raw as BarData;
    const name = String(d.name ?? '');
    const count = Number(d.count ?? 0);
    setDrilldown({
      title: `${name} — Blocked Articles`,
      subtitle: `${count} article${count !== 1 ? 's' : ''} currently blocked`,
      columns: BLOCKED_COLS,
      rows: blockedArticlesByLob[name] ?? [],
    });
  }

  return (
    <section id="content-health">
      <DrilldownDrawer content={drilldown} onClose={() => setDrilldown(null)} />
      <SectionHeader
        title="Content Health"
        subtitle="Ingestion pipeline status, blocked articles, and metadata coverage across LOBs"
        id="content-health"
      />
      <div className="section-grid">
        {/* Ingestion Status Over Time */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Ingestion Status Over Time <span className="chart-hint">click a bar to drill in</span></p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ingestionStatusOverTime} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={45} tickFormatter={v => `${(v/1000).toFixed(1)}k`} />
              <Tooltip formatter={(v) => (v as number)?.toLocaleString() ?? ''} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Ingested" stackId="a" fill="#118dff" style={{ cursor: 'pointer' }} onClick={onIngestionClick} />
              <Bar dataKey="Pending"  stackId="a" fill="#e8b336" style={{ cursor: 'pointer' }} onClick={onIngestionClick} />
              <Bar dataKey="Blocked"  stackId="a" fill="#d83b01" radius={[4,4,0,0]} style={{ cursor: 'pointer' }} onClick={onIngestionClick} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Blocked by LOB */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Blocked Articles by LOB <span className="chart-hint">click a bar to drill in</span></p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={filteredBlocked} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => (v as number)?.toLocaleString() ?? ''} />
              <Bar dataKey="count" radius={[0,4,4,0]} style={{ cursor: 'pointer' }} onClick={onBlockedClick}>
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
