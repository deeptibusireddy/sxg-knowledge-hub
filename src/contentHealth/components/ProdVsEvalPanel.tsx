import type { ProdVsEvalSummary } from '../types';

interface Props {
  summary: ProdVsEvalSummary;
}

function deltaTone(delta: number): 'good' | 'warn' | 'bad' {
  const a = Math.abs(delta);
  if (a < 5) return 'good';
  if (a <= 15) return 'warn';
  return 'bad';
}

function formatDelta(delta: number): string {
  if (delta === 0) return '0';
  const sign = delta > 0 ? '+' : '−';
  return `${sign}${Math.abs(delta).toFixed(1)}`;
}

function hint(delta: number): string {
  const a = Math.abs(delta);
  if (a < 5) return 'Eval matches production';
  if (delta > 0) return 'Evals may be too strict — refresh golden set';
  return 'Evals miss real failures — refresh golden set';
}

export function ProdVsEvalPanel({ summary }: Props) {
  const { overall, byLob } = summary;

  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Prod vs Eval</h3>
        <p className="ch-panel__subtitle">
          Production answer accuracy (windowed, real answers) compared to offline
          eval pass rate (corpus snapshot). A large Δ means your golden-set evals
          don't reflect production reality — refresh them.
        </p>
      </header>

      <div className="ch-pve-overall">
        <div className="ch-pve-overall__col">
          <div className="ch-pve-overall__value">{overall.prodAccuracyPct}%</div>
          <div
            className="ch-pve-overall__label"
            title={`Average eval-judged accuracy across ${overall.answers.toLocaleString()} real AI answers in the selected window.`}
          >
            Prod accuracy
          </div>
          <div className="ch-pve-overall__sub">{overall.answers.toLocaleString()} answers</div>
        </div>
        <div className="ch-pve-overall__col">
          <div className="ch-pve-overall__value">{overall.evalPassPct}%</div>
          <div
            className="ch-pve-overall__label"
            title={`Share of in-scope docs whose latest offline AI eval = 'pass' (point-in-time snapshot, not windowed).`}
          >
            Eval pass rate
          </div>
          <div className="ch-pve-overall__sub">{overall.docs.toLocaleString()} docs</div>
        </div>
        <div className={`ch-pve-overall__col ch-pve-overall__col--${deltaTone(overall.deltaPct)}`}>
          <div className="ch-pve-overall__value">{formatDelta(overall.deltaPct)}</div>
          <div className="ch-pve-overall__label">Δ overall</div>
          <div className="ch-pve-overall__sub">{hint(overall.deltaPct)}</div>
        </div>
      </div>

      <div className="ch-panel__sub">By LOB (sorted by |Δ|)</div>
      <table className="ch-table">
        <thead>
          <tr>
            <th>LOB</th>
            <th title="Average eval-judged accuracy across real AI answers in the selected window.">
              Prod
            </th>
            <th title="Share of in-scope docs in this LOB with latest offline AI eval = 'pass'.">
              Eval
            </th>
            <th>Δ</th>
            <th>Hint</th>
          </tr>
        </thead>
        <tbody>
          {byLob.map((r) => {
            const tone = deltaTone(r.deltaPct);
            return (
              <tr key={r.lob}>
                <td>{r.lob}</td>
                <td title={`${r.answers} answers`}>{r.prodAccuracyPct}%</td>
                <td title={`${r.docs} docs`}>{r.evalPassPct}%</td>
                <td>
                  <span className={`ch-pve-delta ch-pve-delta--${tone}`}>
                    {formatDelta(r.deltaPct)}
                  </span>
                </td>
                <td className="ch-pve-hint">{hint(r.deltaPct)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
