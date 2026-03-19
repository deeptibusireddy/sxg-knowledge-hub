import type { DrilldownRow } from '../components/common/DrilldownDrawer';

// ── Content Health ──────────────────────────────────────────────────────────

export const blockedArticlesByLob: Record<string, DrilldownRow[]> = {
  'Azure':         [
    { id: 'BA001', article: 'Azure AD Conditional Access Policy Guide', owner: 'Priya Nair',   reason: 'Missing LOB metadata tag',   ageDays: '14d' },
    { id: 'BA006', article: 'Azure Blob Storage Access Control',        owner: 'Priya Nair',   reason: 'Missing LOB metadata tag',   ageDays: '18d' },
    { id: 'BA010', article: 'Azure Cost Management Best Practices',     owner: 'Unassigned',   reason: 'Content validation failure', ageDays: '22d' },
    { id: 'BA011', article: 'Azure Networking — VNet Peering Guide',    owner: 'Omar Farouk',  reason: 'PII detected in content',    ageDays: '5d'  },
  ],
  'Microsoft 365': [
    { id: 'BA003', article: 'M365 Admin Center — Licensing Overview',  owner: 'Sara Chen',    reason: 'Duplicate content detected', ageDays: '6d'  },
    { id: 'BA012', article: 'Teams Meeting Policy Configuration',      owner: 'Sara Chen',    reason: 'Missing LOB metadata tag',   ageDays: '11d' },
    { id: 'BA013', article: 'Exchange Online Mail Flow Rules',         owner: 'Luis Mendoza', reason: 'Outdated content (>2 years)', ageDays: '38d' },
  ],
  'Windows': [
    { id: 'BA004', article: 'Windows 11 Upgrade Compatibility FAQ',   owner: 'Unassigned',   reason: 'Missing product tag',        ageDays: '21d' },
    { id: 'BA014', article: 'BitLocker Recovery Key Management',      owner: 'Diana Patel',  reason: 'Content validation failure', ageDays: '9d'  },
  ],
  'Surface': [
    { id: 'BA005', article: 'Surface Pro 9 Battery Troubleshooting',  owner: 'Tom Reeves',   reason: 'Content validation failure', ageDays: '3d'  },
    { id: 'BA015', article: 'Surface Hub 2S Network Setup Guide',     owner: 'Tom Reeves',   reason: 'Missing LOB metadata tag',   ageDays: '16d' },
  ],
  'Xbox': [
    { id: 'BA007', article: 'Xbox Live Ban Appeal Process',           owner: 'Unassigned',   reason: 'Outdated content (>2 years)', ageDays: '45d' },
    { id: 'BA016', article: 'Xbox Game Pass Subscription FAQ',        owner: 'Unassigned',   reason: 'Missing product tag',        ageDays: '12d' },
  ],
  'Intune': [
    { id: 'BA002', article: 'Intune Device Enrollment Troubleshooting', owner: 'James Okafor', reason: 'PII detected in content',    ageDays: '9d'  },
    { id: 'BA008', article: 'Intune MAM Policy Configuration',          owner: 'James Okafor', reason: 'Missing LOB metadata tag',   ageDays: '7d'  },
    { id: 'BA017', article: 'Intune Compliance Policy Setup',           owner: 'James Okafor', reason: 'Content validation failure', ageDays: '4d'  },
  ],
};

