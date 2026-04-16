/**
 * SchemaExplorer — dev-only tool that browses ADLS paths and previews
 * Parquet file columns so you can map them to dashboard data domains.
 */
import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { ADLS_SCOPES } from '../../auth/msalConfig';
import { ADLS_CONFIG, ADLS_PATHS } from '../../config';
import { listAdlsFiles, readParquetDir, type AdlsFileItem } from '../../services/adlsService';
import './SchemaExplorer.css';

interface PathResult {
  key: string;
  path: string;
  files: AdlsFileItem[];
  columns: string[];
  sampleRows: Record<string, unknown>[];
  error?: string;
}

export function SchemaExplorer() {
  const { instance, accounts } = useMsal();
  const [results, setResults]   = useState<PathResult[]>([]);
  const [loading, setLoading]   = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const signedIn = accounts.length > 0;

  async function loadSchemas() {
    setLoading(true);
    setResults([]);

    const entries = Object.entries(ADLS_PATHS).filter(([, p]) => p.trim());
    const settled = await Promise.allSettled(
      entries.map(async ([key, path]): Promise<PathResult> => {
        const files = await listAdlsFiles(instance, path);
        const sampleRows = await readParquetDir(instance, path, 1);
        const columns = sampleRows.length > 0 ? Object.keys(sampleRows[0]) : [];
        return { key, path, files, columns, sampleRows: sampleRows.slice(0, 3) };
      }),
    );

    setResults(
      settled.map((r, i) =>
        r.status === 'fulfilled'
          ? r.value
          : {
              key:        entries[i][0],
              path:       entries[i][1],
              files:      [],
              columns:    [],
              sampleRows: [],
              error: String((r.reason as Error)?.message ?? r.reason),
            },
      ),
    );
    setLoading(false);
  }

  function toggle(key: string) {
    setExpanded(p => ({ ...p, [key]: !p[key] }));
  }

  function copyColumns(r: PathResult) {
    navigator.clipboard.writeText(r.columns.map(c => `"${c}"`).join(', '));
  }

  return (
    <div className="schema-explorer">
      <div className="schema-explorer__header">
        <h1>ADLS Schema Explorer</h1>
        <p>
          Account: <code>{ADLS_CONFIG.account}</code> &nbsp;·&nbsp;
          Filesystem: <code>{ADLS_CONFIG.filesystem}</code>
        </p>
        <p style={{ color: '#605e5c', fontSize: 12 }}>
          Discovers Parquet column names for each configured ADLS path so you can map them to dashboard sections.
        </p>

        {!signedIn ? (
          <button
            className="schema-btn schema-btn--primary"
            onClick={() => instance.loginPopup({ scopes: ADLS_SCOPES })}
          >
            Sign in with Microsoft
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#605e5c' }}>
              Signed in as <strong>{accounts[0].name ?? accounts[0].username}</strong>
            </span>
            <button className="schema-btn schema-btn--primary" onClick={loadSchemas} disabled={loading}>
              {loading ? 'Loading…' : 'Load all schemas'}
            </button>
            <button className="schema-btn" onClick={() => instance.logoutPopup()}>Sign out</button>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="schema-explorer__datasets">
          {results.map(r => (
            <div key={r.key} className={`schema-card${r.error ? ' schema-card--error' : ''}`}>
              <div className="schema-card__title" onClick={() => toggle(r.key)}>
                <span className="schema-card__arrow">{expanded[r.key] ? '▼' : '▶'}</span>
                <strong>{r.key}</strong>
                <code className="schema-card__id">{r.path}</code>
                {r.error
                  ? <span className="schema-card__err">⚠ {r.error}</span>
                  : <span className="schema-card__count">{r.files.length} files · {r.columns.length} columns</span>}
                {!r.error && r.columns.length > 0 && (
                  <button
                    className="schema-btn schema-btn--sm"
                    onClick={e => { e.stopPropagation(); copyColumns(r); }}
                    title="Copy column names"
                  >Copy columns</button>
                )}
              </div>

              {expanded[r.key] && !r.error && (
                <div className="schema-card__body">
                  <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#605e5c' }}>
                    Files ({r.files.length})
                  </p>
                  <ul style={{ margin: '0 0 12px', padding: '0 0 0 16px', fontSize: 11 }}>
                    {r.files.slice(0, 10).map(f => (
                      <li key={f.name} style={{ marginBottom: 2 }}>
                        <code>{f.name.split('/').pop()}</code>
                        <span style={{ color: '#a19f9d', marginLeft: 8 }}>
                          {(f.contentLength / 1024).toFixed(0)} KB
                        </span>
                      </li>
                    ))}
                    {r.files.length > 10 && <li style={{ color: '#a19f9d' }}>…and {r.files.length - 10} more</li>}
                  </ul>

                  {r.columns.length > 0 && (
                    <>
                      <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#605e5c' }}>
                        Columns ({r.columns.length})
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {r.columns.map(c => (
                          <code key={c} style={{ fontSize: 11, background: '#f3f2f1', padding: '2px 6px', borderRadius: 3, color: '#ca5010' }}>
                            {c}
                          </code>
                        ))}
                      </div>
                    </>
                  )}

                  {r.sampleRows.length > 0 && (
                    <>
                      <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 600, color: '#605e5c' }}>
                        Sample rows (first 3)
                      </p>
                      <div style={{ overflowX: 'auto' }}>
                        <table className="schema-table__cols">
                          <thead>
                            <tr>{r.columns.map(c => <th key={c}>{c}</th>)}</tr>
                          </thead>
                          <tbody>
                            {r.sampleRows.map((row, i) => (
                              <tr key={i}>
                                {r.columns.map(c => (
                                  <td key={c}><code>{String(row[c] ?? '')}</code></td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
