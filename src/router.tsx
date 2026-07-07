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
import { Goals } from "@/pages/goals/Goals";
import { Onboarding } from "@/pages/onboarding/Onboarding";
import { Strategy } from "@/pages/strategy/Strategy";
import { Tools } from "@/pages/tools/Tools";

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
        path: "/strategy",
        element: (
          <ProtectedRoute>
            <Strategy />
          </ProtectedRoute>
        ),
      },
      {
        path: "/goals",
        element: (
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tools",
        element: (
          <ProtectedRoute>
            <Tools />
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
