import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Profile } from "@/features/auth/types";
import { supabase } from "@/lib/supabase/client";

export interface BookingRow {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  service: "plan_329" | "sesion_80";
  start_at: string;
  end_at: string;
  status: string;
  payment_id: string | null;
  created_at: string;
}

export interface PaymentRow {
  id: string;
  user_id: string | null;
  stripe_session_id: string | null;
  amount: number;
  currency: string;
  service: "plan_329" | "sesion_80";
  status: string;
  created_at: string;
}

export function useAllProfiles() {
  return useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useClientProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).single();
      if (error) throw error;
      return data as Profile;
    },
    enabled: Boolean(userId),
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("start_at", { ascending: false });
      if (error) throw error;
      return data as BookingRow[];
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] }),
  });
}

export function useAllPayments() {
  return useQuery({
    queryKey: ["admin", "payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PaymentRow[];
    },
  });
}

export function useMarkPaymentPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("payments").update({ status: "pagado" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "payments"] }),
  });
}
