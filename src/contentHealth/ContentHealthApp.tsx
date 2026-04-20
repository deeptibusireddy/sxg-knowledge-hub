import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  selectAgingHeatmap,
  selectCoverage,
  selectFeedback,
  selectFreshness,
  selectKpis,
  selectLobScorecards,
  selectQualitySignals,
  selectReadability,
  selectSearchGapMap,
  selectSearchMisses,
  selectStaleArticles,
  selectThroughput,
  selectTopPerformers,
} from './selectors';
import type { ContentHealthFilter } from './types';
import { ContentHealthSlicer } from './components/ContentHealthSlicer';
import { ContentHealthKpiStrip } from './components/ContentHealthKpiStrip';
import { CoveragePanel } from './components/CoveragePanel';
import { FreshnessPanel } from './components/FreshnessPanel';
import { QualitySignalsPanel } from './components/QualitySignalsPanel';
import { AuthoringThroughputPanel } from './components/AuthoringThroughputPanel';
import { FeedbackUsagePanel } from './components/FeedbackUsagePanel';
import { StaleArticlesPanel } from './components/StaleArticlesPanel';
import { LobScorecardPanel } from './components/LobScorecardPanel';
import { TopPerformersPanel } from './components/TopPerformersPanel';
import { AgingHeatmapPanel } from './components/AgingHeatmapPanel';
import { ReadabilityDistributionPanel } from './components/ReadabilityDistributionPanel';
import { SearchGapMapPanel } from './components/SearchGapMapPanel';
import './ContentHealthApp.css';

const DEFAULT_FILTER: ContentHealthFilter = {
  product: 'AAQ',
  lob: 'all',
  windowDays: 90,
};

const PRODUCT_PILLS: Array<{ id: 'AAQ' | 'CMSP' | 'AI Native'; inScope: boolean }> = [
  { id: 'AAQ',       inScope: true  },
  { id: 'CMSP',      inScope: false },
  { id: 'AI Native', inScope: false },
];

export default function ContentHealthApp() {
  const [filter, setFilter] = useState<ContentHealthFilter>(DEFAULT_FILTER);

  const kpis = useMemo(() => selectKpis(filter), [filter]);
  const coverage = useMemo(() => selectCoverage(filter), [filter]);
  const freshness = useMemo(() => selectFreshness(filter), [filter]);
  const quality = useMemo(() => selectQualitySignals(filter), [filter]);
  const throughput = useMemo(() => selectThroughput(filter), [filter]);
  const feedback = useMemo(() => selectFeedback(filter), [filter]);
  const searchMisses = useMemo(() => selectSearchMisses(), []);
  const staleArticles = useMemo(() => selectStaleArticles(filter), [filter]);
  const scorecards = useMemo(() => selectLobScorecards(filter), [filter]);
  const topPerformers = useMemo(() => selectTopPerformers(filter), [filter]);
  const agingHeatmap = useMemo(() => selectAgingHeatmap(filter), [filter]);
  const readability = useMemo(() => selectReadability(filter), [filter]);
  const searchGap = useMemo(() => selectSearchGapMap(filter), [filter]);

  return (
    <div className="ch-app">
      <header className="ch-app__header">
        <div className="ch-app__header-inner">
          <div className="ch-app__title-block">
            <Link to="/" className="ch-app__back">← Back to Hub</Link>
            <h1 className="ch-app__title">Content Health Dashboard</h1>
            <p className="ch-app__subtitle">
              Coverage · Freshness · Quality · Authoring · Feedback — owned by the Content Health team
            </p>
          </div>
          <div className="ch-app__product-pills" role="group" aria-label="Product scope">
            {PRODUCT_PILLS.map((p) => {
              const active = filter.product === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`ch-app__product-pill${active ? ' ch-app__product-pill--active' : ''}${p.inScope ? '' : ' ch-app__product-pill--disabled'}`}
                  aria-pressed={active}
                  aria-disabled={!p.inScope}
                  disabled={!p.inScope}
                  title={p.inScope ? `View ${p.id}` : `${p.id} is out of scope for this dashboard`}
                  onClick={() => p.inScope && setFilter((f) => ({ ...f, product: p.id }))}
                >
                  <span className="ch-app__product-pill-name">{p.id}</span>
                  {!p.inScope && (
                    <span className="ch-app__product-pill-tag">Out of scope</span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="ch-app__owner-pill">
            <span className="ch-app__owner-dot" />
            Content Health team · synthetic data
          </div>
        </div>
        <div className="ch-app__scope-banner">
          <strong>Scope:</strong> this dashboard currently covers <strong>AAQ</strong> only.
          CMSP and AI Native are not in scope yet.
        </div>
      </header>

      <main className="ch-app__main">
        <ContentHealthSlicer value={filter} onChange={setFilter} />
        <ContentHealthKpiStrip kpis={kpis} />

        <div className="ch-grid">
          <CoveragePanel rows={coverage} />
          <FreshnessPanel
            buckets={freshness}
            staleCount={kpis.staleDocs}
            staleSharePct={kpis.staleSharePct}
          />
          <QualitySignalsPanel signals={quality} />
          <AuthoringThroughputPanel
            series={throughput.series}
            contributors={throughput.contributors}
          />
          <LobScorecardPanel rows={scorecards} />
          <ReadabilityDistributionPanel distribution={readability} />
          <TopPerformersPanel rows={topPerformers} />
          <div className="ch-grid__wide">
            <AgingHeatmapPanel heatmap={agingHeatmap} />
          </div>
          <div className="ch-grid__wide">
            <StaleArticlesPanel rows={staleArticles} />
          </div>
          <div className="ch-grid__wide">
            <SearchGapMapPanel rows={searchGap} />
          </div>
          <div className="ch-grid__wide">
            <FeedbackUsagePanel feedback={feedback} searchMisses={searchMisses} />
          </div>
        </div>
      </main>
    </div>
  );
}
