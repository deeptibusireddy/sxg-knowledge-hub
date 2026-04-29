import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import type { SelfHelpSummary } from '../types';
import { ChPanel } from './ChPanel';

interface Props {
  summary: SelfHelpSummary;
}

export function SelfHelpResolutionPanel({ summary }: Props) {
  const { totalSessions, resolvedPct, fallbackPct, trend, byLob } = summary;
  return (
    <ChPanel
      title="Self-help resolution success"
      subtitle={<>{totalSessions.toLocaleString()} self-help session{totalSessions === 1 ? '' : 's'} in window.
          Higher = engineers / partners solving without escalating.</>}
    >
      <div className="ch-readiness-grid">
        <div className={`ch-readiness-tile ch-readiness-tile--${resolvedPct >= 70 ? 'good' : resolvedPct >= 55 ? 'warn' : 'bad'}`}>
          <div className="ch-readiness-tile__value">{resolvedPct}%</div>
          <div className="ch-readiness-tile__label">Resolved without help</div>
        </div>
        <div className={`ch-readiness-tile ch-readiness-tile--${fallbackPct <= 20 ? 'good' : fallbackPct <= 35 ? 'warn' : 'bad'}`}>
          <div className="ch-readiness-tile__value">{fallbackPct}%</div>
          <div className="ch-readiness-tile__label">Escalated to human</div>
        </div>
      </div>

      <div className="ch-panel__sub">Resolution rate trend</div>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={trend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={30} />
          <YAxis tick={{ fontSize: 11 }} width={32} domain={[0, 100]} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Line type="monotone" dataKey="resolvedPct" stroke="#107c10" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <div className="ch-panel__sub">Worst LOBs</div>
      <table className="ch-table">
        <thead>
          <tr>
            <th>LOB</th>
            <th>Sessions</th>
            <th>Resolved</th>
          </tr>
        </thead>
        <tbody>
          {byLob.slice(0, 5).map((r) => (
            <tr key={r.lob}>
              <td>{r.lob}</td>
              <td>{r.sessions.toLocaleString()}</td>
              <td className={r.resolvedPct >= 65 ? 'ch-pos' : 'ch-neg'}>{r.resolvedPct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChPanel>
  );
}
