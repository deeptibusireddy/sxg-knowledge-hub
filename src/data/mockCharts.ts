import type { TimePoint, CategoryPoint } from '../types';

// ── Content Health ──────────────────────────────────────────────────────────
export const ingestionStatusOverTime: TimePoint[] = [
  { date: 'Oct', Ingested: 4200, Blocked: 610, Pending: 280 },
  { date: 'Nov', Ingested: 4450, Blocked: 590, Pending: 310 },
  { date: 'Dec', Ingested: 4100, Blocked: 700, Pending: 350 },
  { date: 'Jan', Ingested: 4380, Blocked: 720, Pending: 290 },
  { date: 'Feb', Ingested: 4250, Blocked: 850, Pending: 320 },
  { date: 'Mar', Ingested: 4160, Blocked: 890, Pending: 340 },
];

export const blockedByLob: CategoryPoint[] = [
  { name: 'Azure Core', count: 312 },
  { name: 'Modern Work', count: 204 },
  { name: 'Developer Azure Services', count: 149 },
  { name: 'SCIM Sec & Compliance', count: 133 },
  { name: 'Windows', count: 77 },
  { name: 'BizApps', count: 52 },
];

// ── Support Quality ─────────────────────────────────────────────────────────
export const answerQualityTrend: TimePoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 68 + Math.sin(i / 4) * 8 + (i > 20 ? -6 : 0);
  return { date: `D${i + 1}`, score: Math.round(base) };
});

export const emptyResultsByLob: CategoryPoint[] = [
  { name: 'M365 and Office', count: 420 },
  { name: 'Modern Life',     count: 310 },
  { name: 'Xbox',            count: 275 },
  { name: 'Surface',         count: 140 },
  { name: 'Store',           count: 95  },
  { name: 'Advertising',     count: 185 },
];

export const feedbackDistribution: CategoryPoint[] = [
  { name: 'Response not relevant', value: 29 },
  { name: 'No information provided', value: 28 },
  { name: 'Not helpful', value: 11 },
  { name: 'Inaccurate information', value: 9 },
  { name: 'Incorrect source', value: 8 },
  { name: 'Incomplete / outdated', value: 8 },
  { name: 'Hallucinating', value: 7 },
];

// ── Business Outcomes ───────────────────────────────────────────────────────
export const hrrTrend: TimePoint[] = [
  { date: 'Apr', hrr: 90 },
  { date: 'May', hrr: 91 },
  { date: 'Jun', hrr: 91 },
  { date: 'Jul', hrr: 90 },
  { date: 'Aug', hrr: 89 },
  { date: 'Sep', hrr: 90 },
  { date: 'Oct', hrr: 89 },
  { date: 'Nov', hrr: 88 },
  { date: 'Dec', hrr: 88 },
  { date: 'Jan', hrr: 88 },
  { date: 'Feb', hrr: 87 },
  { date: 'Mar', hrr: 86 },
];

export const ahtByProduct: CategoryPoint[] = [
  { name: 'Azure',   copilot: 55,  nonCopilot: 128 },
  { name: 'M365',    copilot: 41,  nonCopilot: 96  },
  { name: 'Windows', copilot: 176, nonCopilot: 150 },
  { name: 'Surface', copilot: 38,  nonCopilot: 84  },
  { name: 'Intune',  copilot: 62,  nonCopilot: 135 },
];

export const escalationsByLob: CategoryPoint[] = [
  { name: 'Azure', count: 84 },
  { name: 'Microsoft 365', count: 62 },
  { name: 'Windows', count: 71 },
  { name: 'Surface', count: 33 },
  { name: 'Xbox', count: 28 },
  { name: 'Intune', count: 47 },
];

// ── Program Health ──────────────────────────────────────────────────────────
export const retrievalSuccessTrend: TimePoint[] = [
  { date: 'Oct', rate: 72 },
  { date: 'Nov', rate: 71 },
  { date: 'Dec', rate: 70 },
  { date: 'Jan', rate: 69 },
  { date: 'Feb', rate: 68 },
  { date: 'Mar', rate: 67 },
];

export const qualityByLob: CategoryPoint[] = [
  { name: 'Azure Core',   jan: 77, feb: 74, mar: 72 },
  { name: 'Modern Work',  jan: 83, feb: 82, mar: 81 },
  { name: 'Windows',      jan: 80, feb: 79, mar: 78 },
  { name: 'BizApps',      jan: 89, feb: 88, mar: 86 },
  { name: 'SCIM Identity',jan: 93, feb: 92, mar: 91 },
];

export const incidentVolume: TimePoint[] = [
  { date: 'Oct', count: 3 },
  { date: 'Nov', count: 2 },
  { date: 'Dec', count: 5 },
  { date: 'Jan', count: 4 },
  { date: 'Feb', count: 6 },
  { date: 'Mar', count: 7 },
];
