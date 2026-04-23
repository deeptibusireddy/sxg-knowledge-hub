import { Card } from '@fluentui/react-components';
import type { KpiCardData } from '../../types';
import './KpiCard.css';

interface Props {
  data: KpiCardData;
  onClick?: () => void;
}

export function KpiCard({ data, onClick }: Props) {
  const { label, value, unit, trend, trendLabel, positiveIsUp } = data;

  const isGood = positiveIsUp ? trend === 'up' : trend === 'down';
  const isBad = positiveIsUp ? trend === 'down' : trend === 'up';

  const trendClass = isGood ? 'kpi-card__trend--good' : isBad ? 'kpi-card__trend--bad' : '';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <Card
      className={`kpi-card${onClick ? ' kpi-card--clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={onClick ? `${label}: ${value}${unit ?? ''} — click for details` : undefined}
    >
      <span className="kpi-card__label">{label}</span>
      <div className="kpi-card__value-row">
        <span className="kpi-card__value">{value}</span>
        {unit && <span className="kpi-card__unit">{unit}</span>}
      </div>
      <span className={`kpi-card__trend ${trendClass}`}>
        {arrow} {trendLabel}
      </span>
      {onClick && <span className="kpi-card__drill-hint">↗ View details</span>}
    </Card>
  );
}
