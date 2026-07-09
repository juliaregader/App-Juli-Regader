import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { LogoMark } from "@/components/brand/LogoMark";
import { Experience } from "@/components/home/Experience";
import { Method } from "@/components/home/Method";
import { WhyOrganize } from "@/components/home/WhyOrganize";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function Home() {
  const { t } = useTranslation();
  useDocumentTitle(t("home.heroTitle"));

  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-brand-100/60 to-transparent">
        <div className="container-page flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <LogoMark className="h-14 w-14 text-brand-900" />
          <h1 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="max-w-xl text-lg text-content-muted sm:text-xl">{t("home.heroSubtitle")}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link to="/registro" className="btn-primary">
              {t("home.ctaCreateProfile")}
            </Link>
            <Link to="/reservas" className="btn-secondary">
              {t("home.ctaBookSession")}
            </Link>
          </div>
        </div>
      </section>

      <WhyOrganize />
      <Method />

      <p className="container-page -mt-6 mb-4 text-center text-xs text-content-muted">
        {t("home.methodDisclaimer")}
      </p>

      <Experience />

      <section className="border-t border-border bg-brand-900">
        <div className="container-page flex flex-col items-center gap-5 py-16 text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{t("home.finalCtaTitle")}</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/registro" className="btn-gold">
              {t("home.ctaCreateProfile")}
            </Link>
            <Link
              to="/servicios"
              className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t("home.ctaSeeServices")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
