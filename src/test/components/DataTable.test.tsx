import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '../../components/common/DataTable';

vi.mock('../../utils/exportCsv', () => ({
  exportToCsv: vi.fn(),
}));

import { exportToCsv } from '../../utils/exportCsv';

interface TestRow {
  id: string;
  name: string;
  score: number;
}

const columns = [
  { key: 'name' as keyof TestRow, header: 'Name' },
  { key: 'score' as keyof TestRow, header: 'Score' },
];

const rows: TestRow[] = [
  { id: '1', name: 'Alice', score: 90 },
  { id: '2', name: 'Bob', score: 80 },
  { id: '3', name: 'Carol', score: 70 },
];

describe('DataTable', () => {
  beforeEach(() => {
    vi.mocked(exportToCsv).mockClear();
  });

  it('renders column headers', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
  });

  it('renders row data', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('shows emptyMessage when rows is empty', () => {
    render(<DataTable columns={columns} rows={[]} emptyMessage="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('shows Export CSV button when exportFilename is provided', () => {
    render(<DataTable columns={columns} rows={rows} exportFilename="data.csv" />);
    expect(screen.getByText(/Export CSV/)).toBeInTheDocument();
  });

  it('does NOT show export button when exportFilename is omitted', () => {
    render(<DataTable columns={columns} rows={rows} />);
    expect(screen.queryByText(/Export CSV/)).not.toBeInTheDocument();
  });

  it('Export button click calls exportToCsv', () => {
    render(<DataTable columns={columns} rows={rows} exportFilename="data.csv" />);
    fireEvent.click(screen.getByText(/Export CSV/));
    expect(exportToCsv).toHaveBeenCalledOnce();
    expect(exportToCsv).toHaveBeenCalledWith('data.csv', expect.any(Array), rows);
  });

  it('shows row count in export button label', () => {
    render(<DataTable columns={columns} rows={rows} exportFilename="data.csv" />);
    expect(screen.getByText(/Export CSV \(3\)/)).toBeInTheDocument();
  });
});
