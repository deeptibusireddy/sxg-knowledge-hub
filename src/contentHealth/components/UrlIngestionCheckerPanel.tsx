import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Textarea } from '@fluentui/react-components';
import { ChPanel } from './ChPanel';

/**
 * Mock of the IngestionStatusCheck tool (c:\Source\IngestionStatusCheck).
 *
 * Faithful behavior emulated:
 *  - Two input modes: paste (one URL per line) and CSV/TXT upload.
 *  - URL normalization: https prefix, lowercased host, tracking params
 *    stripped, query keys sorted, trailing slash removed.
 *  - GUID extraction.
 *  - Match priority:
 *      1. Exact normalized match in blocked set
 *      2. Exact normalized match in ingested set
 *      3. ADO wiki page-ID cross-format match
 *      4. GUID scan against blocked/ingested
 *      5. Missing
 *  - Results: Found / Blocked / Missing / Total summary + per-URL table
 *    with URL · Status badge · Reason · GUIDs found.
 *
 * Synthetic database stands in for IngestedURLs.csv / BlockedURLs.csv.
 */

type Status = 'found' | 'blocked' | 'missing';

interface AuditRow {
  input: string;
  normalized: string;
  status: Status;
  reason: string;
  guids: string[];
}

const TRACKING_PREFIXES = ['utm_', 'mc_'];
const TRACKING_KEYS = new Set([
  'gclid', 'fbclid', 'msclkid', 'igshid', 'yclid', '_hsenc', '_hsmi',
]);
const GUID_RE = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;
const ADO_WIKI_RE = /https?:\/\/dev\.azure\.com\/([^/]+)\/[^/]+\/_wiki\/wikis\/[^/]+\/(\d+)/i;

function normalizeUrl(raw: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed) return '';
  let value = trimmed;
  if (!/^https?:\/\//i.test(value)) value = 'https://' + value;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return value.toLowerCase();
  }
  const params: Array<[string, string]> = [];
  parsed.searchParams.forEach((v, k) => {
    const lower = k.toLowerCase();
    if (TRACKING_PREFIXES.some((p) => lower.startsWith(p))) return;
    if (TRACKING_KEYS.has(lower)) return;
    params.push([k, v]);
  });
  params.sort(([a], [b]) => a.localeCompare(b));
  let normalized = `${parsed.protocol}//${parsed.host.toLowerCase()}${parsed.pathname}`;
  if (params.length > 0) {
    normalized += '?' + params.map(([k, v]) => (v === '' ? k : `${k}=${v}`)).join('&');
  }
  if (parsed.hash) normalized += parsed.hash;
  if (normalized.endsWith('/') && parsed.pathname === '/') {
    normalized = normalized.slice(0, -1);
  }
  return normalized.toLowerCase();
}

function extractGuids(url: string): string[] {
  return Array.from(new Set(url.match(GUID_RE) ?? []));
}

function adoWikiKey(url: string): [string, string] | null {
  const m = url.match(ADO_WIKI_RE);
  return m ? [m[1].toLowerCase(), m[2]] : null;
}

const INGESTED_URLS: string[] = [
  'https://learn.microsoft.com/en-us/azure/active-directory/overview',
  'https://learn.microsoft.com/en-us/azure/billing/subscription-overview',
  'https://learn.microsoft.com/en-us/intune/device-enrollment',
  'https://docs.microsoft.com/en-us/windows/release-info',
  'https://learn.microsoft.com/en-us/microsoft-365/copilot/scenarios',
  'https://internal.contoso.com/wiki/scim/identity-and-access',
  'https://dev.azure.com/contoso/CRM/_wiki/wikis/CRM.wiki/7975/onboarding',
  'https://dev.azure.com/contoso/CRM/_wiki/wikis/CRM.wiki/8120/billing-overview',
  'https://learn.microsoft.com/en-us/surface/firmware-update',
  'https://learn.microsoft.com/en-us/family-safety/setup',
  'https://content.microsoft.com/articles/a1b2c3d4-1111-2222-3333-444455556666',
  'https://content.microsoft.com/articles/b2c3d4e5-2222-3333-4444-555566667777',
];

const BLOCKED_URLS: string[] = [
  'https://learn.microsoft.com/en-us/legacy/deprecated-feature',
  'https://internal.contoso.com/wiki/draft/incomplete-page',
  'https://dev.azure.com/contoso/CRM/_wiki/wikis/CRM.wiki/9001/blocked-doc',
  'https://content.microsoft.com/articles/c3d4e5f6-3333-4444-5555-666677778888',
];

