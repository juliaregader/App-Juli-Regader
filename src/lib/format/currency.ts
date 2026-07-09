import i18n from "@/i18n";

const localeByLanguage: Record<string, string> = {
  es: "es-ES",
  ca: "ca-ES",
  en: "en-GB",
};

function resolveLocale(language?: string): string {
  return localeByLanguage[language ?? i18n.language] ?? "es-ES";
}

export function formatCurrency(value: number, currency = "EUR", language?: string): string {
  return new Intl.NumberFormat(resolveLocale(language), {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, language?: string): string {
  return new Intl.NumberFormat(resolveLocale(language), {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}
