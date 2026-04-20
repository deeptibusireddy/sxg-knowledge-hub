import type { FeedbackSummary, SearchMissRow } from '../types';

interface Props {
  feedback: FeedbackSummary;
  searchMisses: SearchMissRow[];
}

export function FeedbackUsagePanel({ feedback, searchMisses }: Props) {
  const { totalViews, totalThumbsUp, totalThumbsDown, thumbsRatioPct, topDocs } = feedback;
  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Feedback &amp; usage</h3>
        <p className="ch-panel__subtitle">
          {totalViews.toLocaleString()} views · 👍 {totalThumbsUp.toLocaleString()} · 👎 {totalThumbsDown.toLocaleString()} ({thumbsRatioPct}% positive)
        </p>
      </header>

      <div className="ch-panel__sub">Top viewed docs</div>
      <table className="ch-table">
        <thead>
          <tr>
            <th>Doc</th>
            <th>Views</th>
            <th>Net 👍/👎</th>
          </tr>
        </thead>
        <tbody>
          {topDocs.map((d) => (
            <tr key={d.docId}>
              <td title={d.docId}>{d.title}</td>
              <td>{d.views.toLocaleString()}</td>
              <td className={d.net >= 0 ? 'ch-pos' : 'ch-neg'}>{d.net >= 0 ? `+${d.net}` : d.net}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ch-panel__sub">Top search misses</div>
      <table className="ch-table">
        <thead>
          <tr>
            <th>Query</th>
            <th>Occurrences</th>
            <th>Last seen</th>
          </tr>
        </thead>
        <tbody>
          {searchMisses.map((m) => (
            <tr key={m.query}>
              <td>“{m.query}”</td>
              <td>{m.occurrences.toLocaleString()}</td>
              <td>{m.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
