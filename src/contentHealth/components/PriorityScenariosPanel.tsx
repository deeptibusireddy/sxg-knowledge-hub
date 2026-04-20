import type { PriorityScenarioSummary } from '../types';

interface Props {
  summary: PriorityScenarioSummary;
}

const STATUS_TONE: Record<string, string> = {
  covered:  'good',
  draft:    'warn',
  outdated: 'warn',
  gap:      'bad',
};

export function PriorityScenariosPanel({ summary }: Props) {
  const { rows, totals } = summary;
  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Priority scenarios</h3>
        <p className="ch-panel__subtitle">
          <strong>{totals.covered}</strong> of {totals.total} validated ({totals.coveragePct}%).{' '}
          P0: {totals.p0Coverage.covered} / {totals.p0Coverage.total} covered.
        </p>
      </header>
      <div className="ch-readiness-grid">
        <div className="ch-readiness-tile ch-readiness-tile--good">
          <div className="ch-readiness-tile__value">{totals.covered}</div>
          <div className="ch-readiness-tile__label">Covered</div>
        </div>
        <div className="ch-readiness-tile ch-readiness-tile--warn">
          <div className="ch-readiness-tile__value">{totals.draft}</div>
          <div className="ch-readiness-tile__label">Draft</div>
        </div>
        <div className="ch-readiness-tile ch-readiness-tile--warn">
          <div className="ch-readiness-tile__value">{totals.outdated}</div>
          <div className="ch-readiness-tile__label">Outdated</div>
        </div>
        <div className="ch-readiness-tile ch-readiness-tile--bad">
          <div className="ch-readiness-tile__value">{totals.gap}</div>
          <div className="ch-readiness-tile__label">Gap</div>
        </div>
      </div>
      <table className="ch-table">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Scenario</th>
            <th>LOB</th>
            <th>Status</th>
            <th>Linked docs</th>
            <th>Last validated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td><span className={`ch-prio ch-prio--${r.priority}`}>{r.priority}</span></td>
              <td>{r.title}</td>
              <td>{r.lob}</td>
              <td>
                <span className={`ch-status ch-status--${STATUS_TONE[r.status]}`}>{r.status}</span>
              </td>
              <td>{r.linkedDocCount}</td>
              <td>{r.lastValidatedAt ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
