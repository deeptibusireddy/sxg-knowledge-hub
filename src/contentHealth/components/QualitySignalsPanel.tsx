import type { QualitySignals } from '../types';
import type { QualityKey } from '../selectors';

interface Props {
  signals: QualitySignals;
  onIssueClick?: (key: QualityKey, label: string) => void;
}

function pct(n: number, d: number): number {
  return d === 0 ? 0 : Math.round((n / d) * 1000) / 10;
}

export function QualitySignalsPanel({ signals, onIssueClick }: Props) {
  const { brokenLinkDocs, brokenLinksTotal, missingMetadataDocs, hardToReadDocs, totalDocs } = signals;
  const items = [
    { key: 'broken-links' as QualityKey, label: 'Docs with broken links', value: brokenLinkDocs, hint: `${brokenLinksTotal} broken links total`, tone: brokenLinkDocs > 10 ? 'bad' : 'warn' },
    { key: 'missing-meta' as QualityKey, label: 'Missing metadata',       value: missingMetadataDocs, hint: `${pct(missingMetadataDocs, totalDocs)}% of scope`, tone: missingMetadataDocs > 15 ? 'bad' : 'warn' },
    { key: 'hard-to-read' as QualityKey, label: 'Hard to read (Flesch < 50)', value: hardToReadDocs, hint: `${pct(hardToReadDocs, totalDocs)}% of scope`, tone: hardToReadDocs > 20 ? 'warn' : 'neutral' },
  ] as const;

  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Quality signals</h3>
        <p className="ch-panel__subtitle">
          Across {totalDocs.toLocaleString()} docs in scope.
          {onIssueClick && <> Click a row for the doc list.</>}
        </p>
      </header>
      <ul className="ch-quality-list">
        {items.map((it) => {
          const inner = (
            <>
              <div className="ch-quality-list__value">{it.value.toLocaleString()}</div>
              <div className="ch-quality-list__meta">
                <div className="ch-quality-list__label">{it.label}</div>
                <div className="ch-quality-list__hint">{it.hint}</div>
              </div>
            </>
          );
          return (
            <li key={it.key} className={`ch-quality-list__item ch-quality-list__item--${it.tone}`}>
              {onIssueClick ? (
                <button
                  type="button"
                  className="ch-quality-list__button"
                  onClick={() => onIssueClick(it.key, it.label)}
                  aria-label={`Show docs: ${it.label}`}
                >
                  {inner}
                </button>
              ) : inner}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
