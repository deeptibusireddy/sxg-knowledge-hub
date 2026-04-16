/**
 * Azure Data Lake Storage Gen2 service.
 *
 * Uses the user's own credentials via Azure Storage user_impersonation scope —
 * no admin consent required, just the user's existing ADLS access.
 *
 * API reference: https://learn.microsoft.com/en-us/rest/api/storageservices/datalakestoragegen2/filesystem
 */
import type { IPublicClientApplication } from '@azure/msal-browser';
import { ADLS_SCOPES } from '../auth/msalConfig';
import { ADLS_CONFIG } from '../config';

const { account, filesystem } = ADLS_CONFIG;
const BASE = `https://${account}.dfs.core.windows.net`;

export interface AdlsFileItem {
  name: string;
  contentLength: number;
  lastModified: string;
  isDirectory: boolean;
}

async function getToken(msalInstance: IPublicClientApplication): Promise<string> {
  const accounts = msalInstance.getAllAccounts();
  try {
    const r = await msalInstance.acquireTokenSilent({
      scopes: ADLS_SCOPES,
      account: accounts[0],
    });
    return r.accessToken;
  } catch {
    const r = await msalInstance.acquireTokenPopup({ scopes: ADLS_SCOPES });
    return r.accessToken;
  }
}

/** List files (non-recursive) at a path within the configured filesystem. */
export async function listAdlsFiles(
  msalInstance: IPublicClientApplication,
  path: string,
): Promise<AdlsFileItem[]> {
  const token = await getToken(msalInstance);
  // Strip leading slash; path is relative to the filesystem root
  const dir = path.replace(/^\//, '').replace(new RegExp(`^${filesystem}/?`), '');

  const url = new URL(`${BASE}/${filesystem}`);
  url.searchParams.set('resource', 'filesystem');
  url.searchParams.set('recursive', 'false');
  url.searchParams.set('directory', dir);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`ADLS list error ${res.status}: ${res.statusText}`);

  const json = await res.json();
  return (json.paths ?? []).map((p: Record<string, string>) => ({
    name:          p.name,
    contentLength: Number(p.contentLength ?? 0),
    lastModified:  p.lastModified ?? '',
    isDirectory:   p.isDirectory === 'true',
  }));
}

/** Download a file as an ArrayBuffer. */
export async function readAdlsFile(
  msalInstance: IPublicClientApplication,
  filePath: string,
): Promise<ArrayBuffer> {
  const token = await getToken(msalInstance);
  const path = filePath.replace(/^\//, '').replace(new RegExp(`^${filesystem}/?`), '');

  const res = await fetch(`${BASE}/${filesystem}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`ADLS read error ${res.status}: ${res.statusText}`);
  return res.arrayBuffer();
}

/**
 * Read all Parquet files in a directory and return merged rows as plain objects.
 * Uses parquet-wasm for browser-based Parquet parsing.
 */
export async function readParquetDir(
  msalInstance: IPublicClientApplication,
  dirPath: string,
  maxFiles = 5,
): Promise<Record<string, unknown>[]> {
  const files = await listAdlsFiles(msalInstance, dirPath);
  const parquetFiles = files
    .filter(f => !f.isDirectory && f.name.endsWith('.parquet'))
    .slice(0, maxFiles);

  if (parquetFiles.length === 0) {
    // Some directories use extensionless partition files — try all non-directory items
    const allFiles = files.filter(f => !f.isDirectory).slice(0, maxFiles);
    if (allFiles.length === 0) return [];
    parquetFiles.push(...allFiles);
  }

  const { readParquet } = await import('parquet-wasm');

  const allRows: Record<string, unknown>[] = [];
  for (const file of parquetFiles) {
    const buf  = await readAdlsFile(msalInstance, `/${filesystem}/${file.name}`);
    const table = readParquet(new Uint8Array(buf));
    const json  = JSON.parse(table.toString()) as ArrowJson;
    // parquet-wasm returns Arrow IPC — convert batches to row objects
    const rows = arrowToRows(json);
    allRows.push(...rows);
  }
  return allRows;
}

type ArrowJson = {
  schema?: { fields?: { name: string }[] };
  batches?: { columns?: unknown[][] }[];
};

/** Minimal Arrow batch → row-object converter for parquet-wasm output. */
function arrowToRows(arrowJson: ArrowJson): Record<string, unknown>[] {
  const fields  = arrowJson.schema?.fields?.map(f => f.name) ?? [];
  const rows: Record<string, unknown>[] = [];

  for (const batch of arrowJson.batches ?? []) {
    const cols = batch.columns ?? [];
    const len  = (cols[0] as unknown[])?.length ?? 0;
    for (let i = 0; i < len; i++) {
      const row: Record<string, unknown> = {};
      fields.forEach((name, ci) => { row[name] = (cols[ci] as unknown[])[i]; });
      rows.push(row);
    }
  }
  return rows;
}
