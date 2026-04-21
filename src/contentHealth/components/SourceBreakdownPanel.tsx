import type { SourceBreakdown } from '../types';

interface Props {
  breakdown: SourceBreakdown;
}

const SOURCE_COLORS: Record<string, string> = {
  Cornerstone: '#0078d4',
  Learn:       '#107c10',
  Wiki:        '#8764b8',
  LLC:         '#d97706',
  GitHub:      '#5c2d91',
  Other:       '#a19f9d',
};

export function SourceBreakdownPanel({ breakdown }: Props) {
  const { sources, rows, hasUnknown } = breakdown;
  const totalDocs = rows.reduce((s, r) => s + r.total, 0);

  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Source attribution</h3>
        <p className="ch-panel__subtitle">
          Where {totalDocs.toLocaleString()} in-scope doc{totalDocs === 1 ? '' : 's'} came from, by LOB.
          {hasUnknown && <> Some docs have no recorded source — counted as <em>Other</em>.</>}
        </p>
      </header>

      <div className="ch-source-legend" role="list">
        {sources.map((s) => (
          <span key={s} className="ch-source-legend__item" role="listitem">
            <span className="ch-source-legend__swatch" style={{ background: SOURCE_COLORS[s] ?? '#ccc' }} />
            {s}
          </span>
        ))}
      </div>

      <div className="ch-source-bars">
        {rows.map((r) => (
          <div key={r.lob} className="ch-source-bars__row">
            <div className="ch-source-bars__label">{r.lob}</div>
            <div className="ch-source-bars__bar" title={`${r.lob}: ${r.total} docs`}>
              {r.total === 0 ? (
                <div className="ch-source-bars__empty">no docs in scope</div>
              ) : (
                sources.map((s) => {
                  const v = r.bySource[s];
                  if (v === 0) return null;
                  const widthPct = (v / r.total) * 100;
                  return (
                    <div
                      key={s}
                      className="ch-source-bars__seg"
                      style={{ width: `${widthPct}%`, background: SOURCE_COLORS[s] ?? '#ccc' }}
                      title={`${s}: ${v} (${Math.round(widthPct)}%)`}
                    >
                      {widthPct >= 8 && <span className="ch-source-bars__seg-label">{v}</span>}
                    </div>
                  );
                })
              )}
            </div>
            <div className="ch-source-bars__count">{r.total}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
