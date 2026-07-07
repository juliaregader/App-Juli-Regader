import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useProfile } from "@/lib/auth/useProfile";

/** Para las rutas /admin/*: solo el admin autenticado (nunca un visitante anónimo). */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (authLoading || profileLoading) return null;

  if (!session || !profile || profile.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/** Para /login: si ya hay una sesión de admin activa, va directo al panel. */
export function AdminLoginRoute({ children }: { children: ReactNode }) {
  const { loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (authLoading || profileLoading) return null;

  if (profile?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
