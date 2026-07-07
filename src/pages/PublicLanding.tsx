import {
  BookOpen,
  Calculator,
  CalendarDays,
  Check,
  LayoutDashboard,
  Lock,
  PieChart,
  Target,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FEATURES = [
  { key: "dashboard", icon: LayoutDashboard },
  { key: "strategy", icon: PieChart },
  { key: "goals", icon: Target },
  { key: "tools", icon: Calculator },
  { key: "glossary", icon: BookOpen },
  { key: "session", icon: CalendarDays },
] as const;

const STEPS = ["signup", "data", "book", "access"] as const;
const INCLUDED = ["session", "platform", "dashboard", "export"] as const;

export function PublicLanding() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-16">
      <section className="rounded-2xl border border-border bg-surface p-8 text-center shadow-soft sm:p-14">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">
          {t("landing.hero.eyebrow")}
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-content sm:text-4xl">
          {t("landing.hero.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-content-muted">
          {t("landing.hero.subtitle")}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="rounded-lg bg-brand-900 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t("landing.hero.ctaPrimary")}
          </Link>
          <a
            href="#precio"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-content hover:bg-surface-subtle"
          >
            {t("landing.hero.ctaSecondary")}
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-center font-display text-2xl font-bold text-content">
          {t("landing.howItWorks.title")}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((key, index) => (
            <div key={key} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-900 text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-3 font-display text-sm font-semibold text-content">
                {t(`landing.howItWorks.steps.${key}.title`)}
              </h3>
              <p className="mt-1 text-xs text-content-muted">
                {t(`landing.howItWorks.steps.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-center font-display text-2xl font-bold text-content">
          {t("landing.features.title")}
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-content-muted">
          {t("landing.features.subtitle")}
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <div className="flex items-center gap-2">
                <Icon className="size-5 text-brand-500" aria-hidden="true" />
                <h3 className="font-display text-sm font-semibold text-content">
                  {t(`landing.features.items.${key}.title`)}
                </h3>
                <Lock className="ml-auto size-3.5 text-content-muted" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs text-content-muted">
                {t(`landing.features.items.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="precio"
        className="scroll-mt-24 rounded-2xl border border-brand-300 bg-brand-100/40 p-8 text-center shadow-soft"
      >
        <h2 className="font-display text-2xl font-bold text-content">{t("landing.pricing.title")}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-content-muted">
          {t("landing.pricing.subtitle")}
        </p>

        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <p className="font-display text-4xl font-bold text-content">229€</p>
          <p className="text-xs text-content-muted">{t("landing.pricing.oneTime")}</p>
          <ul className="mt-4 flex flex-col gap-2 text-left text-sm text-content">
            {INCLUDED.map((key) => (
              <li key={key} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                {t(`landing.pricing.included.${key}`)}
              </li>
            ))}
          </ul>
          <Link
            to="/login"
            className="mt-6 block w-full rounded-lg bg-brand-900 px-6 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {t("landing.pricing.cta")}
          </Link>
        </div>

        <p className="mx-auto mt-4 max-w-md text-xs text-content-muted">
          {t("landing.pricing.legalNote")}
        </p>
      </section>
    </div>
  );
}
