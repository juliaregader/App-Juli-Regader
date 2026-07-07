export type UserRole = "client" | "admin";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  status: ApprovalStatus;
  base_currency: string;
  locale: string;
  theme: string;
  dashboard_preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