const ingestedSet = new Set(INGESTED_URLS.map(normalizeUrl));
const blockedSet = new Set(BLOCKED_URLS.map(normalizeUrl));
const adoIndex = new Map<string, Status>();
for (const u of INGESTED_URLS) {
  const k = adoWikiKey(normalizeUrl(u));
  if (k) adoIndex.set(`${k[0]}|${k[1]}`, 'found');
}
for (const u of BLOCKED_URLS) {
  const k = adoWikiKey(normalizeUrl(u));
  if (k) adoIndex.set(`${k[0]}|${k[1]}`, 'blocked');
}

function auditOne(input: string): AuditRow {
  const normalized = normalizeUrl(input);
  const guids = extractGuids(normalized);

  if (blockedSet.has(normalized)) {
    return { input, normalized, status: 'blocked', reason: 'URL is in blocked list', guids };
  }
  if (ingestedSet.has(normalized)) {
    return { input, normalized, status: 'found', reason: 'URL exists in ingested content', guids };
  }
  const k = adoWikiKey(normalized);
  if (k) {
    const dbStatus = adoIndex.get(`${k[0]}|${k[1]}`);
    if (dbStatus) {
      return {
        input,
        normalized,
        status: dbStatus,
        reason: `ADO wiki page ID match (page ${k[1]})`,
        guids,
      };
    }
  }
  if (guids.length > 0) {
    for (const guid of guids) {
      for (const blk of blockedSet) {
        if (blk.includes(guid)) {
          return { input, normalized, status: 'blocked', reason: `GUID match: ${guid}`, guids };
        }
      }
      for (const ing of ingestedSet) {
        if (ing.includes(guid)) {
          return { input, normalized, status: 'found', reason: `GUID match: ${guid}`, guids };
        }
      }
    }
  }
  return { input, normalized, status: 'missing', reason: 'URL not found in database', guids };
}

function auditMany(urls: string[]): AuditRow[] {
  return urls.map((u) => u.trim()).filter(Boolean).map(auditOne);
}

