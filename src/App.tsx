import { QueryClientProvider } from "@tanstack/react-query";
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";

import { LogoMark } from "@/components/brand/LogoMark";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { queryClient } from "@/lib/query/queryClient";
import { router } from "@/router";

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LogoMark className="h-10 w-10 animate-pulse text-brand-300" />
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<RouteFallback />}>
            <RouterProvider router={router} />
          </Suspense>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
