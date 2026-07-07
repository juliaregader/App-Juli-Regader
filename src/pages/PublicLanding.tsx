import {
  BookOpen,
  Calculator,
  Check,
  Compass,
  LayoutDashboard,
  LineChart,
  PieChart,
  Target,
  TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmailGate } from "@/components/wealth/EmailGate";
import { Dashboard } from "@/pages/Dashboard";
import { Book } from "@/pages/booking/Book";
import { Glossary } from "@/pages/glossary/Glossary";
import { Goals } from "@/pages/goals/Goals";
import { Onboarding } from "@/pages/onboarding/Onboarding";
import { Strategy } from "@/pages/strategy/Strategy";
import { Tools } from "@/pages/tools/Tools";

const FEATURES = [
  { key: "dashboard", icon: LayoutDashboard, href: "#simulador" },
  { key: "strategy", icon: PieChart, href: "#estrategia" },
  { key: "goals", icon: Target, href: "#objetivos" },
  { key: "tools", icon: Calculator, href: "#herramientas" },
  { key: "glossary", icon: BookOpen, href: "#glosario" },
] as const;

const WHY_POINTS = [
  { key: "clarity", icon: Compass },
  { key: "decisions", icon: LineChart },
  { key: "progress", icon: TrendingUp },
] as const;

const STEPS = ["explore", "data", "book", "talk"] as const;
const INCLUDED = ["review", "plan", "questions", "followUp"] as const;

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-2xl font-bold tracking-tight text-content sm:text-3xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-sm text-content-muted sm:text-base">{subtitle}</p> : null}
    </div>
  );
}

export function PublicLanding() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-20 sm:gap-28">
      <section className="rounded-3xl border border-border bg-surface p-8 text-center shadow-soft sm:p-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">
          {t("landing.hero.eyebrow")}
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-content sm:text-5xl">
          {t("landing.hero.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-content-muted">
          {t("landing.hero.subtitle")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#simulador"
            className="w-full rounded-lg bg-brand-900 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto"
          >
            {t("landing.hero.ctaPrimary")}
          </a>
          <a
            href="#reservar"
            className="w-full rounded-lg border border-border px-6 py-3 text-sm font-medium text-content hover:bg-surface-subtle sm:w-auto"
          >
            {t("landing.hero.ctaSecondary")}
          </a>
        </div>
      </section>

      <section id="por-que" className="scroll-mt-20">
        <SectionHeading title={t("landing.why.title")} subtitle={t("landing.why.subtitle")} />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {WHY_POINTS.map(({ key, icon: Icon }) => (
            <div key={key} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-100 text-brand-900">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-content">
                {t(`landing.why.points.${key}.title`)}
              </h3>
              <p className="mt-1.5 text-sm text-content-muted">
                {t(`landing.why.points.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading title={t("landing.howItWorks.title")} />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <SectionHeading title={t("landing.features.title")} subtitle={t("landing.features.subtitle")} />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ key, icon: Icon, href }) => (
            <a
              key={key}
              href={href}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft transition-colors hover:border-brand-300"
            >
              <div className="flex items-center gap-2">
                <Icon className="size-5 text-brand-500" aria-hidden="true" />
                <h3 className="font-display text-sm font-semibold text-content">
                  {t(`landing.features.items.${key}.title`)}
                </h3>
              </div>
              <p className="mt-2 text-xs text-content-muted">
                {t(`landing.features.items.${key}.body`)}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section id="simulador" className="scroll-mt-20">
        <SectionHeading title={t("nav.wealth")} />
        <div className="mt-10">
          <EmailGate>
            <div className="flex flex-col gap-10">
              <Onboarding />
              <div id="resultado" className="scroll-mt-20">
                <Dashboard />
              </div>
            </div>
          </EmailGate>
        </div>
      </section>

      <section id="estrategia" className="scroll-mt-20">
        <SectionHeading title={t("nav.strategy")} />
        <div className="mt-10">
          <EmailGate>
            <Strategy />
          </EmailGate>
        </div>
      </section>

      <section id="objetivos" className="scroll-mt-20">
        <SectionHeading title={t("nav.goals")} />
        <div className="mt-10">
          <EmailGate>
            <Goals />
          </EmailGate>
        </div>
      </section>

      <section id="herramientas" className="scroll-mt-20">
        <SectionHeading title={t("nav.tools")} />
        <div className="mt-10">
          <Tools />
        </div>
      </section>

      <section id="glosario" className="scroll-mt-20">
        <SectionHeading title={t("nav.glossary")} />
        <div className="mt-10">
          <Glossary />
        </div>
      </section>

      <section
        id="reservar"
        className="scroll-mt-20 rounded-3xl border border-brand-300 bg-brand-100/40 p-8 sm:p-12"
      >
        <SectionHeading title={t("landing.pricing.title")} subtitle={t("landing.pricing.subtitle")} />

        <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-border bg-surface p-6 text-center shadow-soft">
          <p className="font-display text-4xl font-bold text-content">80€</p>
          <p className="text-xs text-content-muted">{t("landing.pricing.oneTime")}</p>
          <ul className="mt-4 flex flex-col gap-2 text-left text-sm text-content">
            {INCLUDED.map((key) => (
              <li key={key} className="flex items-center gap-2">
                <Check className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
                {t(`landing.pricing.included.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <EmailGate>
            <Book />
          </EmailGate>
        </div>

        <p className="mx-auto mt-6 max-w-md text-center text-xs text-content-muted">
          {t("landing.pricing.legalNote")}
        </p>
      </section>
    </div>
  );
}
