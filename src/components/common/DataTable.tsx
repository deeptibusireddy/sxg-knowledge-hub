import { exportToCsv } from '../../utils/exportCsv';
import './DataTable.css';

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface Props<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
  exportFilename?: string;
}

export function DataTable<T extends { id: string }>({
  columns, rows, emptyMessage = 'No data', exportFilename,
}: Props<T>) {
  const handleExport = () => {
    exportToCsv(
      exportFilename!,
      columns.map(c => ({ key: c.key, header: c.header })),
      rows,
    );
  };

  return (
    <div className="data-table-wrapper">
      {exportFilename && (
        <div className="data-table__toolbar">
          <button
            className="data-table__export-btn"
            onClick={handleExport}
            disabled={rows.length === 0}
            title={`Export ${rows.length} rows to CSV`}
          >
            ↓ Export CSV{rows.length > 0 ? ` (${rows.length})` : ''}
          </button>
        </div>
      )}
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.key)}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="data-table__empty">{emptyMessage}</td>
            </tr>
          ) : (
            rows.map(row => (
              <tr key={row.id}>
                {columns.map(col => (
                  <td key={String(col.key)}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
