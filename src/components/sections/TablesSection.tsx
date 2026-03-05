import { useMemo } from 'react';
import type { SlicerState, BlockedArticleRow, IncidentRow } from '../../types';
import { DataTable } from '../common/DataTable';
import type { Column } from '../common/DataTable';
import { blockedArticles, recentIncidents } from '../../data/mockTables';
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

export function TablesSection({ slicer }: Props) {
  const filteredBlocked = useMemo(() => {
    let rows = blockedArticles;
    if (slicer.lob !== 'all') rows = rows.filter(r => r.lob === slicer.lob);
    return rows;
  }, [slicer.lob]);

  const filteredIncidents = useMemo(() => {
    let rows = recentIncidents;
    if (slicer.lob !== 'all') rows = rows.filter(r => r.lob === slicer.lob);
    if (slicer.severity !== 'all') rows = rows.filter(r => r.severity === slicer.severity);
    return rows;
  }, [slicer.lob, slicer.severity]);

  return (
    <div>
      <SectionHeader
        title="Detailed Data"
        subtitle="Blocked articles and open incidents requiring attention"
      />
      <div className="tables-section">
        <div className="surface chart-wrapper tables-section__table">
          <p className="chart-title">Top Blocked Articles</p>
          <DataTable columns={BLOCKED_COLS} rows={filteredBlocked} emptyMessage="No blocked articles for selected filters" />
        </div>
        <div className="surface chart-wrapper tables-section__table">
          <p className="chart-title">Recent Incidents</p>
          <DataTable columns={INCIDENT_COLS} rows={filteredIncidents} emptyMessage="No incidents for selected filters" />
        </div>
      </div>
    </div>
  );
}
