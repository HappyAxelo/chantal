"use server";

import { site, enabledMeetingFormats } from "@/content/site";
import { bookingCategories } from "@/content/services";
import { isSlotAvailable } from "@/lib/booking/availability";
import { adminRecipient, sendEmail } from "@/lib/email/send";
import { appointmentAdminEmail, appointmentClientEmail, inquiryAdminEmail, inquiryClientEmail } from "@/lib/email/templates";
import { rateLimit } from "@/lib/rate-limit";
import { makeReference } from "@/lib/reference";
import { getStore, StoreUnavailableError } from "@/lib/store";
import { bookingSchema, fieldErrors, inquirySchema, looksLikeSpam, type FieldErrors } from "@/lib/validation";

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  reference?: string;
  /** Booking only: the stored request, echoed back for the confirmation screen. */
  booking?: { start: string; end: string; timezone: string; category: string; meetingFormat: string };
}

const UNAVAILABLE = "Online submissions are temporarily unavailable. Please try again later.";
const GENERIC = "Something went wrong and your request was not saved. Please try again.";

function form(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") out[k] = v;
  return out;
}

export async function submitInquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!(await rateLimit("inquiry", 5, 15 * 60_000))) {
    return { status: "error", message: "Too many submissions from this connection. Please wait a few minutes and try again." };
  }
  if (looksLikeSpam(fd)) {
    // Respond neutrally without storing anything.
    return { status: "error", message: "Your submission could not be processed. Please try again." };
  }

  const parsed = inquirySchema.safeParse(form(fd));
  if (!parsed.success) {
    return { status: "error", message: "Please correct the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const v = parsed.data;
  if (v.service !== "general" && !bookingCategories().some((c) => c.id === v.service)) {
    return { status: "error", message: "Please correct the highlighted fields.", fieldErrors: { service: "Please choose a service." } };
  }

  try {
    const inquiry = await getStore().createInquiry({
      reference: makeReference("INQ"),
      name: v.name,
      organization: v.organization ?? null,
      email: v.email,
      phone: v.phone ?? null,
      jurisdiction: v.jurisdiction ?? null,
      service: v.service,
      projectType: v.projectType ?? null,
      timeframe: v.timeframe,
      message: v.message,
      contactPreference: v.contactPreference,
      privacyNoticeVersion: site.legal.privacyNoticeVersion,
    });

    await sendEmail(inquiryClientEmail(inquiry));
    const admin = adminRecipient();
    if (admin) await sendEmail(inquiryAdminEmail(inquiry, admin));

    return { status: "success", reference: inquiry.reference };
  } catch (err) {
    if (err instanceof StoreUnavailableError) return { status: "error", message: UNAVAILABLE };
    console.error("[inquiry] failed:", err instanceof Error ? err.message : "unknown");
    return { status: "error", message: GENERIC };
  }
}

export async function submitBooking(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!(await rateLimit("booking", 5, 15 * 60_000))) {
    return { status: "error", message: "Too many booking attempts from this connection. Please wait a few minutes and try again." };
  }
  if (looksLikeSpam(fd)) {
    return { status: "error", message: "Your request could not be processed. Please try again." };
  }

  const raw = form(fd);
  const formats = enabledMeetingFormats();
  if (formats.length === 0) raw.meetingFormat = "to_be_agreed";

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Please correct the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  }
  const v = parsed.data;

  if (!bookingCategories().some((c) => c.id === v.category)) {
    return { status: "error", message: "That consultation type is not available.", fieldErrors: { category: "Please choose a consultation type." } };
  }
  if (v.meetingFormat !== "to_be_agreed" && !formats.includes(v.meetingFormat)) {
    return { status: "error", message: "Please choose an available meeting format.", fieldErrors: { meetingFormat: "Please choose a meeting format." } };
  }

  try {
    // Server-side re-check against rules, notice period, blocked dates and existing bookings.
    if (!(await isSlotAvailable(v.start))) {
      return { status: "error", message: "That time is no longer available. Please choose another slot.", fieldErrors: { start: "That time is no longer available." } };
    }

    const start = new Date(v.start);
    const end = new Date(start.getTime() + site.booking.slotMinutes * 60_000);
    const result = await getStore().createAppointment({
      reference: makeReference("BK"),
      clientName: v.name,
      clientEmail: v.email,
      clientPhone: v.phone ?? null,
      category: v.category,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      timezone: site.booking.timezone,
      meetingFormat: v.meetingFormat,
      reason: v.reason,
      privacyNoticeVersion: site.legal.privacyNoticeVersion,
    });

    if (!result.ok) {
      return { status: "error", message: "That time was just taken. Please choose another slot.", fieldErrors: { start: "That time is no longer available." } };
    }

    const a = result.appointment;
    await sendEmail(appointmentClientEmail(a, "requested"));
    const admin = adminRecipient();
    if (admin) await sendEmail(appointmentAdminEmail(a, admin));

    return {
      status: "success",
      reference: a.reference,
      booking: { start: a.startAt, end: a.endAt, timezone: a.timezone, category: a.category, meetingFormat: a.meetingFormat },
    };
  } catch (err) {
    if (err instanceof StoreUnavailableError) return { status: "error", message: UNAVAILABLE };
    console.error("[booking] failed:", err instanceof Error ? err.message : "unknown");
    return { status: "error", message: GENERIC };
  }
}
