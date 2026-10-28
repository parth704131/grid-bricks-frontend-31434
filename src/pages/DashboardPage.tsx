import { FormEvent, useEffect, useState } from "react";

import { useAnalysis } from "../hooks/useAnalysis";
import { DailyAccuracyChart } from "../components/charts/DailyAccuracyChart";
import { ForecastActualChart } from "../components/charts/ForecastActualChart";
import { ForecastErrorChart } from "../components/charts/ForecastErrorChart";
import { ForecastVersionsDrawer } from "../components/dashboard/ForecastVersionsDrawer";
import type { SeriesPoint } from "../types/api";
import { formatMwh, formatMw, formatPercentage, formatSignedMw, formatTimestamp } from "../utils/format";
import { DEFAULT_FILTERS, isValidDecisionTime, isValidFilterRange } from "../utils/validation";

type DisplayTimezone = "uk" | "local";
type Filters = { from: string; to: string; decisionTime: string };
const PAGE_SIZE = 20;

function readFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  const candidate = {
    from: params.get("from") ?? DEFAULT_FILTERS.from,
    to: params.get("to") ?? DEFAULT_FILTERS.to,
    decisionTime: params.get("decisionTime") ?? DEFAULT_FILTERS.decisionTime,
  };
  return isValidFilterRange(candidate.from, candidate.to) && isValidDecisionTime(candidate.decisionTime)
    ? candidate
    : DEFAULT_FILTERS;
}

function updateUrl(filters: Filters): void {
  const params = new URLSearchParams(filters);
  window.history.replaceState({}, "", `/?${params.toString()}`);
}

function MetricCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <article className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-description">{description}</p>
    </article>
  );
}

