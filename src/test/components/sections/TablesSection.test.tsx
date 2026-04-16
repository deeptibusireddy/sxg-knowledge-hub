import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TablesSection } from '../../../components/sections/TablesSection';
import type { SlicerState } from '../../../types';

vi.mock('../../../utils/exportCsv', () => ({
  exportToCsv: vi.fn(),
}));

const DEFAULT_SLICER: SlicerState = {
  lob: 'all',
  dateRange: '30d',
  dateFrom: '',
  dateTo: '',
  lobTag: 'all',
  audience: 'all',
  dataSource: 'all',
  business: 'all',
  user: '',
};

describe('TablesSection', () => {
  it('renders Blocked Articles section', () => {
    render(<TablesSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText('Top Blocked Articles')).toBeInTheDocument();
  });

  it('renders Recent Incidents section', () => {
    render(<TablesSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText('Recent Incidents')).toBeInTheDocument();
  });

  it('shows all blocked article rows when lob is all', () => {
    render(<TablesSection slicer={DEFAULT_SLICER} />);
    // blockedArticles has 8 rows
    expect(screen.getByText('Azure AD Conditional Access Policy Guide')).toBeInTheDocument();
    expect(screen.getByText('Xbox Live Ban Appeal Process')).toBeInTheDocument();
  });

  it('filters blocked articles to only Azure rows when lob is Azure', () => {
    render(<TablesSection slicer={{ ...DEFAULT_SLICER, lob: 'Azure' }} />);
    expect(screen.getByText('Azure AD Conditional Access Policy Guide')).toBeInTheDocument();
    expect(screen.queryByText('Xbox Live Ban Appeal Process')).not.toBeInTheDocument();
  });

  it('Export CSV buttons present for both tables', () => {
    render(<TablesSection slicer={DEFAULT_SLICER} />);
    const exportBtns = screen.getAllByText(/Export CSV/);
    expect(exportBtns.length).toBeGreaterThanOrEqual(2);
  });

  it('renders column headers for blocked articles', () => {
    render(<TablesSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText('Article')).toBeInTheDocument();
    // LOB appears in both tables — use getAllByText
    expect(screen.getAllByText('LOB').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Block Reason')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders column headers for incidents', () => {
    render(<TablesSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText('Incident')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Opened')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });
});
