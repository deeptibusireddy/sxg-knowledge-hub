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

export default function App() {
  const [slicer, setSlicer] = useState<SlicerState>(DEFAULT_SLICER);
  const [product, setProduct] = useState<Product>('AAQ');

  return (
    <div className="app">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="app__header">
        <div className="app__header-inner">
          <div className="app__logo">
            <span className="app__logo-icon">◈</span>
            <div>
              <h1 className="app__title">SxG Knowledge Health</h1>
              <p className="app__subtitle">Knowledge Agent · Partner Dashboard</p>
            </div>
          </div>
          <div className="app__header-meta">
            <span className="app__last-updated">Last updated: 2026-03-05T08:41:59Z</span>
          </div>
        </div>
      </header>

      {/* ── Product Bar ─────────────────────────────────────────────────── */}
      <div className="app__product-bar">
        <div className="app__product-bar-inner">
          {PRODUCTS.map(p => (
            <button
              key={p}
              className={`app__product-btn${product === p ? ' app__product-btn--active' : ''}`}
              onClick={() => setProduct(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────────────────────── */}
      <QuickActions />

      {/* ── Body: main + sidebar ────────────────────────────────────────── */}
      <div className="app__body">
        {/* ── Main ──────────────────────────────────────────────────────── */}
        <main className="app__main">
          {/* Slicers */}
          <SlicerBar state={slicer} onChange={setSlicer} />

          {/* KPI Row */}
          <div className="kpi-row">
            {kpiCards.map(card => (
              <KpiCard key={card.id} data={card} />
            ))}
          </div>

          {/* Dashboard Sections */}
          <ContentHealthSection slicer={slicer} />
          <SupportQualitySection slicer={slicer} />
          <BusinessOutcomesSection slicer={slicer} />
          <ProgramHealthSection slicer={slicer} />
          <TablesSection slicer={slicer} />
          <EvalResultsSection dataset={mockEvalDataset} slicer={slicer} />
        </main>

        {/* ── Insights Sidebar ──────────────────────────────────────────── */}
        <div className="app__sidebar">
          <ActionInsightsPanel items={actionItems} />
        </div>
      </div>
    </div>
  );
}
