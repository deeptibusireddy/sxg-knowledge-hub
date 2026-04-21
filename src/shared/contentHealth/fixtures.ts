// TODO(real-data): This file is a TEMPORARY stand-in for the real Content
// Health data tables. See README.md in this folder for the handoff plan
// ("When real data lands"). Replace these exports with an async loader that
// returns the same `ContentHealthDataset` shape from types.ts. Do NOT add
// parallel mocks elsewhere in the repo — extend this file instead.

import type {
  AiAnswerEvent,
  AuthoringEvent,
  ContentHealthDataset,
  Doc,
  DocSource,
  FeedbackEvent,
  IntakeRequest,
  IntakeState,
  LobArea,
  PriorityScenario,
  Product,
  Sbu,
  ScenarioPriority,
  ScenarioStatus,
  SearchEvent,
  SearchMiss,
  SelfHelpSession,
} from './types';

const PRODUCTS: Product[] = ['AAQ', 'CMSP', 'AI Native'];
const LOBS: LobArea[] = ['Azure', 'Microsoft 365', 'Windows', 'Surface', 'Xbox', 'Intune'];
const OWNERS = ['a.chen', 'r.patel', 'm.silva', 's.okafor', 'j.müller', 'k.tanaka', 'l.dubois', 'n.singh'];
const AUTHORS = [...OWNERS, 'd.kim', 'p.romero'];

// Map LOB → SBU (single source of truth for the demo).
const LOB_TO_SBU: Record<LobArea, Sbu> = {
  'Azure':         'Cloud + AI',
  'Microsoft 365': 'Modern Work',
  'Windows':       'Devices',
  'Surface':       'Devices',
  'Xbox':          'Gaming',
  'Intune':        'Security',
};

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

// Per-LOB source weights — modeled loosely after where each LOB's content
// actually lives today (Cornerstone is the dominant ingestion target).
const SOURCE_WEIGHTS: Record<LobArea, Array<[DocSource, number]>> = {
  'Azure':         [['Cornerstone', 50], ['Learn', 25], ['Wiki', 10], ['GitHub', 10], ['LLC', 3],  ['Other', 2]],
  'Microsoft 365': [['Cornerstone', 45], ['Learn', 30], ['Wiki', 10], ['LLC', 8],     ['GitHub', 4], ['Other', 3]],
  'Windows':       [['Cornerstone', 40], ['Learn', 20], ['LLC', 25], ['Wiki', 8],     ['GitHub', 4], ['Other', 3]],
  'Surface':       [['Cornerstone', 55], ['Learn', 20], ['LLC', 15], ['Wiki', 5],     ['GitHub', 2], ['Other', 3]],
  'Xbox':          [['Cornerstone', 35], ['Wiki', 25], ['LLC', 20], ['Learn', 10],    ['GitHub', 5], ['Other', 5]],
  'Intune':        [['Cornerstone', 50], ['Learn', 30], ['Wiki', 10], ['LLC', 5],     ['GitHub', 3], ['Other', 2]],
};

function pickSource(lob: LobArea): DocSource {
  const weights = SOURCE_WEIGHTS[lob];
  const total = weights.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [src, w] of weights) {
    r -= w;
    if (r <= 0) return src;
  }
  return weights[weights.length - 1][0];
}

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
      sbu: LOB_TO_SBU[lob],
      publishedAt: dayOffset(ageDays),
      lastUpdated: dayOffset(updateDays),
      wordCount: intBetween(180, 4200),
      hasMetadata: rand() > 0.18,
      brokenLinkCount: rand() > 0.78 ? intBetween(1, 6) : 0,
      readability: Math.round((40 + rand() * 50) * 10) / 10,
      ai: {
        indexedInAiStore: rand() > 0.10,
        schemaValid: rand() > 0.22,
        hasQaBlock: rand() > 0.45,
        embeddingAgeDays: intBetween(0, 180),
        lastAiEval: rand() > 0.55 ? 'pass' : rand() > 0.5 ? 'fail' : 'never',
      },
      source: pickSource(lob),
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
  // Lightweight keyword classifier so misses arrive pre-tagged with a LOB
  // (real impl would use the search index's classifier, not string match).
  const classify = (q: string): LobArea | undefined => {
    const s = q.toLowerCase();
    if (/azure|b2b|tenant/.test(s)) return 'Azure';
    if (/m365|license|sku|partner/.test(s)) return 'Microsoft 365';
    if (/windows|firmware/.test(s)) return 'Windows';
    if (/surface/.test(s)) return 'Surface';
    if (/xbox/.test(s)) return 'Xbox';
    if (/intune|compliance/.test(s)) return 'Intune';
    return undefined;
  };
  return SEARCH_MISS_QUERIES.map((q) => ({
    query: q,
    occurrences: intBetween(12, 240),
    lastSeen: dayOffset(intBetween(0, 21)),
    classifiedLob: classify(q),
  })).sort((a, b) => b.occurrences - a.occurrences);
}

function makeSearchEvents(): SearchEvent[] {
  const out: SearchEvent[] = [];
  for (let d = 89; d >= 0; d--) {
    const total = intBetween(60, 220);
    for (let k = 0; k < total; k++) {
      const lob = pick(LOBS);
      const hadResult = rand() > 0.18;
      const clicked = hadResult && rand() > 0.32;
      out.push({ date: dayOffset(d), lob, hadResult, clicked });
    }
  }
  return out;
}

