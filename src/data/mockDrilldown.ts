import type { DrilldownRow } from '../components/common/DrilldownDrawer';

// ── Content Health ──────────────────────────────────────────────────────────

export const blockedArticlesByLob: Record<string, DrilldownRow[]> = {
  'Azure Core':             [
    { id: 'BA001', article: 'Azure AD Conditional Access Policy Guide',        owner: 'Priya Nair',   reason: 'Missing LOB metadata tag',             ageDays: '14d' },
    { id: 'BA006', article: 'Azure Blob Storage Access Control',               owner: 'Priya Nair',   reason: 'Missing LOB metadata tag',             ageDays: '18d' },
    { id: 'BA010', article: 'Azure Cost Management Best Practices',            owner: 'Unassigned',   reason: 'Content validation failure',           ageDays: '22d' },
    { id: 'BA011', article: 'Azure Networking — VNet Peering Guide',           owner: 'Omar Farouk',  reason: 'PII detected in content',              ageDays: '5d'  },
    { id: 'BA009', article: 'Conditional Access Policy — Supportability Wiki', owner: 'Unassigned',   reason: 'Compliance scan failure (rate limit)', ageDays: '5d'  },
    { id: 'BA013', article: 'ASIM Security Schema Reference',                  owner: 'Unassigned',   reason: 'Compliance scan failure (rate limit)', ageDays: '5d'  },
  ],
  'Modern Work':            [
    { id: 'BA003', article: 'M365 Admin Center — Licensing Overview',          owner: 'Sara Chen',    reason: 'Duplicate content detected',           ageDays: '6d'  },
    { id: 'BA012', article: 'Teams Meeting Policy Configuration',              owner: 'Sara Chen',    reason: 'Missing LOB metadata tag',             ageDays: '11d' },
    { id: 'BA014', article: 'Exchange Online Mail Flow Rules',                 owner: 'Luis Mendoza', reason: 'Outdated content (>2 years)',           ageDays: '38d' },
    { id: 'BA015', article: 'Teams GCC Tenant Configuration Guide',            owner: 'Unassigned',   reason: 'Compliance scan failure (rate limit)', ageDays: '5d'  },
  ],
  'Developer Azure Services': [
    { id: 'BA019', article: 'Azure Private Endpoint for Storage',              owner: 'Omar Farouk',  reason: 'Missing LOB metadata tag',             ageDays: '9d'  },
    { id: 'BA020', article: 'App Service Deployment Slots Guide',              owner: 'Unassigned',   reason: 'Content validation failure',           ageDays: '14d' },
    { id: 'BA021', article: 'Azure Monitor Alerts Configuration',              owner: 'Unassigned',   reason: 'Compliance scan failure (rate limit)', ageDays: '5d'  },
  ],
  'SCIM Sec & Compliance':  [
    { id: 'BA022', article: 'Conditional Access — MFA Registration',           owner: 'Diana Patel',  reason: 'Missing LOB metadata tag',             ageDays: '7d'  },
    { id: 'BA023', article: 'Entra ID — PIM Role Assignment Guide',            owner: 'Diana Patel',  reason: 'PII detected in content',              ageDays: '11d' },
    { id: 'BA024', article: 'Microsoft Purview Compliance Portal Setup',       owner: 'Unassigned',   reason: 'Content validation failure',           ageDays: '19d' },
  ],
  'Windows':                [
    { id: 'BA004', article: 'Windows 11 Upgrade Compatibility FAQ',            owner: 'Unassigned',   reason: 'Missing product tag',                  ageDays: '21d' },
    { id: 'BA025', article: 'BitLocker Recovery Key Management',               owner: 'Diana Patel',  reason: 'Content validation failure',           ageDays: '9d'  },
  ],
  'BizApps':                [
    { id: 'BA026', article: 'Dynamics 365 CE — Case Management Setup',        owner: 'Unassigned',   reason: 'Missing LOB metadata tag',             ageDays: '12d' },
    { id: 'BA027', article: 'Power Platform Connector Reference',              owner: 'Unassigned',   reason: 'Outdated content (>2 years)',           ageDays: '44d' },
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
  'M365 and Office': [
    { id: 'q1', query: 'How do I cancel my Microsoft 365 Family subscription?',          count: 84, lastSeen: '2026-03-17' },
    { id: 'q2', query: 'Microsoft 365 Personal — can I use it on more than one device?', count: 71, lastSeen: '2026-03-16' },
    { id: 'q3', query: 'How do I transfer my Microsoft 365 license to a new PC?',        count: 63, lastSeen: '2026-03-15' },
    { id: 'q4', query: 'Office apps not activating after reinstall — home user',         count: 58, lastSeen: '2026-03-14' },
  ],
  'Modern Life':     [
    { id: 'q1', query: 'How to enable Copilot in Teams for GCC tenants?',  count: 55, lastSeen: '2026-03-17' },
    { id: 'q2', query: 'Shared mailbox calendar permissions in Exchange',   count: 38, lastSeen: '2026-03-15' },
    { id: 'q3', query: 'M365 Defender — alert suppression rules',          count: 29, lastSeen: '2026-03-13' },
  ],
  'Xbox':            [
    { id: 'q1', query: 'Xbox family settings parental control limits',     count: 33, lastSeen: '2026-03-16' },
    { id: 'q2', query: 'How to migrate Xbox profile to new region',        count: 27, lastSeen: '2026-03-14' },
    { id: 'q3', query: 'Xbox Game Pass — download queue not progressing',  count: 21, lastSeen: '2026-03-12' },
  ],
  'Surface':         [
    { id: 'q1', query: 'Surface Laptop Studio 2 dock compatibility',       count: 19, lastSeen: '2026-03-15' },
    { id: 'q2', query: 'Surface Pro 10 pen firmware update steps',         count: 14, lastSeen: '2026-03-10' },
  ],
  'Store':           [
    { id: 'q1', query: 'Microsoft Store — purchase pending but charged',   count: 12, lastSeen: '2026-03-14' },
    { id: 'q2', query: 'How to request a refund in the Microsoft Store',   count: 9,  lastSeen: '2026-03-11' },
  ],
  'Advertising':     [
    { id: 'q1', query: 'Microsoft Advertising — conversion tracking setup',count: 44, lastSeen: '2026-03-17' },
    { id: 'q2', query: 'Bing Ads — audience targeting not working',        count: 36, lastSeen: '2026-03-16' },
    { id: 'q3', query: 'Microsoft Advertising API rate limit exceeded',    count: 28, lastSeen: '2026-03-15' },
  ],
};

export const feedbackSamplesByCategory: Record<string, DrilldownRow[]> = {
  'Response not relevant': [
    { id: 'f1', article: 'Azure Networking — VNet Peering Guide',        lob: 'Azure',         score: '1 / 5', cases: 63  },
    { id: 'f2', article: 'Intune MAM Policy — Legacy Devices',           lob: 'Intune',        score: '2 / 5', cases: 41  },
    { id: 'f3', article: 'Windows 11 Upgrade Compatibility FAQ',         lob: 'Windows',       score: '2 / 5', cases: 38  },
    { id: 'f4', article: 'Azure Firewall Configuration — Premium IDPS',  lob: 'Azure',         score: '1 / 5', cases: 31  },
  ],
  'No information provided': [
    { id: 'f1', article: 'Azure Cost Management Best Practices',         lob: 'Azure',         score: 'N/A', cases: 55  },
    { id: 'f2', article: 'M365 Admin Center — Licensing Overview',       lob: 'Microsoft 365', score: 'N/A', cases: 44  },
    { id: 'f3', article: 'BitLocker Recovery Key Management',            lob: 'Windows',       score: 'N/A', cases: 31  },
    { id: 'f4', article: 'Intune SCEP Certificate Profile Setup',        lob: 'Intune',        score: 'N/A', cases: 28  },
  ],
  'Inaccurate information': [
    { id: 'f1', article: 'Azure AD Group Policy Migration',              lob: 'Azure',         score: '1 / 5', cases: 29  },
    { id: 'f2', article: 'Conditional Access with Intune',               lob: 'Intune',        score: '2 / 5', cases: 22  },
    { id: 'f3', article: 'Exchange Online Mail Flow Rules',              lob: 'Microsoft 365', score: '2 / 5', cases: 18  },
  ],
  'Incorrect source': [
    { id: 'f1', article: 'Xbox Live Ban Appeal Process',                 lob: 'Xbox',          score: '2 / 5', cases: 41  },
    { id: 'f2', article: 'Azure Resource Tagging Standards',             lob: 'Azure',         score: '1 / 5', cases: 24  },
    { id: 'f3', article: 'Surface Hub 2S Network Setup Guide',          lob: 'Surface',       score: '2 / 5', cases: 16  },
  ],
  'Incomplete / outdated': [
    { id: 'f1', article: 'Windows Autopilot Deployment Modes',           lob: 'Windows',       score: '3 / 5', cases: 33  },
    { id: 'f2', article: 'Teams Meeting Policy Configuration',           lob: 'Microsoft 365', score: '2 / 5', cases: 27  },
    { id: 'f3', article: 'Surface Pro 9 — Initial Setup & Activation',  lob: 'Surface',       score: '3 / 5', cases: 19  },
  ],
  'Hallucinating': [
    { id: 'f1', article: 'Azure Private Endpoint Configuration',         lob: 'Azure',         score: '1 / 5', cases: 14  },
    { id: 'f2', article: 'Intune Compliance Policy Setup',               lob: 'Intune',        score: '1 / 5', cases: 9   },
    { id: 'f3', article: 'M365 Defender Alert Suppression Rules',        lob: 'Microsoft 365', score: '1 / 5', cases: 7   },
  ],
};

// ── Business Outcomes ───────────────────────────────────────────────────────

export const hrrDetailByMonth: Record<string, DrilldownRow[]> = {
  'Apr': [{ id: '1', metric: 'HRR', value: '90%' }, { id: '2', metric: 'Cases resolved', value: '1,240' }, { id: '3', metric: 'Cases escalated', value: '273' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'May': [{ id: '1', metric: 'HRR', value: '91%' }, { id: '2', metric: 'Cases resolved', value: '1,290' }, { id: '3', metric: 'Cases escalated', value: '271' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Jun': [{ id: '1', metric: 'HRR', value: '91%' }, { id: '2', metric: 'Cases resolved', value: '1,310' }, { id: '3', metric: 'Cases escalated', value: '253' }, { id: '4', metric: 'Top gap LOB', value: 'Windows' }],
  'Jul': [{ id: '1', metric: 'HRR', value: '90%' }, { id: '2', metric: 'Cases resolved', value: '1,198' }, { id: '3', metric: 'Cases escalated', value: '286' }, { id: '4', metric: 'Top gap LOB', value: 'Intune' }],
  'Aug': [{ id: '1', metric: 'HRR', value: '89%' }, { id: '2', metric: 'Cases resolved', value: '1,175' }, { id: '3', metric: 'Cases escalated', value: '302' }, { id: '4', metric: 'Top gap LOB', value: 'Intune' }],
  'Sep': [{ id: '1', metric: 'HRR', value: '90%' }, { id: '2', metric: 'Cases resolved', value: '1,221' }, { id: '3', metric: 'Cases escalated', value: '278' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Oct': [{ id: '1', metric: 'HRR', value: '89%' }, { id: '2', metric: 'Cases resolved', value: '1,205' }, { id: '3', metric: 'Cases escalated', value: '289' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Nov': [{ id: '1', metric: 'HRR', value: '88%' }, { id: '2', metric: 'Cases resolved', value: '1,160' }, { id: '3', metric: 'Cases escalated', value: '320' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Dec': [{ id: '1', metric: 'HRR', value: '88%' }, { id: '2', metric: 'Cases resolved', value: '1,135' }, { id: '3', metric: 'Cases escalated', value: '334' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Jan': [{ id: '1', metric: 'HRR', value: '88%' }, { id: '2', metric: 'Cases resolved', value: '1,110' }, { id: '3', metric: 'Cases escalated', value: '351' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Feb': [{ id: '1', metric: 'HRR', value: '87%' }, { id: '2', metric: 'Cases resolved', value: '1,108' }, { id: '3', metric: 'Cases escalated', value: '354' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
  'Mar': [{ id: '1', metric: 'HRR', value: '86%' }, { id: '2', metric: 'Cases resolved', value: '1,125' }, { id: '3', metric: 'Cases escalated', value: '340' }, { id: '4', metric: 'Top gap LOB', value: 'Azure' }],
};

export const ahtDetailByProduct: Record<string, DrilldownRow[]> = {
  'Azure':   [{ id: '1', category: 'Copilot-assisted', current: '55 min', prior: '128 min', delta: '−73 min' }, { id: '2', category: 'Networking', current: '68 min', prior: '145 min', delta: '−77 min' }, { id: '3', category: 'Identity & Access', current: '52 min', prior: '118 min', delta: '−66 min' }],
  'M365':    [{ id: '1', category: 'Copilot-assisted', current: '41 min', prior: '96 min',  delta: '−55 min' }, { id: '2', category: 'Teams',    current: '38 min', prior: '89 min',  delta: '−51 min' }, { id: '3', category: 'Exchange', current: '44 min', prior: '102 min', delta: '−58 min' }],
  'Windows': [{ id: '1', category: 'Copilot-assisted', current: '176 min', prior: '150 min', delta: '+26 min (complex cases)' }, { id: '2', category: 'Updates', current: '182 min', prior: '155 min', delta: '+27 min' }, { id: '3', category: 'Security', current: '170 min', prior: '144 min', delta: '+26 min' }],
  'Surface': [{ id: '1', category: 'Copilot-assisted', current: '38 min', prior: '84 min',  delta: '−46 min' }, { id: '2', category: 'Hardware', current: '35 min', prior: '80 min',  delta: '−45 min' }],
  'Intune':  [{ id: '1', category: 'Copilot-assisted', current: '62 min', prior: '135 min', delta: '−73 min' }, { id: '2', category: 'Enrollment', current: '70 min', prior: '148 min', delta: '−78 min' }, { id: '3', category: 'Compliance', current: '58 min', prior: '124 min', delta: '−66 min' }],
};

export const escalationsByLobDetail: Record<string, DrilldownRow[]> = {
  'Azure':         [
    { id: 'INC-2041', incident: 'INC-2041', summary: 'Ingestion pipeline failure — Azure LOB batch blocked',           severity: 'High',   status: 'Open',      opened: '2026-02-28' },
    { id: 'INC-2049', incident: 'INC-2049', summary: 'Compliance scanner rate-limited — GPT-4o 429 errors blocking batch validation', severity: 'High', status: 'Open', opened: '2026-03-20' },
    { id: 'INC-2021', incident: 'INC-2021', summary: 'Citation links returning 404 for archived Azure docs',            severity: 'Low',    status: 'Open',      opened: '2026-02-08' },
    { id: 'INC-2009', incident: 'INC-2009', summary: 'Azure networking content gap causing empty results',              severity: 'Medium', status: 'Resolved',  opened: '2026-01-20' },
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
  'Azure Core':    [{ id: '1', month: 'Jan', score: '77%', topIssue: 'Missing metadata',           articlesReviewed: 42 }, { id: '2', month: 'Feb', score: '74%', topIssue: 'Content gap (networking)',    articlesReviewed: 38 }, { id: '3', month: 'Mar', score: '72%', topIssue: 'Content gap (networking)',    articlesReviewed: 35 }],
  'Modern Work':   [{ id: '1', month: 'Jan', score: '83%', topIssue: 'Stale Teams policy docs',    articlesReviewed: 51 }, { id: '2', month: 'Feb', score: '82%', topIssue: 'Stale Teams policy docs',    articlesReviewed: 49 }, { id: '3', month: 'Mar', score: '81%', topIssue: 'Stale Teams policy docs',    articlesReviewed: 47 }],
  'Windows':       [{ id: '1', month: 'Jan', score: '80%', topIssue: 'Update article coverage',    articlesReviewed: 38 }, { id: '2', month: 'Feb', score: '79%', topIssue: 'Update article coverage',    articlesReviewed: 36 }, { id: '3', month: 'Mar', score: '78%', topIssue: 'Update article coverage',    articlesReviewed: 34 }],
  'BizApps':       [{ id: '1', month: 'Jan', score: '89%', topIssue: 'Draft abandonment (80%+)',   articlesReviewed: 18 }, { id: '2', month: 'Feb', score: '88%', topIssue: 'Draft abandonment (80%+)',   articlesReviewed: 16 }, { id: '3', month: 'Mar', score: '86%', topIssue: 'Draft abandonment (80%+)',   articlesReviewed: 14 }],
  'SCIM Identity': [{ id: '1', month: 'Jan', score: '93%', topIssue: 'None',                       articlesReviewed: 29 }, { id: '2', month: 'Feb', score: '92%', topIssue: 'None',                       articlesReviewed: 27 }, { id: '3', month: 'Mar', score: '91%', topIssue: 'Enrollment content gap',     articlesReviewed: 26 }],
};

export const incidentsByMonth: Record<string, DrilldownRow[]> = {
  'Oct': [{ id: 'INC-1901', incident: 'INC-1901', summary: 'Ingestion pipeline delay — Surface batch', severity: 'Low',    status: 'Resolved', opened: '2025-10-12' }, { id: 'INC-1902', incident: 'INC-1902', summary: 'Tag validation error — Xbox LOB', severity: 'Low', status: 'Resolved', opened: '2025-10-22' }, { id: 'INC-1903', incident: 'INC-1903', summary: 'Retrieval index rebuild required — Intune', severity: 'Medium', status: 'Resolved', opened: '2025-10-28' }],
  'Nov': [{ id: 'INC-1950', incident: 'INC-1950', summary: 'Empty result spike — M365 licensing queries', severity: 'Medium', status: 'Resolved', opened: '2025-11-08' }, { id: 'INC-1951', incident: 'INC-1951', summary: 'Content sync failure — Windows batch', severity: 'Low', status: 'Resolved', opened: '2025-11-19' }],
  'Dec': [{ id: 'INC-1990', incident: 'INC-1990', summary: 'Metadata schema mismatch after deploy', severity: 'High', status: 'Resolved', opened: '2025-12-03' }, { id: 'INC-1991', incident: 'INC-1991', summary: 'Azure LOB ingestion block', severity: 'High', status: 'Resolved', opened: '2025-12-11' }, { id: 'INC-1992', incident: 'INC-1992', summary: 'Feedback pipeline latency spike', severity: 'Low', status: 'Resolved', opened: '2025-12-17' }, { id: 'INC-1993', incident: 'INC-1993', summary: 'Surface content missing from index', severity: 'Medium', status: 'Resolved', opened: '2025-12-22' }, { id: 'INC-1994', incident: 'INC-1994', summary: 'Intune enrollment keyword mismatch', severity: 'Medium', status: 'Resolved', opened: '2025-12-29' }],
  'Jan': [{ id: 'INC-2001', incident: 'INC-2001', summary: 'HRR drop — Azure content gaps identified', severity: 'High', status: 'Resolved', opened: '2026-01-05' }, { id: 'INC-2005', incident: 'INC-2005', summary: 'Teams policy articles returning stale cache', severity: 'Medium', status: 'Resolved', opened: '2026-01-10' }, { id: 'INC-2008', incident: 'INC-2008', summary: 'Surface LOB articles missing from retrieval index', severity: 'Medium', status: 'Open', opened: '2026-01-28' }, { id: 'INC-2009', incident: 'INC-2009', summary: 'Azure networking content gap causing empty results', severity: 'Medium', status: 'Resolved', opened: '2026-01-20' }],
  'Feb': [{ id: 'INC-2015', incident: 'INC-2015', summary: 'Outdated Xbox support content surfacing in AAQ', severity: 'Low', status: 'In Review', opened: '2026-02-02' }, { id: 'INC-2021', incident: 'INC-2021', summary: 'Citation links returning 404 for archived Azure docs', severity: 'Low', status: 'Open', opened: '2026-02-08' }, { id: 'INC-2029', incident: 'INC-2029', summary: 'Empty results spike — enrollment keyword filter mismatch', severity: 'Medium', status: 'Open', opened: '2026-02-14' }, { id: 'INC-2034', incident: 'INC-2034', summary: 'Retrieval quality degradation for Windows update queries', severity: 'Medium', status: 'Open', opened: '2026-02-20' }, { id: 'INC-2038', incident: 'INC-2038', summary: 'Metadata schema change broke tag validation for M365', severity: 'High', status: 'In Review', opened: '2026-02-25' }, { id: 'INC-2041', incident: 'INC-2041', summary: 'Ingestion pipeline failure — Azure LOB batch blocked', severity: 'High', status: 'Open', opened: '2026-02-28' }],
  'Mar': [{ id: 'INC-2042', incident: 'INC-2042', summary: 'Retrieval index lag — Azure March batch delayed', severity: 'High', status: 'Open', opened: '2026-03-02' }, { id: 'INC-2043', incident: 'INC-2043', summary: 'Content scoring model drift detected', severity: 'High', status: 'Open', opened: '2026-03-05' }, { id: 'INC-2044', incident: 'INC-2044', summary: 'Intune SCEP profiles returning empty results', severity: 'Medium', status: 'Open', opened: '2026-03-08' }, { id: 'INC-2045', incident: 'INC-2045', summary: 'M365 licensing article stale in all channels', severity: 'Medium', status: 'Open', opened: '2026-03-10' }, { id: 'INC-2046', incident: 'INC-2046', summary: 'Windows update KB article missing from index', severity: 'Medium', status: 'Open', opened: '2026-03-12' }, { id: 'INC-2047', incident: 'INC-2047', summary: 'AHT spike in Azure — content gap confirmed', severity: 'High', status: 'Open', opened: '2026-03-14' }, { id: 'INC-2048', incident: 'INC-2048', summary: 'Surface firmware docs missing after migration', severity: 'Low', status: 'Open', opened: '2026-03-16' }, { id: 'INC-2049', incident: 'INC-2049', summary: 'Compliance scanner rate-limited — GPT-4o 429 errors blocking batch validation for 180+ articles', severity: 'High', status: 'Open', opened: '2026-03-20' }],
};
