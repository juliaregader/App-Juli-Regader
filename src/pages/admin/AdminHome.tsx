import { useTranslation } from "react-i18next";

export function AdminHome() {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-surface p-8 shadow-soft">
      <h1 className="font-display text-xl font-semibold text-content">
        {t("admin.homeTitle")}
      </h1>
      <p className="mt-2 text-sm text-content-muted">{t("admin.homeBody")}</p>
    </div>
  );
}
