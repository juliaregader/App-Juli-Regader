import { CalendarCheck, LineChart, Compass as CompassIcon, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

const icons = [CalendarCheck, LineChart, CompassIcon, RefreshCw];

export function Method() {
  const { t } = useTranslation();
  const steps = t("home.method", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <h2 className="text-center font-display text-2xl font-bold text-brand-900 sm:text-3xl">
          {t("home.methodTitle")}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, description }, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={title} className="card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-900 text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 font-semibold text-content">{title}</h3>
                <p className="mt-1.5 text-sm text-content-muted">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
