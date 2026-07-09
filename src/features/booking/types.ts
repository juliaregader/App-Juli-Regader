export type BookingService = "plan_329" | "sesion_80";

export interface Slot {
  slot_start: string;
  slot_end: string;
}

export interface AvailabilityRule {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  active: boolean;
}

export interface AvailabilityBlock {
  id: string;
  block_date: string;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
}
