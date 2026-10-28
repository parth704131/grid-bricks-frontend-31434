import { useEffect, useRef } from "react";

import { useForecastVersions } from "../../hooks/useForecastVersions";
import type { SeriesPoint } from "../../types/api";
import { formatMw, formatTimestamp } from "../../utils/format";

export function ForecastVersionsDrawer({
  point,
  decisionTime,
  onClose,
}: {
  point: SeriesPoint | null;
  decisionTime: string;
  onClose: () => void;
}) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const query = useForecastVersions(point ? { startTime: point.startTime, decisionTime, timezone: "Europe/London" } : null);

  useEffect(() => {
    if (!point) return;
    triggerRef.current = document.activeElement as HTMLElement;
    drawerRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [point, onClose]);

  useEffect(() => {
    if (point) return;
    triggerRef.current?.focus();
  }, [point]);

  if (!point) return null;
  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="drawer" ref={drawerRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="drawer-header"><div><p className="eyebrow">Forecast audit</p><h2 id="drawer-title">Selected half-hour</h2></div><button type="button" className="secondary-button" onClick={onClose}>Close</button></div>
        <dl className="detail-list"><div><dt>Delivery time</dt><dd>{formatTimestamp(point.startTime)}</dd></div><div><dt>Decision cutoff</dt><dd>{formatTimestamp(point.decisionCutoff)} Europe/London</dd></div><div><dt>Actual generation</dt><dd>{formatMw(point.actualMw)}</dd></div></dl>
        {query.isPending && <p role="status">Loading forecast versions…</p>}
        {query.isError && <div className="drawer-error"><p>{query.error.message}</p><button type="button" onClick={() => query.refetch()}>Retry</button></div>}
        {query.data && <div className="version-list">{query.data.versions.map((version) => <div className={`version-row ${version.selected ? "selected" : ""}`} key={version.publishTime}><div><strong>{formatTimestamp(version.publishTime)}</strong><span>{version.eligible ? "Eligible at cutoff" : "After cutoff"}</span></div><strong>{formatMw(version.generationMw)}</strong>{version.selected && <span className="selected-label">Selected</span>}</div>)}</div>}
      </aside>
    </div>
  );
}
