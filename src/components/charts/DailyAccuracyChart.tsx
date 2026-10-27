import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { AnalysisResponse } from "../../types/api";
import { formatMw, formatPercentage } from "../../utils/format";

export function DailyAccuracyChart({ daily }: { daily: AnalysisResponse["daily"] }) {
  return (
    <section className="chart-card" aria-labelledby="daily-accuracy-title">
      <div className="section-heading"><div><p className="eyebrow">Daily performance</p><h2 id="daily-accuracy-title">Accuracy by delivery day</h2></div></div>
      <div className="chart-frame" role="img" aria-label="Daily mean absolute error chart">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={daily} margin={{ top: 12, right: 20, left: 4, bottom: 8 }}>
            <CartesianGrid stroke="#e7ebee" strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
            <Tooltip formatter={(value: unknown, name: unknown) => { const numericValue = typeof value === "number" ? value : null; return name === "maeMw" ? [formatMw(numericValue), "MAE"] : [formatPercentage(numericValue), "Coverage"]; }} />
            <Bar dataKey="maeMw" name="Daily MAE" fill="#245b78" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
