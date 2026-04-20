import type { ReadabilityDistribution } from '../types';

interface Props {
  distribution: ReadabilityDistribution;
}

export function ReadabilityDistributionPanel({ distribution }: Props) {
  const { bins, totalDocs, hardestDocs } = distribution;
  const max = Math.max(1, ...bins.map((b) => b.count));
  const hard = bins.filter((b) => b.isHard).reduce((s, b) => s + b.count, 0);

  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Readability distribution</h3>
        <p className="ch-panel__subtitle">
          Flesch reading-ease across {totalDocs.toLocaleString()} docs.{' '}
          <strong>{hard}</strong> in the hard ranges (&lt; 50).
        </p>
      </header>
      <div className="ch-histogram">
        {bins.map((b) => {
          const w = (b.count / max) * 100;
          return (
            <div key={b.label} className="ch-histogram__row">
              <div className="ch-histogram__label">{b.label}</div>
              <div className="ch-histogram__track">
                <div
                  className={`ch-histogram__fill${b.isHard ? ' ch-histogram__fill--hard' : ''}`}
                  style={{ width: `${w}%` }}
                />
              </div>
              <div className="ch-histogram__count">{b.count}</div>
            </div>
          );
        })}
      </div>
      {hardestDocs.length > 0 && (
        <>
          <div className="ch-panel__sub">Hardest to read</div>
          <table className="ch-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>LOB</th>
                <th>Flesch</th>
              </tr>
            </thead>
            <tbody>
              {hardestDocs.map((d) => (
                <tr key={d.id}>
                  <td title={d.id}>{d.title}</td>
                  <td>{d.lob}</td>
                  <td className="ch-neg">{d.readability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
