import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { supportedLanguages, type SupportedLanguage } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <label className="flex items-center gap-1.5 text-sm text-content-muted">
      <Globe className="size-4" aria-hidden="true" />
      <span className="sr-only">{t("common.language")}</span>
      <select
        value={i18n.resolvedLanguage}
        onChange={(event) => {
          void i18n.changeLanguage(event.target.value as SupportedLanguage);
        }}
        className="cursor-pointer rounded-lg border border-border bg-surface px-2 py-1 text-sm text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {t(`languages.${lang}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
