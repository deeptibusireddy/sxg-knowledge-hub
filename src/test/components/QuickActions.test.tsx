import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuickActions } from '../../components/common/QuickActions';

describe('QuickActions', () => {
  it('renders all 6 buttons', () => {
    render(<QuickActions />);
    expect(screen.getByText('Content Ingestion Request')).toBeInTheDocument();
    expect(screen.getByText('Content Removal Request')).toBeInTheDocument();
    expect(screen.getByText('Give Feedback')).toBeInTheDocument();
    expect(screen.getByText('Feature Request')).toBeInTheDocument();
    expect(screen.getByText('New Partner Onboarding')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Bot')).toBeInTheDocument();
  });

  describe('Content Ingestion Request modal', () => {
    it('opens modal with correct title', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Content Ingestion Request'));
      expect(screen.getAllByText('Knowledge Agent Onboarding Request').length).toBeGreaterThan(0);
    });

    it('modal has Team Name input', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Content Ingestion Request'));
      expect(screen.getByPlaceholderText(/Surface – Device Support/)).toBeInTheDocument();
    });

    it('modal has Agent Type select', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Content Ingestion Request'));
      expect(screen.getByRole('option', { name: 'AAQ' })).toBeInTheDocument();
    });

    it('modal has Excel file input', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Content Ingestion Request'));
      const fileInput = document.querySelector('input[type="file"][accept=".xlsx,.xls"]');
      expect(fileInput).toBeInTheDocument();
    });

    it('Submit button is disabled when required fields are empty', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Content Ingestion Request'));
      const submitBtn = screen.getByText('Submit Request');
      expect(submitBtn).toBeDisabled();
    });

    it('closing modal with ✕ button hides it', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Content Ingestion Request'));
      const closeBtn = screen.getByLabelText('Close');
      await userEvent.click(closeBtn);
      expect(screen.queryByText('Submit Request')).not.toBeInTheDocument();
    });
  });

  describe('Content Removal Request modal', () => {
    it('opens modal with correct title', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Content Removal Request'));
      expect(screen.getAllByText('Content Removal Request').length).toBeGreaterThan(0);
    });

    it('has article textarea', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Content Removal Request'));
      expect(screen.getByPlaceholderText(/Paste one article per line/)).toBeInTheDocument();
    });

    it('has file upload', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Content Removal Request'));
      const fileInput = document.querySelector('input[type="file"][accept=".xlsx,.xls,.csv"]');
      expect(fileInput).toBeInTheDocument();
    });
  });

  describe('Give Feedback modal', () => {
    it('opens modal with category select', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Give Feedback'));
      expect(screen.getByRole('option', { name: 'Content Quality' })).toBeInTheDocument();
    });

    it('has subject input', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Give Feedback'));
      expect(screen.getByPlaceholderText(/Brief summary of your feedback/)).toBeInTheDocument();
    });

    it('has feedback textarea', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Give Feedback'));
      expect(screen.getByPlaceholderText(/What's working well/)).toBeInTheDocument();
    });

    it('Submit disabled when subject/feedback are empty', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Give Feedback'));
      expect(screen.getByText('Send Feedback')).toBeDisabled();
    });
  });

  describe('Feature Request modal', () => {
    it('opens modal with Title input', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Feature Request'));
      expect(screen.getByPlaceholderText('Short name for the feature')).toBeInTheDocument();
    });

    it('has One-Sentence Description input', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Feature Request'));
      expect(screen.getByPlaceholderText(/Scope, work, and outcome in one sentence/)).toBeInTheDocument();
    });

    it('Submit disabled when required fields are empty', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Feature Request'));
      expect(screen.getByText('Submit Request')).toBeDisabled();
    });
  });

  describe('New Partner Onboarding modal', () => {
    it('opens modal with calling method radio buttons', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('New Partner Onboarding'));
      const radios = screen.getAllByRole('radio');
      expect(radios.length).toBeGreaterThanOrEqual(2);
    });

    it('shows NPA Account field when V2 method is selected', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('New Partner Onboarding'));
      // V2 is selected by default
      expect(screen.getByPlaceholderText(/NPA account/i)).toBeInTheDocument();
    });

    it('shows MCP Access field when MCP method is selected', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('New Partner Onboarding'));
      const mcpRadio = screen.getByDisplayValue('mcp');
      fireEvent.click(mcpRadio);
      expect(screen.getByText('MCP Access Obtained?')).toBeInTheDocument();
    });
  });

  describe('Knowledge Bot modal', () => {
    it('opens modal with Coming Soon heading', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Knowledge Bot'));
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });

    it('shows Open in Teams link when TEAMS_BOT_URL is set', async () => {
      render(<QuickActions />);
      await userEvent.click(screen.getByText('Knowledge Bot'));
      expect(screen.getByText(/Open in Teams/i)).toBeInTheDocument();
    });
  });

  it('clicking overlay backdrop closes modal', async () => {
    render(<QuickActions />);
    await userEvent.click(screen.getByText('Give Feedback'));
    expect(screen.getByText('Send Feedback')).toBeInTheDocument();
    const overlay = document.querySelector('.qa-overlay');
    expect(overlay).toBeInTheDocument();
    // Click directly on the overlay (not its children)
    fireEvent.click(overlay!);
    expect(screen.queryByText('Send Feedback')).not.toBeInTheDocument();
  });
});
