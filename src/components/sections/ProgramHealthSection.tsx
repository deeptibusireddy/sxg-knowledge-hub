import { useMemo, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import type { SlicerState } from '../../types';
import { retrievalSuccessTrend, qualityByLob, incidentVolume } from '../../data/mockCharts';
import { retrievalDetailByMonth, qualityDetailByLob, incidentsByMonth } from '../../data/mockDrilldown';
import { DrilldownDrawer } from '../common/DrilldownDrawer';
import type { DrilldownContent } from '../common/DrilldownDrawer';
import { SectionHeader } from '../common/SectionHeader';

interface Props { slicer: SlicerState; }

type BarData = Record<string, string | number>;

const RETRIEVAL_COLS = [{ key: 'metric', header: 'Metric' }, { key: 'value', header: 'Value' }];
const QUALITY_COLS   = [{ key: 'metric', header: 'Metric' }, { key: 'jan', header: 'Jan' }, { key: 'feb', header: 'Feb' }, { key: 'mar', header: 'Mar' }];
const INCIDENT_COLS  = [{ key: 'incident', header: 'ID' }, { key: 'summary', header: 'Summary' }, { key: 'severity', header: 'Sev' }, { key: 'lob', header: 'LOB' }, { key: 'status', header: 'Status' }];

export function ProgramHealthSection({ slicer }: Props) {
  const [drilldown, setDrilldown] = useState<DrilldownContent | null>(null);

  const filteredQuality = useMemo(() => {
    if (slicer.lob === 'all') return qualityByLob;
    return qualityByLob.filter(d => d.name === slicer.lob);
  }, [slicer.lob]);

  function onQualityClick(raw: unknown) {
    const d = raw as BarData;
    const name = String(d.name ?? '');
    setDrilldown({
      title: `${name} — Quality Breakdown`,
      subtitle: 'Jan / Feb / Mar scores by metric',
      columns: QUALITY_COLS,
      rows: qualityDetailByLob[name] ?? [],
    });
  }

  function onIncidentClick(raw: unknown) {
    const d = raw as BarData;
    const date = String(d.date ?? '');
    const count = Number(d.count ?? 0);
    setDrilldown({
      title: `${date} — Incidents`,
      subtitle: `${count} incident${count !== 1 ? 's' : ''} this month`,
      columns: INCIDENT_COLS,
      rows: incidentsByMonth[date] ?? [],
    });
  }

  return (
    <section id="program-health">
      <DrilldownDrawer content={drilldown} onClose={() => setDrilldown(null)} />
      <SectionHeader
        title="Program Health"
        subtitle="End-to-end retrieval success, cross-LOB quality scores, and incident volume"
      />
      <div className="section-grid">
        {/* Retrieval Success Trend */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Retrieval Success Rate — 6-Month Trend <span className="chart-hint">click a point to drill in</span></p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={retrievalSuccessTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} width={35} unit="%" />
              <Tooltip formatter={(v) => [`${v ?? 0}%`, 'Retrieval Success']} />
              <Line type="monotone" dataKey="rate" stroke="#118dff" strokeWidth={2}
                dot={{ r: 3, cursor: 'pointer' }}
                activeDot={{ r: 5, cursor: 'pointer',
                  onClick: (_e: unknown, payload: unknown) => {
                    const p = payload as { payload?: { date: string; rate: number } };
                    if (!p?.payload) return;
                    setDrilldown({
                      title: `${p.payload.date} — Retrieval Detail`,
                      subtitle: `Success Rate: ${p.payload.rate}%`,
                      columns: RETRIEVAL_COLS,
                      rows: retrievalDetailByMonth[p.payload.date] ?? [],
                    });
                  }
                }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quality by LOB */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Quality Score by LOB — Last 3 Months <span className="chart-hint">click a bar to drill in</span></p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filteredQuality} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} width={35} unit="%" />
              <Tooltip formatter={(v) => [`${v ?? 0}%`, '']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="jan" name="Jan" fill="#c8c6c4" radius={[3,3,0,0]} style={{ cursor: 'pointer' }} onClick={onQualityClick} />
              <Bar dataKey="feb" name="Feb" fill="#8764b8" radius={[3,3,0,0]} style={{ cursor: 'pointer' }} onClick={onQualityClick} />
              <Bar dataKey="mar" name="Mar" fill="#118dff" radius={[3,3,0,0]} style={{ cursor: 'pointer' }} onClick={onQualityClick} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incident Volume */}
        <div className="surface chart-wrapper">
          <p className="chart-title">Incident Volume by Month <span className="chart-hint">click a bar to drill in</span></p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={incidentVolume} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} allowDecimals={false} />
              <Tooltip formatter={(v) => [v, 'Incidents']} />
              <Bar dataKey="count" fill="#d83b01" radius={[4,4,0,0]} style={{ cursor: 'pointer' }} onClick={onIncidentClick} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
