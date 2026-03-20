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

const PRODUCT_COLORS: Record<Product, { bg: string; text: string }> = {
  'AAQ':       { bg: '#0078d4', text: '#fff' },
  'CMSP':      { bg: '#5c2d91', text: '#fff' },
  'AI Native': { bg: '#107c10', text: '#fff' },
};

export default function App() {
  const [slicer, setSlicer] = useState<SlicerState>(DEFAULT_SLICER);
  const [product, setProduct] = useState<Product>('AAQ');

  const colors = PRODUCT_COLORS[product];

  return (
    <div className="app">

      {/* ── Zone 1: Identity & Environment ───────────────────────────────── */}
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

      {/* ── Zone 2: Quick Actions ─────────────────────────────────────────── */}
      <div className="app__action-zone">
        <QuickActions />
      </div>

      {/* ── Body: main + sidebar ─────────────────────────────────────────── */}
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

    </div>
  );
}
