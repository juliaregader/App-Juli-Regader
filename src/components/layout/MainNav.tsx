import { LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { clsx } from "clsx";

import { useProfile } from "@/lib/auth/useProfile";

const SECTIONS = [
  { href: "#simulador", key: "wealth" },
  { href: "#estrategia", key: "strategy" },
  { href: "#objetivos", key: "goals" },
  { href: "#herramientas", key: "tools" },
  { href: "#glosario", key: "glossary" },
  { href: "#reservar", key: "book" },
] as const;

export function MainNav() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();

  if (profile?.role === "admin") {
    return (
      <nav className="flex items-center gap-1">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive ? "bg-brand-100 text-brand-900" : "text-content-muted hover:text-content",
            )
          }
        >
          <LayoutDashboard className="size-4" aria-hidden="true" />
          {t("admin.homeTitle")}
        </NavLink>
      </nav>
    );
  }

  return (
    <nav className="hidden items-center gap-0.5 lg:flex">
      {SECTIONS.map(({ href, key }) => (
        <a
          key={href}
          href={href}
          className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium text-content-muted transition-colors hover:bg-surface-subtle hover:text-content xl:px-3"
        >
          {t(`nav.${key}`)}
        </a>
      ))}
    </nav>
  );
}
