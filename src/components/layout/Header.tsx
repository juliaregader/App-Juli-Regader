import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="text-brand-900">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-content-muted md:flex">
          <Link to="/servicios" className="hover:text-brand-900">
            {t("nav.services")}
          </Link>
          <Link to="/consulta-patrimonial" className="hover:text-brand-900">
            {t("nav.consultation")}
          </Link>
          <Link to="/reservas" className="hover:text-brand-900">
            {t("nav.booking")}
          </Link>
          <Link to="/contacto" className="hover:text-brand-900">
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:block" />
          <Link to="/login" className="hidden text-sm font-semibold text-brand-900 sm:block">
            {t("nav.login")}
          </Link>
          <Link to="/registro" className="btn-primary">
            {t("nav.register")}
          </Link>
        </div>
      </div>
    </header>
  );
}
