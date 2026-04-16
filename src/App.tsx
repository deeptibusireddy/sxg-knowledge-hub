import { useState } from 'react';
import type { SlicerState } from './types';
import { DataProvider, useData } from './contexts/DataContext';
import { KpiCard } from './components/common/KpiCard';
import { DrilldownDrawer } from './components/common/DrilldownDrawer';
import type { DrilldownContent } from './components/common/DrilldownDrawer';
import { kpiDrilldownContent } from './data/mockDrilldown';
import { SlicerBar } from './components/common/SlicerBar';
import { ActionInsightsPanel } from './components/common/ActionInsightsPanel';
import { ContentHealthSection } from './components/sections/ContentHealthSection';
import { SupportQualitySection } from './components/sections/SupportQualitySection';
import { BusinessOutcomesSection } from './components/sections/BusinessOutcomesSection';
import { ProgramHealthSection } from './components/sections/ProgramHealthSection';
import { TablesSection } from './components/sections/TablesSection';
import { EvalResultsSection } from './components/sections/EvalResultsSection';
import { QuickActions } from './components/common/QuickActions';
import { AuthButton } from './components/common/AuthButton';
import { SchemaExplorer } from './components/dev/SchemaExplorer';
import { STATIC_DEMO_ONLY } from './config';
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

function Dashboard() {
  const { kpiCards, actionItems, evalDataset, loading, error, isLive, refresh } = useData();
  const [slicer, setSlicer] = useState<SlicerState>(DEFAULT_SLICER);
  const [product, setProduct] = useState<Product>('AAQ');
  const [kpiDrilldown, setKpiDrilldown] = useState<DrilldownContent | null>(null);
  const [showSchema, setShowSchema] = useState(false);

  const colors = PRODUCT_COLORS[product];

  if (showSchema) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 9999, overflow: 'auto' }}>
        <div style={{ padding: '12px 24px', background: '#faf9f8', borderBottom: '1px solid #e1dfdd', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setShowSchema(false)}
            style={{ background: 'none', border: '1px solid #c8c6c4', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontSize: 12 }}
          >
            ← Back to Dashboard
          </button>
          <span style={{ fontSize: 12, color: '#605e5c' }}>Dev Tool — not shown in production</span>
        </div>
        <SchemaExplorer />
      </div>
    );
  }

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

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {import.meta.env.DEV && (
              <button
                onClick={() => setShowSchema(true)}
                style={{ background: 'none', border: '1px solid #c8c6c4', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 11, color: '#605e5c' }}
                title="Open Power BI Schema Explorer (dev only)"
              >
                🔍 Schema
              </button>
            )}
            {isLive && (
              <span style={{ fontSize: 11, color: '#107c10', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#107c10', display: 'inline-block' }} />
                Live data
              </span>
            )}
            {!isLive && (
              <span style={{ fontSize: 11, color: '#a19f9d' }}>
                {STATIC_DEMO_ONLY ? 'Synthetic demo data' : 'Mock data'}
              </span>
            )}
            <AuthButton />
            {loading && <span style={{ fontSize: 11, color: '#0078d4' }}>Loading…</span>}
          </div>
        </div>
      </header>

      {error && (
        <div style={{
          background: '#fdf6f0', borderBottom: '2px solid #d83b01',
          padding: '6px 16px', fontSize: 12, color: '#d83b01',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>⚠ Power BI fetch error: {error}</span>
          <button onClick={refresh} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d83b01', fontSize: 12 }}>Retry</button>
        </div>
      )}

      {/* ── Zone 2: Quick Actions ─────────────────────────────────────────── */}
      <div className="app__action-zone">
        <QuickActions />
      </div>

      {/* ── Body: main + sidebar ─────────────────────────────────────────── */}
      <div className="app__body">
        <main className="app__main">
          <SlicerBar state={slicer} onChange={setSlicer} />
          <div className="kpi-row">
            {kpiCards.map(card => (
              <KpiCard
                key={card.id}
                data={card}
                onClick={kpiDrilldownContent[card.id] ? () => setKpiDrilldown(kpiDrilldownContent[card.id]) : undefined}
              />
            ))}
          </div>
          <ContentHealthSection slicer={slicer} />
          <SupportQualitySection slicer={slicer} />
          <BusinessOutcomesSection slicer={slicer} />
          <ProgramHealthSection slicer={slicer} />
          <TablesSection slicer={slicer} />
          <EvalResultsSection dataset={evalDataset} slicer={slicer} />
        </main>
        <div className="app__sidebar">
          <ActionInsightsPanel items={actionItems} />
        </div>
      </div>

      <DrilldownDrawer content={kpiDrilldown} onClose={() => setKpiDrilldown(null)} />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  );
}
