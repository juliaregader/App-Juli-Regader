import { Check } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/useAuth";
import { useCreateCheckout } from "@/features/payments/queries";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function Servicios() {
  const { t } = useTranslation();
  useDocumentTitle(t("services.title"));
  const { user, profile } = useAuth();
  const createCheckout = useCreateCheckout();
  const [checkoutError, setCheckoutError] = useState(false);

  const planIncludes = t("services.planIncludes", { returnObjects: true }) as string[];
  const sessionIncludes = t("services.sessionIncludes", { returnObjects: true }) as string[];
  const faqs = t("services.faqs", { returnObjects: true }) as { q: string; a: string }[];

  const handleBuyPlan = async () => {
    setCheckoutError(false);
    try {
      const { url } = await createCheckout.mutateAsync({
        service: "plan_329",
        userId: user!.id,
        email: profile?.email ?? user!.email!,
      });
      window.location.assign(url);
    } catch {
      setCheckoutError(true);
    }
  };

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold text-brand-900 sm:text-4xl">{t("services.title")}</h1>
        <p className="mt-3 text-content-muted">{t("services.subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:items-start">
        <div className="card relative overflow-hidden border-2 border-brand-900 lg:col-span-3">
          <span className="absolute right-6 top-6 rounded-full bg-[var(--color-gold)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-950">
            {t("services.recommended")}
          </span>
          <h2 className="font-display text-xl font-bold text-brand-900">{t("services.planTitle")}</h2>
          <p className="mt-1 text-sm text-content-muted">{t("services.planSubtitle")}</p>
          <p className="mt-6 font-display text-4xl font-bold text-brand-900">
            329 € <span className="text-base font-normal text-content-muted">{t("services.planPriceSuffix")}</span>
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            {planIncludes.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                <span className="text-content">{item}</span>
              </li>
            ))}
          </ul>

          {user ? (
            <button
              type="button"
              className="btn-primary mt-8 w-full sm:w-auto"
              onClick={handleBuyPlan}
              disabled={createCheckout.isPending}
            >
              {createCheckout.isPending ? "Redirigiendo a pago…" : t("services.planCta")}
            </button>
          ) : (
            <Link to="/registro?plan=329" className="btn-primary mt-8 w-full sm:w-auto">
              {t("services.planCta")}
            </Link>
          )}
          {checkoutError && (
            <p className="mt-2 text-sm text-red-600">
              No se ha podido iniciar el pago. Inténtalo de nuevo o contacta con soporte.
            </p>
          )}
        </div>

        <div className="card lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-brand-900">{t("services.sessionTitle")}</h2>
          <p className="mt-1 text-sm text-content-muted">{t("services.sessionSubtitle")}</p>
          <p className="mt-6 font-display text-4xl font-bold text-brand-900">
            80 € <span className="text-base font-normal text-content-muted">{t("services.sessionPriceSuffix")}</span>
          </p>

          <ul className="mt-6 space-y-3 text-sm">
            {sessionIncludes.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden />
                <span className="text-content">{item}</span>
              </li>
            ))}
          </ul>

          <Link to="/reservas?servicio=sesion_80" className="btn-secondary mt-8 w-full">
            {t("services.sessionCta")}
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="font-display text-2xl font-bold text-brand-900">{t("services.faqTitle")}</h2>
        <dl className="mt-6 space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <dt className="font-semibold text-content">{q}</dt>
              <dd className="mt-1 text-sm text-content-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
