import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase/client";

import type { InvestmentAsset, InvestmentStrategy } from "./types";

export function useStrategy(userId: string | undefined) {
  return useQuery({
    queryKey: ["investment_strategy", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_strategy")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;

      if (data) return data as InvestmentStrategy;

      const { data: created, error: createError } = await supabase
        .from("investment_strategy")
        .insert({ user_id: userId, name: "Mi estrategia", monthly_contribution: 0 })
        .select()
        .single();
      if (createError) throw createError;
      return created as InvestmentStrategy;
    },
    enabled: Boolean(userId),
  });
}

export function useUpdateStrategy(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Pick<InvestmentStrategy, "name" | "monthly_contribution" | "notes">> & { id: string }) => {
      const { data, error } = await supabase
        .from("investment_strategy")
        .update(patch)
        .eq("id", patch.id)
        .select()
        .single();
      if (error) throw error;
      return data as InvestmentStrategy;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["investment_strategy", userId] }),
  });
}

export function useStrategyAssets(strategyId: string | undefined) {
  return useQuery({
    queryKey: ["investment_assets", strategyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_assets")
        .select("*")
        .eq("strategy_id", strategyId!)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as InvestmentAsset[];
    },
    enabled: Boolean(strategyId),
  });
}

export function useUpsertStrategyAsset(strategyId: string | undefined, userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (asset: Partial<InvestmentAsset> & { id?: string }) => {
      const payload = { ...asset, strategy_id: strategyId, user_id: userId };
      const { data, error } = await supabase.from("investment_assets").upsert(payload).select().single();
      if (error) throw error;
      return data as InvestmentAsset;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["investment_assets", strategyId] }),
  });
}

export function useDeleteStrategyAsset(strategyId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("investment_assets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["investment_assets", strategyId] }),
  });
}