export const ingestionByMonth: Record<string, DrilldownRow[]> = {
  'Oct': [{ id: '1', metric: 'Ingested', count: '4,200' }, { id: '2', metric: 'Pending', count: '280' }, { id: '3', metric: 'Blocked', count: '610' }, { id: '4', metric: 'Total',   count: '5,090' }, { id: '5', metric: 'Block rate', count: '12.0%' }],
  'Nov': [{ id: '1', metric: 'Ingested', count: '4,450' }, { id: '2', metric: 'Pending', count: '310' }, { id: '3', metric: 'Blocked', count: '590' }, { id: '4', metric: 'Total',   count: '5,350' }, { id: '5', metric: 'Block rate', count: '11.0%' }],
  'Dec': [{ id: '1', metric: 'Ingested', count: '4,100' }, { id: '2', metric: 'Pending', count: '350' }, { id: '3', metric: 'Blocked', count: '700' }, { id: '4', metric: 'Total',   count: '5,150' }, { id: '5', metric: 'Block rate', count: '13.6%' }],
  'Jan': [{ id: '1', metric: 'Ingested', count: '4,380' }, { id: '2', metric: 'Pending', count: '290' }, { id: '3', metric: 'Blocked', count: '720' }, { id: '4', metric: 'Total',   count: '5,390' }, { id: '5', metric: 'Block rate', count: '13.4%' }],
  'Feb': [{ id: '1', metric: 'Ingested', count: '4,250' }, { id: '2', metric: 'Pending', count: '320' }, { id: '3', metric: 'Blocked', count: '850' }, { id: '4', metric: 'Total',   count: '5,420' }, { id: '5', metric: 'Block rate', count: '15.7%' }],
  'Mar': [{ id: '1', metric: 'Ingested', count: '4,160' }, { id: '2', metric: 'Pending', count: '340' }, { id: '3', metric: 'Blocked', count: '890' }, { id: '4', metric: 'Total',   count: '5,390' }, { id: '5', metric: 'Block rate', count: '16.5%' }],
};

// ── Support Quality ─────────────────────────────────────────────────────────

export const emptyQuerySamplesByLob: Record<string, DrilldownRow[]> = {
  'Azure':         [
    { id: 'q1', query: 'How do I configure Azure Private Link for Storage?', count: 42, lastSeen: '2026-03-17' },
    { id: 'q2', query: 'Azure Arc-enabled Kubernetes setup steps',            count: 37, lastSeen: '2026-03-16' },
    { id: 'q3', query: 'Azure Firewall Premium IDPS configuration',           count: 31, lastSeen: '2026-03-15' },
    { id: 'q4', query: 'Defender for Cloud — regulatory compliance report',   count: 28, lastSeen: '2026-03-14' },
  ],
  'Microsoft 365': [
    { id: 'q1', query: 'How to enable Copilot in Teams for GCC tenants?', count: 55, lastSeen: '2026-03-17' },
    { id: 'q2', query: 'Shared mailbox calendar permissions in Exchange',   count: 38, lastSeen: '2026-03-15' },
    { id: 'q3', query: 'M365 Defender — alert suppression rules',          count: 29, lastSeen: '2026-03-13' },
  ],
  'Windows': [
    { id: 'q1', query: 'Windows 11 WDAG browser container setup',         count: 33, lastSeen: '2026-03-16' },
    { id: 'q2', query: 'Autopilot reset not completing on domain-joined',  count: 27, lastSeen: '2026-03-14' },
    { id: 'q3', query: 'Windows Hello for Business hybrid trust guide',    count: 21, lastSeen: '2026-03-12' },
  ],
  'Surface': [
    { id: 'q1', query: 'Surface Laptop Studio 2 dock compatibility',      count: 19, lastSeen: '2026-03-15' },
    { id: 'q2', query: 'Surface Pro 10 pen firmware update steps',        count: 14, lastSeen: '2026-03-10' },
  ],
  'Xbox': [
    { id: 'q1', query: 'Xbox family settings parental control limits',    count: 12, lastSeen: '2026-03-14' },
    { id: 'q2', query: 'How to migrate Xbox profile to new region',       count: 9,  lastSeen: '2026-03-11' },
  ],
  'Intune': [
    { id: 'q1', query: 'Intune — remove stale device from AAD and Intune', count: 44, lastSeen: '2026-03-17' },
    { id: 'q2', query: 'Android Enterprise zero-touch enrollment OEM',     count: 36, lastSeen: '2026-03-16' },
    { id: 'q3', query: 'Intune SCEP certificate profile not deploying',    count: 28, lastSeen: '2026-03-15' },
  ],
};

