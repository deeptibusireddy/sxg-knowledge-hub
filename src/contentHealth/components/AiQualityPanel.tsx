import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import type { AiQualitySummary } from '../types';
import { ChPanel } from './ChPanel';

interface Props {
  summary: AiQualitySummary;
}

function kpiTone(value: number, goodAt: number, warnAt: number) {
  if (value >= goodAt) return 'good';
  if (value >= warnAt) return 'warn';
  return 'bad';
}

export function AiQualityPanel({ summary }: Props) {
  const { totalAnswers, accuracyPct, meanConfidencePct, groundedPct, fallbackPct, accuracyTrend, byLob } = summary;
  return (
    <ChPanel
      title="AI quality"
      subtitle={<>{totalAnswers.toLocaleString()} AI answer{totalAnswers === 1 ? '' : 's'} judged in window.
          Accuracy is eval-judged; confidence is model self-reported.</>}
    >
      <div className="ch-readiness-grid">
        <div className={`ch-readiness-tile ch-readiness-tile--${kpiTone(accuracyPct, 80, 60)}`}>
          <div className="ch-readiness-tile__value">{accuracyPct}%</div>
          <div className="ch-readiness-tile__label">Answer accuracy</div>
        </div>
        <div className={`ch-readiness-tile ch-readiness-tile--${kpiTone(meanConfidencePct, 75, 55)}`}>
          <div className="ch-readiness-tile__value">{meanConfidencePct}%</div>
          <div className="ch-readiness-tile__label">Mean confidence</div>
        </div>
        <div className={`ch-readiness-tile ch-readiness-tile--${kpiTone(groundedPct, 80, 60)}`}>
          <div className="ch-readiness-tile__value">{groundedPct}%</div>
          <div className="ch-readiness-tile__label">Grounded in a doc</div>
        </div>
        <div className={`ch-readiness-tile ch-readiness-tile--${kpiTone(100 - fallbackPct, 80, 60)}`}>
          <div className="ch-readiness-tile__value">{fallbackPct}%</div>
          <div className="ch-readiness-tile__label">Human fallback</div>
        </div>
      </div>

      <div className="ch-panel__sub">Accuracy trend</div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={accuracyTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={30} />
          <YAxis tick={{ fontSize: 11 }} width={32} domain={[0, 100]} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Line type="monotone" dataKey="accuracyPct" stroke="#5c2d91" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <div className="ch-panel__sub">Worst LOBs by accuracy</div>
      <table className="ch-table">
        <thead>
          <tr>
            <th>LOB</th>
            <th>Answers</th>
            <th>Accuracy</th>
            <th>Fallback</th>
          </tr>
        </thead>
        <tbody>
          {byLob.slice(0, 5).map((r) => (
            <tr key={r.lob}>
              <td>{r.lob}</td>
              <td>{r.answers}</td>
              <td className={r.accuracyPct >= 70 ? 'ch-pos' : 'ch-neg'}>{r.accuracyPct}%</td>
              <td className={r.fallbackPct <= 20 ? 'ch-pos' : 'ch-neg'}>{r.fallbackPct}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChPanel>
  );
}
