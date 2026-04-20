import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import type { ContributorRow, ThroughputPoint } from '../types';

interface Props {
  series: ThroughputPoint[];
  contributors: ContributorRow[];
}

export function AuthoringThroughputPanel({ series, contributors }: Props) {
  const totalPrs = series.reduce((s, p) => s + p.prs, 0);
  return (
    <section className="ch-panel">
      <header className="ch-panel__header">
        <h3 className="ch-panel__title">Authoring throughput</h3>
        <p className="ch-panel__subtitle">
          <strong>{totalPrs}</strong> PR{totalPrs === 1 ? '' : 's'} merged in window.
        </p>
      </header>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e1dfdd" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} minTickGap={30} />
          <YAxis tick={{ fontSize: 11 }} width={32} />
          <Tooltip formatter={(v) => (v as number).toLocaleString()} />
          <Line type="monotone" dataKey="prs" stroke="#0078d4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <div className="ch-panel__sub">Top contributors</div>
      <table className="ch-table">
        <thead>
          <tr>
            <th>Author</th>
            <th>PRs</th>
            <th>Lines</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map((c) => (
            <tr key={c.author}>
              <td>{c.author}</td>
              <td>{c.prs}</td>
              <td>{c.linesChanged.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