export const feedbackSamplesByCategory: Record<string, DrilldownRow[]> = {
  'Helpful': [
    { id: 'f1', article: 'Intune Device Enrollment — Step by Step',       lob: 'Intune',        score: '5 / 5', cases: 142 },
    { id: 'f2', article: 'Azure AD SSPR Configuration Guide',             lob: 'Azure',         score: '5 / 5', cases: 118 },
    { id: 'f3', article: 'Windows Autopilot Deployment Modes',            lob: 'Windows',       score: '4 / 5', cases: 97  },
    { id: 'f4', article: 'M365 — Setting Up MFA for End Users',           lob: 'Microsoft 365', score: '4 / 5', cases: 86  },
    { id: 'f5', article: 'Surface Pro 9 — Initial Setup & Activation',   lob: 'Surface',       score: '5 / 5', cases: 54  },
  ],
  'Not Helpful': [
    { id: 'f1', article: 'Azure Networking — VNet Peering Guide',        lob: 'Azure',         score: '1 / 5', cases: 63  },
    { id: 'f2', article: 'Xbox Live Ban Appeal Process',                  lob: 'Xbox',          score: '2 / 5', cases: 41  },
    { id: 'f3', article: 'Windows 11 Upgrade Compatibility FAQ',         lob: 'Windows',       score: '2 / 5', cases: 38  },
    { id: 'f4', article: 'Intune MAM Policy — Legacy Devices',           lob: 'Intune',        score: '1 / 5', cases: 29  },
  ],
  'No Response': [
    { id: 'f1', article: 'Azure Cost Management Best Practices',         lob: 'Azure',         score: 'N/A', cases: 55  },
    { id: 'f2', article: 'M365 Admin Center — Licensing Overview',       lob: 'Microsoft 365', score: 'N/A', cases: 44  },
    { id: 'f3', article: 'BitLocker Recovery Key Management',            lob: 'Windows',       score: 'N/A', cases: 31  },
  ],
};

// ── Business Outcomes ───────────────────────────────────────────────────────

