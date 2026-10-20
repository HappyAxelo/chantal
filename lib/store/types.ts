import type { AvailabilityRule, Interval } from "@/lib/booking/slots";

export type InquiryStatus = "new" | "in_review" | "responded" | "closed" | "spam";
export type AppointmentStatus = "pending" | "confirmed" | "declined" | "cancelled" | "completed";
export type MeetingFormatValue = "in_person" | "online" | "phone" | "to_be_agreed";

export interface InquiryRecord {
  id: string;
  reference: string;
  name: string;
  organization: string | null;
  email: string;
  phone: string | null;
  jurisdiction: string | null;
  service: string;
  projectType: string | null;
  timeframe: string;
  message: string;
  contactPreference: string;
  privacyNoticeVersion: string;
  status: InquiryStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentRecord {
  id: string;
  reference: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  category: string;
  startAt: string;
  endAt: string;
  timezone: string;
  meetingFormat: MeetingFormatValue;
  status: AppointmentStatus;
  reason: string;
  adminNotes: string | null;
  privacyNoticeVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlockedPeriod {
  id: string;
  startAt: string;
  endAt: string;
  reason: string | null;
  createdAt: string;
}

export type NewInquiry = Omit<InquiryRecord, "id" | "status" | "adminNotes" | "createdAt" | "updatedAt">;
export type NewAppointment = Omit<AppointmentRecord, "id" | "status" | "adminNotes" | "createdAt" | "updatedAt">;

export type CreateAppointmentResult = { ok: true; appointment: AppointmentRecord } | { ok: false; reason: "conflict" };
export type UpdateAppointmentResult = { ok: true; appointment: AppointmentRecord } | { ok: false; reason: "conflict" | "not_found" };

export interface InquiryFilter {
  status?: InquiryStatus;
  service?: string;
  from?: string; // YYYY-MM-DD
  to?: string;
}

export interface AppointmentFilter {
  status?: AppointmentStatus;
  upcomingOnly?: boolean;
}

/** Statuses that occupy a slot. */
export const ACTIVE_STATUSES: AppointmentStatus[] = ["pending", "confirmed"];

export interface Store {
  readonly kind: "supabase" | "local";
  createInquiry(input: NewInquiry): Promise<InquiryRecord>;
  listInquiries(filter: InquiryFilter): Promise<InquiryRecord[]>;
  updateInquiry(id: string, patch: { status?: InquiryStatus; adminNotes?: string | null }): Promise<InquiryRecord | null>;

  /** Must reject overlapping active appointments atomically. */
  createAppointment(input: NewAppointment): Promise<CreateAppointmentResult>;
  listAppointments(filter: AppointmentFilter): Promise<AppointmentRecord[]>;
  getAppointment(id: string): Promise<AppointmentRecord | null>;
  updateAppointment(
    id: string,
    patch: { status?: AppointmentStatus; startAt?: string; endAt?: string; adminNotes?: string | null },
  ): Promise<UpdateAppointmentResult>;
  busyIntervals(from: Date, to: Date): Promise<Interval[]>;

  listRules(): Promise<AvailabilityRule[]>;
  addRule(rule: Omit<AvailabilityRule, "id">): Promise<void>;
  setRuleActive(id: string, active: boolean): Promise<void>;
  deleteRule(id: string): Promise<void>;

  listBlocked(): Promise<BlockedPeriod[]>;
  addBlocked(input: { startAt: string; endAt: string; reason: string | null }): Promise<void>;
  deleteBlocked(id: string): Promise<void>;

  counts(): Promise<{ newInquiries: number; pendingAppointments: number; upcomingConfirmed: number; inquiriesLast30: number }>;
}
