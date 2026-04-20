import type { CoverageRow } from '../types';

interface Props {
  rows: CoverageRow[];
}

export function CoveragePanel({ rows }: Props) {
  // Pivot rows into product (rows) × LOB (cols).
  const products = [...new Set(rows.map((r) => r.product))];
  const lobs = [...new Set(rows.map((r) => r.lob))];
  const lookup = new Map(rows.map((r) => [`${r.product}|${r.lob}`, r] as const));

  const max = Math.max(1, ...rows.map((r) => r.docCount));
  const gaps = rows.filter((r) => r.isGap);

  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Coverage</h3>
        <p className="ch-panel__subtitle">
          Docs per product × LOB.{' '}
          <strong>{gaps.length}</strong> gap area{gaps.length === 1 ? '' : 's'} (&lt; 4 docs).
        </p>
      </header>

      <div className="ch-coverage-grid" style={{ gridTemplateColumns: `120px repeat(${lobs.length}, 1fr)` }}>
        <div className="ch-coverage-grid__corner" />
        {lobs.map((lob) => (
          <div key={lob} className="ch-coverage-grid__col-head">{lob}</div>
        ))}
        {products.map((product) => (
          <div key={product} className="ch-coverage-grid__row" style={{ display: 'contents' }}>
            <div className="ch-coverage-grid__row-head">{product}</div>
            {lobs.map((lob) => {
              const r = lookup.get(`${product}|${lob}`);
              const count = r?.docCount ?? 0;
              const intensity = Math.min(1, count / max);
              const bg = r?.isGap
                ? '#fdf6f0'
                : `rgba(17, 141, 255, ${0.08 + intensity * 0.55})`;
              const color = intensity > 0.6 ? '#fff' : '#201f1e';
              return (
                <div
                  key={`${product}|${lob}`}
                  className={`ch-coverage-grid__cell${r?.isGap ? ' ch-coverage-grid__cell--gap' : ''}`}
                  style={{ background: bg, color }}
                  title={`${product} · ${lob}: ${count} docs${r?.isGap ? ' (gap)' : ''}`}
                >
                  {count}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {gaps.length > 0 && (
        <ul className="ch-panel__list">
          {gaps.slice(0, 4).map((g) => (
            <li key={`${g.product}|${g.lob}`}>
              <span className="ch-tag ch-tag--warn">Gap</span> {g.product} · {g.lob} — {g.docCount} doc{g.docCount === 1 ? '' : 's'}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
