import { useQuery } from "@tanstack/react-query";

import { fetchAnalysis } from "../api/analysis";
import type { AnalysisRequest } from "../types/api";

export function useAnalysis(request: AnalysisRequest) {
  return useQuery({
    queryKey: ["analysis", request.from, request.to, request.decisionTime, request.timezone],
    queryFn: ({ signal }) => fetchAnalysis(request, signal),
    staleTime: 60 * 60 * 1000,
  });
}
