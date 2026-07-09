export type AssetType = "liquido" | "inversion" | "inmueble" | "otros";

export interface Asset {
  id: string;
  user_id: string;
  name: string;
  type: AssetType;
  value: number;
  currency: string;
  is_liquid: boolean;
  updated_at: string;
}

export interface Liability {
  id: string;
  user_id: string;
  name: string;
  type: string;
  balance: number;
  monthly_payment: number;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number | null;
  target_date: string | null;
  description: string | null;
  created_at: string;
}

export interface FinancialSnapshot {
  id: string;
  user_id: string;
  month: string;
  net_income: number;
  expenses: Record<string, number>;
  total_expenses: number;
  total_assets: number;
  total_liabilities: number;
  savings: number;
  net_worth: number;
  notes: string | null;
  created_at: string;
}
