import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/components/layout/RootLayout";
import { ProtectedRoute, PublicOnlyRoute, RequireSession } from "@/lib/auth/ProtectedRoute";
import { AdminHome } from "@/pages/admin/AdminHome";
import { PendingApproval } from "@/pages/auth/PendingApproval";
import { SignIn } from "@/pages/auth/SignIn";
import { Home } from "@/pages/Home";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicOnlyRoute>
            <SignIn />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "/pending",
        element: (
          <RequireSession>
            <PendingApproval />
          </RequireSession>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute requireRole="admin">
            <AdminHome />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
