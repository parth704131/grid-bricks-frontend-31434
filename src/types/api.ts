import { z } from "zod";

export const periodStatusSchema = z.enum(["matched", "missing_forecast", "missing_actual"]);
export type PeriodStatus = z.infer<typeof periodStatusSchema>;

const nullableNumber = z.number().nullable();

export const decisionPolicySchema = z.object({
  time: z.string(),
  timezone: z.literal("Europe/London"),
  daysBeforeDelivery: z.number(),
});

export const seriesPointSchema = z.object({
  startTime: z.string(),
  forecastMw: nullableNumber,
  actualMw: nullableNumber,
  errorMw: nullableNumber,
  absoluteErrorMw: nullableNumber,
  energyErrorMwh: nullableNumber,
  forecastPublishTime: z.string().nullable(),
  decisionCutoff: z.string(),
  status: periodStatusSchema,
});

export const analysisResponseSchema = z.object({
  period: z.object({ from: z.string(), to: z.string() }),
  decisionPolicy: decisionPolicySchema,
  summary: z.object({
    maeMw: nullableNumber,
    rmseMw: nullableNumber,
    biasMw: nullableNumber,
    p90AbsoluteErrorMw: nullableNumber,
    positiveErrorMwh: z.number(),
    negativeErrorMwh: z.number(),
  }),
  coverage: z.object({
    expectedPeriods: z.number(),
    matchedPeriods: z.number(),
    percentage: z.number(),
  }),
  daily: z.array(
    z.object({
      date: z.string(),
      maeMw: nullableNumber,
      rmseMw: nullableNumber,
      biasMw: nullableNumber,
      coverage: z.number(),
    }),
  ),
  series: z.array(seriesPointSchema),
  dataAsOf: z.string(),
  warnings: z.array(z.string()),
});
export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
export type SeriesPoint = z.infer<typeof seriesPointSchema>;

export const analysisPeriodsResponseSchema = z.object({
  period: z.object({ from: z.string(), to: z.string() }),
  decisionPolicy: decisionPolicySchema,
  series: z.array(seriesPointSchema),
  pagination: z.object({
    page: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
  }),
  dataAsOf: z.string(),
});
export type AnalysisPeriodsResponse = z.infer<typeof analysisPeriodsResponseSchema>;

export const forecastVersionSchema = z.object({
  publishTime: z.string(),
  generationMw: z.number(),
  eligible: z.boolean(),
  selected: z.boolean(),
});

export const forecastVersionsResponseSchema = z.object({
  startTime: z.string(),
  decisionPolicy: decisionPolicySchema,
  decisionCutoff: z.string(),
  versions: z.array(forecastVersionSchema),
});
export type ForecastVersionsResponse = z.infer<typeof forecastVersionsResponseSchema>;

export interface AnalysisRequest {
  from: string;
  to: string;
  decisionTime: string;
  timezone: "Europe/London";
}

export interface ForecastVersionsRequest {
  startTime: string;
  decisionTime: string;
  timezone: "Europe/London";
}

export interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
    requestId?: string;
  };
}

export class ApiRequestError extends Error {
  readonly code: string;
  readonly requestId?: string;
  readonly status: number;

  constructor(message: string, status: number, code = "INTERNAL_ERROR", requestId?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.requestId = requestId;
    this.status = status;
  }
}
