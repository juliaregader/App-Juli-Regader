import { Compass, PiggyBank, ShieldCheck, Target, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const icons = [Compass, PiggyBank, TrendingDown, ShieldCheck, Target];

export function WhyOrganize() {
  const { t } = useTranslation();
  const points = t("home.why", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section className="container-page py-16 sm:py-20">
      <h2 className="text-center font-display text-2xl font-bold text-brand-900 sm:text-3xl">
        {t("home.whyTitle")}
      </h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {points.map(({ title, description }, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={title} className="card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-900">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-content">{title}</h3>
              <p className="mt-1.5 text-sm text-content-muted">{description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
