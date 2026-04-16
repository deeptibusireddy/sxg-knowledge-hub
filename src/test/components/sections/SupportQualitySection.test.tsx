import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SupportQualitySection } from '../../../components/sections/SupportQualitySection';
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

describe('SupportQualitySection', () => {
  it('renders Support Quality section header', () => {
    render(<SupportQualitySection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText('Support Quality')).toBeInTheDocument();
  });

  it('renders Answer Quality Score chart title', () => {
    render(<SupportQualitySection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText(/Answer Quality Score/)).toBeInTheDocument();
  });

  it('renders Empty Results by LOB chart title', () => {
    render(<SupportQualitySection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText(/Empty Results by LOB/)).toBeInTheDocument();
  });

  it('renders Feedback Distribution chart title', () => {
    render(<SupportQualitySection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText(/Feedback Distribution/)).toBeInTheDocument();
  });

  it('shows chart hint texts', () => {
    render(<SupportQualitySection slicer={DEFAULT_SLICER} />);
    const hints = screen.getAllByText(/click a (bar|point|segment) to drill in/);
    expect(hints.length).toBeGreaterThan(0);
  });
});
