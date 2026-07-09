import { LineChart, ListChecks, PiggyBank, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const icons = [LineChart, ListChecks, PiggyBank, Target];

export function ConsultaPatrimonial() {
  const { t } = useTranslation();
  useDocumentTitle(t("consultation.title"));
  const items = t("consultation.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">{t("consultation.title")}</h1>
        <p className="mt-3 text-content-muted">{t("consultation.subtitle")}</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
        {items.map(({ title, description }, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={title} className="card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="mt-4 font-semibold text-content">{title}</h2>
              <p className="mt-1.5 text-sm text-content-muted">{description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-col items-center gap-3 text-center">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/registro" className="btn-primary">
            {t("consultation.ctaCreateProfile")}
          </Link>
          <Link to="/login" className="btn-secondary">
            {t("consultation.ctaLogin")}
          </Link>
        </div>
        <p className="max-w-md text-xs text-content-muted">{t("consultation.disclaimer")}</p>
      </div>
    </section>
  );
}
