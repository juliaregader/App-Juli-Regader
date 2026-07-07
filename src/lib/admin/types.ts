import type { ApprovalStatus } from "@/lib/auth/types";

export type AppointmentStatus = "requested" | "confirmed" | "completed" | "cancelled";

export interface ClientProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  status: ApprovalStatus;
  base_currency: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  admin_id: string;
  starts_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  amount: number;
  notes: string | null;
}

export interface AdminNote {
  id: string;
  client_id: string;
  note: string;
  created_at: string;
}

export type NewAppointment = Pick<
  Appointment,
  "client_id" | "starts_at" | "duration_minutes" | "status" | "amount" | "notes"
>;
