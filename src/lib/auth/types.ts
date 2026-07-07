export type UserRole = "client" | "admin";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  status: ApprovalStatus;
  has_paid: boolean;
  base_currency: string;
  locale: string;
  theme: string;
  dashboard_preferences: Record<string, unknown>;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}
