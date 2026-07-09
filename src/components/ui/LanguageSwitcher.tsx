import { useTranslation } from "react-i18next";

import { supportedLanguages } from "@/i18n";

const labels: Record<string, string> = {
  es: "ES",
  ca: "CA",
  en: "EN",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation();

  return (
    <div className={className} role="group" aria-label="Idioma">
      <select
        value={i18n.resolvedLanguage}
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
        className="rounded-lg border border-border bg-white px-2 py-1 text-sm font-medium text-content-muted focus-visible:border-brand-500"
      >
        {supportedLanguages.map((lng) => (
          <option key={lng} value={lng}>
            {labels[lng]}
          </option>
        ))}
      </select>
    </div>
  );
}
