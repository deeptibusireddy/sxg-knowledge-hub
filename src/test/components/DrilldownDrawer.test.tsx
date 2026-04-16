import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DrilldownDrawer } from '../../components/common/DrilldownDrawer';
import type { DrilldownContent } from '../../components/common/DrilldownDrawer';

vi.mock('../../utils/exportCsv', () => ({
  exportToCsv: vi.fn(),
}));

const content: DrilldownContent = {
  title: 'Azure — Blocked Articles',
  subtitle: '4 articles currently blocked',
  columns: [
    { key: 'article', header: 'Article' },
    { key: 'reason', header: 'Reason' },
  ],
  rows: [
    { id: 'r1', article: 'Azure AD Guide', reason: 'Missing tag' },
    { id: 'r2', article: 'Azure Cost Management', reason: 'PII detected' },
  ],
};

describe('DrilldownDrawer', () => {
  it('renders nothing meaningful when content is null', () => {
    const { container } = render(<DrilldownDrawer content={null} onClose={vi.fn()} />);
    // drawer exists but has no visible content
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(container.querySelector('.drilldown-drawer--open')).not.toBeInTheDocument();
  });

  it('renders title when content is provided', () => {
    render(<DrilldownDrawer content={content} onClose={vi.fn()} />);
    expect(screen.getByText('Azure — Blocked Articles')).toBeInTheDocument();
  });

  it('renders subtitle when content is provided', () => {
    render(<DrilldownDrawer content={content} onClose={vi.fn()} />);
    expect(screen.getByText('4 articles currently blocked')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<DrilldownDrawer content={content} onClose={vi.fn()} />);
    expect(screen.getByText('Article')).toBeInTheDocument();
    expect(screen.getByText('Reason')).toBeInTheDocument();
  });

  it('renders row values', () => {
    render(<DrilldownDrawer content={content} onClose={vi.fn()} />);
    expect(screen.getByText('Azure AD Guide')).toBeInTheDocument();
    expect(screen.getByText('Missing tag')).toBeInTheDocument();
  });

  it('shows Export CSV button when rows are present', () => {
    render(<DrilldownDrawer content={content} onClose={vi.fn()} />);
    expect(screen.getByTitle('Export to CSV')).toBeInTheDocument();
  });

  it('calls onClose when close button (✕) is clicked', async () => {
    const onClose = vi.fn();
    render(<DrilldownDrawer content={content} onClose={onClose} />);
    const closeBtn = screen.getByLabelText('Close');
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn();
    render(<DrilldownDrawer content={content} onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(<DrilldownDrawer content={content} onClose={onClose} />);
    const backdrop = container.querySelector('.drilldown-backdrop');
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
