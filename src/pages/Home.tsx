import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useProfile } from "@/lib/auth/useProfile";
import { formatCurrency } from "@/lib/format/currency";
import { useLatestNetWorth } from "@/lib/wealth/queries";

export function Home() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const { data: snapshot, isLoading } = useLatestNetWorth();
  const currency = profile?.base_currency ?? "EUR";

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

      {profile?.role === "client" ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-sm text-content-muted">{t("home.stats.assets")}</p>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums text-content">
              {isLoading ? "…" : formatCurrency(snapshot?.total_assets ?? 0, currency)}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
            <p className="text-sm text-content-muted">{t("home.stats.liabilities")}</p>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums text-content">
              {isLoading ? "…" : formatCurrency(snapshot?.total_liabilities ?? 0, currency)}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-300 bg-brand-100/40 p-6 shadow-soft dark:bg-brand-950/40">
            <p className="text-sm text-content-muted">{t("home.stats.netWorth")}</p>
            <p className="mt-2 font-display text-2xl font-bold tabular-nums text-content">
              {isLoading ? "…" : formatCurrency(snapshot?.net_worth ?? 0, currency)}
            </p>
          </div>
        </section>
      ) : profile?.role === "admin" ? (
        <section className="rounded-2xl border border-dashed border-brand-300 bg-brand-100/40 p-6 dark:bg-brand-950/40">
          <p className="text-sm text-content-muted">{t("home.adminNotice")}</p>
          <Link
            to="/admin"
            className="mt-3 inline-block rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-brand-100 dark:text-brand-900"
          >
            {t("admin.homeTitle")}
          </Link>
        </section>
      ) : null}
    </div>
  );
}
