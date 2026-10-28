import { useQuery } from "@tanstack/react-query";

import { fetchAnalysisPeriods } from "../api/periods";
import type { AnalysisRequest } from "../types/api";

export function useAnalysisPeriods(request: AnalysisRequest & { page: number; pageSize: number }) {
  return useQuery({
    queryKey: ["analysis-periods", request.from, request.to, request.decisionTime, request.timezone, request.page, request.pageSize],
    queryFn: ({ signal }) => fetchAnalysisPeriods(request, signal),
    placeholderData: (previous) => previous,
    staleTime: 60 * 60 * 1000,
  });
}
