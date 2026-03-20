import { useState } from 'react';
import type { SlicerState } from './types';
import { kpiCards } from './data/mockKpis';
import { actionItems } from './data/mockActions';
import { mockEvalDataset } from './data/mockEvalData';
import { KpiCard } from './components/common/KpiCard';
import { SlicerBar } from './components/common/SlicerBar';
import { ActionInsightsPanel } from './components/common/ActionInsightsPanel';
import { ContentHealthSection } from './components/sections/ContentHealthSection';
import { SupportQualitySection } from './components/sections/SupportQualitySection';
import { BusinessOutcomesSection } from './components/sections/BusinessOutcomesSection';
import { ProgramHealthSection } from './components/sections/ProgramHealthSection';
import { TablesSection } from './components/sections/TablesSection';
import { EvalResultsSection } from './components/sections/EvalResultsSection';
import { QuickActions } from './components/common/QuickActions';
import './App.css';

const DEFAULT_SLICER: SlicerState = {
  lob: 'all',
  dateRange: '30d',
  dateFrom: '',
  dateTo: '',
  lobTag: 'all',
  audience: 'all',
  dataSource: 'all',
  business: 'all',
  user: '',
};

type Product = 'AAQ' | 'CMSP' | 'AI Native';
const PRODUCTS: Product[] = ['AAQ', 'CMSP', 'AI Native'];

// Per-product accent colours used by Layouts A and C
const PRODUCT_COLORS: Record<Product, { bg: string; text: string; badge: string }> = {
  'AAQ':       { bg: '#0078d4', text: '#fff', badge: '#cce3f6' },
  'CMSP':      { bg: '#5c2d91', text: '#fff', badge: '#e0d4f5' },
  'AI Native': { bg: '#107c10', text: '#fff', badge: '#d6f0d6' },
};

type LayoutMode = 'A' | 'B' | 'C';

// ── Dashboard body (shared across all layouts) ───────────────────────────────
function DashboardBody({ slicer, setSlicer }: { slicer: SlicerState; setSlicer: (s: SlicerState) => void }) {
  return (
    <div className="app__body">
      <main className="app__main">
        <SlicerBar state={slicer} onChange={setSlicer} />
        <div className="kpi-row">
          {kpiCards.map(card => <KpiCard key={card.id} data={card} />)}
        </div>
        <ContentHealthSection slicer={slicer} />
        <SupportQualitySection slicer={slicer} />
        <BusinessOutcomesSection slicer={slicer} />
        <ProgramHealthSection slicer={slicer} />
        <TablesSection slicer={slicer} />
        <EvalResultsSection dataset={mockEvalDataset} slicer={slicer} />
      </main>
      <div className="app__sidebar">
        <ActionInsightsPanel items={actionItems} />
      </div>
    </div>
  );
}

export default function App() {
  const [slicer, setSlicer] = useState<SlicerState>(DEFAULT_SLICER);
  const [product, setProduct] = useState<Product>('AAQ');
  const [layout, setLayout] = useState<LayoutMode>('A');

  const colors = PRODUCT_COLORS[product];

  // ── Layout preview toggle (temp UI) ────────────────────────────────────────
  const LayoutPicker = () => (
    <div className="layout-picker">
      <span className="layout-picker__label">Preview layout:</span>
      {(['A', 'B', 'C'] as LayoutMode[]).map(l => (
        <button
          key={l}
          className={`layout-picker__btn${layout === l ? ' layout-picker__btn--active' : ''}`}
          onClick={() => setLayout(l)}
        >
          {l === 'A' ? '⓪ Merged header' : l === 'B' ? '② Floating actions' : '③ Two-zone header'}
        </button>
      ))}
    </div>
  );

  // ── Layout A: Merged header — environment badge inline, actions strip below ─
  if (layout === 'A') return (
    <div className="app">
      <LayoutPicker />
      <header className="app__header" style={{ background: colors.bg }}>
        <div className="app__header-inner">
          <div className="app__logo">
            <span className="app__logo-icon">◈</span>
            <div>
              <h1 className="app__title">SxG Knowledge Hub</h1>
              <p className="app__subtitle">Actionable Insights · Partner Dashboard</p>
            </div>
          </div>
          <div className="app__env-switcher">
            {PRODUCTS.map(p => (
              <button
                key={p}
                className={`app__env-btn${product === p ? ' app__env-btn--active' : ''}`}
                style={product === p ? { background: 'rgba(255,255,255,0.25)', color: '#fff', borderColor: 'rgba(255,255,255,0.6)' } : {}}
                onClick={() => setProduct(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <span className="app__last-updated">Last updated: 2026-03-05</span>
        </div>
      </header>
      <QuickActions />
      <DashboardBody slicer={slicer} setSlicer={setSlicer} />
    </div>
  );

  // ── Layout B: Floating side panel for actions ────────────────────────────────
  if (layout === 'B') return (
    <div className="app">
      <LayoutPicker />
      <header className="app__header">
        <div className="app__header-inner">
          <div className="app__logo">
            <span className="app__logo-icon">◈</span>
            <div>
              <h1 className="app__title">SxG Knowledge Hub</h1>
              <p className="app__subtitle">Actionable Insights · Partner Dashboard</p>
            </div>
          </div>
          <div className="app__env-switcher">
            {PRODUCTS.map(p => (
              <button
                key={p}
                className={`app__env-btn app__env-btn--light${product === p ? ' app__env-btn--light-active' : ''}`}
                onClick={() => setProduct(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <span className="app__last-updated">Last updated: 2026-03-05</span>
        </div>
      </header>
      {/* Full-width body with sticky side panel */}
      <div className="app__layout-b">
        <div className="app__layout-b__main">
          <DashboardBody slicer={slicer} setSlicer={setSlicer} />
        </div>
        <div className="app__layout-b__actions">
          <QuickActions vertical />
        </div>
      </div>
    </div>
  );

  // ── Layout C: Two-zone header ─────────────────────────────────────────────────
  return (
    <div className="app">
      <LayoutPicker />
      {/* Zone 1 — Identity */}
      <header className="app__header">
        <div className="app__header-inner">
          <div className="app__logo">
            <span className="app__logo-icon">◈</span>
            <div>
              <h1 className="app__title">SxG Knowledge Hub</h1>
              <p className="app__subtitle">Actionable Insights · Partner Dashboard</p>
            </div>
          </div>
          <div className="app__env-pills">
            {PRODUCTS.map(p => (
              <button
                key={p}
                className={`app__env-pill${product === p ? ' app__env-pill--active' : ''}`}
                style={product === p ? { background: colors.bg, color: colors.text, borderColor: colors.bg } : {}}
                onClick={() => setProduct(p)}
              >
                {product === p && <span className="app__env-pill-dot" />}
                {p}
              </button>
            ))}
          </div>
          <span className="app__last-updated">Last updated: 2026-03-05</span>
        </div>
      </header>
      {/* Zone 2 — Actions */}
      <div className="app__action-zone">
        <QuickActions />
      </div>
      <DashboardBody slicer={slicer} setSlicer={setSlicer} />
    </div>
  );
}