export const hrrDetailByMonth: Record<string, DrilldownRow[]> = {
  'Apr': [{ id: '1', metric: 'HRR', value: '78%' }, { id: '2', metric: 'Cases resolved', value: '1,240' }, { id: '3', metric: 'Cases escalated', value: '273' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'May': [{ id: '1', metric: 'HRR', value: '79%' }, { id: '2', metric: 'Cases resolved', value: '1,290' }, { id: '3', metric: 'Cases escalated', value: '271' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Jun': [{ id: '1', metric: 'HRR', value: '80%' }, { id: '2', metric: 'Cases resolved', value: '1,310' }, { id: '3', metric: 'Cases escalated', value: '253' }, { id: '4', metric: 'Top gap LOB', value: 'Windows' }],
  'Jul': [{ id: '1', metric: 'HRR', value: '77%' }, { id: '2', metric: 'Cases resolved', value: '1,198' }, { id: '3', metric: 'Cases escalated', value: '286' }, { id: '4', metric: 'Top gap LOB', value: 'Intune' }],
  'Aug': [{ id: '1', metric: 'HRR', value: '76%' }, { id: '2', metric: 'Cases resolved', value: '1,175' }, { id: '3', metric: 'Cases escalated', value: '302' }, { id: '4', metric: 'Top gap LOB', value: 'Intune' }],
  'Sep': [{ id: '1', metric: 'HRR', value: '78%' }, { id: '2', metric: 'Cases resolved', value: '1,221' }, { id: '3', metric: 'Cases escalated', value: '278' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Oct': [{ id: '1', metric: 'HRR', value: '77%' }, { id: '2', metric: 'Cases resolved', value: '1,205' }, { id: '3', metric: 'Cases escalated', value: '289' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Nov': [{ id: '1', metric: 'HRR', value: '75%' }, { id: '2', metric: 'Cases resolved', value: '1,160' }, { id: '3', metric: 'Cases escalated', value: '320' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Dec': [{ id: '1', metric: 'HRR', value: '74%' }, { id: '2', metric: 'Cases resolved', value: '1,135' }, { id: '3', metric: 'Cases escalated', value: '334' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Jan': [{ id: '1', metric: 'HRR', value: '73%' }, { id: '2', metric: 'Cases resolved', value: '1,110' }, { id: '3', metric: 'Cases escalated', value: '351' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Feb': [{ id: '1', metric: 'HRR', value: '73%' }, { id: '2', metric: 'Cases resolved', value: '1,108' }, { id: '3', metric: 'Cases escalated', value: '354' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Mar': [{ id: '1', metric: 'HRR', value: '74%' }, { id: '2', metric: 'Cases resolved', value: '1,125' }, { id: '3', metric: 'Cases escalated', value: '340' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
};

export const ahtDetailByProduct: Record<string, DrilldownRow[]> = {
  'Azure':   [{ id: '1', category: 'Networking', current: '12.4 min', prior: '11.1 min', delta: '+1.3 min' }, { id: '2', category: 'Identity & Access', current: '10.8 min', prior: '9.8 min', delta: '+1.0 min' }, { id: '3', category: 'Storage', current: '10.4 min', prior: '9.4 min', delta: '+1.0 min' }],
  'M365':    [{ id: '1', category: 'Teams',    current: '8.9 min', prior: '8.5 min', delta: '+0.4 min' }, { id: '2', category: 'Exchange', current: '8.1 min', prior: '7.9 min', delta: '+0.2 min' }, { id: '3', category: 'SharePoint', current: '8.2 min', prior: '7.9 min', delta: '+0.3 min' }],
  'Windows': [{ id: '1', category: 'Updates',   current: '10.2 min', prior: '9.5 min', delta: '+0.7 min' }, { id: '2', category: 'Security',  current: '9.4 min', prior: '8.6 min', delta: '+0.8 min' }, { id: '3', category: 'Deployment', current: '9.5 min', prior: '8.9 min', delta: '+0.6 min' }],
  'Surface': [{ id: '1', category: 'Hardware',  current: '8.1 min', prior: '7.9 min', delta: '+0.2 min' }, { id: '2', category: 'Firmware',  current: '7.5 min', prior: '7.2 min', delta: '+0.3 min' }],
  'Intune':  [{ id: '1', category: 'Enrollment', current: '11.2 min', prior: '10.4 min', delta: '+0.8 min' }, { id: '2', category: 'Compliance', current: '9.8 min', prior: '9.1 min', delta: '+0.7 min' }, { id: '3', category: 'App Protection', current: '9.9 min', prior: '9.3 min', delta: '+0.6 min' }],
};

export const escalationsByLobDetail: Record<string, DrilldownRow[]> = {
  'Azure':         [
    { id: 'INC-2041', incident: 'INC-2041', summary: 'Ingestion pipeline failure — Azure LOB batch blocked', severity: 'High',   status: 'Open',      opened: '2026-02-28' },
    { id: 'INC-2021', incident: 'INC-2021', summary: 'Citation links returning 404 for archived Azure docs',  severity: 'Low',    status: 'Open',      opened: '2026-02-08' },
    { id: 'INC-2009', incident: 'INC-2009', summary: 'Azure networking content gap causing empty results',    severity: 'Medium', status: 'Resolved',  opened: '2026-01-20' },
  ],
  'Microsoft 365': [
    { id: 'INC-2038', incident: 'INC-2038', summary: 'Metadata schema change broke tag validation for M365', severity: 'High',   status: 'In Review', opened: '2026-02-25' },
    { id: 'INC-2005', incident: 'INC-2005', summary: 'Teams policy articles returning stale cached content', severity: 'Medium', status: 'Resolved',  opened: '2026-01-10' },
  ],
  'Windows': [
    { id: 'INC-2034', incident: 'INC-2034', summary: 'Retrieval quality degradation for Windows update queries', severity: 'Medium', status: 'Open',     opened: '2026-02-20' },
  ],
  'Surface': [
    { id: 'INC-2008', incident: 'INC-2008', summary: 'Surface LOB articles missing from retrieval index',    severity: 'Medium', status: 'Open',      opened: '2026-01-28' },
  ],
  'Xbox': [
    { id: 'INC-2015', incident: 'INC-2015', summary: 'Outdated Xbox content surfacing in AAQ responses',     severity: 'Low',    status: 'In Review', opened: '2026-02-02' },
  ],
  'Intune': [
    { id: 'INC-2029', incident: 'INC-2029', summary: 'Empty results spike — enrollment keyword filter mismatch', severity: 'Medium', status: 'Open',   opened: '2026-02-14' },
  ],
};

// ── Program Health ──────────────────────────────────────────────────────────

export const retrievalDetailByMonth: Record<string, DrilldownRow[]> = {
  'Oct': [{ id: '1', metric: 'Success Rate', value: '84%' }, { id: '2', metric: 'Total Queries', value: '18,400' }, { id: '3', metric: 'Failed Queries', value: '2,944' }, { id: '4', metric: 'Top Failure LOB', value: 'Intune' }],
  'Nov': [{ id: '1', metric: 'Success Rate', value: '83%' }, { id: '2', metric: 'Total Queries', value: '19,100' }, { id: '3', metric: 'Failed Queries', value: '3,247' }, { id: '4', metric: 'Top Failure LOB', value: 'Intune' }],
  'Dec': [{ id: '1', metric: 'Success Rate', value: '81%' }, { id: '2', metric: 'Total Queries', value: '17,800' }, { id: '3', metric: 'Failed Queries', value: '3,382' }, { id: '4', metric: 'Top Failure LOB', value: 'Azure' }],
  'Jan': [{ id: '1', metric: 'Success Rate', value: '80%' }, { id: '2', metric: 'Total Queries', value: '20,200' }, { id: '3', metric: 'Failed Queries', value: '4,040' }, { id: '4', metric: 'Top Failure LOB', value: 'Azure' }],
  'Feb': [{ id: '1', metric: 'Success Rate', value: '80%' }, { id: '2', metric: 'Total Queries', value: '21,500' }, { id: '3', metric: 'Failed Queries', value: '4,300' }, { id: '4', metric: 'Top Failure LOB', value: 'Azure' }],
  'Mar': [{ id: '1', metric: 'Success Rate', value: '79%' }, { id: '2', metric: 'Total Queries', value: '22,100' }, { id: '3', metric: 'Failed Queries', value: '4,641' }, { id: '4', metric: 'Top Failure LOB', value: 'Azure' }],
};

export const qualityDetailByLob: Record<string, DrilldownRow[]> = {
  'Azure':   [{ id: '1', month: 'Jan', score: '77%', topIssue: 'Missing metadata', articlesReviewed: 42 }, { id: '2', month: 'Feb', score: '74%', topIssue: 'Content gap (networking)', articlesReviewed: 38 }, { id: '3', month: 'Mar', score: '72%', topIssue: 'Content gap (networking)', articlesReviewed: 35 }],
  'M365':    [{ id: '1', month: 'Jan', score: '83%', topIssue: 'Stale Teams policy docs', articlesReviewed: 51 }, { id: '2', month: 'Feb', score: '82%', topIssue: 'Stale Teams policy docs', articlesReviewed: 49 }, { id: '3', month: 'Mar', score: '81%', topIssue: 'Stale Teams policy docs', articlesReviewed: 47 }],
  'Windows': [{ id: '1', month: 'Jan', score: '80%', topIssue: 'Update article coverage', articlesReviewed: 38 }, { id: '2', month: 'Feb', score: '79%', topIssue: 'Update article coverage', articlesReviewed: 36 }, { id: '3', month: 'Mar', score: '78%', topIssue: 'Update article coverage', articlesReviewed: 34 }],
  'Surface': [{ id: '1', month: 'Jan', score: '85%', topIssue: 'None',               articlesReviewed: 22 }, { id: '2', month: 'Feb', score: '85%', topIssue: 'None',               articlesReviewed: 22 }, { id: '3', month: 'Mar', score: '84%', topIssue: 'Firmware docs outdated', articlesReviewed: 21 }],
  'Intune':  [{ id: '1', month: 'Jan', score: '76%', topIssue: 'Enrollment content gap', articlesReviewed: 29 }, { id: '2', month: 'Feb', score: '75%', topIssue: 'Enrollment content gap', articlesReviewed: 27 }, { id: '3', month: 'Mar', score: '74%', topIssue: 'Enrollment content gap', articlesReviewed: 26 }],
};

export const incidentsByMonth: Record<string, DrilldownRow[]> = {
  'Oct': [{ id: 'INC-1901', incident: 'INC-1901', summary: 'Ingestion pipeline delay — Surface batch', severity: 'Low',    status: 'Resolved', opened: '2025-10-12' }, { id: 'INC-1902', incident: 'INC-1902', summary: 'Tag validation error — Xbox LOB', severity: 'Low', status: 'Resolved', opened: '2025-10-22' }, { id: 'INC-1903', incident: 'INC-1903', summary: 'Retrieval index rebuild required — Intune', severity: 'Medium', status: 'Resolved', opened: '2025-10-28' }],
  'Nov': [{ id: 'INC-1950', incident: 'INC-1950', summary: 'Empty result spike — M365 licensing queries', severity: 'Medium', status: 'Resolved', opened: '2025-11-08' }, { id: 'INC-1951', incident: 'INC-1951', summary: 'Content sync failure — Windows batch', severity: 'Low', status: 'Resolved', opened: '2025-11-19' }],
  'Dec': [{ id: 'INC-1990', incident: 'INC-1990', summary: 'Metadata schema mismatch after deploy', severity: 'High', status: 'Resolved', opened: '2025-12-03' }, { id: 'INC-1991', incident: 'INC-1991', summary: 'Azure LOB ingestion block', severity: 'High', status: 'Resolved', opened: '2025-12-11' }, { id: 'INC-1992', incident: 'INC-1992', summary: 'Feedback pipeline latency spike', severity: 'Low', status: 'Resolved', opened: '2025-12-17' }, { id: 'INC-1993', incident: 'INC-1993', summary: 'Surface content missing from index', severity: 'Medium', status: 'Resolved', opened: '2025-12-22' }, { id: 'INC-1994', incident: 'INC-1994', summary: 'Intune enrollment keyword mismatch', severity: 'Medium', status: 'Resolved', opened: '2025-12-29' }],
  'Jan': [{ id: 'INC-2001', incident: 'INC-2001', summary: 'HRR drop — Azure content gaps identified', severity: 'High', status: 'Resolved', opened: '2026-01-05' }, { id: 'INC-2005', incident: 'INC-2005', summary: 'Teams policy articles returning stale cache', severity: 'Medium', status: 'Resolved', opened: '2026-01-10' }, { id: 'INC-2008', incident: 'INC-2008', summary: 'Surface LOB articles missing from retrieval index', severity: 'Medium', status: 'Open', opened: '2026-01-28' }, { id: 'INC-2009', incident: 'INC-2009', summary: 'Azure networking content gap causing empty results', severity: 'Medium', status: 'Resolved', opened: '2026-01-20' }],
  'Feb': [{ id: 'INC-2015', incident: 'INC-2015', summary: 'Outdated Xbox support content surfacing in AAQ', severity: 'Low', status: 'In Review', opened: '2026-02-02' }, { id: 'INC-2021', incident: 'INC-2021', summary: 'Citation links returning 404 for archived Azure docs', severity: 'Low', status: 'Open', opened: '2026-02-08' }, { id: 'INC-2029', incident: 'INC-2029', summary: 'Empty results spike — enrollment keyword filter mismatch', severity: 'Medium', status: 'Open', opened: '2026-02-14' }, { id: 'INC-2034', incident: 'INC-2034', summary: 'Retrieval quality degradation for Windows update queries', severity: 'Medium', status: 'Open', opened: '2026-02-20' }, { id: 'INC-2038', incident: 'INC-2038', summary: 'Metadata schema change broke tag validation for M365', severity: 'High', status: 'In Review', opened: '2026-02-25' }, { id: 'INC-2041', incident: 'INC-2041', summary: 'Ingestion pipeline failure — Azure LOB batch blocked', severity: 'High', status: 'Open', opened: '2026-02-28' }],
  'Mar': [{ id: 'INC-2042', incident: 'INC-2042', summary: 'Retrieval index lag — Azure March batch delayed', severity: 'High', status: 'Open', opened: '2026-03-02' }, { id: 'INC-2043', incident: 'INC-2043', summary: 'Content scoring model drift detected', severity: 'High', status: 'Open', opened: '2026-03-05' }, { id: 'INC-2044', incident: 'INC-2044', summary: 'Intune SCEP profiles returning empty results', severity: 'Medium', status: 'Open', opened: '2026-03-08' }, { id: 'INC-2045', incident: 'INC-2045', summary: 'M365 licensing article stale in all channels', severity: 'Medium', status: 'Open', opened: '2026-03-10' }, { id: 'INC-2046', incident: 'INC-2046', summary: 'Windows update KB article missing from index', severity: 'Medium', status: 'Open', opened: '2026-03-12' }, { id: 'INC-2047', incident: 'INC-2047', summary: 'AHT spike in Azure — content gap confirmed', severity: 'High', status: 'Open', opened: '2026-03-14' }, { id: 'INC-2048', incident: 'INC-2048', summary: 'Surface firmware docs missing after migration', severity: 'Low', status: 'Open', opened: '2026-03-16' }],
};
