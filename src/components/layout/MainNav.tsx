import { LayoutDashboard, PieChart, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { clsx } from "clsx";

import { useProfile } from "@/lib/auth/useProfile";

export function MainNav() {
  const { t } = useTranslation();
  const { data: profile } = useProfile();

  if (!profile || profile.status !== "approved") return null;

  const links =
    profile.role === "admin"
      ? [{ to: "/admin", label: t("admin.homeTitle"), icon: LayoutDashboard }]
      : [
          { to: "/", label: t("nav.dashboard"), icon: LayoutDashboard },
          { to: "/wealth", label: t("nav.wealth"), icon: Wallet },
          { to: "/strategy", label: t("nav.strategy"), icon: PieChart },
        ];

  return (
    <nav className="flex items-center gap-1">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-100 text-brand-900 dark:bg-brand-900 dark:text-brand-100"
                : "text-content-muted hover:text-content",
            )
          }
        >
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
