import type { DrilldownRow, DrilldownContent } from '../components/common/DrilldownDrawer';

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

// ── Second-level drilldown data ─────────────────────────────────────────────

const hrrByLob: Record<string, DrilldownRow[]> = {
  'Mar 2026': [
    { id: '1', lob: 'SCIM Identity',            hrr: '91%', thumbsUp: '2,584', thumbsDown: '257',   vsTarget: '−9%'  },
    { id: '2', lob: 'Modern Work',               hrr: '88%', thumbsUp: '7,147', thumbsDown: '972',   vsTarget: '−12%' },
    { id: '3', lob: 'Windows',                   hrr: '85%', thumbsUp: '3,579', thumbsDown: '631',   vsTarget: '−15%' },
    { id: '4', lob: 'BizApps',                   hrr: '83%', thumbsUp: '3,030', thumbsDown: '621',   vsTarget: '−17%' },
    { id: '5', lob: 'Azure Core',                hrr: '79%', thumbsUp: '5,009', thumbsDown: '1,330', vsTarget: '−21%' },
    { id: '6', lob: 'Developer Azure Services',  hrr: '77%', thumbsUp: '2,265', thumbsDown: '675',   vsTarget: '−23%' },
  ],
  'Feb 2026': [
    { id: '1', lob: 'SCIM Identity',            hrr: '92%', thumbsUp: '2,422', thumbsDown: '211',   vsTarget: '−8%'  },
    { id: '2', lob: 'Modern Work',               hrr: '89%', thumbsUp: '6,980', thumbsDown: '863',   vsTarget: '−11%' },
    { id: '3', lob: 'Windows',                   hrr: '85%', thumbsUp: '3,401', thumbsDown: '600',   vsTarget: '−15%' },
    { id: '4', lob: 'BizApps',                   hrr: '84%', thumbsUp: '2,940', thumbsDown: '559',   vsTarget: '−16%' },
    { id: '5', lob: 'Azure Core',                hrr: '80%', thumbsUp: '4,800', thumbsDown: '1,200', vsTarget: '−20%' },
    { id: '6', lob: 'Developer Azure Services',  hrr: '78%', thumbsUp: '2,100', thumbsDown: '592',   vsTarget: '−22%' },
  ],
  'Jan 2026': [
    { id: '1', lob: 'SCIM Identity',            hrr: '93%', thumbsUp: '2,511', thumbsDown: '189',   vsTarget: '−7%'  },
    { id: '2', lob: 'Modern Work',               hrr: '90%', thumbsUp: '7,200', thumbsDown: '800',   vsTarget: '−10%' },
    { id: '3', lob: 'Windows',                   hrr: '86%', thumbsUp: '3,612', thumbsDown: '589',   vsTarget: '−14%' },
    { id: '4', lob: 'BizApps',                   hrr: '85%', thumbsUp: '3,060', thumbsDown: '540',   vsTarget: '−15%' },
    { id: '5', lob: 'Azure Core',                hrr: '81%', thumbsUp: '5,000', thumbsDown: '1,170', vsTarget: '−19%' },
    { id: '6', lob: 'Developer Azure Services',  hrr: '79%', thumbsUp: '2,289', thumbsDown: '610',   vsTarget: '−21%' },
  ],
};

// ── Level 3 data: articles driving low HRR per LOB ─────────────────────────

const hrrArticlesByLob: Record<string, DrilldownRow[]> = {
  'Azure Core': [
    { id: '1', article: 'Azure AD Conditional Access Policy Guide',    queries: '412', thumbsDown: '189', hrr: '68%', topTheme: 'Response not relevant'   },
    { id: '2', article: 'Azure Networking — VNet Peering Guide',       queries: '338', thumbsDown: '156', hrr: '71%', topTheme: 'Inaccurate information'  },
    { id: '3', article: 'Azure Cost Management Best Practices',        queries: '290', thumbsDown: '122', hrr: '72%', topTheme: 'No information provided' },
    { id: '4', article: 'Azure Private Endpoint Configuration',        queries: '245', thumbsDown: '98',  hrr: '74%', topTheme: 'Hallucinating'           },
    { id: '5', article: 'Azure Firewall Configuration — Premium IDPS', queries: '198', thumbsDown: '81',  hrr: '71%', topTheme: 'Response not relevant'   },
  ],
  'Developer Azure Services': [
    { id: '1', article: 'App Service Deployment Slots Guide',          queries: '284', thumbsDown: '134', hrr: '69%', topTheme: 'Incomplete / outdated'   },
    { id: '2', article: 'Azure Monitor Alerts Configuration',          queries: '231', thumbsDown: '108', hrr: '73%', topTheme: 'Inaccurate information'  },
    { id: '3', article: 'Azure Private Endpoint for Storage',          queries: '178', thumbsDown: '79',  hrr: '74%', topTheme: 'Response not relevant'   },
  ],
  'Modern Work': [
    { id: '1', article: 'M365 Admin Center — Licensing Overview',      queries: '380', thumbsDown: '118', hrr: '72%', topTheme: 'Inaccurate information'  },
    { id: '2', article: 'Teams Meeting Policy Configuration',          queries: '295', thumbsDown: '97',  hrr: '74%', topTheme: 'Incomplete / outdated'   },
    { id: '3', article: 'Exchange Online Mail Flow Rules',             queries: '241', thumbsDown: '89',  hrr: '75%', topTheme: 'Incorrect source'        },
    { id: '4', article: 'Teams GCC Tenant Configuration Guide',        queries: '189', thumbsDown: '72',  hrr: '73%', topTheme: 'No information provided' },
  ],
  'Windows': [
    { id: '1', article: 'Windows 11 Upgrade Compatibility FAQ',        queries: '312', thumbsDown: '109', hrr: '73%', topTheme: 'Incomplete / outdated'   },
    { id: '2', article: 'Windows Autopilot Deployment Modes',          queries: '267', thumbsDown: '95',  hrr: '74%', topTheme: 'Inaccurate information'  },
    { id: '3', article: 'BitLocker Recovery Key Management',           queries: '198', thumbsDown: '68',  hrr: '76%', topTheme: 'Response not relevant'   },
  ],
  'BizApps': [
    { id: '1', article: 'Dynamics 365 CE — Case Management Setup',    queries: '224', thumbsDown: '102', hrr: '70%', topTheme: 'Inaccurate information'  },
    { id: '2', article: 'Power Platform Connector Reference',          queries: '187', thumbsDown: '85',  hrr: '72%', topTheme: 'Incomplete / outdated'   },
    { id: '3', article: 'Dynamics 365 FO — Journal Entry Process',    queries: '154', thumbsDown: '71',  hrr: '71%', topTheme: 'Response not relevant'   },
  ],
  'SCIM Identity': [
    { id: '1', article: 'Conditional Access — MFA Registration',       queries: '198', thumbsDown: '44',  hrr: '87%', topTheme: 'Inaccurate information'  },
    { id: '2', article: 'Entra ID — PIM Role Assignment Guide',        queries: '167', thumbsDown: '38',  hrr: '88%', topTheme: 'Response not relevant'   },
  ],
};

