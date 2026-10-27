import { getJson } from "./client";
import { analysisResponseSchema, type AnalysisRequest } from "../types/api";

export async function fetchAnalysis(request: AnalysisRequest, signal?: AbortSignal) {
  const params = new URLSearchParams({
    from: request.from,
    to: request.to,
    decisionTime: request.decisionTime,
    timezone: request.timezone,
  });
  const payload = await getJson<unknown>(`/api/v1/analysis?${params.toString()}`, signal);
  return analysisResponseSchema.parse(payload);
}
