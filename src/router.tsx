import { createBrowserRouter } from "react-router-dom";

import { PrivateLayout } from "@/components/layout/PrivateLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { AdminRoute } from "@/features/auth/AdminRoute";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { AdminHome } from "@/pages/admin/AdminHome";
import { Dashboard } from "@/pages/app/Dashboard";
import { Perfil } from "@/pages/app/Perfil";
import { RegistroMensual } from "@/pages/app/RegistroMensual";
import { Strategy } from "@/pages/app/Strategy";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ResetPassword } from "@/pages/auth/ResetPassword";
import { Onboarding } from "@/pages/onboarding/Onboarding";
import { Contacto } from "@/pages/Contacto";
import { ConsultaPatrimonial } from "@/pages/ConsultaPatrimonial";
import { Home } from "@/pages/Home";
import { AvisoLegal } from "@/pages/legal/AvisoLegal";
import { Privacidad } from "@/pages/legal/Privacidad";
import { Terminos } from "@/pages/legal/Terminos";
import { NotFound } from "@/pages/NotFound";
import { Reservas } from "@/pages/Reservas";
import { Servicios } from "@/pages/Servicios";
import { Status } from "@/pages/Status";

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
            children: [{ index: true, element: <AdminHome /> }],
          },
        ],
      },
    ],
  },
]);
