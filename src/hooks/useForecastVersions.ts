import { useQuery } from "@tanstack/react-query";

import { fetchForecastVersions } from "../api/forecasts";
import type { ForecastVersionsRequest } from "../types/api";

export function useForecastVersions(request: ForecastVersionsRequest | null) {
  return useQuery({
    queryKey: request
      ? ["forecast-versions", request.startTime, request.decisionTime, request.timezone]
      : ["forecast-versions", "closed"],
    queryFn: ({ signal }) => fetchForecastVersions(request!, signal),
    enabled: request !== null,
    staleTime: 60 * 60 * 1000,
  });
}
