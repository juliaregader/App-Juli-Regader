import i18n from "@/i18n";

export function firstOfMonth(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
}

export function shiftMonth(monthIso: string, delta: number): string {
  const [year, month] = monthIso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return firstOfMonth(date);
}

const localeByLanguage: Record<string, string> = {
  es: "es-ES",
  ca: "ca-ES",
  en: "en-GB",
};

export function formatMonthLabel(monthIso: string, language?: string): string {
  const [year, month] = monthIso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  const locale = localeByLanguage[language ?? i18n.language] ?? "es-ES";
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export function monthRange(startIso: string, endIso: string): string[] {
  const months: string[] = [];
  let cursor = startIso;
  while (cursor <= endIso) {
    months.push(cursor);
    cursor = shiftMonth(cursor, 1);
  }
  return months;
}
