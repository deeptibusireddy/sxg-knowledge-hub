import type { AiReadinessSummary } from '../types';
import { ChPanel } from './ChPanel';

interface Props {
  summary: AiReadinessSummary;
}

function tone(score: number): 'good' | 'warn' | 'bad' {
  if (score >= 80) return 'good';
  if (score >= 60) return 'warn';
  return 'bad';
}

export function AiReadinessPanel({ summary }: Props) {
  const checks = [
    { key: 'idx',  label: 'Indexed in AI store', value: summary.indexedPct },
    { key: 'sch',  label: 'Schema valid',         value: summary.schemaValidPct },
    { key: 'qa',   label: 'Has Q&A block',        value: summary.hasQaBlockPct },
    { key: 'emb',  label: 'Embedding fresh (≤30d)', value: summary.embeddingFreshPct },
    { key: 'eval', label: 'Last AI eval = pass',  value: summary.evalPassPct },
  ];
  return (
    <ChPanel
      title="AI readiness"
      subtitle={<>Per-doc readiness for AI agents across {summary.totalDocs.toLocaleString()} docs in scope.
          Higher = safer to ground answers on this corpus.</>}
    >
      <div className="ch-readiness-grid">
        {checks.map((c) => {
          const t = tone(c.value);
          return (
            <div key={c.key} className={`ch-readiness-tile ch-readiness-tile--${t}`}>
              <div className="ch-readiness-tile__value">{c.value}%</div>
              <div className="ch-readiness-tile__label">{c.label}</div>
            </div>
          );
        })}
      </div>
      {summary.blockedDocs.length > 0 && (
        <>
          <div className="ch-panel__sub">Top AI-blocked docs (≥ 2 issues)</div>
          <table className="ch-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>LOB</th>
                <th>Issues</th>
              </tr>
            </thead>
            <tbody>
              {summary.blockedDocs.map((d) => (
                <tr key={d.id}>
                  <td title={d.id}>{d.title}</td>
                  <td>{d.lob}</td>
                  <td>
                    {d.issues.map((i) => (
                      <span key={i} className="ch-tag ch-tag--warn">{i}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </ChPanel>
  );
}
