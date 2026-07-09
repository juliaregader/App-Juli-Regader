export type UserRole = "admin" | "client";
export type Language = "es" | "ca" | "en";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  language: Language;
  currency: string;
  onboarding_completed: boolean;
  created_at: string;
}
