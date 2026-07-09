import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { PrivateLayout } from "@/components/layout/PrivateLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { AdminRoute } from "@/features/auth/AdminRoute";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

const Home = lazy(() => import("@/pages/Home").then((m) => ({ default: m.Home })));
const Servicios = lazy(() => import("@/pages/Servicios").then((m) => ({ default: m.Servicios })));
const ConsultaPatrimonial = lazy(() =>
  import("@/pages/ConsultaPatrimonial").then((m) => ({ default: m.ConsultaPatrimonial })),
);
const Reservas = lazy(() => import("@/pages/Reservas").then((m) => ({ default: m.Reservas })));
const Contacto = lazy(() => import("@/pages/Contacto").then((m) => ({ default: m.Contacto })));
const PaymentSuccess = lazy(() =>
  import("@/pages/payments/PaymentSuccess").then((m) => ({ default: m.PaymentSuccess })),
);
const PaymentCancelled = lazy(() =>
  import("@/pages/payments/PaymentCancelled").then((m) => ({ default: m.PaymentCancelled })),
);
const Status = lazy(() => import("@/pages/Status").then((m) => ({ default: m.Status })));
const Register = lazy(() => import("@/pages/auth/Register").then((m) => ({ default: m.Register })));
const Login = lazy(() => import("@/pages/auth/Login").then((m) => ({ default: m.Login })));
const ForgotPassword = lazy(() =>
  import("@/pages/auth/ForgotPassword").then((m) => ({ default: m.ForgotPassword })),
);
const ResetPassword = lazy(() =>
  import("@/pages/auth/ResetPassword").then((m) => ({ default: m.ResetPassword })),
);
const AvisoLegal = lazy(() => import("@/pages/legal/AvisoLegal").then((m) => ({ default: m.AvisoLegal })));
const Privacidad = lazy(() => import("@/pages/legal/Privacidad").then((m) => ({ default: m.Privacidad })));
const Terminos = lazy(() => import("@/pages/legal/Terminos").then((m) => ({ default: m.Terminos })));
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));

const Dashboard = lazy(() => import("@/pages/app/Dashboard").then((m) => ({ default: m.Dashboard })));
const Onboarding = lazy(() => import("@/pages/onboarding/Onboarding").then((m) => ({ default: m.Onboarding })));
const Perfil = lazy(() => import("@/pages/app/Perfil").then((m) => ({ default: m.Perfil })));
const Strategy = lazy(() => import("@/pages/app/Strategy").then((m) => ({ default: m.Strategy })));
const RegistroMensual = lazy(() =>
  import("@/pages/app/RegistroMensual").then((m) => ({ default: m.RegistroMensual })),
);

const AdminClients = lazy(() => import("@/pages/admin/AdminClients").then((m) => ({ default: m.AdminClients })));
const AdminClientDetail = lazy(() =>
  import("@/pages/admin/AdminClientDetail").then((m) => ({ default: m.AdminClientDetail })),
);
const AdminBookings = lazy(() => import("@/pages/admin/AdminBookings").then((m) => ({ default: m.AdminBookings })));
const AdminPayments = lazy(() => import("@/pages/admin/AdminPayments").then((m) => ({ default: m.AdminPayments })));
const AdminAvailability = lazy(() =>
  import("@/pages/admin/AdminAvailability").then((m) => ({ default: m.AdminAvailability })),
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "servicios", element: <Servicios /> },
      { path: "consulta-patrimonial", element: <ConsultaPatrimonial /> },
      { path: "reservas", element: <Reservas /> },
      { path: "contacto", element: <Contacto /> },
      { path: "pago/exito", element: <PaymentSuccess /> },
      { path: "pago/cancelado", element: <PaymentCancelled /> },
      { path: "status", element: <Status /> },
      { path: "registro", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "recuperar-contrasena", element: <ForgotPassword /> },
      { path: "restablecer-contrasena", element: <ResetPassword /> },
      { path: "legal/aviso-legal", element: <AvisoLegal /> },
      { path: "legal/privacidad", element: <Privacidad /> },
      { path: "legal/terminos", element: <Terminos /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "onboarding", element: <Onboarding /> },
          { path: "perfil", element: <Perfil /> },
          { path: "estrategia", element: <Strategy /> },
          { path: "registro-mensual", element: <RegistroMensual /> },
          {
            path: "admin",
            element: <AdminRoute />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { index: true, element: <AdminClients /> },
                  { path: "clientes/:id", element: <AdminClientDetail /> },
                  { path: "reservas", element: <AdminBookings /> },
                  { path: "pagos", element: <AdminPayments /> },
                  { path: "disponibilidad", element: <AdminAvailability /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
