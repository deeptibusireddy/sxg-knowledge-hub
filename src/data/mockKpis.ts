import type { KpiCardData } from '../types';

export const kpiCards: KpiCardData[] = [
  // Business Outcomes
  {
    id: 'hrr',
    label: 'Hit Rate Resolution',
    value: '74',
    unit: '%',
    trend: 'down',
    trendLabel: '−3% vs last month',
    positiveIsUp: true,
  },
  {
    id: 'aht',
    label: 'Avg Handle Time',
    value: '9.2',
    unit: 'min',
    trend: 'up',
    trendLabel: '+0.8 min vs last month',
    positiveIsUp: false,
  },
  // Support Quality
  {
    id: 'emptyResults',
    label: 'Empty Results Rate',
    value: '18',
    unit: '%',
    trend: 'up',
    trendLabel: '+5% vs last 30d',
    positiveIsUp: false,
  },
  {
    id: 'citationCoverage',
    label: 'Citation Coverage',
    value: '61',
    unit: '%',
    trend: 'down',
    trendLabel: '−7% vs last 30d',
    positiveIsUp: true,
  },
  // Content Health
  {
    id: 'ingestionRate',
    label: 'Ingestion Success',
    value: '83',
    unit: '%',
    trend: 'up',
    trendLabel: '+2% vs last month',
    positiveIsUp: true,
  },
  {
    id: 'blockedPct',
    label: 'Blocked Articles',
    value: '17',
    unit: '%',
    trend: 'down',
    trendLabel: '+1% vs last month',
    positiveIsUp: false,
  },
  // Program Health
  {
    id: 'retrievalSuccess',
    label: 'Retrieval Success',
    value: '79',
    unit: '%',
    trend: 'down',
    trendLabel: '−4% vs last month',
    positiveIsUp: true,
  },
  {
    id: 'openIncidents',
    label: 'Open Incidents',
    value: '7',
    trend: 'up',
    trendLabel: '+3 vs last month',
    positiveIsUp: false,
  },
];
