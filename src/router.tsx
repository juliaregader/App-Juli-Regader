import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/components/layout/RootLayout";
import {
  OnboardingRoute,
  ProtectedRoute,
  PublicOnlyRoute,
  RequireSession,
} from "@/lib/auth/ProtectedRoute";
import { AdminHome } from "@/pages/admin/AdminHome";
import { PendingApproval } from "@/pages/auth/PendingApproval";
import { SignIn } from "@/pages/auth/SignIn";
import { Home } from "@/pages/Home";
import { Onboarding } from "@/pages/onboarding/Onboarding";

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
        path: "/onboarding",
        element: (
          <OnboardingRoute>
            <Onboarding />
          </OnboardingRoute>
        ),
      },
      {
        path: "/wealth",
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
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
