import type { ActionItem } from '../types';

export const actionItems: ActionItem[] = [
  {
    id: 'a1',
    priority: 'High',
    persona: 'Content Manager',
    description: '14 Azure LOB articles blocked due to missing metadata tags — assign to content owner and remediate.',
    section: 'content-health',
  },
  {
    id: 'a2',
    priority: 'High',
    persona: 'Support Engineer',
    description: 'Empty results for "SLA policy" queries spiked 18% this week — retest key prompts and flag gaps.',
    section: 'support-quality',
  },
  {
    id: 'a3',
    priority: 'High',
    persona: 'Program Leader',
    description: 'INC-2041: Azure ingestion pipeline failure is unresolved — escalate to engineering for root cause.',
    section: 'program-health',
  },
  {
    id: 'a4',
    priority: 'Medium',
    persona: 'LOB Leader',
    description: 'Windows LOB HRR dropped 4% over last 30 days — investigate content gaps in Windows update articles.',
    section: 'business-outcomes',
  },
  {
    id: 'a5',
    priority: 'Medium',
    persona: 'Content Manager',
    description: 'Metadata coverage below 70% for Intune and Azure LOBs — run bulk tag update to restore searchability.',
    section: 'content-health',
  },
  {
    id: 'a6',
    priority: 'Medium',
    persona: 'Support Engineer',
    description: 'Feedback score for Azure LOB dropped to 62% — coordinate retest session on top 10 Azure prompts.',
    section: 'support-quality',
  },
  {
    id: 'a7',
    priority: 'Medium',
    persona: 'Program Leader',
    description: 'Retrieval success has declined for 2 consecutive months — add to next shiproom agenda.',
    section: 'program-health',
  },
  {
    id: 'a8',
    priority: 'Low',
    persona: 'LOB Leader',
    description: '3 open incidents are older than 7 days — review status with owning LOB leads and close or escalate.',
    section: 'program-health',
  },
  {
    id: 'a9',
    priority: 'Low',
    persona: 'Content Manager',
    description: 'Xbox article "Ban Appeal Process" is 45 days old and blocked — determine if content should be archived.',
    section: 'content-health',
  },
];
