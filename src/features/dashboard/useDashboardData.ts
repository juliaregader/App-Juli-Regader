import { useAssets, useFinancialSnapshots, useLiabilities } from "@/features/wealth/queries";
import type { Asset } from "@/features/wealth/types";

export type ThresholdLevel = "good" | "warning" | "risk";

function sumByType(assets: Asset[], type: Asset["type"]) {
  return assets.filter((a) => a.type === type).reduce((sum, a) => sum + a.value, 0);
}

export function useDashboardData(userId: string | undefined) {
  const assetsQuery = useAssets(userId);
  const liabilitiesQuery = useLiabilities(userId);
  const snapshotsQuery = useFinancialSnapshots(userId);

  const isLoading = assetsQuery.isLoading || liabilitiesQuery.isLoading || snapshotsQuery.isLoading;

  const assets = assetsQuery.data ?? [];
  const liabilities = liabilitiesQuery.data ?? [];
  const snapshots = snapshotsQuery.data ?? [];

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
  const netWorth = totalAssets - totalLiabilities;

  const liquidAssets = assets.filter((a) => a.is_liquid).reduce((sum, a) => sum + a.value, 0);
  const monthlyDebtPayments = liabilities.reduce((sum, l) => sum + l.monthly_payment, 0);

  const latestSnapshot = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  const monthlyIncome = latestSnapshot?.net_income ?? 0;
  const monthlyExpenses = latestSnapshot?.total_expenses ?? 0;
  const monthlySavings = monthlyIncome - monthlyExpenses;

  const savingsRate = monthlyIncome > 0 ? monthlySavings / monthlyIncome : null;
  const debtRatio = monthlyIncome > 0 ? monthlyDebtPayments / monthlyIncome : null;
  const emergencyFundMonths = monthlyExpenses > 0 ? liquidAssets / monthlyExpenses : null;
  const liquidityRatio = totalAssets > 0 ? liquidAssets / totalAssets : null;
  const debtToAssetsRatio = totalAssets > 0 ? totalLiabilities / totalAssets : null;
  const realEstateValue = sumByType(assets, "inmueble");
  const realEstateWeight = totalAssets > 0 ? realEstateValue / totalAssets : null;

  const debtRatioLevel: ThresholdLevel = debtRatio === null ? "good" : debtRatio < 0.3 ? "good" : debtRatio <= 0.4 ? "warning" : "risk";

  const assetAllocation = [
    { name: "Líquido", value: sumByType(assets, "liquido") },
    { name: "Inversión", value: sumByType(assets, "inversion") },
    { name: "Inmueble", value: realEstateValue },
    { name: "Otros", value: sumByType(assets, "otros") },
  ].filter((entry) => entry.value > 0);

  const netWorthEvolution = snapshots.map((s) => ({ month: s.month, netWorth: s.net_worth }));

  return {
    isLoading,
    totalAssets,
    totalLiabilities,
    netWorth,
    liquidAssets,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    savingsRate,
    monthlyDebtPayments,
    debtRatio,
    debtRatioLevel,
    emergencyFundMonths,
    liquidityRatio,
    debtToAssetsRatio,
    realEstateWeight,
    assetAllocation,
    netWorthEvolution,
    hasSnapshot: Boolean(latestSnapshot),
  };
}
