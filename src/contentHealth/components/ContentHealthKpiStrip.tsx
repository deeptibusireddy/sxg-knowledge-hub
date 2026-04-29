import { Card } from '@fluentui/react-components';
import type { KpiSummary } from '../types';

interface Props {
  kpis: KpiSummary;
}

interface Tile {
  label: string;
  value: string;
  hint: string;
  tone: 'neutral' | 'good' | 'warn' | 'bad';
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

export function ContentHealthKpiStrip({ kpis }: Props) {
  const tiles: Tile[] = [
    {
      label: 'Docs in scope',
      value: fmt(kpis.coverageDocs),
      hint: `${kpis.coverageGapAreas} thin area${kpis.coverageGapAreas === 1 ? '' : 's'} (<4 docs)`,
      tone: kpis.coverageGapAreas > 0 ? 'warn' : 'good',
    },
    {
      label: 'Stale docs (>180d)',
      value: fmt(kpis.staleDocs),
      hint: `${kpis.staleSharePct}% of scope`,
      tone: kpis.staleSharePct > 25 ? 'bad' : kpis.staleSharePct > 10 ? 'warn' : 'good',
    },
    {
      label: 'Quality issues',
      value: fmt(kpis.qualityIssues),
      hint: 'broken links + missing meta + low readability',
      tone: kpis.qualityIssues > 40 ? 'bad' : kpis.qualityIssues > 15 ? 'warn' : 'good',
    },
    {
      label: 'Updates merged',
      value: fmt(kpis.prsLastWindow),
      hint: 'in selected window',
      tone: 'neutral',
    },
    {
      label: 'Thumbs ratio',
      value: `${kpis.thumbsRatioPct}%`,
      hint: 'positive feedback share',
      tone: kpis.thumbsRatioPct >= 80 ? 'good' : kpis.thumbsRatioPct >= 60 ? 'warn' : 'bad',
    },
    {
      label: 'Response coverage',
      value: `${kpis.responseCoveragePct}%`,
      hint: 'searches that returned a usable result',
      tone: kpis.responseCoveragePct >= 90 ? 'good' : kpis.responseCoveragePct >= 75 ? 'warn' : 'bad',
    },
  ];

  return (
    <div className="ch-kpi-strip">
      {tiles.map((t) => (
        <Card
          key={t.label}
          appearance="filled"
          className={`ch-kpi-strip__tile ch-kpi-strip__tile--${t.tone}`}
        >
          <div className="ch-kpi-strip__label">{t.label}</div>
          <div className="ch-kpi-strip__value">{t.value}</div>
          <div className="ch-kpi-strip__hint">{t.hint}</div>
        </Card>
      ))}
    </div>
  );
}
