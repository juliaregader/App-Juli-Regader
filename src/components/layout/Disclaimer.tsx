import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Disclaimer() {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-subtle p-4 text-sm text-content-muted">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden="true" />
      <p>
        <span className="font-semibold text-content">{t("legal.disclaimerTitle")}: </span>
        {t("legal.disclaimer")}
      </p>
    </div>
  );
}
