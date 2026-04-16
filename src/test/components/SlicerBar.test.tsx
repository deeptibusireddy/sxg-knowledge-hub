import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SlicerBar } from '../../components/common/SlicerBar';
import type { SlicerState } from '../../types';

const DEFAULT_STATE: SlicerState = {
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

describe('SlicerBar', () => {
  it('renders LOB dropdown with expected options', () => {
    render(<SlicerBar state={DEFAULT_STATE} onChange={vi.fn()} />);
    const lobSelect = screen.getByLabelText('Line of Business');
    expect(lobSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All LOBs' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'SCIM' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'A&I' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'MW' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'DAS' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Nebula' })).toBeInTheDocument();
  });

  it('changing LOB calls onChange with updated lob', async () => {
    const onChange = vi.fn();
    render(<SlicerBar state={DEFAULT_STATE} onChange={onChange} />);
    const lobSelect = screen.getByLabelText('Line of Business');
    await userEvent.selectOptions(lobSelect, 'SCIM');
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_STATE, lob: 'SCIM' });
  });

  it('renders date range dropdown with expected options', () => {
    render(<SlicerBar state={DEFAULT_STATE} onChange={vi.fn()} />);
    const dateSelect = screen.getByLabelText('Date Range');
    expect(dateSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Last 7 days' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Last 30 days' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Last 90 days' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All time' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Custom range...' })).toBeInTheDocument();
  });

  it('shows dateFrom and dateTo inputs when dateRange is custom', () => {
    render(<SlicerBar state={{ ...DEFAULT_STATE, dateRange: 'custom' }} onChange={vi.fn()} />);
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
  });

  it('hides date inputs when dateRange is not custom', () => {
    render(<SlicerBar state={DEFAULT_STATE} onChange={vi.fn()} />);
    expect(screen.queryByLabelText('From')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('To')).not.toBeInTheDocument();
  });

  it('Clear All button resets state to defaults', async () => {
    const onChange = vi.fn();
    const activeState: SlicerState = { ...DEFAULT_STATE, lob: 'SCIM', user: 'alice' };
    render(<SlicerBar state={activeState} onChange={onChange} />);
    const clearBtn = screen.getByText(/Clear all/i);
    await userEvent.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith(DEFAULT_STATE);
  });

  it('renders audience dropdown', () => {
    render(<SlicerBar state={DEFAULT_STATE} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Audience')).toBeInTheDocument();
  });

  it('renders dataSource dropdown', () => {
    render(<SlicerBar state={DEFAULT_STATE} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Data Source')).toBeInTheDocument();
  });

  it('renders business dropdown', () => {
    render(<SlicerBar state={DEFAULT_STATE} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Business')).toBeInTheDocument();
  });

  it('user search input calls onChange with updated user value', async () => {
    const onChange = vi.fn();
    render(<SlicerBar state={DEFAULT_STATE} onChange={onChange} />);
    const userInput = screen.getByPlaceholderText('Filter by user...');
    fireEvent.change(userInput, { target: { value: 'alice' } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_STATE, user: 'alice' });
  });
});