const STATUS_STYLES: Record<Status, { bg: string; fg: string; border: string; label: string }> = {
  found:   { bg: '#dff6dd', fg: '#0e700e', border: '#9fd89f', label: 'found' },
  blocked: { bg: '#fde7e9', fg: '#a4262c', border: '#f1bbbb', label: 'blocked' },
  missing: { bg: '#f3f2f1', fg: '#605e5c', border: '#d2d0ce', label: 'missing' },
};

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.border}`,
        textTransform: 'lowercase',
      }}
    >
      {s.label}
    </span>
  );
}

function SummaryCard({ label, count, status }: { label: string; count: number; status?: Status }) {
  const color = status ? STATUS_STYLES[status].fg : '#667eea';
  return (
    <div
      style={{
        flex: '1 1 110px',
        minWidth: 110,
        padding: '10px 14px',
        border: '1px solid #e1dfdd',
        borderRadius: 6,
        background: '#fff',
      }}
    >
      <div style={{ fontSize: 11, color: '#605e5c', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color }}>{count}</div>
    </div>
  );
}

type Mode = 'paste' | 'upload';

export function UrlIngestionCheckerPanel({ initialUrl = '' }: { initialUrl?: string }) {
  const [mode, setMode] = useState<Mode>('paste');
  const [text, setText] = useState(initialUrl);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<AuditRow[] | null>(null);
  const [running, setRunning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialUrl && initialUrl !== text) setText(initialUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  const counts = useMemo(() => {
    if (!results) return null;
    return {
      found:   results.filter((r) => r.status === 'found').length,
      blocked: results.filter((r) => r.status === 'blocked').length,
      missing: results.filter((r) => r.status === 'missing').length,
      total:   results.length,
    };
  }, [results]);

  function runAudit() {
    const urls = text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (urls.length === 0) return;
    setRunning(true);
    window.setTimeout(() => {
      setResults(auditMany(urls));
      setRunning(false);
    }, 350);
  }

  function clearAll() {
    setText('');
    setFileName(null);
    setResults(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result ?? '');
      const lines = raw.split(/\r?\n/).map((l) => {
        const cell = l.split(',')[0] ?? '';
        return cell.trim().replace(/^"(.*)"$/, '$1');
      }).filter(Boolean);
      const first = lines[0]?.toLowerCase() ?? '';
      const startList = (first.startsWith('http://') || first.startsWith('https://') || first.startsWith('www.'))
        ? lines : lines.slice(1);
      setText(startList.join('\n'));
      setMode('paste');
    };
    reader.readAsText(f);
  }

  function downloadCsv() {
    if (!results) return;
    const header = 'input,normalized,status,reason,guids\n';
    const body = results.map((r) =>
      [r.input, r.normalized, r.status, r.reason, r.guids.join(' ')]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([header + body], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ingestion-audit.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function copyResults() {
    if (!results) return;
    const lines = ['URL\tStatus\tReason\tGUIDs'];
    for (const r of results) {
      lines.push(`${r.input}\t${r.status}\t${r.reason}\t${r.guids.join(' ')}`);
    }
    navigator.clipboard?.writeText(lines.join('\n'));
  }

  return (
    <ChPanel
      title="URL Ingestion Checker"
      subtitle={
        <>
          Audit one or many URLs against the ingested + blocked databases.
          Wraps the existing IngestionStatusCheck tool. <em>(Mock dataset for demo.)</em>
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          gap: 18,
          padding: '8px 12px',
          background: '#f3f2f1',
          border: '1px solid #e1dfdd',
          borderRadius: 6,
          fontSize: 12,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <span>📊 Ingested URLs: <strong>{ingestedSet.size}</strong></span>
        <span>🚫 Blocked URLs: <strong>{blockedSet.size}</strong></span>
        <span style={{ marginLeft: 'auto', color: '#a19f9d' }}>Synthetic DB · production wires to live registry</span>
      </div>

      <div role="tablist" aria-label="Input mode" style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {(['paste', 'upload'] as const).map((m) => {
          const active = mode === m;
          return (
            <button
              key={m}
              role="tab"
              aria-selected={active}
              onClick={() => setMode(m)}
              style={{
                padding: '6px 12px',
                background: active ? '#fff' : '#f3f2f1',
                border: '1px solid #e1dfdd',
                borderBottom: active ? '1px solid #fff' : '1px solid #e1dfdd',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: active ? 600 : 400,
              }}
            >
              {m === 'paste' ? '📝 Paste URLs' : '📤 Upload CSV / TXT'}
            </button>
          );
        })}
      </div>

      {mode === 'paste' && (
        <div>
          <Textarea
            value={text}
            onChange={(_, d) => setText(d.value)}
            placeholder={'Paste one URL per line\nhttps://learn.microsoft.com/en-us/azure/...\nhttps://internal.contoso.com/wiki/...\nhttps://dev.azure.com/contoso/CRM/_wiki/wikis/CRM.wiki/7975'}
            style={{ width: '100%' }}
            textarea={{ style: { minHeight: 140, fontFamily: 'Consolas, monospace', fontSize: 12 } }}
            aria-label="URLs to audit"
          />
          <p style={{ fontSize: 11, color: '#605e5c', margin: '6px 0 0' }}>
            💡 One URL per line. Tracking params (utm_*, gclid, fbclid…) and trailing slashes are normalized.
            ADO wiki URLs match by page ID across formats.
          </p>
        </div>
      )}

      {mode === 'upload' && (
        <div>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              padding: 24,
              border: '2px dashed #c8c6c4',
              borderRadius: 6,
              textAlign: 'center',
              cursor: 'pointer',
              background: '#faf9f8',
            }}
          >
            <div style={{ fontSize: 24 }}>📁</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Click to choose a CSV or TXT file</div>
            <div style={{ fontSize: 11, color: '#605e5c', marginTop: 4 }}>One URL per line · header row auto-detected</div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt"
            style={{ display: 'none' }}
            onChange={onFile}
          />
          {fileName && (
            <p style={{ fontSize: 12, marginTop: 8, color: '#0078d4' }}>
              ✓ Loaded <strong>{fileName}</strong> — switch back to "Paste URLs" tab to review and run.
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button appearance="primary" onClick={runAudit} disabled={!text.trim() || running}>
          {running ? 'Running…' : '🔍 Run Audit'}
        </Button>
        <Button appearance="secondary" onClick={clearAll} disabled={running}>
          Clear
        </Button>
      </div>

      {results && counts && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Audit Results</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <SummaryCard label="Found" count={counts.found} status="found" />
            <SummaryCard label="Blocked" count={counts.blocked} status="blocked" />
            <SummaryCard label="Missing" count={counts.missing} status="missing" />
            <SummaryCard label="Total" count={counts.total} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <Button size="small" appearance="secondary" onClick={copyResults}>Copy</Button>
            <Button size="small" appearance="secondary" onClick={downloadCsv}>Download CSV</Button>
          </div>
          <div style={{ overflowX: 'auto', border: '1px solid #e1dfdd', borderRadius: 6 }}>
            <table className="ch-table" style={{ width: '100%', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>URL</th>
                  <th style={{ textAlign: 'left' }}>Status</th>
                  <th style={{ textAlign: 'left' }}>Reason</th>
                  <th style={{ textAlign: 'left' }}>GUIDs Found</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={`${r.input}-${i}`}>
                    <td style={{ wordBreak: 'break-all', maxWidth: 380 }} title={r.normalized}>
                      {r.input}
                    </td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>{r.reason}</td>
                    <td style={{ fontFamily: 'Consolas, monospace', fontSize: 11 }}>
                      {r.guids.length > 0 ? r.guids.join(', ') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11, color: '#a19f9d', marginTop: 8 }}>
            Mock dataset · production wires to the existing IngestionStatusCheck tool (ingested + blocked URL registries).
          </p>
        </div>
      )}
    </ChPanel>
  );
}
