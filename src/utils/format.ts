const UK_TIMEZONE = "Europe/London";

export function formatMw(value: number | null): string {
  return value === null ? "—" : `${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(value)} MW`;
}

export function formatMwh(value: number | null): string {
  return value === null ? "—" : `${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(value)} MWh`;
}

export function formatPercentage(value: number | null): string {
  return value === null ? "—" : `${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 }).format(value)}%`;
}

export function formatSignedMw(value: number | null): string {
  if (value === null) return "—";
  const formatted = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1, signDisplay: "always" }).format(value);
  return `${formatted} MW`;
}

export function formatTimestamp(value: string, timezone: "uk" | "local" = "uk"): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone === "uk" ? UK_TIMEZONE : undefined,
  }).format(new Date(value));
}
