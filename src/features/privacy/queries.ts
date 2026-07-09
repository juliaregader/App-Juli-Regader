import { useMutation } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase/client";

async function fetchAllRows(table: string, userId: string) {
  const { data, error } = await supabase.from(table).select("*").eq("user_id", userId);
  if (error) throw error;
  return data;
}

export function useExportMyData(userId: string | undefined) {
  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Sin sesión");

      const [profile, assets, liabilities, goals, snapshots, strategy, strategyAssets] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single().then((r) => r.data),
        fetchAllRows("assets", userId),
        fetchAllRows("liabilities", userId),
        fetchAllRows("goals", userId),
        fetchAllRows("financial_snapshots", userId),
        supabase.from("investment_strategy").select("*").eq("user_id", userId).maybeSingle().then((r) => r.data),
        fetchAllRows("investment_assets", userId),
      ]);

      const payload = { profile, assets, liabilities, goals, financial_snapshots: snapshots, investment_strategy: strategy, investment_assets: strategyAssets };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "juliuscapital-mis-datos.json";
      link.click();
      URL.revokeObjectURL(url);
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke("delete-account", { body: {} });
      if (error) throw error;
    },
  });
}
