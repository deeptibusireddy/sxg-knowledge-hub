/** A single row from the Power BI executeQueries API. */
export type PbiRow = Record<string, string | number | boolean | null>;

/**
 * Executes a DAX query via a Power Automate HTTP-trigger flow.
 *
 * The flow must accept POST body: { queryName, datasetId, daxQuery }
 * and return: { rows: PbiRow[] }
 *
 * See: docs/power-automate-flow-setup.md for flow configuration.
 */
export async function executeViaFlow(
  flowUrl: string,
  queryName: string,
  datasetId: string,
  daxQuery: string,
): Promise<PbiRow[]> {
  const response = await fetch(flowUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queryName, datasetId, daxQuery }),
  });

  if (!response.ok) {
    throw new Error(`Flow error ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  // Support both { rows: [...] } and raw array responses
  return (Array.isArray(json) ? json : json.rows ?? []) as PbiRow[];
}

/**
 * Executes a DAX query directly against the Power BI REST API
 * using an MSAL-acquired access token.
 *
 * Column names in returned rows are "[Alias]" — matching the alias
 * given in SELECTCOLUMNS, e.g. { "[Date]": "Jan", "[Count]": 42 }.
 */
export async function executePbiQuery(
  msalInstance: import('@azure/msal-browser').IPublicClientApplication,
  datasetId: string,
  query: string,
): Promise<PbiRow[]> {
  const { POWERBI_SCOPES } = await import('../auth/msalConfig');
  const { POWERBI_WORKSPACE_ID } = await import('../config');

  const accounts = msalInstance.getAllAccounts();
  let accessToken: string;
  try {
    const result = await msalInstance.acquireTokenSilent({
      scopes: POWERBI_SCOPES,
      account: accounts[0],
    });
    accessToken = result.accessToken;
  } catch {
    const result = await msalInstance.acquireTokenPopup({ scopes: POWERBI_SCOPES });
    accessToken = result.accessToken;
  }

  const url =
    `https://api.powerbi.com/v1.0/myorg/groups/${POWERBI_WORKSPACE_ID}` +
    `/datasets/${datasetId}/executeQueries`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      queries: [{ query }],
      serializerSettings: { includeNulls: true },
    }),
  });

  if (!response.ok) {
    throw new Error(`Power BI API error ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  return (json.results?.[0]?.tables?.[0]?.rows ?? []) as PbiRow[];
}
