const localeByLanguage: Record<string, string> = {
  es: "es-ES",
  ca: "ca-ES",
  en: "en-GB",
};

export function formatCurrency(value: number, currency = "EUR", language = "es"): string {
  const locale = localeByLanguage[language] ?? "es-ES";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, language = "es"): string {
  const locale = localeByLanguage[language] ?? "es-ES";
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}
