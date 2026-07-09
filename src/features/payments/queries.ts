import { useMutation, useQuery } from "@tanstack/react-query";

import type { BookingService } from "@/features/booking/types";
import { supabase } from "@/lib/supabase/client";

interface CreateCheckoutInput {
  service: BookingService;
  userId?: string;
  email: string;
  bookingId?: string;
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async (input: CreateCheckoutInput) => {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", { body: input });
      if (error) throw error;
      return data as { id: string; url: string };
    },
  });
}

export function useHasPaidPlan(userId: string | undefined) {
  return useQuery({
    queryKey: ["payments", "plan_329_paid", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("id")
        .eq("user_id", userId!)
        .eq("service", "plan_329")
        .eq("status", "pagado")
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
    enabled: Boolean(userId),
  });
}
