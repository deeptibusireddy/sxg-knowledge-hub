import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  selectAgingHeatmap,
  selectAiQuality,
  selectAiReadiness,
  selectCoverage,
  selectDocsByAgingCell,
  selectDocsByFreshness,
  selectDocsByQualityIssue,
  selectFeedback,
  selectFreshness,
  selectIntakeQueue,
  selectKpis,
  selectLobScorecards,
  selectOwnerSbu,
  selectPriorityScenarios,
  selectProdVsEval,
  selectQualitySignals,
  selectReadability,
  selectSearchAnalytics,
  selectSearchGapMap,
  selectSearchMisses,
  selectSelfHelp,
  selectSourceBreakdown,
  selectStaleArticles,
  selectThroughput,
  selectTopPerformers,
  type QualityKey,
} from './selectors';
import type { ContentHealthFilter, DocDrilldownRow } from './types';
import type { LobArea } from '../shared/contentHealth/types';
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
import { AiReadinessPanel } from './components/AiReadinessPanel';
import { AiQualityPanel } from './components/AiQualityPanel';
import { ProdVsEvalPanel } from './components/ProdVsEvalPanel';
import { PriorityScenariosPanel } from './components/PriorityScenariosPanel';
import { IntakeQueuePanel } from './components/IntakeQueuePanel';
import { OwnerSbuRolloutPanel } from './components/OwnerSbuRolloutPanel';
import { SelfHelpResolutionPanel } from './components/SelfHelpResolutionPanel';
import { SearchAnalyticsPanel } from './components/SearchAnalyticsPanel';
import { SourceBreakdownPanel } from './components/SourceBreakdownPanel';
import { DrilldownDrawer, type DrilldownContent, type DrilldownRow } from '../components/common/DrilldownDrawer';
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
  const [drilldown, setDrilldown] = useState<DrilldownContent | null>(null);

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
  const aiReadiness = useMemo(() => selectAiReadiness(filter), [filter]);
  const aiQuality = useMemo(() => selectAiQuality(filter), [filter]);
  const prodVsEval = useMemo(() => selectProdVsEval(filter), [filter]);
  const priorityScenarios = useMemo(() => selectPriorityScenarios(filter), [filter]);
  const intakeQueue = useMemo(() => selectIntakeQueue(filter), [filter]);
  const ownerSbu = useMemo(() => selectOwnerSbu(filter), [filter]);
  const selfHelp = useMemo(() => selectSelfHelp(filter), [filter]);
  const searchAnalytics = useMemo(() => selectSearchAnalytics(filter), [filter]);
  const sourceBreakdown = useMemo(() => selectSourceBreakdown(filter), [filter]);

  const docColumns: DrilldownContent['columns'] = [
    { key: 'title',       header: 'Title' },
    { key: 'lob',         header: 'LOB' },
    { key: 'owner',       header: 'Owner' },
    { key: 'lastUpdated', header: 'Last updated' },
    { key: 'daysSince',   header: 'Days' },
    { key: 'brokenLinks', header: 'Broken' },
    { key: 'readability', header: 'Flesch' },
  ];
  const toRows = (rows: DocDrilldownRow[]): DrilldownRow[] =>
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      lob: r.lob,
      owner: r.owner,
      lastUpdated: r.lastUpdated,
      daysSince: r.daysSince,
      brokenLinks: r.brokenLinks,
      readability: r.readability,
    }));

  const handleFreshnessClick = (bucket: { label: string; fromDays: number; toDays: number | null }) => {
    const docs = selectDocsByFreshness(filter, bucket.fromDays, bucket.toDays);
    setDrilldown({
      title: `Docs · ${bucket.label} since update`,
      subtitle: `${docs.length} doc${docs.length === 1 ? '' : 's'} in current scope`,
      columns: docColumns,
      rows: toRows(docs),
    });
  };

  const handleAgingClick = (lob: LobArea, bucket: { label: string; fromDays: number; toDays: number | null }) => {
    const docs = selectDocsByAgingCell(filter, lob, bucket.fromDays, bucket.toDays);
    setDrilldown({
      title: `${lob} · ${bucket.label}`,
      subtitle: `${docs.length} doc${docs.length === 1 ? '' : 's'}`,
      columns: docColumns,
      rows: toRows(docs),
    });
  };

  const handleQualityClick = (key: QualityKey, label: string) => {
    const docs = selectDocsByQualityIssue(filter, key);
    setDrilldown({
      title: label,
      subtitle: `${docs.length} doc${docs.length === 1 ? '' : 's'} in current scope`,
      columns: docColumns,
      rows: toRows(docs),
    });
  };

  return (
    <div className="ch-app">
      <a href="#main-content" className="ch-app__skip-link">
        Skip to main content
      </a>
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

      <main className="ch-app__main" id="main-content" tabIndex={-1}>
        <ContentHealthSlicer value={filter} onChange={setFilter} />
        <ContentHealthKpiStrip kpis={kpis} />

        <h2 className="ch-section">A · Knowledge hygiene</h2>
        <div className="ch-grid">
          <CoveragePanel rows={coverage} />
          <FreshnessPanel
            buckets={freshness}
            staleCount={kpis.staleDocs}
            staleSharePct={kpis.staleSharePct}
            onBucketClick={handleFreshnessClick}
          />
          <QualitySignalsPanel signals={quality} onIssueClick={handleQualityClick} />
          <AuthoringThroughputPanel
            series={throughput.series}
            contributors={throughput.contributors}
          />
          <LobScorecardPanel rows={scorecards} />
          <ReadabilityDistributionPanel distribution={readability} />
          <div className="ch-grid__wide">
            <AgingHeatmapPanel heatmap={agingHeatmap} onCellClick={handleAgingClick} />
          </div>
          <div className="ch-grid__wide">
            <SourceBreakdownPanel breakdown={sourceBreakdown} />
          </div>
        </div>

        <h2 className="ch-section">B · AI readiness &amp; quality</h2>
        <div className="ch-grid">
          <AiReadinessPanel summary={aiReadiness} />
          <AiQualityPanel summary={aiQuality} />
          <div className="ch-grid__wide">
            <ProdVsEvalPanel summary={prodVsEval} />
          </div>
        </div>

        <h2 className="ch-section">C · Lifecycle (intake → retire)</h2>
        <div className="ch-grid">
          <div className="ch-grid__wide">
            <IntakeQueuePanel summary={intakeQueue} />
          </div>
          <div className="ch-grid__wide">
            <PriorityScenariosPanel summary={priorityScenarios} />
          </div>
          <div className="ch-grid__wide">
            <StaleArticlesPanel rows={staleArticles} />
          </div>
        </div>

        <h2 className="ch-section">D · Cross-team &amp; outcomes</h2>
        <div className="ch-grid">
          <div className="ch-grid__wide">
            <OwnerSbuRolloutPanel rows={ownerSbu} />
          </div>
          <SelfHelpResolutionPanel summary={selfHelp} />
          <SearchAnalyticsPanel summary={searchAnalytics} />
          <TopPerformersPanel rows={topPerformers} />
          <div className="ch-grid__wide">
            <SearchGapMapPanel rows={searchGap} />
          </div>
          <div className="ch-grid__wide">
            <FeedbackUsagePanel feedback={feedback} searchMisses={searchMisses} />
          </div>
        </div>
      </main>

      <DrilldownDrawer content={drilldown} onClose={() => setDrilldown(null)} />
    </div>
  );
}
