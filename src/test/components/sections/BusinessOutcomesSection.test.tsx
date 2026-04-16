import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BusinessOutcomesSection } from '../../../components/sections/BusinessOutcomesSection';
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

describe('BusinessOutcomesSection', () => {
  it('renders Business Outcomes section header', () => {
    render(<BusinessOutcomesSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText('Business Outcomes')).toBeInTheDocument();
  });

  it('renders Hit Rate Resolution chart title', () => {
    render(<BusinessOutcomesSection slicer={DEFAULT_SLICER} />);
    // Use specific text that matches the chart title but not the subtitle
    expect(screen.getByText(/Hit Rate Resolution — 12-Month Trend/)).toBeInTheDocument();
  });

  it('renders Avg Handle Time chart title', () => {
    render(<BusinessOutcomesSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText(/Avg Handle Time/)).toBeInTheDocument();
  });

  it('renders Escalations by LOB chart title', () => {
    render(<BusinessOutcomesSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText(/Escalations by LOB/)).toBeInTheDocument();
  });
});
