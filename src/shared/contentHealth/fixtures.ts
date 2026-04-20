// TODO(real-data): This file is a TEMPORARY stand-in for the real Content
// Health data tables. See README.md in this folder for the handoff plan
// ("When real data lands"). Replace these exports with an async loader that
// returns the same `ContentHealthDataset` shape from types.ts. Do NOT add
// parallel mocks elsewhere in the repo — extend this file instead.

import type {
  AuthoringEvent,
  ContentHealthDataset,
  Doc,
  FeedbackEvent,
  LobArea,
  Product,
  SearchMiss,
} from './types';

const PRODUCTS: Product[] = ['AAQ', 'CMSP', 'AI Native'];
const LOBS: LobArea[] = ['Azure', 'Microsoft 365', 'Windows', 'Surface', 'Xbox', 'Intune'];
const OWNERS = ['a.chen', 'r.patel', 'm.silva', 's.okafor', 'j.müller', 'k.tanaka', 'l.dubois', 'n.singh'];
const AUTHORS = [...OWNERS, 'd.kim', 'p.romero'];

// Tiny seeded PRNG so fixtures are stable across renders/builds.
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260418);
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const intBetween = (lo: number, hi: number) => Math.floor(rand() * (hi - lo + 1)) + lo;

const TODAY = new Date('2026-04-18T00:00:00Z');
const dayOffset = (n: number) => {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};

function makeDocs(): Doc[] {
  const docs: Doc[] = [];
  for (let i = 0; i < 180; i++) {
    const product = pick(PRODUCTS);
    const lob = pick(LOBS);
    const ageDays = intBetween(1, 720);
    const updateDays = Math.min(ageDays, intBetween(0, 540));
    docs.push({
      id: `doc-${String(i).padStart(4, '0')}`,
      title: `${lob} · ${product} · article ${i + 1}`,
      product,
      lob,
      owner: pick(OWNERS),
      publishedAt: dayOffset(ageDays),
      lastUpdated: dayOffset(updateDays),
      wordCount: intBetween(180, 4200),
      hasMetadata: rand() > 0.18,
      brokenLinkCount: rand() > 0.78 ? intBetween(1, 6) : 0,
      readability: Math.round((40 + rand() * 50) * 10) / 10,
    });
  }
  return docs;
}

function makeAuthoring(): AuthoringEvent[] {
  const out: AuthoringEvent[] = [];
  for (let d = 89; d >= 0; d--) {
    const merges = intBetween(0, 7);
    for (let k = 0; k < merges; k++) {
      out.push({
        id: `pr-${d}-${k}`,
        mergedAt: dayOffset(d),
        author: pick(AUTHORS),
        product: pick(PRODUCTS),
        lob: pick(LOBS),
        size: intBetween(8, 640),
      });
    }
  }
  return out;
}

function makeFeedback(docs: Doc[]): FeedbackEvent[] {
  const out: FeedbackEvent[] = [];
  // Sample 60 docs, generate 30 daily rows each.
  const sampled = docs.slice(0, 60);
  for (const doc of sampled) {
    for (let d = 29; d >= 0; d--) {
      const views = intBetween(5, 320);
      const up = Math.floor(views * (0.04 + rand() * 0.08));
      const down = Math.floor(views * (0.005 + rand() * 0.03));
      out.push({ docId: doc.id, date: dayOffset(d), views, thumbsUp: up, thumbsDown: down });
    }
  }
  return out;
}

const SEARCH_MISS_QUERIES = [
  'reset partner tenant secret',
  'cmsp onboarding ddos',
  'aaq fallback latency p99',
  'ai native eval rubric template',
  'partner offboarding playbook',
  'azure b2b graph throttling',
  'm365 license sku mapping',
  'xbox content takedown sla',
  'surface firmware rollback',
  'intune compliance retry policy',
  'export usage report parquet',
  'how to file content removal request',
];

function makeSearchMisses(): SearchMiss[] {
  return SEARCH_MISS_QUERIES.map((q) => ({
    query: q,
    occurrences: intBetween(12, 240),
    lastSeen: dayOffset(intBetween(0, 21)),
  })).sort((a, b) => b.occurrences - a.occurrences);
}

const docs = makeDocs();
const authoring = makeAuthoring();
const feedback = makeFeedback(docs);
const searchMisses = makeSearchMisses();

export const contentHealthDataset: ContentHealthDataset = {
  docs,
  authoring,
  feedback,
  searchMisses,
  generatedAt: TODAY.toISOString(),
};
