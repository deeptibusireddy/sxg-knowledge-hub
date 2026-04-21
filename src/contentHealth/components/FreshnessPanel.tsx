import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts';
import type { FreshnessBucket } from '../types';

interface Props {
  buckets: FreshnessBucket[];
  staleCount: number;
  staleSharePct: number;
  onBucketClick?: (bucket: FreshnessBucket) => void;
}

const BUCKET_COLORS = ['#107c10', '#3b9a3b', '#e8b336', '#d97706', '#d83b01'];

export function FreshnessPanel({ buckets, staleCount, staleSharePct, onBucketClick }: Props) {
  const total = buckets.reduce((s, b) => s + b.count, 0);
  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Freshness</h3>
        <p className="ch-panel__subtitle">
          Days since last update.{' '}
          <strong>{staleCount}</strong> stale doc{staleCount === 1 ? '' : 's'} (&gt; 180d) — {staleSharePct}% of {total}.
          {onBucketClick && <> Click a bar to list docs.</>}
        </p>
      </header>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={buckets} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} width={40} />
          <Tooltip formatter={(v) => (v as number).toLocaleString()} />
          <Bar
            dataKey="count"
            radius={[4, 4, 0, 0]}
            onClick={onBucketClick ? (data) => onBucketClick(data.payload as FreshnessBucket) : undefined}
            style={onBucketClick ? { cursor: 'pointer' } : undefined}
          >
            {buckets.map((_, i) => (
              <Cell key={i} fill={BUCKET_COLORS[i % BUCKET_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
