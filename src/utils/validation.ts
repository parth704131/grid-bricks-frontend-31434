import { isValid, parseISO } from "date-fns";

export const DEFAULT_FILTERS = {
  from: "2026-01-01",
  to: "2026-01-31",
  decisionTime: "10:00",
} as const;

export function isSupportedDate(value: string): boolean {
  if (!/^2026-01-(?:0[1-9]|[12]\d|3[01])$/.test(value)) return false;
  return isValid(parseISO(value));
}

export function isValidDecisionTime(value: string): boolean {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function isValidFilterRange(from: string, to: string): boolean {
  return isSupportedDate(from) && isSupportedDate(to) && from <= to;
}
