import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/components/layout/RootLayout";
import { PaywallGate } from "@/components/paywall/PaywallGate";
import {
  LandingRoute,
  OnboardingRoute,
  ProtectedRoute,
  PublicOnlyRoute,
  RequireSession,
} from "@/lib/auth/ProtectedRoute";
import { AdminHome } from "@/pages/admin/AdminHome";
import { Appointments } from "@/pages/admin/Appointments";
import { ClientDetail } from "@/pages/admin/ClientDetail";
import { PendingApproval } from "@/pages/auth/PendingApproval";
import { SignIn } from "@/pages/auth/SignIn";
import { Home } from "@/pages/Home";
import { PublicLanding } from "@/pages/PublicLanding";
import { Glossary } from "@/pages/glossary/Glossary";
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
          <LandingRoute>
            <PublicLanding />
          </LandingRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <PaywallGate>
              <Home />
            </PaywallGate>
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
            <PaywallGate>
              <Strategy />
            </PaywallGate>
          </ProtectedRoute>
        ),
      },
      {
        path: "/goals",
        element: (
          <ProtectedRoute>
            <PaywallGate>
              <Goals />
            </PaywallGate>
          </ProtectedRoute>
        ),
      },
      {
        path: "/tools",
        element: (
          <ProtectedRoute>
            <PaywallGate>
              <Tools />
            </PaywallGate>
          </ProtectedRoute>
        ),
      },
      {
        path: "/glossary",
        element: (
          <ProtectedRoute>
            <PaywallGate>
              <Glossary />
            </PaywallGate>
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
      {
        path: "/admin/clients/:id",
        element: (
          <ProtectedRoute requireRole="admin">
            <ClientDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/appointments",
        element: (
          <ProtectedRoute requireRole="admin">
            <Appointments />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
