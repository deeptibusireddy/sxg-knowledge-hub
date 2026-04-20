import type { AgingHeatmap } from '../types';

interface Props {
  heatmap: AgingHeatmap;
}

export function AgingHeatmapPanel({ heatmap }: Props) {
  const { lobs, buckets, counts, max } = heatmap;
  const total = counts.flat().reduce((s, c) => s + c, 0);

  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Document aging heatmap</h3>
        <p className="ch-panel__subtitle">
          {total.toLocaleString()} docs across {lobs.length} LOB{lobs.length === 1 ? '' : 's'} ×{' '}
          {buckets.length} age buckets. Darker = more docs; rightmost columns are stale.
        </p>
      </header>
      <div
        className="ch-heatmap"
        style={{ gridTemplateColumns: `120px repeat(${buckets.length}, 1fr)` }}
      >
        <div />
        {buckets.map((b) => (
          <div key={b.label} className="ch-heatmap__col-head">{b.label}</div>
        ))}
        {lobs.map((lob, li) => (
          <div key={lob} style={{ display: 'contents' }}>
            <div className="ch-heatmap__row-head">{lob}</div>
            {buckets.map((b, bi) => {
              const count = counts[li][bi];
              const intensity = count / max;
              const isStaleCol = b.fromDays > 180;
              const hue = isStaleCol ? '8, 59, 1' : '17, 141, 255';
              const bg = count === 0
                ? '#fafafa'
                : `rgba(${hue}, ${0.10 + intensity * 0.60})`;
              const color = intensity > 0.55 ? '#fff' : '#201f1e';
              return (
                <div
                  key={`${lob}-${b.label}`}
                  className="ch-heatmap__cell"
                  style={{ background: bg, color }}
                  title={`${lob} · ${b.label}: ${count} doc${count === 1 ? '' : 's'}`}
                >
                  {count}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
