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
  { name: 'Azure', count: 312 },
  { name: 'Microsoft 365', count: 198 },
  { name: 'Windows', count: 147 },
  { name: 'Surface', count: 88 },
  { name: 'Xbox', count: 63 },
  { name: 'Intune', count: 82 },
];

// ── Support Quality ─────────────────────────────────────────────────────────
export const answerQualityTrend: TimePoint[] = Array.from({ length: 30 }, (_, i) => {
  const base = 68 + Math.sin(i / 4) * 8 + (i > 20 ? -6 : 0);
  return { date: `D${i + 1}`, score: Math.round(base) };
});

export const emptyResultsByLob: CategoryPoint[] = [
  { name: 'Azure', count: 420 },
  { name: 'Microsoft 365', count: 310 },
  { name: 'Windows', count: 275 },
  { name: 'Surface', count: 140 },
  { name: 'Xbox', count: 95 },
  { name: 'Intune', count: 185 },
];

export const feedbackDistribution: CategoryPoint[] = [
  { name: 'Helpful', value: 54 },
  { name: 'Not Helpful', value: 28 },
  { name: 'No Response', value: 18 },
];

// ── Business Outcomes ───────────────────────────────────────────────────────
export const hrrTrend: TimePoint[] = [
  { date: 'Apr', hrr: 78 },
  { date: 'May', hrr: 79 },
  { date: 'Jun', hrr: 80 },
  { date: 'Jul', hrr: 77 },
  { date: 'Aug', hrr: 76 },
  { date: 'Sep', hrr: 78 },
  { date: 'Oct', hrr: 77 },
  { date: 'Nov', hrr: 75 },
  { date: 'Dec', hrr: 74 },
  { date: 'Jan', hrr: 73 },
  { date: 'Feb', hrr: 73 },
  { date: 'Mar', hrr: 74 },
];

export const ahtByProduct: CategoryPoint[] = [
  { name: 'Azure', current: 11.2, prior: 10.1 },
  { name: 'M365', current: 8.4, prior: 8.1 },
  { name: 'Windows', current: 9.7, prior: 9.0 },
  { name: 'Surface', current: 7.8, prior: 7.5 },
  { name: 'Intune', current: 10.3, prior: 9.6 },
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
  { date: 'Oct', rate: 84 },
  { date: 'Nov', rate: 83 },
  { date: 'Dec', rate: 81 },
  { date: 'Jan', rate: 80 },
  { date: 'Feb', rate: 80 },
  { date: 'Mar', rate: 79 },
];

export const qualityByLob: CategoryPoint[] = [
  { name: 'Azure', jan: 77, feb: 74, mar: 72 },
  { name: 'M365', jan: 83, feb: 82, mar: 81 },
  { name: 'Windows', jan: 80, feb: 79, mar: 78 },
  { name: 'Surface', jan: 85, feb: 85, mar: 84 },
  { name: 'Intune', jan: 76, feb: 75, mar: 74 },
];

export const incidentVolume: TimePoint[] = [
  { date: 'Oct', count: 3 },
  { date: 'Nov', count: 2 },
  { date: 'Dec', count: 5 },
  { date: 'Jan', count: 4 },
  { date: 'Feb', count: 6 },
  { date: 'Mar', count: 7 },
];
