import type { IntakeQueueSummary } from '../types';
import { ChPanel } from './ChPanel';

interface Props {
  summary: IntakeQueueSummary;
}

const STATE_LABELS: Record<string, string> = {
  pending:   'Pending',
  in_review: 'In review',
  blocked:   'Blocked',
  published: 'Published',
};
const STATE_TONE: Record<string, string> = {
  pending:   'neutral',
  in_review: 'warn',
  blocked:   'bad',
  published: 'good',
};

export function IntakeQueuePanel({ summary }: Props) {
  const { byState, slaBreaches, total, breachPct } = summary;
  const states: Array<keyof typeof byState> = ['pending', 'in_review', 'blocked', 'published'];
  const open = byState.pending + byState.in_review + byState.blocked;
  return (
    <ChPanel
      title="Intake &amp; review queue"
      subtitle={<>{total} request{total === 1 ? '' : 's'} in flight · {open} open ·{' '}
          <strong className={breachPct > 25 ? 'ch-neg' : 'ch-pos'}>{breachPct}%</strong> of open are past SLA.</>}
    >
      <div className="ch-kanban">
        {states.map((s) => (
          <div key={s} className={`ch-kanban__col ch-kanban__col--${STATE_TONE[s]}`}>
            <div className="ch-kanban__count">{byState[s]}</div>
            <div className="ch-kanban__label">{STATE_LABELS[s]}</div>
          </div>
        ))}
      </div>
      {slaBreaches.length > 0 ? (
        <>
          <div className="ch-panel__sub">SLA breaches (oldest first)</div>
          <table className="ch-table">
            <thead>
              <tr>
                <th>Request</th>
                <th>LOB</th>
                <th>State</th>
                <th>Age (d)</th>
                <th>SLA (d)</th>
                <th>Over by</th>
              </tr>
            </thead>
            <tbody>
              {slaBreaches.map((b) => (
                <tr key={b.id}>
                  <td title={b.id}>{b.title}</td>
                  <td>{b.lob}</td>
                  <td>{STATE_LABELS[b.state]}</td>
                  <td>{b.ageInStateDays}</td>
                  <td>{b.slaTargetDays}</td>
                  <td className="ch-neg">+{b.overBy}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="ch-panel__hint">No SLA breaches in the open queue.</p>
      )}
    </ChPanel>
  );
}
