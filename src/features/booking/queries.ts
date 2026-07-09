import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase/client";

import type { AvailabilityBlock, AvailabilityRule, BookingService, Slot } from "./types";

export function useAvailableSlots(date: string) {
  return useQuery({
    queryKey: ["available_slots", date],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_slots", { p_date: date });
      if (error) throw error;
      return data as Slot[];
    },
  });
}

interface CreateBookingInput {
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  service: BookingService;
  startAt: string;
  endAt: string;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: input.userId ?? null,
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          service: input.service,
          start_at: input.startAt,
          end_at: input.endAt,
        })
        .select()
        .single();
      if (error) throw error;

      // Notifica por email (admin + cliente) vía Edge Function. Si falla el
      // envío, la reserva ya ha quedado guardada; no bloqueamos al usuario.
      await supabase.functions.invoke("notify-booking", { body: { bookingId: data.id } }).catch(() => null);

      return data;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["available_slots"] });
      if (variables.startAt) {
        void queryClient.invalidateQueries({ queryKey: ["available_slots", variables.startAt.slice(0, 10)] });
      }
    },
  });
}

// --- Administración de disponibilidad ---------------------------------------

export function useAvailabilityRules() {
  return useQuery({
    queryKey: ["admin", "availability_rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_rules")
        .select("*")
        .order("weekday", { ascending: true })
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data as AvailabilityRule[];
    },
  });
}

export function useUpsertAvailabilityRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rule: Partial<AvailabilityRule> & { id?: string }) => {
      const { data, error } = await supabase.from("availability_rules").upsert(rule).select().single();
      if (error) throw error;
      return data as AvailabilityRule;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "availability_rules"] }),
  });
}

export function useDeleteAvailabilityRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("availability_rules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "availability_rules"] }),
  });
}

export function useAvailabilityBlocks() {
  return useQuery({
    queryKey: ["admin", "availability_blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_blocks")
        .select("*")
        .order("block_date", { ascending: true });
      if (error) throw error;
      return data as AvailabilityBlock[];
    },
  });
}

export function useAddAvailabilityBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (block: Omit<AvailabilityBlock, "id">) => {
      const { data, error } = await supabase.from("availability_blocks").insert(block).select().single();
      if (error) throw error;
      return data as AvailabilityBlock;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "availability_blocks"] }),
  });
}

export function useDeleteAvailabilityBlock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("availability_blocks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "availability_blocks"] }),
  });
}
