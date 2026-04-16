import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgramHealthSection } from '../../../components/sections/ProgramHealthSection';
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

describe('ProgramHealthSection', () => {
  it('renders Program Health section header', () => {
    render(<ProgramHealthSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText('Program Health')).toBeInTheDocument();
  });

  it('renders Retrieval Success Rate chart title', () => {
    render(<ProgramHealthSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText(/Retrieval Success Rate/)).toBeInTheDocument();
  });

  it('renders Quality Score by LOB chart title', () => {
    render(<ProgramHealthSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText(/Quality Score by LOB/)).toBeInTheDocument();
  });

  it('renders Incident Volume by Month chart title', () => {
    render(<ProgramHealthSection slicer={DEFAULT_SLICER} />);
    expect(screen.getByText(/Incident Volume by Month/)).toBeInTheDocument();
  });
});
