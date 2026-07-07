import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth/AuthProvider";
import type { ApprovalStatus } from "@/lib/auth/types";
import { supabase } from "@/lib/supabase/client";
import type { AdminNote, Appointment, ClientProfile, NewAppointment } from "@/lib/admin/types";

export function useClientProfiles() {
  return useQuery({
    queryKey: ["admin", "clients"],
    queryFn: async (): Promise<ClientProfile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

/** Última fecha de snapshot de patrimonio por cliente (para detectar clientes inactivos). */
export function useLastUpdateByClient() {
  return useQuery({
    queryKey: ["admin", "last-update-by-client"],
    queryFn: async (): Promise<Map<string, string>> => {
      const { data, error } = await supabase
        .from("net_worth_snapshots")
        .select("profile_id, snapshot_date")
        .order("snapshot_date", { ascending: false });
      if (error) throw error;

      const lastByClient = new Map<string, string>();
      for (const row of data as { profile_id: string; snapshot_date: string }[]) {
        if (!lastByClient.has(row.profile_id)) {
          lastByClient.set(row.profile_id, row.snapshot_date);
        }
      }
      return lastByClient;
    },
  });
}

export function useUpdateClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApprovalStatus }) => {
      const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "clients"] });
    },
  });
}

export function useUpdateClientPaidStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, hasPaid }: { id: string; hasPaid: boolean }) => {
      const { error } = await supabase.from("profiles").update({ has_paid: hasPaid }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "clients"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "client", variables.id] });
    },
  });
}

export function useClientProfile(clientId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "client", clientId],
    queryFn: async (): Promise<ClientProfile> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", clientId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(clientId),
  });
}

export function useClientNetWorth(clientId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "client-net-worth", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("net_worth_snapshots")
        .select("*")
        .eq("profile_id", clientId)
        .order("snapshot_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(clientId),
  });
}

export function useAdminNotes(clientId: string | undefined) {
  return useQuery({
    queryKey: ["admin", "notes", clientId],
    queryFn: async (): Promise<AdminNote[]> => {
      const { data, error } = await supabase
        .from("admin_notes")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: Boolean(clientId),
  });
}

export function useCreateAdminNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, note }: { clientId: string; note: string }) => {
      const { error } = await supabase.from("admin_notes").insert({ client_id: clientId, note });
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "notes", variables.clientId] });
    },
  });
}

export function useAppointments() {
  return useQuery({
    queryKey: ["admin", "appointments"],
    queryFn: async (): Promise<Appointment[]> => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("starts_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateAppointment() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointment: NewAppointment) => {
      if (!session) throw new Error("No hay sesión activa.");
      const { error } = await supabase
        .from("appointments")
        .insert({ ...appointment, admin_id: session.user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<NewAppointment> }) => {
      const { error } = await supabase.from("appointments").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "appointments"] });
    },
  });
}