// ── Level 3 data: case samples per AHT scenario ──────────────────────────────

const ahtCasesByScenario: Record<string, DrilldownRow[]> = {
  'Screen reader & assistive tech setup': [
    { id: '1', caseId: 'CSE-44821', agentTime: '612 min', topics: 'NVDA + Windows 11 magnifier',       outcome: 'Resolved'   },
    { id: '2', caseId: 'CSE-44803', agentTime: '548 min', topics: 'JAWS screen reader calibration',     outcome: 'Resolved'   },
    { id: '3', caseId: 'CSE-44799', agentTime: '690 min', topics: 'Narrator + Outlook voice control',   outcome: 'Escalated'  },
    { id: '4', caseId: 'CSE-44752', agentTime: '580 min', topics: 'Third-party AT compatibility',       outcome: 'Resolved'   },
  ],
  'Accessibility settings configuration': [
    { id: '1', caseId: 'CSE-44815', agentTime: '498 min', topics: 'High contrast + display scaling',   outcome: 'Resolved'   },
    { id: '2', caseId: 'CSE-44802', agentTime: '521 min', topics: 'Keyboard shortcuts remapping',       outcome: 'Resolved'   },
    { id: '3', caseId: 'CSE-44788', agentTime: '462 min', topics: 'Touch pointer size & color',         outcome: 'Resolved'   },
  ],
  'Hardware adaptations guidance': [
    { id: '1', caseId: 'CSE-44766', agentTime: '580 min', topics: 'Switch Access configuration',       outcome: 'Resolved'   },
    { id: '2', caseId: 'CSE-44751', agentTime: '612 min', topics: 'Eye control device setup',           outcome: 'Escalated'  },
    { id: '3', caseId: 'CSE-44738', agentTime: '544 min', topics: 'Head mouse configuration',           outcome: 'Resolved'   },
  ],
  'Licensing & subscription management': [
    { id: '1', caseId: 'CSE-51204', agentTime: '1,240 min', topics: 'M365 E5→E3 downgrade + seat reallocation', outcome: 'Resolved'   },
    { id: '2', caseId: 'CSE-51198', agentTime: '980 min',   topics: 'License transfer after tenant merger',      outcome: 'Escalated'  },
    { id: '3', caseId: 'CSE-51177', agentTime: '1,100 min', topics: 'Copilot for M365 activation failures',      outcome: 'Resolved'   },
    { id: '4', caseId: 'CSE-51155', agentTime: '890 min',   topics: 'SKU mismatch after 2025 pricing change',    outcome: 'Resolved'   },
  ],
  'Teams meeting policy configuration': [
    { id: '1', caseId: 'CSE-51310', agentTime: '682 min', topics: 'GCC-H meeting recording policy',   outcome: 'Resolved'   },
    { id: '2', caseId: 'CSE-51298', agentTime: '590 min', topics: 'External access + federation',      outcome: 'Escalated'  },
    { id: '3', caseId: 'CSE-51287', agentTime: '720 min', topics: 'Teams Live Events quota limits',    outcome: 'Resolved'   },
  ],
  'Account & billing disputes': [
    { id: '1', caseId: 'CSE-78821', agentTime: '89 min',  topics: 'Unauthorized subscription charge',  outcome: 'Refunded'   },
    { id: '2', caseId: 'CSE-78819', agentTime: '94 min',  topics: 'Family plan billing error',          outcome: 'Resolved'   },
    { id: '3', caseId: 'CSE-78812', agentTime: '78 min',  topics: 'Xbox Gift Card redemption failure',  outcome: 'Resolved'   },
    { id: '4', caseId: 'CSE-78799', agentTime: '102 min', topics: 'Chargeback dispute — game purchase', outcome: 'Escalated'  },
  ],
  'Hardware warranty & repair': [
    { id: '1', caseId: 'CSE-62401', agentTime: '72 min',  topics: 'Surface Pro 9 screen replacement',  outcome: 'Warranty'   },
    { id: '2', caseId: 'CSE-62389', agentTime: '81 min',  topics: 'Laptop Studio 2 hinge failure',      outcome: 'Warranty'   },
    { id: '3', caseId: 'CSE-62374', agentTime: '65 min',  topics: 'Surface Go battery drain issue',     outcome: 'Resolved'   },
  ],
};

