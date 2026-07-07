export type IncomeCategory = "fixed" | "variable";
export type ExpenseCategory =
  | "housing"
  | "utilities"
  | "transport"
  | "leisure"
  | "debt"
  | "savings"
  | "other";
export type AssetCategory = "liquid" | "investment" | "real_estate" | "other";
export type LiabilityCategory = "mortgage" | "loan" | "credit_card" | "other";

export interface IncomeItem {
  id: string;
  profile_id: string;
  name: string;
  category: IncomeCategory;
  amount: number;
  currency: string;
  period_month: string;
}

export interface ExpenseItem {
  id: string;
  profile_id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  period_month: string;
}

export interface Asset {
  id: string;
  profile_id: string;
  name: string;
  category: AssetCategory;
  value: number;
  currency: string;
  notes: string | null;
  updated_at: string;
}

export interface Liability {
  id: string;
  profile_id: string;
  name: string;
  category: LiabilityCategory;
  value: number;
  currency: string;
  interest_rate: number | null;
  monthly_payment: number | null;
  notes: string | null;
  updated_at: string;
}

export interface NetWorthSnapshot {
  id: string;
  profile_id: string;
  snapshot_date: string;
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
}

export interface StrategyAllocation {
  id: string;
  profile_id: string;
  asset_class: string;
  target_percentage: number;
  current_value: number;
  currency: string;
  sort_order: number;
}

export interface Goal {
  id: string;
  profile_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  currency: string;
  target_date: string | null;
}

/** Nuevo registro sin los campos que rellena la base de datos. */
export type NewIncomeItem = Pick<IncomeItem, "name" | "category" | "amount" | "currency">;
export type NewExpenseItem = Pick<ExpenseItem, "name" | "category" | "amount" | "currency">;
export type NewAsset = Pick<Asset, "name" | "category" | "value" | "currency">;
export type NewLiability = Pick<
  Liability,
  "name" | "category" | "value" | "currency" | "interest_rate" | "monthly_payment"
>;
export type NewStrategyAllocation = Pick<
  StrategyAllocation,
  "asset_class" | "target_percentage" | "current_value" | "currency"
>;
export type NewGoal = Pick<Goal, "name" | "target_amount" | "current_amount" | "currency" | "target_date">;
