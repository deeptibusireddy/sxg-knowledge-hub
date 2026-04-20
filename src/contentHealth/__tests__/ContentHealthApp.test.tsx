import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContentHealthApp from '../ContentHealthApp';

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/content-health']}>
      <ContentHealthApp />
    </MemoryRouter>,
  );
}

describe('ContentHealthApp', () => {
  it('renders the page title and team-owner pill', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: 'Content Health Dashboard' })).toBeInTheDocument();
    expect(screen.getByText(/Content Health team · synthetic data/i)).toBeInTheDocument();
  });

  it('renders a Back to Hub link', () => {
    renderApp();
    const back = screen.getByRole('link', { name: /Back to Hub/i });
    expect(back).toBeInTheDocument();
    expect(back).toHaveAttribute('href', '/');
  });

  it('renders all eighteen panel headings', () => {
    renderApp();
    // Section A — hygiene
    expect(screen.getByRole('heading', { name: 'Coverage' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Freshness' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Quality signals' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Authoring throughput' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'LOB health scorecard' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Readability distribution' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Document aging heatmap' })).toBeInTheDocument();
    // Section B — AI
    expect(screen.getByRole('heading', { name: 'AI readiness' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AI quality' })).toBeInTheDocument();
    // Section C — lifecycle
    expect(screen.getByRole('heading', { name: /Intake & review queue/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Priority scenarios' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Stale / at-risk articles' })).toBeInTheDocument();
    // Section D — cross-team & outcomes
    expect(screen.getByRole('heading', { name: 'Owner / SBU rollup' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Self-help resolution success' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Search analytics' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Top performing docs' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Search-miss → coverage gap' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Feedback/i })).toBeInTheDocument();
  });

  it('renders all four section headings', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: /Knowledge hygiene/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /AI readiness & quality/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Lifecycle/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Cross-team & outcomes/i })).toBeInTheDocument();
  });

  it('renders product pills with AAQ active and CMSP / AI Native disabled & out-of-scope', () => {
    renderApp();
    const aaq = screen.getByRole('button', { name: /AAQ/ });
    const cmsp = screen.getByRole('button', { name: /CMSP/ });
    const ai = screen.getByRole('button', { name: /AI Native/ });
    expect(aaq).toHaveAttribute('aria-pressed', 'true');
    expect(cmsp).toBeDisabled();
    expect(ai).toBeDisabled();
    const tags = screen.getAllByText(/Out of scope/i);
    expect(tags.length).toBe(2);
  });

  it('renders the slicer with LOB and window selects', () => {
    const { container } = renderApp();
    const slicer = container.querySelector('.ch-slicer');
    expect(slicer).not.toBeNull();
    expect(slicer!.textContent).toMatch(/LOB/);
    expect(slicer!.textContent).toMatch(/Window/);
  });

  it('renders the KPI strip with all six tiles', () => {
    const { container } = renderApp();
    const tiles = container.querySelectorAll('.ch-kpi-strip__tile');
    expect(tiles.length).toBe(6);
  });
});
