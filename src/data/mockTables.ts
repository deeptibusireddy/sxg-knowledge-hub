import type { BlockedArticleRow, IncidentRow } from '../types';

export const blockedArticles: BlockedArticleRow[] = [
  { id: 'BA001', article: 'Azure AD Conditional Access Policy Guide', lob: 'Azure', owner: 'Priya Nair', reason: 'Missing LOB metadata tag', ageDays: 14 },
  { id: 'BA002', article: 'Intune Device Enrollment Troubleshooting', lob: 'Intune', owner: 'James Okafor', reason: 'PII detected in content', ageDays: 9 },
  { id: 'BA003', article: 'M365 Admin Center — Licensing Overview', lob: 'Microsoft 365', owner: 'Sara Chen', reason: 'Duplicate content detected', ageDays: 6 },
  { id: 'BA004', article: 'Windows 11 Upgrade Compatibility FAQ', lob: 'Windows', owner: 'Unassigned', reason: 'Missing product tag', ageDays: 21 },
  { id: 'BA005', article: 'Surface Pro 9 Battery Troubleshooting', lob: 'Surface', owner: 'Tom Reeves', reason: 'Content validation failure', ageDays: 3 },
  { id: 'BA006', article: 'Azure Blob Storage Access Control', lob: 'Azure', owner: 'Priya Nair', reason: 'Missing LOB metadata tag', ageDays: 18 },
  { id: 'BA007', article: 'Xbox Live Ban Appeal Process', lob: 'Xbox', owner: 'Unassigned', reason: 'Outdated content (>2 years)', ageDays: 45 },
  { id: 'BA008', article: 'Intune MAM Policy Configuration', lob: 'Intune', owner: 'James Okafor', reason: 'Missing LOB metadata tag', ageDays: 7 },
];

export const recentIncidents: IncidentRow[] = [
  { id: 'INC-2041', lob: 'Azure', severity: 'High', status: 'Open', opened: '2026-02-28', summary: 'Ingestion pipeline failure — Azure LOB batch blocked' },
  { id: 'INC-2038', lob: 'Microsoft 365', severity: 'High', status: 'In Review', opened: '2026-02-25', summary: 'Metadata schema change broke tag validation for M365' },
  { id: 'INC-2034', lob: 'Windows', severity: 'Medium', status: 'Open', opened: '2026-02-20', summary: 'Retrieval quality degradation for Windows update queries' },
  { id: 'INC-2029', lob: 'Intune', severity: 'Medium', status: 'Open', opened: '2026-02-14', summary: 'Empty results spike — "enrollment" keyword filter mismatch' },
  { id: 'INC-2021', lob: 'Azure', severity: 'Low', status: 'Open', opened: '2026-02-08', summary: 'Citation links returning 404 for archived Azure docs' },
  { id: 'INC-2015', lob: 'Xbox', severity: 'Low', status: 'In Review', opened: '2026-02-02', summary: 'Outdated Xbox support content surfacing in AAQ responses' },
  { id: 'INC-2008', lob: 'Surface', severity: 'Medium', status: 'Open', opened: '2026-01-28', summary: 'Surface LOB articles missing from retrieval index after migration' },
];
