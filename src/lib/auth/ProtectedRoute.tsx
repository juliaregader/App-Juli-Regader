import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "@/lib/auth/AuthProvider";
import { useProfile } from "@/lib/auth/useProfile";
import type { UserRole } from "@/lib/auth/types";

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: UserRole;
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { session, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (authLoading || (session && profileLoading)) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!profile || profile.status !== "approved") {
    return <Navigate to="/pending" replace />;
  }

  if (requireRole && profile.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/** Requiere una sesión iniciada, sin exigir que el perfil esté aprobado. */
export function RequireSession({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

/** Para páginas públicas (login): si ya hay sesión, redirige a donde toque. */
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  if (authLoading || (session && profileLoading)) return null;

  if (session) {
    return <Navigate to={profile?.status === "approved" ? "/" : "/pending"} replace />;
  }

  return <>{children}</>;
}
