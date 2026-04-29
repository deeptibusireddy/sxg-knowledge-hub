import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import type { SearchAnalyticsSummary } from '../types';
import { ChPanel } from './ChPanel';

interface Props {
  summary: SearchAnalyticsSummary;
}

export function SearchAnalyticsPanel({ summary }: Props) {
  const { totalSearches, successRatePct, zeroClickRatePct, trend, byLob } = summary;
  return (
    <ChPanel
      title="Search analytics"
      subtitle={<>{totalSearches.toLocaleString()} search{totalSearches === 1 ? '' : 'es'} in window.
          Successful = at least one result above relevance threshold.</>}
    >
      <div className="ch-readiness-grid">
        <div className={`ch-readiness-tile ch-readiness-tile--${successRatePct >= 80 ? 'good' : successRatePct >= 65 ? 'warn' : 'bad'}`}>
          <div className="ch-readiness-tile__value">{successRatePct}%</div>
          <div className="ch-readiness-tile__label">Successful searches</div>
        </div>
        <div className={`ch-readiness-tile ch-readiness-tile--${zeroClickRatePct <= 25 ? 'good' : zeroClickRatePct <= 40 ? 'warn' : 'bad'}`}>
          <div className="ch-readiness-tile__value">{zeroClickRatePct}%</div>
          <div className="ch-readiness-tile__label">Zero-click (results shown, none clicked)</div>
        </div>
      </div>

      <div className="ch-panel__sub">Success rate trend</div>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={trend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={30} />
          <YAxis tick={{ fontSize: 11 }} width={32} domain={[0, 100]} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Line type="monotone" dataKey="successRatePct" stroke="#0078d4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <div className="ch-panel__sub">Worst LOBs</div>
      <table className="ch-table">
        <thead>
          <tr>
            <th>LOB</th>
            <th>Searches</th>
            <th>Success</th>
            <th>Zero-click</th>
          </tr>
        </thead>
        <tbody>
          {byLob.slice(0, 5).map((r) => (
            <tr key={r.lob}>
              <td>{r.lob}</td>
              <td>{r.searches.toLocaleString()}</td>
              <td className={r.successRatePct >= 75 ? 'ch-pos' : 'ch-neg'}>{r.successRatePct}%</td>
              <td className={r.zeroClickRatePct <= 30 ? 'ch-pos' : 'ch-neg'}>{r.zeroClickRatePct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChPanel>
  );
}
