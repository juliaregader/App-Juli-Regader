import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useProfile } from "@/lib/auth/useProfile";
import { Dashboard } from "@/pages/Dashboard";

export function Home() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();

  if (profile?.role === "admin") {
    return (
      <section className="rounded-2xl border border-dashed border-brand-300 bg-brand-100/40 p-6 dark:bg-brand-950/40">
        <p className="text-sm text-content-muted">{t("home.adminNotice")}</p>
        <Link
          to="/admin"
          className="mt-3 inline-block rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-brand-100 dark:text-brand-900"
        >
          {t("admin.homeTitle")}
        </Link>
      </section>
    );
  }

  return <Dashboard />;
}
