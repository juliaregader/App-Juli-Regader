export interface InvestmentStrategy {
  id: string;
  user_id: string;
  name: string;
  monthly_contribution: number;
  notes: string | null;
  updated_at: string;
}

export interface InvestmentAsset {
  id: string;
  strategy_id: string;
  user_id: string;
  asset_name: string;
  target_pct: number;
  amount: number;
  currency: string;
  updated_at: string;
}
