import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

vi.mock('../utils/exportCsv', () => ({
  exportToCsv: vi.fn(),
}));

describe('App', () => {
  it('renders SxG Knowledge Hub in header', () => {
    render(<App />);
    expect(screen.getByText('SxG Knowledge Hub')).toBeInTheDocument();
  });

  it('renders all 3 product pills', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /AAQ/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CMSP/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /AI Native/ })).toBeInTheDocument();
  });

  it('AAQ is selected by default (has active class)', () => {
    const { container } = render(<App />);
    const aaqBtn = screen.getByRole('button', { name: /AAQ/ });
    expect(aaqBtn.className).toContain('app__env-pill--active');
    void container;
  });

  it('clicking CMSP makes it active', async () => {
    render(<App />);
    const cmspBtn = screen.getByRole('button', { name: /CMSP/ });
    await userEvent.click(cmspBtn);
    expect(cmspBtn.className).toContain('app__env-pill--active');
  });

  it('clicking AI Native makes it active', async () => {
    render(<App />);
    const aiBtn = screen.getByRole('button', { name: /AI Native/ });
    await userEvent.click(aiBtn);
    expect(aiBtn.className).toContain('app__env-pill--active');
  });

  it('renders all 6 QuickAction buttons', () => {
    render(<App />);
    expect(screen.getByText('Content Ingestion Request')).toBeInTheDocument();
    expect(screen.getByText('Content Removal Request')).toBeInTheDocument();
    expect(screen.getByText('Give Feedback')).toBeInTheDocument();
    expect(screen.getByText('Feature Request')).toBeInTheDocument();
    expect(screen.getByText('New Partner Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Bot')).toBeInTheDocument();
  });

  it('renders SlicerBar', () => {
    render(<App />);
    expect(screen.getByLabelText('Line of Business')).toBeInTheDocument();
  });

  it('renders KPI cards (at least 4)', () => {
    const { container } = render(<App />);
    const kpiCards = container.querySelectorAll('.kpi-card');
    expect(kpiCards.length).toBeGreaterThanOrEqual(4);
  });

  it('renders Content Health section header', () => {
    render(<App />);
    expect(screen.getByText('Content Health')).toBeInTheDocument();
  });

  it('renders Support Quality section header', () => {
    render(<App />);
    expect(screen.getByText('Support Quality')).toBeInTheDocument();
  });

  it('renders Business Outcomes section header', () => {
    render(<App />);
    expect(screen.getByText('Business Outcomes')).toBeInTheDocument();
  });

  it('renders Program Health section header', () => {
    render(<App />);
    expect(screen.getByText('Program Health')).toBeInTheDocument();
  });

  it('action zone (grey strip) is present', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.app__action-zone')).toBeInTheDocument();
  });

  it('header contains subtitle text', () => {
    render(<App />);
    expect(screen.getByText('Actionable Insights · Partner Dashboard')).toBeInTheDocument();
  });
});
