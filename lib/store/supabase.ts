import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AvailabilityRule } from "@/lib/booking/slots";
import type { AppointmentRecord, BlockedPeriod, InquiryRecord, Store } from "./types";

/* Row <-> record mapping (snake_case columns, see supabase/migrations). */

type Row = Record<string, unknown>;
const s = (v: unknown) => (v == null ? null : String(v));

function toInquiry(r: Row): InquiryRecord {
  return {
    id: String(r.id), reference: String(r.reference_number), name: String(r.name), organization: s(r.organization),
    email: String(r.email), phone: s(r.phone), jurisdiction: s(r.jurisdiction), service: String(r.service_category),
    projectType: s(r.project_type), timeframe: String(r.timeframe), message: String(r.message),
    contactPreference: String(r.contact_preference), privacyNoticeVersion: String(r.privacy_notice_version),
    status: r.status as InquiryRecord["status"], adminNotes: s(r.admin_notes),
    createdAt: String(r.created_at), updatedAt: String(r.updated_at),
  };
}

function toAppointment(r: Row): AppointmentRecord {
  return {
    id: String(r.id), reference: String(r.reference_number), clientName: String(r.client_name),
    clientEmail: String(r.client_email), clientPhone: s(r.client_phone), category: String(r.service_category),
    startAt: new Date(String(r.start_at)).toISOString(), endAt: new Date(String(r.end_at)).toISOString(),
    timezone: String(r.timezone), meetingFormat: r.meeting_format as AppointmentRecord["meetingFormat"],
    status: r.status as AppointmentRecord["status"], reason: String(r.general_notes), adminNotes: s(r.admin_notes),
    privacyNoticeVersion: String(r.privacy_notice_version), createdAt: String(r.created_at), updatedAt: String(r.updated_at),
  };
}

function toRule(r: Row): AvailabilityRule {
  return { id: String(r.id), weekday: Number(r.weekday), startTime: String(r.start_time).slice(0, 5), endTime: String(r.end_time).slice(0, 5), active: Boolean(r.active) };
}

function toBlocked(r: Row): BlockedPeriod {
  return { id: String(r.id), startAt: String(r.start_at), endAt: String(r.end_at), reason: s(r.reason), createdAt: String(r.created_at) };
}

/** Postgres exclusion_violation: overlapping active appointment. */
const isConflict = (e: { code?: string } | null) => e?.code === "23P01";

function fail(e: { message: string } | null): never {
  // Do not leak database details to callers; log server-side only.
  console.error("[store] supabase error:", e?.message);
  throw new Error("Storage operation failed");
}

