import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./useAuth";

export function AdminRoute() {
  const { isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-content-muted">
        Cargando…
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
