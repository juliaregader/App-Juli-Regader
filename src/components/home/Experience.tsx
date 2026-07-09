import { GraduationCap, LineChart, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

const icons = [GraduationCap, Wallet, LineChart];

// Biografía de marcador editable: home.experienceBio en cada locale (i18n/locales).
export function Experience() {
  const { t } = useTranslation();
  const highlights = t("home.experienceHighlights", { returnObjects: true }) as string[];

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">
          {t("home.experienceTitle")}
        </h2>
        <p className="mt-5 text-content-muted">{t("home.experienceBio")}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {highlights.map((label, index) => {
            const Icon = icons[index % icons.length];
            return (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-content"
              >
                <Icon className="h-4 w-4 text-brand-500" aria-hidden />
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
