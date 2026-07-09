import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function Reservas() {
  const { t } = useTranslation();
  useDocumentTitle(t("reservations.title"));

  return (
    <section className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-brand-900">{t("reservations.title")}</h1>
      <p className="max-w-md text-content-muted">{t("reservations.comingSoon")}</p>
      <Link to="/contacto" className="btn-primary">
        {t("reservations.goToContact")}
      </Link>
    </section>
  );
}