function makeAiAnswers(docs: Doc[]): AiAnswerEvent[] {
  const out: AiAnswerEvent[] = [];
  for (let d = 89; d >= 0; d--) {
    const n = intBetween(20, 80);
    for (let k = 0; k < n; k++) {
      const lob = pick(LOBS);
      const grounded = rand() > 0.22;
      const candidates = docs.filter((doc) => doc.lob === lob);
      const sources = grounded && candidates.length > 0
        ? [pick(candidates).id, ...(rand() > 0.6 && candidates.length > 1 ? [pick(candidates).id] : [])]
        : [];
      // Accuracy is correlated with grounding (real signal we'd see).
      const accuracy = grounded
        ? Math.min(1, 0.55 + rand() * 0.45)
        : Math.max(0, 0.20 + rand() * 0.35);
      const confidence = Math.min(1, accuracy + (rand() - 0.5) * 0.2);
      const fellBack = !grounded && rand() > 0.4;
      out.push({
        id: `ai-${d}-${k}`,
        date: dayOffset(d),
        lob,
        sourceDocIds: [...new Set(sources)],
        accuracy: Math.round(accuracy * 1000) / 1000,
        confidence: Math.round(confidence * 1000) / 1000,
        grounded,
        fellBackToHuman: fellBack,
      });
    }
  }
  return out;
}

function makePriorityScenarios(): PriorityScenario[] {
  // Curated registry — a real KM would maintain this list with product partners.
  const seeds: Array<{ title: string; lob: LobArea; priority: ScenarioPriority }> = [
    { title: 'Reset partner tenant secret',                   lob: 'Microsoft 365', priority: 'P0' },
    { title: 'Azure B2B graph throttling mitigation',         lob: 'Azure',         priority: 'P0' },
    { title: 'AAQ fallback latency p99 troubleshooting',      lob: 'Azure',         priority: 'P0' },
    { title: 'CMSP onboarding DDoS playbook',                 lob: 'Azure',         priority: 'P1' },
    { title: 'M365 license SKU mapping for partners',         lob: 'Microsoft 365', priority: 'P1' },
    { title: 'Intune compliance retry policy',                lob: 'Intune',        priority: 'P1' },
    { title: 'Surface firmware rollback procedure',           lob: 'Surface',       priority: 'P1' },
    { title: 'Xbox content takedown SLA',                     lob: 'Xbox',          priority: 'P2' },
    { title: 'Partner offboarding playbook',                  lob: 'Microsoft 365', priority: 'P0' },
    { title: 'Export usage report to parquet',                lob: 'Azure',         priority: 'P2' },
    { title: 'AI Native eval rubric template',                lob: 'Azure',         priority: 'P1' },
    { title: 'How to file a content removal request',         lob: 'Microsoft 365', priority: 'P2' },
    { title: 'Windows Update Hold for partner-managed fleets',lob: 'Windows',       priority: 'P1' },
    { title: 'Intune device retirement edge cases',           lob: 'Intune',        priority: 'P2' },
  ];
  const statuses: ScenarioStatus[] = ['covered', 'covered', 'covered', 'draft', 'gap', 'outdated'];
  return seeds.map((s, i) => {
    const status = statuses[(i + Math.floor(rand() * statuses.length)) % statuses.length];
    const linked = status === 'gap' ? 0 : status === 'draft' ? 1 : intBetween(2, 6);
    const lastValidated = status === 'gap' || status === 'draft'
      ? null
      : dayOffset(intBetween(status === 'outdated' ? 200 : 5, status === 'outdated' ? 540 : 120));
    return {
      id: `scn-${String(i + 1).padStart(3, '0')}`,
      title: s.title,
      lob: s.lob,
      priority: s.priority,
      status,
      linkedDocCount: linked,
      lastValidatedAt: lastValidated,
    };
  });
}

function makeIntake(): IntakeRequest[] {
  const states: IntakeState[] = ['pending', 'in_review', 'blocked', 'published'];
  const slaByState: Record<IntakeState, number> = {
    pending:    3,
    in_review:  5,
    blocked:    7,
    published: 30,
  };
  const out: IntakeRequest[] = [];
  for (let i = 0; i < 36; i++) {
    const state = pick(states);
    const lob = pick(LOBS);
    out.push({
      id: `req-${String(i + 1).padStart(3, '0')}`,
      title: `${lob} — request ${i + 1}`,
      lob,
      sbu: LOB_TO_SBU[lob],
      requester: pick(AUTHORS),
      state,
      ageInStateDays: intBetween(0, state === 'blocked' ? 18 : state === 'in_review' ? 12 : 9),
      slaTargetDays: slaByState[state],
    });
  }
  return out;
}

function makeSelfHelp(): SelfHelpSession[] {
  const out: SelfHelpSession[] = [];
  for (let d = 89; d >= 0; d--) {
    const n = intBetween(40, 140);
    for (let k = 0; k < n; k++) {
      const lob = pick(LOBS);
      // Resolution rate trends up gently over the window.
      const baseRate = 0.55 + (89 - d) * 0.0015;
      const resolved = rand() < baseRate;
      const fellBack = !resolved && rand() > 0.45;
      out.push({
        id: `sh-${d}-${k}`,
        date: dayOffset(d),
        lob,
        resolved,
        fellBackToHuman: fellBack,
      });
    }
  }
  return out;
}

const docs = makeDocs();
const authoring = makeAuthoring();
const feedback = makeFeedback(docs);
const searchMisses = makeSearchMisses();
const searchEvents = makeSearchEvents();
const aiAnswers = makeAiAnswers(docs);
const priorityScenarios = makePriorityScenarios();
const intake = makeIntake();
const selfHelp = makeSelfHelp();

export const contentHealthDataset: ContentHealthDataset = {
  docs,
  authoring,
  feedback,
  searchMisses,
  searchEvents,
  aiAnswers,
  priorityScenarios,
  intake,
  selfHelp,
  generatedAt: TODAY.toISOString(),
};
