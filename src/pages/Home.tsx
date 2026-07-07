import { Compass } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl border border-border bg-surface p-8 shadow-soft sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">
          {t("home.heroEyebrow")}
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-content sm:text-4xl">
          {t("home.heroTitle")}
        </h1>
        <p className="mt-4 max-w-xl text-base text-content-muted">{t("home.heroSubtitle")}</p>
      </section>

      <section className="flex items-start gap-4 rounded-2xl border border-dashed border-brand-300 bg-brand-100/40 p-6 dark:bg-brand-950/40">
        <Compass className="mt-0.5 size-5 shrink-0 text-brand-500" aria-hidden="true" />
        <div>
          <h2 className="font-display text-base font-semibold text-content">
            {t("home.phaseNoticeTitle")}
          </h2>
          <p className="mt-1 text-sm text-content-muted">{t("home.phaseNoticeBody")}</p>
        </div>
      </section>
    </div>
  );
}
