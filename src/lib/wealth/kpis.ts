import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth/AuthProvider";
import { supabase } from "@/lib/supabase/client";
import type { Asset, ExpenseItem, IncomeItem, Liability, NetWorthSnapshot } from "@/lib/wealth/types";

function currentMonthStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

/** Historial completo de snapshots de patrimonio neto, ordenado por fecha. */
export function useNetWorthHistory() {
  const { session } = useAuth();
  const profileId = session?.user.id;

  return useQuery({
    queryKey: ["net-worth-history", profileId],
    queryFn: async (): Promise<NetWorthSnapshot[]> => {
      const { data, error } = await supabase
        .from("net_worth_snapshots")
        .select("*")
        .order("snapshot_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: Boolean(profileId),
  });
}

export interface MonthlyCashFlow {
  totalIncome: number;
  totalExpenses: number;
  cashFlow: number;
  savingsRate: number | null;
}

/** Cash-flow y tasa de ahorro del mes en curso. */
export function useMonthlyCashFlow() {
  const { session } = useAuth();
  const profileId = session?.user.id;
  const month = currentMonthStart();

  return useQuery({
    queryKey: ["monthly-cash-flow", profileId, month],
    queryFn: async (): Promise<MonthlyCashFlow> => {
      const [{ data: income, error: incomeError }, { data: expenses, error: expenseError }] =
        await Promise.all([
          supabase.from("income_items").select("amount").eq("period_month", month),
          supabase.from("expense_items").select("amount").eq("period_month", month),
        ]);
      if (incomeError) throw incomeError;
      if (expenseError) throw expenseError;

      const totalIncome = (income as Pick<IncomeItem, "amount">[]).reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );
      const totalExpenses = (expenses as Pick<ExpenseItem, "amount">[]).reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );
      const cashFlow = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? cashFlow / totalIncome : null;

      return { totalIncome, totalExpenses, cashFlow, savingsRate };
    },
    enabled: Boolean(profileId),
  });
}

export interface DebtRatios {
  debtToAssets: number | null;
  debtToIncome: number | null;
}

/** Ratio deuda/activos y deuda/ingresos (usa el ingreso mensual del mes en curso). */
export function useDebtRatios() {
  const { session } = useAuth();
  const profileId = session?.user.id;
  const month = currentMonthStart();

  return useQuery({
    queryKey: ["debt-ratios", profileId, month],
    queryFn: async (): Promise<DebtRatios> => {
      const [
        { data: assets, error: assetsError },
        { data: liabilities, error: liabilitiesError },
        { data: income, error: incomeError },
      ] = await Promise.all([
        supabase.from("assets").select("value"),
        supabase.from("liabilities").select("value"),
        supabase.from("income_items").select("amount").eq("period_month", month),
      ]);
      if (assetsError) throw assetsError;
      if (liabilitiesError) throw liabilitiesError;
      if (incomeError) throw incomeError;

      const totalAssets = (assets as Pick<Asset, "value">[]).reduce(
        (sum, item) => sum + Number(item.value),
        0,
      );
      const totalLiabilities = (liabilities as Pick<Liability, "value">[]).reduce(
        (sum, item) => sum + Number(item.value),
        0,
      );
      const totalIncome = (income as Pick<IncomeItem, "amount">[]).reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );

      return {
        debtToAssets: totalAssets > 0 ? totalLiabilities / totalAssets : null,
        debtToIncome: totalIncome > 0 ? totalLiabilities / totalIncome : null,
      };
    },
    enabled: Boolean(profileId),
  });
}

/** Meses de gastos cubiertos por activos líquidos. */
export function useEmergencyFundMonths() {
  const { session } = useAuth();
  const profileId = session?.user.id;
  const month = currentMonthStart();

  return useQuery({
    queryKey: ["emergency-fund", profileId, month],
    queryFn: async (): Promise<number | null> => {
      const [{ data: assets, error: assetsError }, { data: expenses, error: expensesError }] =
        await Promise.all([
          supabase.from("assets").select("value").eq("category", "liquid"),
          supabase.from("expense_items").select("amount").eq("period_month", month),
        ]);
      if (assetsError) throw assetsError;
      if (expensesError) throw expensesError;

      const liquidAssets = (assets as Pick<Asset, "value">[]).reduce(
        (sum, item) => sum + Number(item.value),
        0,
      );
      const monthlyExpenses = (expenses as Pick<ExpenseItem, "amount">[]).reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );

      return monthlyExpenses > 0 ? liquidAssets / monthlyExpenses : null;
    },
    enabled: Boolean(profileId),
  });
}

export interface AssetBreakdownEntry {
  category: string;
  total: number;
}

/** Distribución de activos por categoría. */
export function useAssetBreakdown() {
  const { session } = useAuth();
  const profileId = session?.user.id;

  return useQuery({
    queryKey: ["asset-breakdown", profileId],
    queryFn: async (): Promise<AssetBreakdownEntry[]> => {
      const { data, error } = await supabase.from("assets").select("category, value");
      if (error) throw error;

      const totals = new Map<string, number>();
      for (const item of data as Pick<Asset, "category" | "value">[]) {
        totals.set(item.category, (totals.get(item.category) ?? 0) + Number(item.value));
      }
      return Array.from(totals.entries()).map(([category, total]) => ({ category, total }));
    },
    enabled: Boolean(profileId),
  });
}

/** Distribución de gastos del mes en curso por categoría. */
export function useExpenseBreakdown() {
  const { session } = useAuth();
  const profileId = session?.user.id;
  const month = currentMonthStart();

  return useQuery({
    queryKey: ["expense-breakdown", profileId, month],
    queryFn: async (): Promise<AssetBreakdownEntry[]> => {
      const { data, error } = await supabase
        .from("expense_items")
        .select("category, amount")
        .eq("period_month", month);
      if (error) throw error;

      const totals = new Map<string, number>();
      for (const item of data as Pick<ExpenseItem, "category" | "amount">[]) {
        totals.set(item.category, (totals.get(item.category) ?? 0) + Number(item.amount));
      }
      return Array.from(totals.entries()).map(([category, total]) => ({ category, total }));
    },
    enabled: Boolean(profileId),
  });
}
