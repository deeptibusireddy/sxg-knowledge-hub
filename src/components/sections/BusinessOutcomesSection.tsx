import { useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import type { SlicerState } from '../../types';
import { hrrTrend, ahtByProduct, escalationsByLob } from '../../data/mockCharts';
import { hrrDetailByMonth, ahtDetailByProduct, escalationsByLobDetail } from '../../data/mockDrilldown';
import { DrilldownDrawer } from '../common/DrilldownDrawer';
import type { DrilldownContent } from '../common/DrilldownDrawer';
import { SectionHeader } from '../common/SectionHeader';

interface Props { slicer: SlicerState; }

type BarData = Record<string, string | number>;

const HRR_COLS  = [{ key: 'metric', header: 'Metric' }, { key: 'value', header: 'Value' }];
const AHT_COLS  = [{ key: 'category', header: 'Category' }, { key: 'current', header: 'Current' }, { key: 'prior', header: 'Prior' }, { key: 'delta', header: 'Δ' }];
const ESCL_COLS = [{ key: 'incident', header: 'Incident' }, { key: 'summary', header: 'Summary' }, { key: 'severity', header: 'Severity' }, { key: 'status', header: 'Status' }, { key: 'opened', header: 'Opened' }];

export function BusinessOutcomesSection({ slicer }: Props) {
  const [drilldown, setDrilldown] = useState<DrilldownContent | null>(null);

  const filteredEscalations = useMemo(() => {
    if (slicer.lob === 'all') return escalationsByLob;
    return escalationsByLob.filter(d => d.name === slicer.lob);
  }, [slicer.lob]);

  function onAhtClick(raw: unknown) {
    const d = raw as BarData;
    const name = String(d.name ?? '');
    setDrilldown({
      title: `${name} — AHT Breakdown`,
      subtitle: `Current: ${d.current} min | Prior: ${d.prior} min`,
      columns: AHT_COLS,
      rows: ahtDetailByProduct[name] ?? [],
    });
  }

  function onEscalationClick(raw: unknown) {
    const d = raw as BarData;
    const name = String(d.name ?? '');
    const count = Number(d.count ?? 0);
    setDrilldown({
      title: `${name} — Escalated Incidents`,
      subtitle: `${count} escalations this period`,
      columns: ESCL_COLS,
      rows: escalationsByLobDetail[name] ?? [],
    });
  }

  return (
    <section id="business-outcomes">
      <DrilldownDrawer content={drilldown} onClose={() => setDrilldown(null)} />
      <SectionHeader
        title="Business Outcomes"
        subtitle="Hit Rate Resolution, Average Handle Time, and escalation trends by LOB"
      />
      <div className="section-grid">
        {/* HRR Trend */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Hit Rate Resolution — 12-Month Trend <span className="chart-hint">click a point to drill in</span></p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hrrTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 90]} tick={{ fontSize: 11 }} width={35} unit="%" />
              <Tooltip formatter={(v) => [`${v ?? 0}%`, 'HRR']} />
              <Line type="monotone" dataKey="hrr" stroke="#107c10" strokeWidth={2}
                dot={{ r: 3, cursor: 'pointer' }}
                activeDot={{ r: 5, cursor: 'pointer',
                  onClick: (_e: unknown, payload: unknown) => {
                    const p = payload as { payload?: { date: string; hrr: number } };
                    if (!p?.payload) return;
                    setDrilldown({
                      title: `${p.payload.date} — HRR Detail`,
                      subtitle: `Hit Rate Resolution: ${p.payload.hrr}%`,
                      columns: HRR_COLS,
                      rows: hrrDetailByMonth[p.payload.date] ?? [],
                    });
                  }
                }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AHT by Product */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Avg Handle Time by Product Area (min) <span className="chart-hint">click a bar to drill in</span></p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ahtByProduct} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} domain={[0, 14]} />
              <Tooltip formatter={(v) => [`${v ?? 0} min`, '']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="prior"   name="Prior Month" fill="#c8c6c4" radius={[3,3,0,0]} style={{ cursor: 'pointer' }} onClick={onAhtClick} />
              <Bar dataKey="current" name="Current"     fill="#118dff" radius={[3,3,0,0]} style={{ cursor: 'pointer' }} onClick={onAhtClick} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Escalations by LOB */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Escalations by LOB <span className="chart-hint">click a bar to drill in</span></p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filteredEscalations} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => (v as number)?.toLocaleString() ?? ''} />
              <Bar dataKey="count" fill="#ca5010" radius={[0,4,4,0]} style={{ cursor: 'pointer' }} onClick={onEscalationClick} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
