import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/components/layout/RootLayout";
import { AdminLoginRoute, AdminRoute } from "@/lib/auth/ProtectedRoute";
import { AdminHome } from "@/pages/admin/AdminHome";
import { Appointments } from "@/pages/admin/Appointments";
import { ClientDetail } from "@/pages/admin/ClientDetail";
import { SignIn } from "@/pages/auth/SignIn";
import { PublicLanding } from "@/pages/PublicLanding";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <PublicLanding />,
      },
      {
        path: "/login",
        element: (
          <AdminLoginRoute>
            <SignIn />
          </AdminLoginRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/clients/:id",
        element: (
          <AdminRoute>
            <ClientDetail />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/appointments",
        element: (
          <AdminRoute>
            <Appointments />
          </AdminRoute>
        ),
      },
    ],
  },
]);
