import i18n from "@/lib/i18n";

const LOCALE_BY_LANGUAGE: Record<string, string> = {
  es: "es-ES",
  ca: "ca-ES",
  en: "en-US",
};

export function formatCurrency(amount: number, currency: string): string {
  const locale = LOCALE_BY_LANGUAGE[i18n.language] ?? "es-ES";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
