import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { SeriesPoint } from "../../types/api";
import { formatMw, formatTimestamp } from "../../utils/format";

export function ForecastActualChart({ series }: { series: SeriesPoint[] }) {
  const data = series.map((point) => ({
    ...point,
    label: formatTimestamp(point.startTime),
    forecast: point.forecastMw,
    actual: point.actualMw,
  }));
  return (
    <section className="chart-card" aria-labelledby="forecast-actual-title">
      <div className="section-heading"><div><p className="eyebrow">Generation comparison</p><h2 id="forecast-actual-title">Forecast versus actual</h2></div></div>
      <div className="chart-frame" role="img" aria-label="Forecast and actual wind generation chart">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 12, right: 20, left: 4, bottom: 8 }}>
            <CartesianGrid stroke="#e7ebee" strokeDasharray="3 3" />
            <XAxis dataKey="label" hide={data.length > 48} />
            <YAxis tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
            <Tooltip formatter={(value: unknown, name: unknown) => [formatMw(typeof value === "number" ? value : null), name === "forecast" ? "Forecast" : "Actual"]} labelFormatter={(label) => label} />
            <Legend />
            <Line connectNulls={false} dataKey="forecast" name="Forecast" stroke="#5b4b8a" dot={false} strokeWidth={2} />
            <Line connectNulls={false} dataKey="actual" name="Actual" stroke="#168a79" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