export function DashboardPage() {
  const [filters, setFilters] = useState<Filters>(readFilters);
  const [draft, setDraft] = useState<Filters>(filters);
  const [displayTimezone, setDisplayTimezone] = useState<DisplayTimezone>("uk");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState<SeriesPoint | null>(null);
  const analysis = useAnalysis({ ...filters, timezone: "Europe/London" });
  const filterValid = isValidFilterRange(draft.from, draft.to) && isValidDecisionTime(draft.decisionTime);

  const allSeries = analysis.data?.series ?? [];
  const pageSeries = allSeries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pageCount = Math.max(1, Math.ceil(allSeries.length / PAGE_SIZE));
  const totalItems = allSeries.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  function applyFilters(event: FormEvent) {
    event.preventDefault();
    if (!filterValid) return;
    setFilters(draft);
    setCurrentPage(1);
    updateUrl(draft);
  }

  function resetFilters() {
    setDraft(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    updateUrl(DEFAULT_FILTERS);
  }

  return (
    <main className="dashboard-shell" id="overview">
        <header className="dashboard-header">
          <div className="header-copy"><p className="eyebrow">ELEXON · WIND OPERATIONS</p><h1>Wind Procurement Insight</h1><p className="subtitle">A clearer view of what the market knew—and when.</p></div>
          <div className="header-meta"><span className="freshness-pill"><span className="live-dot" />Historical data</span><div className="freshness"><span>Data source: Elexon</span><strong>{analysis.data ? `Data as of ${formatTimestamp(analysis.data.dataAsOf, displayTimezone)}` : "Data freshness pending"}</strong></div></div>
        </header>

      <section className="controls-card" aria-labelledby="controls-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Decision controls</p>
            <h2 id="controls-title">Choose an analysis period</h2>
          </div>
          <span className="policy-chip">Business timezone: Europe/London</span>
        </div>
        <form className="filter-form" onSubmit={applyFilters}>
          <label>From<input type="date" min="2026-01-01" max="2026-01-31" value={draft.from} onChange={(event) => setDraft({ ...draft, from: event.target.value })} /></label>
          <label>To<input type="date" min="2026-01-01" max="2026-01-31" value={draft.to} onChange={(event) => setDraft({ ...draft, to: event.target.value })} /></label>
          <label>Decision cutoff<input type="time" value={draft.decisionTime} onChange={(event) => setDraft({ ...draft, decisionTime: event.target.value })} /></label>
          <label>Display time<select value={displayTimezone} onChange={(event) => setDisplayTimezone(event.target.value as DisplayTimezone)}><option value="uk">UK market time</option><option value="local">My local time</option></select></label>
          <div className="filter-actions"><button type="submit" disabled={!filterValid || analysis.isFetching}>Apply</button><button type="button" className="secondary-button" onClick={resetFilters}>Reset</button></div>
        </form>
        {!filterValid && <p className="field-error">Choose dates within January 2026 and a valid 24-hour cutoff.</p>}
      </section>

      <section className="notice" aria-label="Decision policy explanation">
        <strong>How to read this view</strong>
        <span>The latest wind forecast published before the previous-day cutoff is compared with actual generation. Positive error means wind was overforecast; negative error means it was underforecast.</span>
      </section>

      {analysis.isPending && <section className="state-card" role="status">Loading January analysis…</section>}
      {analysis.isError && <section className="state-card error-state"><strong>Analysis unavailable</strong><span>{analysis.error.message}</span><button type="button" onClick={() => analysis.refetch()}>Retry</button></section>}
      {analysis.data && <>
        <section className="metrics-grid" aria-label="Accuracy summary">
          <MetricCard label="Typical error" value={formatMw(analysis.data.summary.maeMw)} description="Average absolute forecast miss" />
          <MetricCard label="Large-error sensitivity" value={formatMw(analysis.data.summary.rmseMw)} description="Weights larger misses more heavily" />
          <MetricCard label="Systematic bias" value={formatSignedMw(analysis.data.summary.biasMw)} description="Positive means wind was overforecast" />
          <MetricCard label="P90 error" value={formatMw(analysis.data.summary.p90AbsoluteErrorMw)} description="90% of matched errors are below this" />
          <MetricCard label="Data coverage" value={formatPercentage(analysis.data.coverage.percentage)} description={`${analysis.data.coverage.matchedPeriods} of ${analysis.data.coverage.expectedPeriods} periods matched`} />
          <MetricCard label="Net error energy" value={formatMwh(analysis.data.summary.positiveErrorMwh + analysis.data.summary.negativeErrorMwh)} description={`Positive: ${formatMwh(analysis.data.summary.positiveErrorMwh)} · Negative: ${formatMwh(analysis.data.summary.negativeErrorMwh)}`} />
        </section>

        <section className="charts-grid" aria-label="Forecast analysis charts">
          <ForecastActualChart series={analysis.data.series} />
          <ForecastErrorChart series={analysis.data.series} />
          <DailyAccuracyChart daily={analysis.data.daily} />
        </section>

        {(analysis.data.coverage.percentage < 100 || analysis.data.warnings.length > 0) && <section className="warning-panel" role="status"><strong>Partial data</strong><span>{analysis.data.coverage.matchedPeriods} of {analysis.data.coverage.expectedPeriods} periods were matched. Missing periods are excluded from accuracy metrics.</span>{analysis.data.warnings.map((warning) => <span key={warning}>{warning}</span>)}</section>}

        <section className="table-card" id="periods" aria-labelledby="periods-title">
          <div className="section-heading"><div><p className="eyebrow">Delivery periods</p><h2 id="periods-title">Half-hourly comparison</h2></div></div>
          <div className="table-scroll"><table><thead><tr><th>Delivery time</th><th>Forecast</th><th>Actual</th><th>Error</th><th>Error energy</th><th>Published</th><th>Status</th><th>Details</th></tr></thead><tbody>{pageSeries.map((point) => <tr key={point.startTime}><td>{formatTimestamp(point.startTime, displayTimezone)}</td><td>{formatMw(point.forecastMw)}</td><td>{formatMw(point.actualMw)}</td><td>{formatSignedMw(point.errorMw)}</td><td>{formatMwh(point.energyErrorMwh)}</td><td>{point.forecastPublishTime ? formatTimestamp(point.forecastPublishTime, displayTimezone) : "—"}</td><td><span className={`status status-${point.status}`}>{point.status.replace("_", " ")}</span></td><td><button type="button" className="table-action" onClick={() => setSelectedPoint(point)}>Inspect</button></td></tr>)}</tbody></table></div>
          <div className="pagination" aria-label="Period table pagination"><span>Showing {totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems}</span><div><button type="button" className="secondary-button" disabled={currentPage === 1 || analysis.isFetching} onClick={() => setCurrentPage((page) => page - 1)}>Previous</button><span className="page-number">Page {currentPage} of {pageCount}</span><button type="button" className="secondary-button" disabled={currentPage === pageCount || analysis.isFetching} onClick={() => setCurrentPage((page) => page + 1)}>Next</button></div></div>
        </section>
        <ForecastVersionsDrawer point={selectedPoint} decisionTime={filters.decisionTime} onClose={() => setSelectedPoint(null)} />
      </>}
    </main>
  );
}
