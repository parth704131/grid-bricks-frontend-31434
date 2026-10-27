import { getJson } from "./client";
import { forecastVersionsResponseSchema, type ForecastVersionsRequest } from "../types/api";

export async function fetchForecastVersions(request: ForecastVersionsRequest, signal?: AbortSignal) {
  const params = new URLSearchParams({
    startTime: request.startTime,
    decisionTime: request.decisionTime,
    timezone: request.timezone,
  });
  const payload = await getJson<unknown>(`/api/v1/forecast-versions?${params.toString()}`, signal);
  return forecastVersionsResponseSchema.parse(payload);
}
