import { Link, Outlet } from "react-router-dom";

import { Logo } from "@/components/brand/Logo";
import { SignOutButton } from "@/components/ui/SignOutButton";
import { useAuth } from "@/features/auth/useAuth";

export function PrivateLayout() {
  const { profile, isAdmin } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle">
      <header className="sticky top-0 z-40 border-b border-border bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/app" className="text-brand-900">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-content-muted md:flex">
            <Link to="/app" className="hover:text-brand-900">
              Mi área
            </Link>
            <Link to="/app/estrategia" className="hover:text-brand-900">
              Estrategia
            </Link>
            <Link to="/app/perfil" className="hover:text-brand-900">
              Mi perfil
            </Link>
            {isAdmin && (
              <Link to="/app/admin" className="hover:text-brand-900">
                Administración
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-content-muted sm:block">{profile?.full_name || profile?.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
