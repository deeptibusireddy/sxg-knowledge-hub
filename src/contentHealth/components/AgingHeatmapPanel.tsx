import type { AgingHeatmap } from '../types';
import type { LobArea } from '../../shared/contentHealth/types';
import { ChPanel } from './ChPanel';

interface Props {
  heatmap: AgingHeatmap;
  onCellClick?: (lob: LobArea, bucket: AgingHeatmap['buckets'][number]) => void;
}

export function AgingHeatmapPanel({ heatmap, onCellClick }: Props) {
  const { lobs, buckets, counts, max } = heatmap;
  const total = counts.flat().reduce((s, c) => s + c, 0);

  return (
    <ChPanel
      title="Document aging heatmap"
      subtitle={<>{total.toLocaleString()} docs across {lobs.length} LOB{lobs.length === 1 ? '' : 's'} ×{' '}
          {buckets.length} age buckets. Darker = more docs; rightmost columns are stale.
          {onCellClick && <> Click a cell to list docs.</>}</>}
    >
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
              const title = `${lob} · ${b.label}: ${count} doc${count === 1 ? '' : 's'}`;
              const canClick = !!onCellClick && count > 0;
              if (canClick) {
                return (
                  <button
                    key={`${lob}-${b.label}`}
                    type="button"
                    className="ch-heatmap__cell ch-heatmap__cell--clickable"
                    style={{ background: bg, color }}
                    title={title}
                    aria-label={`${title}. Click to list.`}
                    onClick={() => onCellClick!(lob, b)}
                  >
                    {count}
                  </button>
                );
              }
              return (
                <div
                  key={`${lob}-${b.label}`}
                  className="ch-heatmap__cell"
                  style={{ background: bg, color }}
                  title={title}
                >
                  {count}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </ChPanel>
  );
}
