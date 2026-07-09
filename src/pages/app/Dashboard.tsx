import { Navigate } from "react-router-dom";

import { AssetAllocationChart } from "@/components/charts/AssetAllocationChart";
import { NetWorthEvolutionChart } from "@/components/charts/NetWorthEvolutionChart";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useAuth } from "@/features/auth/useAuth";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatCurrency, formatPercent } from "@/lib/format/currency";

export function Dashboard() {
  const { user, profile } = useAuth();
  const currency = profile?.currency ?? "EUR";
  const data = useDashboardData(user?.id);

  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/app/onboarding" replace />;
  }

  const debtRatioLabel =
    data.debtRatioLevel === "good" ? "Saludable" : data.debtRatioLevel === "warning" ? "Atención" : "Riesgo";

  return (
    <section className="container-page space-y-8 py-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900">Tu dashboard financiero</h1>
        <p className="mt-1 text-content-muted">
          Basado en tus activos/pasivos actuales y tu último registro mensual.
        </p>
      </div>

      {!data.hasSnapshot && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Aún no tienes un registro mensual de ingresos y gastos: los indicadores de ahorro y
          endeudamiento se mostrarán en 0 hasta que lo completes en "Mi perfil" o en el registro
          mensual.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Ingresos mensuales" value={formatCurrency(data.monthlyIncome, currency)} />
        <KpiCard label="Gastos mensuales" value={formatCurrency(data.monthlyExpenses, currency)} />
        <KpiCard
          label="Ahorro mensual"
          value={formatCurrency(data.monthlySavings, currency)}
          formula="Ahorro = Ingresos − Gastos"
          explanation={data.savingsRate !== null ? `Tasa de ahorro: ${formatPercent(data.savingsRate)}` : undefined}
        />
        <KpiCard
          label="Patrimonio neto"
          value={formatCurrency(data.netWorth, currency)}
          formula="Patrimonio neto = Activos − Pasivos"
        />
        <KpiCard
          label="Ratio de endeudamiento"
          value={data.debtRatio !== null ? formatPercent(data.debtRatio) : "—"}
          formula="Cuotas de deuda mensuales / Ingresos netos mensuales"
          level={data.debtRatioLevel}
          levelLabel={debtRatioLabel}
          explanation="Verde < 30 % · Ámbar 30–40 % · Rojo > 40 %"
        />
        <KpiCard
          label="Cobertura fondo de emergencia"
          value={data.emergencyFundMonths !== null ? `${data.emergencyFundMonths.toFixed(1)} meses` : "—"}
          formula="Activos líquidos / Gastos mensuales"
        />
        <KpiCard
          label="Ratio de liquidez"
          value={data.liquidityRatio !== null ? formatPercent(data.liquidityRatio) : "—"}
          formula="Activos líquidos / Total activos"
        />
        <KpiCard
          label="Peso de la vivienda"
          value={data.realEstateWeight !== null ? formatPercent(data.realEstateWeight) : "—"}
          formula="Valor inmuebles / Total activos"
        />
        <KpiCard
          label="Ratio deuda / activos"
          value={data.debtToAssetsRatio !== null ? formatPercent(data.debtToAssetsRatio) : "—"}
          formula="Total pasivos / Total activos"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold text-content">Distribución de activos</h2>
          <div className="mt-4">
            <AssetAllocationChart data={data.assetAllocation} currency={currency} />
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold text-content">Evolución del patrimonio neto</h2>
          <div className="mt-4">
            <NetWorthEvolutionChart data={data.netWorthEvolution} currency={currency} />
          </div>
        </div>
      </div>
    </section>
  );
}
