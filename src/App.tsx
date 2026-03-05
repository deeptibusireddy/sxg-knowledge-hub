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
import './App.css';

const DEFAULT_SLICER: SlicerState = {
  lob: 'all',
  dateRange: '30d',
  severity: 'all',
};

export default function App() {
  const [slicer, setSlicer] = useState<SlicerState>(DEFAULT_SLICER);

  return (
    <div className="app">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="app__header">
        <div className="app__header-inner">
          <div className="app__logo">
            <span className="app__logo-icon">◈</span>
            <div>
              <h1 className="app__title">AAQ Environment Health</h1>
              <p className="app__subtitle">Knowledge Agent · Partner Dashboard</p>
            </div>
          </div>
          <div className="app__header-meta">
            <span className="app__last-updated">Last updated: Mar 4, 2026 · 05:00 UTC</span>
          </div>
        </div>
      </header>

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
