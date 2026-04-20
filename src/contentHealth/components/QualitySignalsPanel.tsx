import type { QualitySignals } from '../types';

interface Props {
  signals: QualitySignals;
}

function pct(n: number, d: number): number {
  return d === 0 ? 0 : Math.round((n / d) * 1000) / 10;
}

export function QualitySignalsPanel({ signals }: Props) {
  const { brokenLinkDocs, brokenLinksTotal, missingMetadataDocs, hardToReadDocs, totalDocs } = signals;
  const items = [
    { key: 'links', label: 'Docs with broken links', value: brokenLinkDocs, hint: `${brokenLinksTotal} broken links total`, tone: brokenLinkDocs > 10 ? 'bad' : 'warn' },
    { key: 'meta',  label: 'Missing metadata',       value: missingMetadataDocs, hint: `${pct(missingMetadataDocs, totalDocs)}% of scope`, tone: missingMetadataDocs > 15 ? 'bad' : 'warn' },
    { key: 'read',  label: 'Hard to read (Flesch < 50)', value: hardToReadDocs, hint: `${pct(hardToReadDocs, totalDocs)}% of scope`, tone: hardToReadDocs > 20 ? 'warn' : 'neutral' },
  ] as const;

  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Quality signals</h3>
        <p className="ch-panel__subtitle">Across {totalDocs.toLocaleString()} docs in scope.</p>
      </header>
      <ul className="ch-quality-list">
        {items.map((it) => (
          <li key={it.key} className={`ch-quality-list__item ch-quality-list__item--${it.tone}`}>
            <div className="ch-quality-list__value">{it.value.toLocaleString()}</div>
            <div className="ch-quality-list__meta">
              <div className="ch-quality-list__label">{it.label}</div>
              <div className="ch-quality-list__hint">{it.hint}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
