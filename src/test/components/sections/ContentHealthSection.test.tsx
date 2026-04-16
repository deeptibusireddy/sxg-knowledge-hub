import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentHealthSection } from '../../../components/sections/ContentHealthSection';
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

describe('ContentHealthSection', () => {
  it('renders Content Health section header', () => {
    render(<ContentHealthSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText('Content Health')).toBeInTheDocument();
  });

  it('renders Ingestion Status Over Time chart title', () => {
    render(<ContentHealthSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText(/Ingestion Status Over Time/)).toBeInTheDocument();
  });

  it('renders Blocked Articles by LOB chart title', () => {
    render(<ContentHealthSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText(/Blocked Articles by LOB/)).toBeInTheDocument();
  });

  it('shows click hint text', () => {
    render(<ContentHealthSection slicer={DEFAULT_SLICER} />);
    const hints = screen.getAllByText('click a bar to drill in');
    expect(hints.length).toBeGreaterThan(0);
  });

  it('DrilldownDrawer is closed initially', () => {
    const { container } = render(<ContentHealthSection slicer={DEFAULT_SLICER} />);
    expect(container.querySelector('.drilldown-drawer--open')).not.toBeInTheDocument();
  });

  it('renders without crashing for lob=all', () => {
    const { container } = render(<ContentHealthSection slicer={{ ...DEFAULT_SLICER, lob: 'all' }} />);
    expect(container).toBeInTheDocument();
  });

  it('renders without crashing for lob=Azure', () => {
    const { container } = render(<ContentHealthSection slicer={{ ...DEFAULT_SLICER, lob: 'Azure' }} />);
    expect(container).toBeInTheDocument();
  });

  it('renders without crashing for lob=Microsoft 365', () => {
    const { container } = render(<ContentHealthSection slicer={{ ...DEFAULT_SLICER, lob: 'Microsoft 365' }} />);
    expect(container).toBeInTheDocument();
  });
});
