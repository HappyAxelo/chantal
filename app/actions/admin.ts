"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { site } from "@/content/site";
import { requireAdmin, signIn, signOut } from "@/lib/auth";
import { zonedToUtc } from "@/lib/booking/time";
import { sendEmail } from "@/lib/email/send";
import { appointmentClientEmail } from "@/lib/email/templates";
import { rateLimit } from "@/lib/rate-limit";
import { getStore, type AppointmentStatus, type InquiryStatus } from "@/lib/store";

export interface AdminActionState {
  ok?: boolean;
  error?: string;
}

/* ----------------------------------------------------------------- session */

export async function loginAction(_prev: AdminActionState, fd: FormData): Promise<AdminActionState> {
  if (!(await rateLimit("admin-login", 8, 15 * 60_000))) return { error: "Too many attempts. Try again in 15 minutes." };
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };
  const res = await signIn(email, password);
  if (!res.ok) return { error: res.error };
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect("/admin/login");
}

/* --------------------------------------------------------------- inquiries */

const inquiryStatuses = ["new", "in_review", "responded", "closed", "spam"] as const;

export async function updateInquiryAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(fd.get("id"));
  const status = z.enum(inquiryStatuses).parse(fd.get("status")) as InquiryStatus;
  const notes = z.string().max(4000).optional().parse(fd.get("adminNotes") ?? undefined);
  await getStore().updateInquiry(id, { status, adminNotes: notes ?? null });
  revalidatePath("/admin", "layout");
}

/* ------------------------------------------------------------ appointments */

export async function setAppointmentStatusAction(_prev: AdminActionState, fd: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const id = z.string().uuid().safeParse(fd.get("id"));
  const status = z.enum(["confirmed", "declined", "cancelled", "completed"]).safeParse(fd.get("status"));
  if (!id.success || !status.success) return { error: "Invalid request." };

  const res = await getStore().updateAppointment(id.data, { status: status.data as AppointmentStatus });
  if (!res.ok) return { error: res.reason === "conflict" ? "This time now overlaps another booking." : "Appointment not found." };

  if (status.data === "confirmed" || status.data === "declined" || status.data === "cancelled") {
    await sendEmail(appointmentClientEmail(res.appointment, status.data));
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function rescheduleAppointmentAction(_prev: AdminActionState, fd: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = z.object({
    id: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
  }).safeParse({ id: fd.get("id"), date: fd.get("date"), time: fd.get("time") });
  if (!parsed.success) return { error: "Enter a valid date and time." };

  const store = getStore();
  const current = await store.getAppointment(parsed.data.id);
  if (!current) return { error: "Appointment not found." };
  const durationMs = new Date(current.endAt).getTime() - new Date(current.startAt).getTime();
  const start = zonedToUtc(parsed.data.date, parsed.data.time, site.booking.timezone);
  if (start.getTime() < Date.now()) return { error: "The new time must be in the future." };

  // Rescheduling by the owner confirms the new time.
  const res = await store.updateAppointment(current.id, {
    startAt: start.toISOString(),
    endAt: new Date(start.getTime() + durationMs).toISOString(),
    status: "confirmed",
  });
  if (!res.ok) return { error: res.reason === "conflict" ? "That time overlaps another pending or confirmed booking." : "Appointment not found." };

  await sendEmail(appointmentClientEmail(res.appointment, "rescheduled"));
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function saveAppointmentNotesAction(fd: FormData): Promise<void> {
  await requireAdmin();
  const id = z.string().uuid().parse(fd.get("id"));
  const notes = z.string().max(4000).parse(fd.get("adminNotes") ?? "");
  await getStore().updateAppointment(id, { adminNotes: notes || null });
  revalidatePath("/admin/appointments");
}

/* ------------------------------------------------------------ availability */

export async function addRuleAction(_prev: AdminActionState, fd: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = z.object({
    weekday: z.coerce.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  }).safeParse({ weekday: fd.get("weekday"), startTime: fd.get("startTime"), endTime: fd.get("endTime") });
  if (!parsed.success) return { error: "Enter a valid day and times." };
  if (parsed.data.endTime <= parsed.data.startTime) return { error: "End time must be after start time." };
  await getStore().addRule({ ...parsed.data, active: true });
  revalidatePath("/admin/availability");
  return { ok: true };
}

export async function toggleRuleAction(fd: FormData): Promise<void> {
  await requireAdmin();
  await getStore().setRuleActive(z.string().uuid().parse(fd.get("id")), fd.get("active") === "true");
  revalidatePath("/admin/availability");
}

export async function deleteRuleAction(fd: FormData): Promise<void> {
  await requireAdmin();
  await getStore().deleteRule(z.string().uuid().parse(fd.get("id")));
  revalidatePath("/admin/availability");
}

export async function addBlockedAction(_prev: AdminActionState, fd: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    startTime: z.string().regex(/^\d{2}:\d{2}$/).or(z.literal("")),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).or(z.literal("")),
    reason: z.string().max(200),
  }).safeParse(Object.fromEntries(["startDate", "endDate", "startTime", "endTime", "reason"].map((k) => [k, String(fd.get(k) ?? "")])));
  if (!parsed.success) return { error: "Enter valid dates." };
  const d = parsed.data;
  const tz = site.booking.timezone;
  const start = zonedToUtc(d.startDate, d.startTime || "00:00", tz);
  const end = zonedToUtc(d.endDate, d.endTime || "23:59", tz);
  if (end <= start) return { error: "The end must be after the start." };
  await getStore().addBlocked({ startAt: start.toISOString(), endAt: end.toISOString(), reason: d.reason || null });
  revalidatePath("/admin/availability");
  return { ok: true };
}

export async function deleteBlockedAction(fd: FormData): Promise<void> {
  await requireAdmin();
  await getStore().deleteBlocked(z.string().uuid().parse(fd.get("id")));
  revalidatePath("/admin/availability");
}
