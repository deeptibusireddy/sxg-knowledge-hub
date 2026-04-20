import type { TopPerformerRow } from '../types';

interface Props {
  rows: TopPerformerRow[];
}

export function TopPerformersPanel({ rows }: Props) {
  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Top performing docs</h3>
        <p className="ch-panel__subtitle">
          {rows.length === 0
            ? 'Not enough engagement in window to rank.'
            : 'Best feedback ratio among docs with ≥ 100 views in window.'}
        </p>
      </header>
      {rows.length > 0 && (
        <table className="ch-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>LOB</th>
              <th>Views</th>
              <th>👍</th>
              <th>👎</th>
              <th>Positive</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.docId}>
                <td title={r.docId}>{r.title}</td>
                <td>{r.lob}</td>
                <td>{r.views.toLocaleString()}</td>
                <td>{r.thumbsUp.toLocaleString()}</td>
                <td>{r.thumbsDown.toLocaleString()}</td>
                <td className="ch-pos">{r.ratioPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
