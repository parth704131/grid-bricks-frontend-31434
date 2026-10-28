import { getJson } from "./client";
import { analysisPeriodsResponseSchema, type AnalysisRequest } from "../types/api";

export async function fetchAnalysisPeriods(
  request: AnalysisRequest & { page: number; pageSize?: number },
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    from: request.from,
    to: request.to,
    decisionTime: request.decisionTime,
    timezone: request.timezone,
    page: String(request.page),
    pageSize: String(request.pageSize ?? 20),
  });
  const payload = await getJson<unknown>(`/api/v1/analysis/periods?${params.toString()}`, signal);
  return analysisPeriodsResponseSchema.parse(payload);
}
