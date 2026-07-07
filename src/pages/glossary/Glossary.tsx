import { useTranslation } from "react-i18next";

const GLOSSARY_TERM_IDS = [
  "netWorth",
  "asset",
  "liability",
  "diversification",
  "liquidity",
  "compoundInterest",
  "savingsRate",
  "debtRatio",
  "emergencyFund",
  "fourPercentRule",
  "budget502030",
] as const;

export function Glossary() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h1 className="font-display text-xl font-semibold text-content">
          {t("glossary.title")}
        </h1>
        <p className="mt-1 text-sm text-content-muted">{t("glossary.description")}</p>
      </section>

      <section className="flex flex-col gap-3">
        {GLOSSARY_TERM_IDS.map((id) => (
          <div
            key={id}
            id={id}
            className="scroll-mt-24 rounded-2xl border border-border bg-surface p-5 shadow-soft"
          >
            <h2 className="font-display text-base font-semibold text-content">
              {t(`glossary.terms.${id}.term`)}
            </h2>
            <p className="mt-1 text-sm text-content-muted">
              {t(`glossary.terms.${id}.definition`)}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
