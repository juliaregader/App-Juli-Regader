import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/components/layout/RootLayout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { Status } from "@/pages/Status";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "status", element: <Status /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
