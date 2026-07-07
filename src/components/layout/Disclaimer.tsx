import { useTranslation } from "react-i18next";

export function Disclaimer() {
  const { t } = useTranslation();

  return (
    <p className="text-xs leading-relaxed text-content-muted">
      <span className="font-medium">{t("legal.disclaimerTitle")}:</span> {t("legal.disclaimer")}
    </p>
  );
}
