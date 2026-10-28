export function DashboardSkeleton() {
  return (
    <section className="dashboard-skeleton" aria-label="Loading January analysis" role="status">
      <div className="skeleton-metrics">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="skeleton-card" key={index}>
            <span className="skeleton-line skeleton-label" />
            <span className="skeleton-line skeleton-value" />
            <span className="skeleton-line skeleton-description" />
          </div>
        ))}
      </div>
      <div className="skeleton-charts">
        {Array.from({ length: 3 }, (_, index) => (
          <div className={`skeleton-chart ${index === 2 ? "skeleton-chart-wide" : ""}`} key={index}>
            <span className="skeleton-line skeleton-chart-title" />
            <span className="skeleton-chart-area" />
          </div>
        ))}
      </div>
      <div className="skeleton-table">
        <div className="skeleton-table-heading" />
        {Array.from({ length: 8 }, (_, index) => <div className="skeleton-table-row" key={index} />)}
      </div>
    </section>
  );
}
