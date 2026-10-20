import { site } from "@/content/site";
import { brandName } from "@/lib/brand";
import { siteUrl } from "@/lib/env";
import { formatDateTime, tzLabel } from "@/lib/booking/time";
import type { AppointmentRecord, InquiryRecord } from "@/lib/store/types";
import type { Email } from "./send";

/* Templates never include admin_notes. All user input is HTML-escaped. */

export function esc(v: string): string {
  return v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const categoryLabel: Record<string, string> = {
  procurement: "Procurement consultation",
  contract: "Contract management consultation",
  fidic: "FIDIC-related consultation",
  mou: "MoU consultation",
  notarial: "Notarial appointment",
  documentation: "Documentation support consultation",
  general: "General consultation",
};
export const labelForCategory = (c: string) => categoryLabel[c] ?? c;

const formatLabel: Record<string, string> = {
  in_person: "In person",
  online: "Online video call",
  phone: "Telephone",
  to_be_agreed: "To be agreed",
};
export const labelForFormat = (f: string) => formatLabel[f] ?? f;

function layout(title: string, rows: [string, string][], paragraphs: string[]): { html: string; text: string } {
  const brand = esc(brandName());
  const contact = site.contact.email ? `<p style="margin:0;color:#5b6474;font-size:13px">Contact: ${esc(site.contact.email)}</p>` : "";
  const html = `<!doctype html><html><body style="margin:0;background:#f6f4ef;font-family:Arial,Helvetica,sans-serif;color:#2b2f36">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e3ded3">
<tr><td style="background:#14213d;padding:20px 28px;color:#ffffff;font-family:Georgia,serif;font-size:18px">${brand}<div style="width:28px;height:2px;background:#a8865a;margin-top:10px"></div></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:22px;font-weight:normal;color:#14213d">${esc(title)}</h1>
${paragraphs.map((p) => `<p style="margin:0 0 14px;line-height:1.55;font-size:15px">${p}</p>`).join("")}
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid #e3ded3;margin:16px 0">
${rows.map(([k, v]) => `<tr><td style="padding:8px 0;color:#5b6474;font-size:13px;width:38%;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;font-size:14px">${esc(v)}</td></tr>`).join("")}
</table>
${contact}
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #e3ded3;color:#7a8291;font-size:12px;line-height:1.5">This message relates to a request submitted at ${esc(siteUrl())}. Submitting a request does not by itself create an engagement or professional relationship.</td></tr>
</table></td></tr></table></body></html>`;
  const text = [title, "", ...paragraphs.map((p) => p.replace(/<[^>]+>/g, "")), "", ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n");
  return { html, text };
}

export function inquiryClientEmail(i: InquiryRecord): Email {
  const next = site.responseStandard ? esc(site.responseStandard) : "We will review your request and contact you using your preferred method.";
  const { html, text } = layout("We have received your inquiry", [
    ["Reference", i.reference],
    ["Service", labelForCategory(i.service)],
    ["Status", "Received, awaiting review"],
  ], [`Dear ${esc(i.name)},`, `Thank you for contacting ${esc(brandName())}. ${next}`, "Please quote your reference number in any related correspondence. Do not reply with confidential documents; if documents are needed, we will agree a secure way to share them."]);
  return { to: i.email, subject: `Inquiry received — ${i.reference}`, html, text };
}

export function inquiryAdminEmail(i: InquiryRecord, to: string): Email {
  const { html, text } = layout("New website inquiry", [
    ["Reference", i.reference], ["Name", i.name], ["Organisation", i.organization ?? "—"], ["Email", i.email],
    ["Phone", i.phone ?? "—"], ["Service", labelForCategory(i.service)], ["Timeframe", i.timeframe],
    ["Preferred contact", i.contactPreference],
  ], ["A new inquiry was submitted. Review it in the dashboard:", esc(`${siteUrl()}/admin/inquiries`)]);
  return { to, subject: `New inquiry ${i.reference} — ${labelForCategory(i.service)}`, html, text, replyTo: i.email };
}

type ApptEvent = "requested" | "confirmed" | "rescheduled" | "cancelled" | "declined";

export function appointmentClientEmail(a: AppointmentRecord, event: ApptEvent): Email {
  const when = formatDateTime(a.startAt, a.timezone);
  const titles: Record<ApptEvent, string> = {
    requested: "Your appointment request has been received",
    confirmed: "Your appointment is confirmed",
    rescheduled: "Your appointment has been rescheduled",
    cancelled: "Your appointment has been cancelled",
    declined: "We are unable to accept your appointment request",
  };
  const statusText: Record<ApptEvent, string> = {
    requested: "Requested, awaiting confirmation",
    confirmed: "Confirmed",
    rescheduled: "Confirmed (new time)",
    cancelled: "Cancelled",
    declined: "Not accepted",
  };
  const body: Record<ApptEvent, string> = {
    requested: "Your requested time is held while we review it. <strong>This is not yet a confirmed appointment.</strong> You will receive a separate message once it is confirmed, or if we need to propose another time.",
    confirmed: "Your appointment is confirmed for the time below. If you need to reschedule or cancel, please reply to this email or contact us quoting your reference.",
    rescheduled: "Your appointment has been moved to the time below. If this does not suit you, please contact us quoting your reference.",
    cancelled: "Your appointment has been cancelled. If you would like to arrange another time, you are welcome to submit a new request.",
    declined: "Unfortunately we cannot accept this request. You are welcome to request another time or send us an inquiry.",
  };
  const { html, text } = layout(titles[event], [
    ["Reference", a.reference],
    ["Consultation", labelForCategory(a.category)],
    ["Date and time", `${when} (${tzLabel(a.timezone)})`],
    ["Format", labelForFormat(a.meetingFormat)],
    ["Status", statusText[event]],
  ], [`Dear ${esc(a.clientName)},`, body[event]]);
  return { to: a.clientEmail, subject: `${titles[event]} — ${a.reference}`, html, text };
}

export function appointmentAdminEmail(a: AppointmentRecord, to: string): Email {
  const { html, text } = layout("New appointment request", [
    ["Reference", a.reference], ["Name", a.clientName], ["Email", a.clientEmail], ["Phone", a.clientPhone ?? "—"],
    ["Consultation", labelForCategory(a.category)], ["Requested time", `${formatDateTime(a.startAt, a.timezone)} (${tzLabel(a.timezone)})`],
    ["Format", labelForFormat(a.meetingFormat)],
  ], ["A booking request is awaiting your approval:", esc(`${siteUrl()}/admin/appointments`)]);
  return { to, subject: `Booking request ${a.reference} — approval needed`, html, text, replyTo: a.clientEmail };
}
