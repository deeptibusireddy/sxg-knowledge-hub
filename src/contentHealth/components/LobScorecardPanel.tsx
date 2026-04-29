import type { LobScorecardRow } from '../types';
import { ChPanel } from './ChPanel';

interface Props {
  rows: LobScorecardRow[];
}

const GRADE_TONE: Record<LobScorecardRow['grade'], string> = {
  A: 'good',
  B: 'good',
  C: 'warn',
  D: 'warn',
  F: 'bad',
};

function bar(score: number, color: string) {
  const w = Math.max(0, Math.min(100, score));
  return (
    <div className="ch-scorebar" title={`${score}/100`}>
      <div className="ch-scorebar__fill" style={{ width: `${w}%`, background: color }} />
      <span className="ch-scorebar__num">{score}</span>
    </div>
  );
}

export function LobScorecardPanel({ rows }: Props) {
  return (
    <ChPanel
      title="LOB health scorecard"
      subtitle={<>Composite score per LOB: 30% coverage · 40% freshness · 30% quality.</>}
    >
      <table className="ch-table">
        <thead>
          <tr>
            <th>LOB</th>
            <th>Docs</th>
            <th>Coverage</th>
            <th>Freshness</th>
            <th>Quality</th>
            <th>Overall</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.lob}>
              <td>{r.lob}</td>
              <td>{r.docs}</td>
              <td>{bar(r.coverageScore, '#0078d4')}</td>
              <td>{bar(r.freshnessScore, '#107c10')}</td>
              <td>{bar(r.qualityScore, '#5c2d91')}</td>
              <td><strong>{r.overallScore}</strong></td>
              <td>
                <span className={`ch-grade ch-grade--${GRADE_TONE[r.grade]}`}>{r.grade}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChPanel>
  );
}
