import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KpiCard } from '../../components/common/KpiCard';
import type { KpiCardData } from '../../types';

function makeCard(overrides: Partial<KpiCardData> = {}): KpiCardData {
  return {
    id: 'test',
    label: 'Test Metric',
    value: '42',
    unit: '%',
    trend: 'up',
    trendLabel: '+2% vs last month',
    positiveIsUp: true,
    ...overrides,
  };
}

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard data={makeCard()} />);
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders unit when provided', () => {
    render(<KpiCard data={makeCard({ unit: '%' })} />);
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('omits unit when not provided', () => {
    render(<KpiCard data={makeCard({ unit: undefined })} />);
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('shows up arrow for trend=up', () => {
    render(<KpiCard data={makeCard({ trend: 'up' })} />);
    expect(screen.getByText(/↑/)).toBeInTheDocument();
  });

  it('shows down arrow for trend=down', () => {
    render(<KpiCard data={makeCard({ trend: 'down' })} />);
    expect(screen.getByText(/↓/)).toBeInTheDocument();
  });

  it('applies green class when positiveIsUp=true and trend=up', () => {
    const { container } = render(<KpiCard data={makeCard({ trend: 'up', positiveIsUp: true })} />);
    const trendEl = container.querySelector('.kpi-card__trend');
    expect(trendEl?.className).toContain('kpi-card__trend--good');
  });

  it('applies red class when positiveIsUp=true and trend=down', () => {
    const { container } = render(<KpiCard data={makeCard({ trend: 'down', positiveIsUp: true })} />);
    const trendEl = container.querySelector('.kpi-card__trend');
    expect(trendEl?.className).toContain('kpi-card__trend--bad');
  });

  it('renders trendLabel text', () => {
    render(<KpiCard data={makeCard({ trendLabel: '+5% vs last month' })} />);
    expect(screen.getByText(/\+5% vs last month/)).toBeInTheDocument();
  });
});