const incidentDetails: Record<string, DrilldownRow[]> = {
  'INC-2049': [
    { id: '1', field: 'Summary',          value: 'Compliance scanner rate-limited — GPT-4o 429 errors blocking 180+ articles' },
    { id: '2', field: 'LOB',              value: 'Azure Core, Modern Work, Developer Azure Services' },
    { id: '3', field: 'Opened',           value: '2026-03-20' },
    { id: '4', field: 'Root cause',       value: 'Azure OpenAI S0 tier hitting RateLimitReached on GPT-4o during batch compliance scan' },
    { id: '5', field: 'Impact',           value: '180+ DevOps Wiki articles stuck in scan pending — not non-compliant, scanner failed' },
    { id: '6', field: 'Recommended fix',  value: 'Upgrade scanner to S1 tier or add retry with exponential backoff (linked: action a12)' },
  ],
  'INC-2047': [
    { id: '1', field: 'Summary',          value: 'AHT spike in Azure — content gap confirmed' },
    { id: '2', field: 'LOB',              value: 'Azure Core' },
    { id: '3', field: 'Opened',           value: '2026-03-14' },
    { id: '4', field: 'Root cause',       value: 'Missing articles for Azure Networking and IAM — agents spending extra time researching manually' },
    { id: '5', field: 'Impact',           value: 'AHT for Azure +15% vs prior month. ~340 cases affected.' },
    { id: '6', field: 'Recommended fix',  value: 'Content team assigned 8 new articles. ETA 2 weeks.' },
  ],
  'INC-2043': [
    { id: '1', field: 'Summary',          value: 'Content scoring model drift detected' },
    { id: '2', field: 'LOB',              value: 'All LOBs' },
    { id: '3', field: 'Opened',           value: '2026-03-05' },
    { id: '4', field: 'Root cause',       value: 'Quality scoring model producing inconsistent results after March content schema update' },
    { id: '5', field: 'Impact',           value: 'HRR declining ~1%/week since Mar 5. ~4,600 queries misclassified.' },
    { id: '6', field: 'Recommended fix',  value: 'DS team retraining scoring model; rollback to Feb model as interim mitigation' },
  ],
  'INC-2042': [
    { id: '1', field: 'Summary',          value: 'Retrieval index lag — Azure March batch delayed' },
    { id: '2', field: 'LOB',              value: 'Azure Core' },
    { id: '3', field: 'Opened',           value: '2026-03-02' },
    { id: '4', field: 'Root cause',       value: 'March ingestion batch for Azure not completing within SLA window — index 48h behind' },
    { id: '5', field: 'Impact',           value: 'Azure content 2 days stale in retrieval. 6,340 daily queries serving outdated articles.' },
    { id: '6', field: 'Recommended fix',  value: 'Ingestion team investigating; manual index refresh deployed as temporary mitigation' },
  ],
  'INC-2044': [
    { id: '1', field: 'Summary',          value: 'Intune SCEP profiles returning empty results' },
    { id: '2', field: 'LOB',              value: 'Modern Work' },
    { id: '3', field: 'Opened',           value: '2026-03-08' },
    { id: '4', field: 'Root cause',       value: '"SCEP" not mapped to "Simple Certificate Enrollment Protocol" in synonym dictionary' },
    { id: '5', field: 'Impact',           value: '38 daily queries returning empty. Agents escalating to Intune SME.' },
    { id: '6', field: 'Recommended fix',  value: 'Add SCEP synonym mapping. Content team updating dictionary.' },
  ],
  'INC-2045': [
    { id: '1', field: 'Summary',          value: 'M365 licensing article stale in all channels' },
    { id: '2', field: 'LOB',              value: 'Modern Work' },
    { id: '3', field: 'Opened',           value: '2026-03-10' },
    { id: '4', field: 'Root cause',       value: 'Article last updated Nov 2024 — does not reflect 2025 SKU changes' },
    { id: '5', field: 'Impact',           value: '58 daily queries getting wrong answers. High escalation rate.' },
    { id: '6', field: 'Recommended fix',  value: 'Assigned to Sara Chen (Modern Work). Target refresh: 2026-04-15.' },
  ],
  'INC-2046': [
    { id: '1', field: 'Summary',          value: 'Windows update KB article missing from index' },
    { id: '2', field: 'LOB',              value: 'Windows' },
    { id: '3', field: 'Opened',           value: '2026-03-12' },
    { id: '4', field: 'Root cause',       value: 'March Patch Tuesday KB article not ingested — migration from legacy content system pending' },
    { id: '5', field: 'Impact',           value: 'Windows update queries returning 100% empty results since Mar 12 patch release.' },
    { id: '6', field: 'Recommended fix',  value: 'Manual content upload in progress. ETA: 2026-04-03.' },
  ],
};

const ahtSubData: Record<string, DrilldownRow[]> = {
  'Disability Answer Desk': [
    { id: '1', scenario: 'Screen reader & assistive tech setup',  copilotAht: '612 min', nonCopilotAht: '44 min',  volume: '124' },
    { id: '2', scenario: 'Accessibility settings configuration',  copilotAht: '498 min', nonCopilotAht: '35 min',  volume: '89'  },
    { id: '3', scenario: 'Hardware adaptations guidance',         copilotAht: '580 min', nonCopilotAht: '34 min',  volume: '67'  },
    { id: '4', scenario: 'Magnifier & contrast settings',         copilotAht: '411 min', nonCopilotAht: '29 min',  volume: '44'  },
  ],
  'M365 and Office': [
    { id: '1', scenario: 'Licensing & subscription management',   copilotAht: '1,240 min', nonCopilotAht: '142 min', volume: '312' },
    { id: '2', scenario: 'Teams meeting policy configuration',    copilotAht: '682 min',   nonCopilotAht: '78 min',  volume: '198' },
    { id: '3', scenario: 'Exchange mail flow & routing',          copilotAht: '544 min',   nonCopilotAht: '63 min',  volume: '155' },
    { id: '4', scenario: 'SharePoint permissions & access',       copilotAht: '703 min',   nonCopilotAht: '98 min',  volume: '134' },
  ],
  'Xbox': [
    { id: '1', scenario: 'Account & billing disputes',            copilotAht: '89 min',  nonCopilotAht: '22 min', volume: '1,840' },
    { id: '2', scenario: 'Game Pass cancellation & refunds',      copilotAht: '54 min',  nonCopilotAht: '19 min', volume: '1,210' },
    { id: '3', scenario: 'Console hardware issues',               copilotAht: '71 min',  nonCopilotAht: '38 min', volume: '980'   },
    { id: '4', scenario: 'Online safety & parental controls',     copilotAht: '44 min',  nonCopilotAht: '18 min', volume: '825'   },
  ],
  'Surface': [
    { id: '1', scenario: 'Hardware warranty & repair',            copilotAht: '72 min',  nonCopilotAht: '41 min', volume: '512' },
    { id: '2', scenario: 'Driver & firmware updates',             copilotAht: '48 min',  nonCopilotAht: '29 min', volume: '388' },
    { id: '3', scenario: 'Dock & accessory compatibility',        copilotAht: '39 min',  nonCopilotAht: '24 min', volume: '271' },
  ],
};

