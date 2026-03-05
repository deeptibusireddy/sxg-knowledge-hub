import type { KpiCardData } from '../../types';
import './KpiCard.css';

interface Props {
  data: KpiCardData;
}

export function KpiCard({ data }: Props) {
  const { label, value, unit, trend, trendLabel, positiveIsUp } = data;

  const isGood = positiveIsUp ? trend === 'up' : trend === 'down';
  const isBad = positiveIsUp ? trend === 'down' : trend === 'up';

  const trendClass = isGood ? 'kpi-card__trend--good' : isBad ? 'kpi-card__trend--bad' : '';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div className="kpi-card surface">
      <span className="kpi-card__label">{label}</span>
      <div className="kpi-card__value-row">
        <span className="kpi-card__value">{value}</span>
        {unit && <span className="kpi-card__unit">{unit}</span>}
      </div>
      <span className={`kpi-card__trend ${trendClass}`}>
        {arrow} {trendLabel}
      </span>
    </div>
  );
}
