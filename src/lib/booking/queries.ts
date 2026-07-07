import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import type { Appointment } from "@/lib/admin/types";

const SESSION_PRICE_EUR = 229;
const SESSION_DURATION_MINUTES = 60;

export function useAdminProfile() {
  return useQuery({
    queryKey: ["booking", "admin-profile"],
    queryFn: async (): Promise<{ id: string } | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useMyAppointments() {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery({
    queryKey: ["booking", "my-appointments", userId],
    queryFn: async (): Promise<Appointment[]> => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("client_id", userId)
        .order("starts_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: Boolean(userId),
  });
}

export function useRequestAppointment() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const userId = session?.user.id;

  return useMutation({
    mutationFn: async ({ startsAt, notes, adminId }: { startsAt: string; notes: string | null; adminId: string }) => {
      if (!userId) throw new Error("No hay sesión activa.");
      const { error } = await supabase.from("appointments").insert({
        client_id: userId,
        admin_id: adminId,
        starts_at: startsAt,
        duration_minutes: SESSION_DURATION_MINUTES,
        status: "requested",
        amount: SESSION_PRICE_EUR,
        notes,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["booking", "my-appointments", userId] });
    },
  });
}