// ── KPI Drilldown Content ────────────────────────────────────────────────────
// Keyed by KpiCardData.id — opened when user clicks a KPI tile

export const kpiDrilldownContent: Record<string, DrilldownContent> = {
  hrr: {
    title: 'Hit Rate Resolution — Monthly Trend',
    subtitle: 'Commercial current: 86% | Consumer benchmark: 91.6% | Target: 90%',
    columns: [
      { key: 'month',      header: 'Month'           },
      { key: 'hrr',        header: 'HRR'             },
      { key: 'resolved',   header: 'Cases Resolved'  },
      { key: 'escalated',  header: 'Escalated'       },
      { key: 'topGapLob',  header: 'Top Gap LOB'     },
    ],
    rows: [
      { id: '1',  month: 'Apr 2025', hrr: '90%', resolved: '1,240', escalated: '273', topGapLob: 'Azure Core'   },
      { id: '2',  month: 'May 2025', hrr: '91%', resolved: '1,290', escalated: '271', topGapLob: 'Azure Core'   },
      { id: '3',  month: 'Jun 2025', hrr: '91%', resolved: '1,310', escalated: '253', topGapLob: 'Windows'      },
      { id: '4',  month: 'Jul 2025', hrr: '90%', resolved: '1,198', escalated: '286', topGapLob: 'Modern Work'  },
      { id: '5',  month: 'Aug 2025', hrr: '89%', resolved: '1,175', escalated: '302', topGapLob: 'Modern Work'  },
      { id: '6',  month: 'Sep 2025', hrr: '90%', resolved: '1,221', escalated: '278', topGapLob: 'Azure Core'   },
      { id: '7',  month: 'Oct 2025', hrr: '89%', resolved: '1,205', escalated: '289', topGapLob: 'Azure Core'   },
      { id: '8',  month: 'Nov 2025', hrr: '88%', resolved: '1,160', escalated: '320', topGapLob: 'Azure Core'   },
      { id: '9',  month: 'Dec 2025', hrr: '88%', resolved: '1,135', escalated: '334', topGapLob: 'Azure Core'   },
      { id: '10', month: 'Jan 2026', hrr: '88%', resolved: '1,110', escalated: '351', topGapLob: 'Azure Core'   },
      { id: '11', month: 'Feb 2026', hrr: '87%', resolved: '1,108', escalated: '354', topGapLob: 'Azure Core'   },
      { id: '12', month: 'Mar 2026', hrr: '86%', resolved: '1,125', escalated: '340', topGapLob: 'Azure Core'   },
    ],
    rowDrilldown: (row) => {
      const rows = hrrByLob[row.month as string];
      if (!rows) return null;
      return {
        title: `HRR by LOB — ${row.month}`,
        subtitle: `Overall HRR: ${row.hrr} | ${row.resolved} cases resolved | ${row.escalated} escalated`,
        columns: [
          { key: 'lob',        header: 'LOB'         },
          { key: 'hrr',        header: 'HRR'         },
          { key: 'thumbsUp',   header: 'Thumbs Up'   },
          { key: 'thumbsDown', header: 'Thumbs Down' },
          { key: 'vsTarget',   header: 'vs Target'   },
        ],
        rows,
        rowDrilldown: (lobRow) => {
          const articleRows = hrrArticlesByLob[lobRow.lob as string];
          if (!articleRows) return null;
          return {
            title: `Low-HRR Articles — ${lobRow.lob}`,
            subtitle: `LOB HRR: ${lobRow.hrr} | ${lobRow.thumbsDown} thumbs-down | ${lobRow.vsTarget} vs target`,
            columns: [
              { key: 'article',   header: 'Article'              },
              { key: 'queries',   header: 'Queries (30d)'        },
              { key: 'thumbsDown',header: 'Thumbs Down'          },
              { key: 'hrr',       header: 'Article HRR'          },
              { key: 'topTheme',  header: 'Top Feedback Theme'   },
            ],
            rows: articleRows,
            rowDrilldown: (articleRow) => ({
              title: String(articleRow.article),
              subtitle: `Article HRR: ${articleRow.hrr} | ${articleRow.thumbsDown} negative signals | LOB: ${lobRow.lob}`,
              columns: [
                { key: 'field', header: 'Field'  },
                { key: 'value', header: 'Detail' },
              ],
              rows: [
                { id: '1', field: 'Queries (30d)',      value: articleRow.queries                                                       },
                { id: '2', field: 'Thumbs Down',        value: articleRow.thumbsDown                                                    },
                { id: '3', field: 'Article HRR',        value: articleRow.hrr                                                           },
                { id: '4', field: 'Top feedback theme', value: articleRow.topTheme                                                      },
                { id: '5', field: 'Likely root cause',  value: String(articleRow.topTheme) === 'Hallucinating'      ? 'Model generating unsupported claims — article may have conflicting or ambiguous content'
                                                             : String(articleRow.topTheme) === 'Inaccurate information' ? 'Article content outdated or contains factual errors vs current product behavior'
                                                             : String(articleRow.topTheme) === 'Incomplete / outdated'  ? 'Article not updated to reflect recent product changes'
                                                             : String(articleRow.topTheme) === 'Incorrect source'       ? 'Retrieval returning wrong article for this query pattern'
                                                             : 'Content gap — no article closely matches the query intent'                },
                { id: '6', field: 'Recommended action', value: String(articleRow.topTheme) === 'Hallucinating'      ? 'Review article for ambiguity; add explicit caveats or split into focused sub-articles'
                                                             : String(articleRow.topTheme) === 'Inaccurate information' ? 'Assign to content owner for factual review and update'
                                                             : String(articleRow.topTheme) === 'Incomplete / outdated'  ? 'Refresh article content; update last-modified date and resubmit'
                                                             : String(articleRow.topTheme) === 'Incorrect source'       ? 'Review metadata tags and retrieval synonyms to improve routing'
                                                             : 'Create new article covering this query pattern or expand existing article scope'  },
              ],
            }),
          };
        },
      };
    },
  },

  aht: {
    title: 'AHT — Copilot vs Non-Copilot by LOB',
    subtitle: 'Overall: 55 min (Copilot) vs 125 min (non-Copilot). ⚠ Higher Copilot AHT = complex-case selection bias.',
    columns: [
      { key: 'lob',           header: 'LOB'              },
      { key: 'copilotAht',    header: 'Copilot AHT'      },
      { key: 'nonCopilotAht', header: 'Non-Copilot AHT'  },
      { key: 'copilotPct',    header: 'Copilot Chat %'   },
      { key: 'note',          header: 'Note'             },
    ],
    rows: [
      { id: '1',  lob: 'Disability Answer Desk',   copilotAht: '530 min', nonCopilotAht: '37 min',  copilotPct: '98.5%', note: '⚠ AHT paradox — complex cases' },
      { id: '2',  lob: 'M365 and Office',          copilotAht: '790 min', nonCopilotAht: '96 min',  copilotPct: '92.7%', note: '⚠ Very high — review needed'   },
      { id: '3',  lob: 'Modern Life Advocates',    copilotAht: '332 min', nonCopilotAht: '45 min',  copilotPct: '96.4%', note: '⚠ AHT paradox'                 },
      { id: '4',  lob: 'Outlook',                  copilotAht: '477 min', nonCopilotAht: '18 min',  copilotPct: '89.2%', note: '⚠ AHT paradox'                 },
      { id: '5',  lob: 'Advertising',              copilotAht: '18.8 min',nonCopilotAht: '11 min',  copilotPct: '92.0%', note: '⚠ AHT paradox'                 },
      { id: '6',  lob: 'Store',                    copilotAht: '8.7 min', nonCopilotAht: '0.5 min', copilotPct: '88.6%', note: '⚠ AHT paradox'                 },
      { id: '7',  lob: 'Xbox',                     copilotAht: '67 min',  nonCopilotAht: '26 min',  copilotPct: '96.7%', note: '⚠ AHT paradox'                 },
      { id: '8',  lob: 'Surface',                  copilotAht: '56 min',  nonCopilotAht: '33 min',  copilotPct: '91.0%', note: '⚠ AHT paradox'                 },
      { id: '9',  lob: 'Skype and Teams',          copilotAht: '35 min',  nonCopilotAht: '51 min',  copilotPct: '98.0%', note: '✓ Reduction'                   },
      { id: '10', lob: 'Product Activation',       copilotAht: '42 min',  nonCopilotAht: '44 min',  copilotPct: '44.9%', note: 'Minimal impact'                },
      { id: '11', lob: 'Amplify – MPlus Nurturing',copilotAht: '65 min',  nonCopilotAht: '42 min',  copilotPct: '94.9%', note: '⚠ AHT paradox'                 },
      { id: '12', lob: 'ACA',                      copilotAht: '38 min',  nonCopilotAht: '9 min',   copilotPct: '97.4%', note: '⚠ AHT paradox'                 },
    ],
    rowDrilldown: (row) => {
      const rows = ahtSubData[row.lob as string];
      if (!rows) return null;
      return {
        title: `AHT Detail — ${row.lob}`,
        subtitle: `Copilot: ${row.copilotAht} | Non-Copilot: ${row.nonCopilotAht} | ${row.note}`,
        columns: [
          { key: 'scenario',      header: 'Scenario'         },
          { key: 'copilotAht',    header: 'Copilot AHT'      },
          { key: 'nonCopilotAht', header: 'Non-Copilot AHT'  },
          { key: 'volume',        header: 'Cases (30d)'      },
        ],
        rows,
        rowDrilldown: (scenarioRow) => {
          const caseRows = ahtCasesByScenario[scenarioRow.scenario as string];
          if (!caseRows) return null;
          return {
            title: `Case Samples — ${scenarioRow.scenario}`,
            subtitle: `Copilot AHT: ${scenarioRow.copilotAht} | Non-Copilot: ${scenarioRow.nonCopilotAht} | Volume: ${scenarioRow.volume} cases`,
            columns: [
              { key: 'caseId',    header: 'Case ID'       },
              { key: 'agentTime', header: 'Handle Time'   },
              { key: 'topics',    header: 'Topics'        },
              { key: 'outcome',   header: 'Outcome'       },
            ],
            rows: caseRows,
            rowDrilldown: (caseRow) => ({
              title: `Case Detail — ${caseRow.caseId}`,
              subtitle: `${scenarioRow.scenario} · ${row.lob}`,
              columns: [
                { key: 'field', header: 'Field'  },
                { key: 'value', header: 'Detail' },
              ],
              rows: [
                { id: '1', field: 'Case ID',          value: caseRow.caseId                                                        },
                { id: '2', field: 'LOB',              value: row.lob                                                                },
                { id: '3', field: 'Scenario',         value: scenarioRow.scenario                                                   },
                { id: '4', field: 'Handle time',      value: caseRow.agentTime                                                     },
                { id: '5', field: 'Topics covered',   value: caseRow.topics                                                        },
                { id: '6', field: 'Outcome',          value: caseRow.outcome                                                       },
                { id: '7', field: 'Copilot AHT avg',  value: scenarioRow.copilotAht                                                },
                { id: '8', field: 'Non-Copilot avg',  value: scenarioRow.nonCopilotAht                                             },
                { id: '9', field: 'AHT note',         value: String(caseRow.agentTime) > String(scenarioRow.nonCopilotAht)
                    ? '⚠ Above non-Copilot average — likely high-complexity case selected for Copilot assistance'
                    : '✓ Within expected range for Copilot-assisted handling'
                },
              ],
            }),
          };
        },
      };
    },
  },

  copilotAdoption: {
    title: 'Copilot Adoption by Segment & LOB',
    subtitle: 'Commercial: 11% | Consumer: 95.9% | Large gap signals commercial enablement gap',
    columns: [
      { key: 'lob',       header: 'LOB'            },
      { key: 'segment',   header: 'Segment'        },
      { key: 'adoption',  header: 'Copilot Chat %' },
      { key: 'hrr',       header: 'HRR'            },
    ],
    rows: [
      { id: '1',  lob: 'Modern Life',              segment: 'Consumer',   adoption: '95.6%', hrr: '92.9%' },
      { id: '2',  lob: 'Xbox',                     segment: 'Consumer',   adoption: '96.7%', hrr: '89.9%' },
      { id: '3',  lob: 'Modern Life Advocates',    segment: 'Consumer',   adoption: '96.4%', hrr: '93.6%' },
      { id: '4',  lob: 'Skype and Teams',          segment: 'Consumer',   adoption: '98.0%', hrr: '82.4%' },
      { id: '5',  lob: 'Advertising',              segment: 'Consumer',   adoption: '92.0%', hrr: '76.4%' },
      { id: '6',  lob: 'Store',                    segment: 'Consumer',   adoption: '88.6%', hrr: '81.6%' },
      { id: '7',  lob: 'Surface',                  segment: 'Consumer',   adoption: '91.0%', hrr: '60.8%' },
      { id: '8',  lob: 'MW Commercial',            segment: 'Commercial', adoption: '14%',   hrr: '84.2%' },
      { id: '9',  lob: 'Windows Commercial',       segment: 'Commercial', adoption: '11%',   hrr: '82.3%' },
      { id: '10', lob: 'AIPD Commercial',          segment: 'Commercial', adoption: '9%',    hrr: '81.7%' },
      { id: '11', lob: 'BizApps',                  segment: 'Commercial', adoption: '8%',    hrr: '77.1%' },
      { id: '12', lob: 'SCIM FTE',                 segment: 'Commercial', adoption: '6%',    hrr: '79.4%' },
    ],
  },

  emptyResults: {
    title: 'Empty Result Queries — Top Samples by LOB',
    subtitle: 'Empty results rate: 18% (+5% vs last 30d) | Sorted by volume',
    columns: [
      { key: 'lob',      header: 'LOB'       },
      { key: 'query',    header: 'Query'     },
      { key: 'count',    header: 'Count'     },
      { key: 'lastSeen', header: 'Last Seen' },
    ],
    rows: [
      { id: 'e1',  lob: 'M365 and Office', query: 'How do I cancel my Microsoft 365 Family subscription?',          count: 84, lastSeen: '2026-03-17' },
      { id: 'e2',  lob: 'M365 and Office', query: 'Microsoft 365 Personal — can I use it on more than one device?', count: 71, lastSeen: '2026-03-16' },
      { id: 'e3',  lob: 'M365 and Office', query: 'How do I transfer my Microsoft 365 license to a new PC?',        count: 63, lastSeen: '2026-03-15' },
      { id: 'e4',  lob: 'M365 and Office', query: 'Office apps not activating after reinstall — home user',         count: 58, lastSeen: '2026-03-14' },
      { id: 'e5',  lob: 'Advertising',     query: 'Microsoft Advertising — conversion tracking setup',              count: 44, lastSeen: '2026-03-17' },
      { id: 'e6',  lob: 'Advertising',     query: 'Bing Ads — audience targeting not working',                      count: 36, lastSeen: '2026-03-16' },
      { id: 'e7',  lob: 'Advertising',     query: 'Microsoft Advertising API rate limit exceeded',                  count: 28, lastSeen: '2026-03-15' },
      { id: 'e8',  lob: 'Modern Life',     query: 'How to enable Copilot in Teams for GCC tenants?',                count: 55, lastSeen: '2026-03-17' },
      { id: 'e9',  lob: 'Modern Life',     query: 'Shared mailbox calendar permissions in Exchange',                count: 38, lastSeen: '2026-03-15' },
      { id: 'e10', lob: 'Modern Life',     query: 'M365 Defender — alert suppression rules',                        count: 29, lastSeen: '2026-03-13' },
      { id: 'e11', lob: 'Xbox',            query: 'Xbox family settings parental control limits',                   count: 33, lastSeen: '2026-03-16' },
      { id: 'e12', lob: 'Xbox',            query: 'How to migrate Xbox profile to new region',                      count: 27, lastSeen: '2026-03-14' },
      { id: 'e13', lob: 'Xbox',            query: 'Xbox Game Pass — download queue not progressing',                count: 21, lastSeen: '2026-03-12' },
      { id: 'e14', lob: 'Surface',         query: 'Surface Laptop Studio 2 dock compatibility',                     count: 19, lastSeen: '2026-03-15' },
      { id: 'e15', lob: 'Surface',         query: 'Surface Pro 10 pen firmware update steps',                       count: 14, lastSeen: '2026-03-10' },
      { id: 'e16', lob: 'Store',           query: 'Microsoft Store — purchase pending but charged',                 count: 12, lastSeen: '2026-03-14' },
      { id: 'e17', lob: 'Store',           query: 'How to request a refund in the Microsoft Store',                 count: 9,  lastSeen: '2026-03-11' },
    ],
    rowDrilldown: (row) => ({
      title: 'Query Gap Analysis',
      subtitle: `"${row.query}"`,
      columns: [
        { key: 'field', header: 'Analysis'  },
        { key: 'value', header: 'Detail'    },
      ],
      rows: [
        { id: '1', field: 'LOB',                value: row.lob                                                },
        { id: '2', field: 'Frequency (30d)',     value: `${row.count} queries returned empty`                 },
        { id: '3', field: 'Last seen',           value: row.lastSeen                                          },
        { id: '4', field: 'Root cause',          value: 'No matching article in knowledge base for this query pattern' },
        { id: '5', field: 'Nearest content',     value: 'Partial match found — article coverage incomplete'  },
        { id: '6', field: 'Estimated impact',    value: `~${Math.round(Number(row.count) * 0.8)} fewer escalations/month if gap filled` },
        { id: '7', field: 'Recommended action',  value: 'Create or update article. Tag with matching LOB and product keywords.' },
      ],
    }),
  },

  citationCoverage: {
    title: 'Content Quality by LOB — Last 3 Months',
    subtitle: 'Citation coverage: 61% (−7% vs last 30d) | Scores reflect article quality review pass rate',
    columns: [
      { key: 'lob',              header: 'LOB'               },
      { key: 'month',            header: 'Month'             },
      { key: 'score',            header: 'Quality Score'     },
      { key: 'topIssue',         header: 'Top Issue'         },
      { key: 'articlesReviewed', header: 'Articles Reviewed' },
    ],
    rows: [
      { id: 'q1',  lob: 'Azure Core',    month: 'Jan', score: '77%', topIssue: 'Missing metadata',         articlesReviewed: 42 },
      { id: 'q2',  lob: 'Azure Core',    month: 'Feb', score: '74%', topIssue: 'Content gap (networking)', articlesReviewed: 38 },
      { id: 'q3',  lob: 'Azure Core',    month: 'Mar', score: '72%', topIssue: 'Content gap (networking)', articlesReviewed: 35 },
      { id: 'q4',  lob: 'Modern Work',   month: 'Jan', score: '83%', topIssue: 'Stale Teams policy docs',  articlesReviewed: 51 },
      { id: 'q5',  lob: 'Modern Work',   month: 'Feb', score: '82%', topIssue: 'Stale Teams policy docs',  articlesReviewed: 49 },
      { id: 'q6',  lob: 'Modern Work',   month: 'Mar', score: '81%', topIssue: 'Stale Teams policy docs',  articlesReviewed: 47 },
      { id: 'q7',  lob: 'Windows',       month: 'Jan', score: '80%', topIssue: 'Update article coverage',  articlesReviewed: 38 },
      { id: 'q8',  lob: 'Windows',       month: 'Feb', score: '79%', topIssue: 'Update article coverage',  articlesReviewed: 36 },
      { id: 'q9',  lob: 'Windows',       month: 'Mar', score: '78%', topIssue: 'Update article coverage',  articlesReviewed: 34 },
      { id: 'q10', lob: 'BizApps',       month: 'Jan', score: '89%', topIssue: 'Draft abandonment (80%+)', articlesReviewed: 18 },
      { id: 'q11', lob: 'BizApps',       month: 'Feb', score: '88%', topIssue: 'Draft abandonment (80%+)', articlesReviewed: 16 },
      { id: 'q12', lob: 'BizApps',       month: 'Mar', score: '86%', topIssue: 'Draft abandonment (80%+)', articlesReviewed: 14 },
      { id: 'q13', lob: 'SCIM Identity', month: 'Jan', score: '93%', topIssue: 'None',                     articlesReviewed: 29 },
      { id: 'q14', lob: 'SCIM Identity', month: 'Feb', score: '92%', topIssue: 'None',                     articlesReviewed: 27 },
      { id: 'q15', lob: 'SCIM Identity', month: 'Mar', score: '91%', topIssue: 'Enrollment content gap',   articlesReviewed: 26 },
    ],
  },

  ingestionRate: {
    title: 'Ingestion Success — Monthly Detail',
    subtitle: 'Ingestion rate: 83% | Block rate trend: 12% (Oct) → 17% (Mar) — worsening',
    columns: [
      { key: 'month',     header: 'Month'      },
      { key: 'ingested',  header: 'Ingested'   },
      { key: 'pending',   header: 'Pending'    },
      { key: 'blocked',   header: 'Blocked'    },
      { key: 'total',     header: 'Total'      },
      { key: 'blockRate', header: 'Block Rate' },
    ],
    rows: [
      { id: '1', month: 'Oct 2025', ingested: '4,200', pending: '280', blocked: '610', total: '5,090', blockRate: '12.0%' },
      { id: '2', month: 'Nov 2025', ingested: '4,450', pending: '310', blocked: '590', total: '5,350', blockRate: '11.0%' },
      { id: '3', month: 'Dec 2025', ingested: '4,100', pending: '350', blocked: '700', total: '5,150', blockRate: '13.6%' },
      { id: '4', month: 'Jan 2026', ingested: '4,380', pending: '290', blocked: '720', total: '5,390', blockRate: '13.4%' },
      { id: '5', month: 'Feb 2026', ingested: '4,250', pending: '320', blocked: '850', total: '5,420', blockRate: '15.7%' },
      { id: '6', month: 'Mar 2026', ingested: '4,160', pending: '340', blocked: '890', total: '5,390', blockRate: '16.5%' },
    ],
  },

  blockedPct: {
    title: 'Blocked Articles by LOB',
    subtitle: '17% blocked rate | 33,425 articles tracked | Top causes: compliance scan failure, missing metadata',
    columns: [
      { key: 'lob',     header: 'LOB'          },
      { key: 'article', header: 'Article'      },
      { key: 'owner',   header: 'Owner'        },
      { key: 'reason',  header: 'Block Reason' },
      { key: 'ageDays', header: 'Age'          },
    ],
    rows: Object.entries(blockedArticlesByLob).flatMap(([lob, rows]) =>
      rows.map(r => ({ ...r, lob }))
    ),
    rowDrilldown: (row) => ({
      title: String(row.article),
      subtitle: `${row.lob} · Blocked ${row.ageDays} · Owner: ${row.owner}`,
      columns: [
        { key: 'field', header: 'Field'  },
        { key: 'value', header: 'Detail' },
      ],
      rows: [
        { id: '1', field: 'Article',          value: row.article                                            },
        { id: '2', field: 'LOB',              value: row.lob                                                },
        { id: '3', field: 'Owner',            value: row.owner                                              },
        { id: '4', field: 'Block reason',     value: row.reason                                             },
        { id: '5', field: 'Blocked since',    value: `${row.ageDays} ago`                                   },
        { id: '6', field: 'Recommended fix',  value: String(row.reason).includes('rate limit')
            ? 'Compliance scanner 429 error — requeue after scanner capacity is restored (see INC-2049)'
            : String(row.reason).includes('PII')
              ? 'Remove or redact PII from article content before resubmitting'
              : String(row.reason).includes('metadata')
                ? 'Add required LOB and product metadata tags via the content management portal'
                : String(row.reason).includes('Duplicate')
                  ? 'Review and merge with canonical article or delete duplicate'
                  : 'Review content for compliance and resubmit through ingestion pipeline'
        },
        { id: '7', field: 'Priority',         value: String(row.reason).includes('rate limit') ? 'Low (scanner issue, not content)' : 'High' },
      ],
    }),
  },

  retrievalSuccess: {
    title: 'Helpful Response Rate — Monthly Detail',
    subtitle: 'HRR: 67% (−4% vs last month) | Query volume growing while success rate falls',
    columns: [
      { key: 'month',         header: 'Month'            },
      { key: 'rate',          header: 'Success Rate'     },
      { key: 'totalQueries',  header: 'Total Queries'    },
      { key: 'failedQueries', header: 'Failed Queries'   },
      { key: 'topFailureLob', header: 'Top Failure LOB'  },
    ],
    rows: [
      { id: '1', month: 'Oct 2025', rate: '84%', totalQueries: '18,400', failedQueries: '2,944', topFailureLob: 'Modern Work'  },
      { id: '2', month: 'Nov 2025', rate: '83%', totalQueries: '19,100', failedQueries: '3,247', topFailureLob: 'Modern Work'  },
      { id: '3', month: 'Dec 2025', rate: '81%', totalQueries: '17,800', failedQueries: '3,382', topFailureLob: 'Azure Core'   },
      { id: '4', month: 'Jan 2026', rate: '80%', totalQueries: '20,200', failedQueries: '4,040', topFailureLob: 'Azure Core'   },
      { id: '5', month: 'Feb 2026', rate: '80%', totalQueries: '21,500', failedQueries: '4,300', topFailureLob: 'Azure Core'   },
      { id: '6', month: 'Mar 2026', rate: '79%', totalQueries: '22,100', failedQueries: '4,641', topFailureLob: 'Azure Core'   },
    ],
  },

  openIncidents: {
    title: 'Open Incidents',
    subtitle: '7 open — 4 High severity | Most recent: INC-2049 Compliance scanner rate-limited',
    columns: [
      { key: 'incident', header: 'Incident'  },
      { key: 'summary',  header: 'Summary'   },
      { key: 'severity', header: 'Severity'  },
      { key: 'status',   header: 'Status'    },
      { key: 'opened',   header: 'Opened'    },
    ],
    rows: [
      { id: 'INC-2049', incident: 'INC-2049', summary: 'Compliance scanner rate-limited — GPT-4o 429 errors blocking 180+ articles',   severity: 'High',   status: 'Open',      opened: '2026-03-20' },
      { id: 'INC-2047', incident: 'INC-2047', summary: 'AHT spike in Azure — content gap confirmed',                                    severity: 'High',   status: 'Open',      opened: '2026-03-14' },
      { id: 'INC-2043', incident: 'INC-2043', summary: 'Content scoring model drift detected',                                          severity: 'High',   status: 'Open',      opened: '2026-03-05' },
      { id: 'INC-2042', incident: 'INC-2042', summary: 'Retrieval index lag — Azure March batch delayed',                               severity: 'High',   status: 'Open',      opened: '2026-03-02' },
      { id: 'INC-2044', incident: 'INC-2044', summary: 'Intune SCEP profiles returning empty results',                                  severity: 'Medium', status: 'Open',      opened: '2026-03-08' },
      { id: 'INC-2045', incident: 'INC-2045', summary: 'M365 licensing article stale in all channels',                                  severity: 'Medium', status: 'Open',      opened: '2026-03-10' },
      { id: 'INC-2046', incident: 'INC-2046', summary: 'Windows update KB article missing from index',                                  severity: 'Medium', status: 'Open',      opened: '2026-03-12' },
    ],
    rowDrilldown: (row) => {
      const rows = incidentDetails[row.incident as string];
      if (!rows) return null;
      return {
        title: `${row.incident} — Incident Detail`,
        subtitle: `${row.severity} severity · ${row.status} · Opened ${row.opened}`,
        columns: [
          { key: 'field', header: 'Field'  },
          { key: 'value', header: 'Detail' },
        ],
        rows,
      };
    },
  },
};
