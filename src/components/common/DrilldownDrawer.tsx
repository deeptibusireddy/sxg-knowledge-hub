import { useEffect, useMemo, useState } from 'react';
import { exportToCsv } from '../../utils/exportCsv';
import './DrilldownDrawer.css';

export interface DrilldownRow { id: string; [key: string]: string | number; }

export interface DrilldownContent {
  title: string;
  subtitle?: string;
  columns: Array<{ key: string; header: string }>;
  rows: DrilldownRow[];
  rowDrilldown?: (row: DrilldownRow) => DrilldownContent | null;
}

interface Props {
  content: DrilldownContent | null;
  onClose: () => void;
}

export function DrilldownDrawer({ content, onClose }: Props) {
  const [stack, setStack] = useState<DrilldownContent[]>([]);

  useEffect(() => {
    if (content) setStack([content]);
    else setStack([]);
  }, [content]);

  const current = stack[stack.length - 1] ?? null;
  const canGoBack = stack.length > 1;

  useEffect(() => {
    if (!content) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [content, onClose]);

  // Pre-compute which rows have second-level detail so we only call rowDrilldown once per row
  const rowDetails = useMemo(() => {
    if (!current?.rowDrilldown) return null;
    const fn = current.rowDrilldown;
    return new Map(current.rows.map(row => [row.id, fn(row)]));
  }, [current]);

  const handleRowClick = (row: DrilldownRow) => {
    const next = rowDetails?.get(row.id);
    if (next) setStack(s => [...s, next]);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drilldown-backdrop${content ? ' drilldown-backdrop--visible' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className={`drilldown-drawer${content ? ' drilldown-drawer--open' : ''}`} aria-label="Drilldown detail">
        {current && (
          <>
            <div className="drilldown-drawer__header">
              <div className="drilldown-drawer__titles">
                {canGoBack && (
                  <button className="drilldown-drawer__back" onClick={() => setStack(s => s.slice(0, -1))}>
                    ← Back
                  </button>
                )}
                <h3 className="drilldown-drawer__title">{current.title}</h3>
                {current.subtitle && <p className="drilldown-drawer__subtitle">{current.subtitle}</p>}
              </div>
              <div className="drilldown-drawer__actions">
                {current.rows.length > 0 && (
                  <button
                    className="drilldown-drawer__export"
                    onClick={() => exportToCsv('drilldown.csv', current.columns, current.rows)}
                    title="Export to CSV"
                  >
                    ↓ CSV
                  </button>
                )}
                <button className="drilldown-drawer__close" onClick={onClose} aria-label="Close">✕</button>
              </div>
            </div>

            <div className="drilldown-drawer__count">
              {current.rows.length} row{current.rows.length !== 1 ? 's' : ''}
              {rowDetails && <span className="drilldown-drawer__clickable-hint"> · Click a row to drill in</span>}
            </div>

            <div className="drilldown-drawer__body">
              {current.rows.length === 0 ? (
                <p className="drilldown-drawer__empty">No detail data available for this selection.</p>
              ) : (
                <table className="drilldown-drawer__table">
                  <thead>
                    <tr>
                      {current.columns.map(col => <th key={col.key}>{col.header}</th>)}
                      {rowDetails && <th className="drilldown-drawer__th-drill" />}
                    </tr>
                  </thead>
                  <tbody>
                    {current.rows.map(row => {
                      const hasDetail = !!rowDetails?.get(row.id);
                      return (
                        <tr
                          key={row.id}
                          className={hasDetail ? 'drilldown-drawer__row--clickable' : ''}
                          onClick={hasDetail ? () => handleRowClick(row) : undefined}
                          tabIndex={hasDetail ? 0 : undefined}
                          onKeyDown={hasDetail ? (e) => { if (e.key === 'Enter') handleRowClick(row); } : undefined}
                        >
                          {current.columns.map(col => (
                            <td key={col.key}>{String(row[col.key] ?? '')}</td>
                          ))}
                          {rowDetails && (
                            <td className="drilldown-drawer__td-drill">{hasDetail ? '›' : ''}</td>
                          )}
                        </tr>
                      );
                    })}
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
