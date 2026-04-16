import { PublicClientApplication } from '@azure/msal-browser';
import { MSAL_CONFIG } from '../config';

/** Scopes required to call the Power BI REST API. */
export const POWERBI_SCOPES = [
  'https://analysis.windows.net/powerbi/api/Dataset.Read.All',
];

/** Scope for Azure Data Lake Storage Gen2 — user consent only, no admin needed. */
export const ADLS_SCOPES = [
  'https://storage.azure.com/user_impersonation',
];

export const msalInstance = new PublicClientApplication({
  auth: {
    // Falls back to a placeholder so MSAL initialises without throwing;
    // auth features simply won't work until a real clientId is supplied.
    clientId: MSAL_CONFIG.clientId || 'placeholder-replace-me',
    authority: `https://login.microsoftonline.com/${MSAL_CONFIG.tenantId || 'common'}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
});
