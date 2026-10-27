import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { SeriesPoint } from "../../types/api";
import { formatMw, formatTimestamp } from "../../utils/format";

export function ForecastErrorChart({ series }: { series: SeriesPoint[] }) {
  const data = series.map((point) => ({ ...point, label: formatTimestamp(point.startTime), error: point.errorMw }));
  return (
    <section className="chart-card" aria-labelledby="forecast-error-title">
      <div className="section-heading"><div><p className="eyebrow">Forecast miss</p><h2 id="forecast-error-title">Error by delivery period</h2></div></div>
      <div className="chart-frame" role="img" aria-label="Forecast error diverging bar chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 12, right: 20, left: 4, bottom: 8 }}>
            <CartesianGrid stroke="#e7ebee" strokeDasharray="3 3" />
            <XAxis dataKey="label" hide={data.length > 48} />
            <YAxis tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
            <ReferenceLine y={0} stroke="#52606d" />
            <Tooltip formatter={(value: unknown) => [formatMw(typeof value === "number" ? value : null), "Error"]} />
            <Bar dataKey="error" name="Error" isAnimationActive={false}>
              {data.map((point) => <Cell key={point.startTime} fill={(point.error ?? 0) >= 0 ? "#b4534b" : "#3478a5"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
