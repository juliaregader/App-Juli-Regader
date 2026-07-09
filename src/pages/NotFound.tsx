import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="font-display text-2xl font-bold text-brand-900">{t("notFound.title")}</h1>
      <p className="text-content-muted">{t("notFound.description")}</p>
      <Link to="/" className="btn-primary">
        {t("notFound.backHome")}
      </Link>
    </section>
  );
}
