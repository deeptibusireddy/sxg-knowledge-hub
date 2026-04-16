import { useMemo } from 'react';
import type { SlicerState, BlockedArticleRow, IncidentRow, AdoWorkItemRow } from '../../types';
import { useData } from '../../contexts/DataContext';
import { DataTable } from '../common/DataTable';
import type { Column } from '../common/DataTable';
import { SectionHeader } from '../common/SectionHeader';
import '../common/DataTable.css';
import './TablesSection.css';

interface Props { slicer: SlicerState; }

const BLOCKED_COLS: Column<BlockedArticleRow>[] = [
  { key: 'article', header: 'Article' },
  { key: 'lob',     header: 'LOB' },
  { key: 'owner',   header: 'Owner' },
  { key: 'reason',  header: 'Block Reason' },
  {
    key: 'ageDays',
    header: 'Age',
    render: (v) => `${v}d`,
  },
];

const INCIDENT_COLS: Column<IncidentRow>[] = [
  { key: 'id',       header: 'Incident' },
  { key: 'lob',      header: 'LOB' },
  {
    key: 'severity',
    header: 'Severity',
    render: (v) => (
      <span className={`severity-badge severity-badge--${v}`}>{String(v)}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (v) => (
      <span className={`status-badge status-badge--${String(v).replace(' ', '\\ ')}`}>{String(v)}</span>
    ),
  },
  { key: 'opened',  header: 'Opened' },
  { key: 'summary', header: 'Summary' },
];

const ADO_STATE_CLASS: Record<string, string> = {
  'Active':   'active',
  'Resolved': 'resolved',
  'Closed':   'closed',
  'New':      'new',
};

const ADO_COLS: Column<AdoWorkItemRow>[] = [
  {
    key: 'id',
    header: 'ID',
    render: (v, row) => (
      <a
        href={(row as AdoWorkItemRow).url}
        target="_blank"
        rel="noreferrer"
        className="ado-id-link"
      >
        #{String(v)}
      </a>
    ),
  },
  { key: 'title',       header: 'Title' },
  { key: 'type',        header: 'Type' },
  {
    key: 'state',
    header: 'State',
    render: (v) => {
      const cls = ADO_STATE_CLASS[String(v)] ?? 'unknown';
      return <span className={`ado-state-badge ado-state-badge--${cls}`}>{String(v)}</span>;
    },
  },
  { key: 'assignedTo',   header: 'Assigned To' },
  { key: 'createdDate',  header: 'Created' },
];

export function TablesSection({ slicer }: Props) {
  const { blockedArticles, recentIncidents, adoWorkItems } = useData();

  const filteredBlocked = useMemo(() => {
    let rows = blockedArticles;
    if (slicer.lob !== 'all') rows = rows.filter(r => r.lob === slicer.lob);
    return rows;
  }, [blockedArticles, slicer.lob]);

  const filteredIncidents = useMemo(() => {
    let rows = recentIncidents;
    if (slicer.lob !== 'all') rows = rows.filter(r => r.lob === slicer.lob);
    return rows;
  }, [recentIncidents, slicer.lob]);

  return (
    <div>
      <SectionHeader
        title="Detailed Data"
        subtitle="Blocked articles, open incidents, and submitted work items"
      />
      <div className="tables-section">
        <div className="surface chart-wrapper tables-section__table">
          <p className="chart-title">Top Blocked Articles</p>
          <DataTable columns={BLOCKED_COLS} rows={filteredBlocked} emptyMessage="No blocked articles for selected filters" exportFilename="blocked-articles.csv" />
        </div>
        <div className="surface chart-wrapper tables-section__table">
          <p className="chart-title">Recent Incidents</p>
          <DataTable columns={INCIDENT_COLS} rows={filteredIncidents} emptyMessage="No incidents for selected filters" exportFilename="incidents.csv" />
        </div>
      </div>

      <div className="tables-section tables-section--full-width" style={{ marginTop: '1rem' }}>
        <div className="surface chart-wrapper">
          <p className="chart-title">ADO Work Items</p>
          <p className="chart-subtitle">Work items submitted from this dashboard — refreshed daily</p>
          <DataTable
            columns={ADO_COLS}
            rows={adoWorkItems}
            emptyMessage="No work items yet. Items created from this dashboard will appear here after the next daily refresh."
            exportFilename="ado-work-items.csv"
          />
        </div>
      </div>
    </div>
  );
}
