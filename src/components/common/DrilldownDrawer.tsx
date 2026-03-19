import { useEffect } from 'react';
import { exportToCsv } from '../../utils/exportCsv';
import './DrilldownDrawer.css';

export interface DrilldownRow { id: string; [key: string]: string | number; }

export interface DrilldownContent {
  title: string;
  subtitle?: string;
  columns: Array<{ key: string; header: string }>;
  rows: DrilldownRow[];
}

interface Props {
  content: DrilldownContent | null;
  onClose: () => void;
}

export function DrilldownDrawer({ content, onClose }: Props) {
  useEffect(() => {
    if (!content) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [content, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drilldown-backdrop${content ? ' drilldown-backdrop--visible' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`drilldown-drawer${content ? ' drilldown-drawer--open' : ''}`} aria-label="Drilldown detail">
        {content && (
          <>
            <div className="drilldown-drawer__header">
              <div className="drilldown-drawer__titles">
                <h3 className="drilldown-drawer__title">{content.title}</h3>
                {content.subtitle && <p className="drilldown-drawer__subtitle">{content.subtitle}</p>}
              </div>
              <div className="drilldown-drawer__actions">
                {content.rows.length > 0 && (
                  <button
                    className="drilldown-drawer__export"
                    onClick={() => exportToCsv('drilldown.csv', content.columns, content.rows)}
                    title="Export to CSV"
                  >
                    ↓ CSV
                  </button>
                )}
                <button className="drilldown-drawer__close" onClick={onClose} aria-label="Close">✕</button>
              </div>
            </div>

            <div className="drilldown-drawer__count">
              {content.rows.length} row{content.rows.length !== 1 ? 's' : ''}
            </div>

            <div className="drilldown-drawer__body">
              {content.rows.length === 0 ? (
                <p className="drilldown-drawer__empty">No detail data available for this selection.</p>
              ) : (
                <table className="drilldown-drawer__table">
                  <thead>
                    <tr>
                      {content.columns.map(col => (
                        <th key={col.key}>{col.header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {content.rows.map(row => (
                      <tr key={row.id}>
                        {content.columns.map(col => (
                          <td key={col.key}>{String(row[col.key] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
