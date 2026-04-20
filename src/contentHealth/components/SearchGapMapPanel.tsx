import type { SearchGapRow } from '../types';

interface Props {
  rows: SearchGapRow[];
}

export function SearchGapMapPanel({ rows }: Props) {
  const top = rows.find((r) => r.gapScore > 0);
  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Search-miss → coverage gap</h3>
        <p className="ch-panel__subtitle">
          Where unmet search demand meets thin coverage.{' '}
          {top
            ? <>Biggest gap: <strong>{top.lob}</strong> (score {top.gapScore}).</>
            : 'No clear gaps in this window.'}
        </p>
      </header>
      <table className="ch-table">
        <thead>
          <tr>
            <th>LOB</th>
            <th>Miss occurrences</th>
            <th>Distinct queries</th>
            <th>Docs in scope</th>
            <th>Gap score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.lob}>
              <td>{r.lob}</td>
              <td>{r.missOccurrences.toLocaleString()}</td>
              <td>{r.missQueries}</td>
              <td>{r.docCount}</td>
              <td>
                <div className="ch-scorebar ch-scorebar--gap" title={`${r.gapScore}/100`}>
                  <div
                    className="ch-scorebar__fill"
                    style={{
                      width: `${r.gapScore}%`,
                      background: r.gapScore >= 60 ? '#d83b01' : r.gapScore >= 30 ? '#e8b336' : '#a19f9d',
                    }}
                  />
                  <span className="ch-scorebar__num">{r.gapScore}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="ch-panel__hint">
        Heuristic mapping: queries are bucketed to a LOB by keyword. Replace with
        the search index's classifier when wiring real data.
      </p>
    </section>
  );
}
