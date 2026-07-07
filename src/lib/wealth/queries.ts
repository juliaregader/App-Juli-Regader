import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import type {
  Asset,
  ExpenseItem,
  IncomeItem,
  Liability,
  NetWorthSnapshot,
  NewAsset,
  NewExpenseItem,
  NewIncomeItem,
  NewLiability,
} from "@/lib/wealth/types";

function useWealthList<T>(table: string) {
  const { session } = useAuth();
  const profileId = session?.user.id;

  return useQuery({
    queryKey: [table, profileId],
    queryFn: async (): Promise<T[]> => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as T[];
    },
    enabled: Boolean(profileId),
  });
}

function useWealthCreate<TNew extends object>(table: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const profileId = session?.user.id;

  return useMutation({
    mutationFn: async (item: TNew) => {
      if (!profileId) throw new Error("No hay sesión activa.");
      const { error } = await supabase.from(table).insert({ ...item, profile_id: profileId });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [table, profileId] });
      void queryClient.invalidateQueries({ queryKey: ["net-worth-snapshot", profileId] });
    },
  });
}

function useWealthDelete(table: string) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const profileId = session?.user.id;

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [table, profileId] });
      void queryClient.invalidateQueries({ queryKey: ["net-worth-snapshot", profileId] });
    },
  });
}

export const useIncomeItems = () => useWealthList<IncomeItem>("income_items");
export const useCreateIncomeItem = () => useWealthCreate<NewIncomeItem>("income_items");
export const useDeleteIncomeItem = () => useWealthDelete("income_items");

export const useExpenseItems = () => useWealthList<ExpenseItem>("expense_items");
export const useCreateExpenseItem = () => useWealthCreate<NewExpenseItem>("expense_items");
export const useDeleteExpenseItem = () => useWealthDelete("expense_items");

export const useAssets = () => useWealthList<Asset>("assets");
export const useCreateAsset = () => useWealthCreate<NewAsset>("assets");
export const useDeleteAsset = () => useWealthDelete("assets");

export const useLiabilities = () => useWealthList<Liability>("liabilities");
export const useCreateLiability = () => useWealthCreate<NewLiability>("liabilities");
export const useDeleteLiability = () => useWealthDelete("liabilities");

export function useLatestNetWorth() {
  const { session } = useAuth();
  const profileId = session?.user.id;

  return useQuery({
    queryKey: ["net-worth-snapshot", profileId],
    queryFn: async (): Promise<NetWorthSnapshot | null> => {
      const { data, error } = await supabase
        .from("net_worth_snapshots")
        .select("*")
        .order("snapshot_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(profileId),
  });
}
