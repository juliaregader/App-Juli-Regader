import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Logo } from "@/components/brand/Logo";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white">
      <div className="container-page py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-content-muted">{t("footer.disclaimer")}</p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-content-muted sm:items-end">
            <Link to="/legal/aviso-legal" className="hover:text-brand-900">
              {t("footer.legalNotice")}
            </Link>
            <Link to="/legal/privacidad" className="hover:text-brand-900">
              {t("footer.privacy")}
            </Link>
            <Link to="/legal/terminos" className="hover:text-brand-900">
              {t("footer.terms")}
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-content-muted">
          © {year} JuliusCapital. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
