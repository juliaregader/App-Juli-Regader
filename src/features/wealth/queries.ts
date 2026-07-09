import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { firstOfMonth } from "@/lib/dates";
import { supabase } from "@/lib/supabase/client";

import type { Asset, FinancialSnapshot, Goal, Liability } from "./types";

// --- Assets ---------------------------------------------------------------

export function useAssets(userId: string | undefined) {
  return useQuery({
    queryKey: ["assets", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("user_id", userId!)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Asset[];
    },
    enabled: Boolean(userId),
  });
}

export function useUpsertAsset(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (asset: Partial<Asset> & { id?: string }) => {
      const payload = { ...asset, user_id: userId };
      const { data, error } = await supabase.from("assets").upsert(payload).select().single();
      if (error) throw error;
      return data as Asset;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assets", userId] }),
  });
}

export function useDeleteAsset(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("assets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assets", userId] }),
  });
}

// --- Liabilities ------------------------------------------------------------

export function useLiabilities(userId: string | undefined) {
  return useQuery({
    queryKey: ["liabilities", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("liabilities")
        .select("*")
        .eq("user_id", userId!)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as Liability[];
    },
    enabled: Boolean(userId),
  });
}

export function useUpsertLiability(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (liability: Partial<Liability> & { id?: string }) => {
      const payload = { ...liability, user_id: userId };
      const { data, error } = await supabase.from("liabilities").upsert(payload).select().single();
      if (error) throw error;
      return data as Liability;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["liabilities", userId] }),
  });
}

export function useDeleteLiability(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("liabilities").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["liabilities", userId] }),
  });
}

// --- Goals ------------------------------------------------------------------

export function useGoals(userId: string | undefined) {
  return useQuery({
    queryKey: ["goals", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Goal[];
    },
    enabled: Boolean(userId),
  });
}

export function useUpsertGoal(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goal: Partial<Goal> & { id?: string }) => {
      const payload = { ...goal, user_id: userId };
      const { data, error } = await supabase.from("goals").upsert(payload).select().single();
      if (error) throw error;
      return data as Goal;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals", userId] }),
  });
}

export function useDeleteGoal(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["goals", userId] }),
  });
}

// --- Financial snapshots (registro mensual) --------------------------------

export function useFinancialSnapshots(userId: string | undefined) {
  return useQuery({
    queryKey: ["financial_snapshots", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_snapshots")
        .select("*")
        .eq("user_id", userId!)
        .order("month", { ascending: true });
      if (error) throw error;
      return data as FinancialSnapshot[];
    },
    enabled: Boolean(userId),
  });
}

export function useMonthSnapshot(userId: string | undefined, month: string = firstOfMonth()) {
  return useQuery({
    queryKey: ["financial_snapshot", userId, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_snapshots")
        .select("*")
        .eq("user_id", userId!)
        .eq("month", month)
        .maybeSingle();
      if (error) throw error;
      return data as FinancialSnapshot | null;
    },
    enabled: Boolean(userId),
  });
}

export function useUpsertMonthSnapshot(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (snapshot: {
      month: string;
      net_income: number;
      expenses: Record<string, number>;
      total_expenses: number;
      total_assets: number;
      total_liabilities: number;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("financial_snapshots")
        .upsert({ ...snapshot, user_id: userId }, { onConflict: "user_id,month" })
        .select()
        .single();
      if (error) throw error;
      return data as FinancialSnapshot;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["financial_snapshots", userId] });
      void queryClient.invalidateQueries({ queryKey: ["financial_snapshot", userId] });
    },
  });
}
