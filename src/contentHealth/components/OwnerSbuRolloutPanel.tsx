import type { OwnerSbuRow } from '../types';

interface Props {
  rows: OwnerSbuRow[];
}

export function OwnerSbuRolloutPanel({ rows }: Props) {
  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Owner / SBU rollup</h3>
        <p className="ch-panel__subtitle">
          Where to focus cross-team conversations. Sorted by combined risk
          (stale share + quality share + intake breaches).
        </p>
      </header>
      <table className="ch-table">
        <thead>
          <tr>
            <th>SBU</th>
            <th>Docs</th>
            <th>Stale</th>
            <th>Stale %</th>
            <th>Quality issues</th>
            <th>Issue %</th>
            <th>Intake open</th>
            <th>SLA breaches</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.sbu}>
              <td><strong>{r.sbu}</strong></td>
              <td>{r.docs}</td>
              <td>{r.staleDocs}</td>
              <td className={r.staleSharePct >= 25 ? 'ch-neg' : ''}>{r.staleSharePct}%</td>
              <td>{r.qualityIssueDocs}</td>
              <td className={r.qualityIssueSharePct >= 30 ? 'ch-neg' : ''}>{r.qualityIssueSharePct}%</td>
              <td>{r.intakeOpen}</td>
              <td className={r.intakeBreaches > 0 ? 'ch-neg' : 'ch-pos'}>{r.intakeBreaches}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