export const supabaseStore: Store = {
  kind: "supabase",

  async createInquiry(i) {
    const { data, error } = await supabaseAdmin().from("inquiries").insert({
      reference_number: i.reference, name: i.name, organization: i.organization, email: i.email, phone: i.phone,
      jurisdiction: i.jurisdiction, service_category: i.service, project_type: i.projectType, timeframe: i.timeframe,
      message: i.message, contact_preference: i.contactPreference, privacy_notice_version: i.privacyNoticeVersion,
    }).select().single();
    if (error) fail(error);
    return toInquiry(data);
  },

  async listInquiries(f) {
    let q = supabaseAdmin().from("inquiries").select("*").order("created_at", { ascending: false }).limit(500);
    if (f.status) q = q.eq("status", f.status);
    if (f.service) q = q.eq("service_category", f.service);
    if (f.from) q = q.gte("created_at", `${f.from}T00:00:00Z`);
    if (f.to) q = q.lte("created_at", `${f.to}T23:59:59Z`);
    const { data, error } = await q;
    if (error) fail(error);
    return (data ?? []).map(toInquiry);
  },

  async updateInquiry(id, patch) {
    const upd: Row = {};
    if (patch.status) upd.status = patch.status;
    if (patch.adminNotes !== undefined) upd.admin_notes = patch.adminNotes;
    const { data, error } = await supabaseAdmin().from("inquiries").update(upd).eq("id", id).select().maybeSingle();
    if (error) fail(error);
    return data ? toInquiry(data) : null;
  },

  async createAppointment(a) {
    const { data, error } = await supabaseAdmin().from("appointments").insert({
      reference_number: a.reference, client_name: a.clientName, client_email: a.clientEmail, client_phone: a.clientPhone,
      service_category: a.category, start_at: a.startAt, end_at: a.endAt, timezone: a.timezone,
      meeting_format: a.meetingFormat, general_notes: a.reason, privacy_notice_version: a.privacyNoticeVersion,
    }).select().single();
    if (isConflict(error)) return { ok: false, reason: "conflict" };
    if (error) fail(error);
    return { ok: true, appointment: toAppointment(data) };
  },

  async listAppointments(f) {
    let q = supabaseAdmin().from("appointments").select("*").order("start_at", { ascending: true }).limit(500);
    if (f.status) q = q.eq("status", f.status);
    if (f.upcomingOnly) q = q.gte("end_at", new Date().toISOString());
    const { data, error } = await q;
    if (error) fail(error);
    return (data ?? []).map(toAppointment);
  },

  async getAppointment(id) {
    const { data, error } = await supabaseAdmin().from("appointments").select("*").eq("id", id).maybeSingle();
    if (error) fail(error);
    return data ? toAppointment(data) : null;
  },

  async updateAppointment(id, patch) {
    const upd: Row = {};
    if (patch.status) upd.status = patch.status;
    if (patch.startAt) upd.start_at = patch.startAt;
    if (patch.endAt) upd.end_at = patch.endAt;
    if (patch.adminNotes !== undefined) upd.admin_notes = patch.adminNotes;
    const { data, error } = await supabaseAdmin().from("appointments").update(upd).eq("id", id).select().maybeSingle();
    if (isConflict(error)) return { ok: false, reason: "conflict" };
    if (error) fail(error);
    if (!data) return { ok: false, reason: "not_found" };
    return { ok: true, appointment: toAppointment(data) };
  },

  async busyIntervals(from, to) {
    const { data, error } = await supabaseAdmin()
      .from("appointments").select("start_at,end_at").in("status", ["pending", "confirmed"])
      .lt("start_at", to.toISOString()).gt("end_at", from.toISOString());
    if (error) fail(error);
    return (data ?? []).map((r) => ({ start: new Date(r.start_at), end: new Date(r.end_at) }));
  },

  async listRules() {
    const { data, error } = await supabaseAdmin().from("availability_rules").select("*").order("weekday").order("start_time");
    if (error) fail(error);
    return (data ?? []).map(toRule);
  },
  async addRule(r) {
    const { error } = await supabaseAdmin().from("availability_rules").insert({ weekday: r.weekday, start_time: r.startTime, end_time: r.endTime, active: r.active });
    if (error) fail(error);
  },
  async setRuleActive(id, active) {
    const { error } = await supabaseAdmin().from("availability_rules").update({ active }).eq("id", id);
    if (error) fail(error);
  },
  async deleteRule(id) {
    const { error } = await supabaseAdmin().from("availability_rules").delete().eq("id", id);
    if (error) fail(error);
  },

  async listBlocked() {
    const { data, error } = await supabaseAdmin().from("blocked_periods").select("*").order("start_at");
    if (error) fail(error);
    return (data ?? []).map(toBlocked);
  },
  async addBlocked(b) {
    const { error } = await supabaseAdmin().from("blocked_periods").insert({ start_at: b.startAt, end_at: b.endAt, reason: b.reason });
    if (error) fail(error);
  },
  async deleteBlocked(id) {
    const { error } = await supabaseAdmin().from("blocked_periods").delete().eq("id", id);
    if (error) fail(error);
  },

  async counts() {
    const db = supabaseAdmin();
    const t = new Date().toISOString();
    const cutoff = new Date(Date.now() - 30 * 86400_000).toISOString();
    const head = { count: "exact" as const, head: true };
    const [a, b, c, d] = await Promise.all([
      db.from("inquiries").select("id", head).eq("status", "new"),
      db.from("appointments").select("id", head).eq("status", "pending").gte("end_at", t),
      db.from("appointments").select("id", head).eq("status", "confirmed").gte("end_at", t),
      db.from("inquiries").select("id", head).gte("created_at", cutoff),
    ]);
    return { newInquiries: a.count ?? 0, pendingAppointments: b.count ?? 0, upcomingConfirmed: c.count ?? 0, inquiriesLast30: d.count ?? 0 };
  },
};
