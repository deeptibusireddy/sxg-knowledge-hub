import type { StaleArticleRow } from '../types';

interface Props {
  rows: StaleArticleRow[];
}

export function StaleArticlesPanel({ rows }: Props) {
  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Stale / at-risk articles</h3>
        <p className="ch-panel__subtitle">
          {rows.length === 0
            ? 'No articles past the 180-day stale threshold in scope.'
            : `Top ${rows.length} oldest docs (> 180d since update). Reach out to the owner to refresh.`}
        </p>
      </header>
      {rows.length > 0 && (
        <table className="ch-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>LOB</th>
              <th>Owner</th>
              <th>Last updated</th>
              <th>Days</th>
              <th>Broken links</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td title={r.id}>{r.title}</td>
                <td>{r.lob}</td>
                <td>{r.owner}</td>
                <td>{r.lastUpdated}</td>
                <td className="ch-neg">{r.daysSince}</td>
                <td className={r.brokenLinkCount > 0 ? 'ch-neg' : ''}>{r.brokenLinkCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
