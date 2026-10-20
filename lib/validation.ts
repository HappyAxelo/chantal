import { z } from "zod";
import { contactPreferences, inquiryCategories, timeframes } from "./options";

export { contactPreferences, inquiryCategories, timeframeLabels, timeframes } from "./options";

const trimmed = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`);
const optionalText = (max: number) =>
  trimmed(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const phone = z
  .string()
  .trim()
  .max(40)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^[+()\d\s.-]{6,40}$/.test(v), "Please enter a valid phone number, or leave it blank.");

export const inquirySchema = z.object({
  name: trimmed(120).min(2, "Please enter your full name."),
  organization: optionalText(160),
  email: z.string().trim().toLowerCase().max(200).email("Please enter a valid email address."),
  phone,
  jurisdiction: optionalText(120),
  service: z.enum(inquiryCategories, { errorMap: () => ({ message: "Please choose a service." }) }),
  projectType: optionalText(160),
  timeframe: z.enum(timeframes, { errorMap: () => ({ message: "Please choose a timeframe." }) }),
  message: trimmed(3000).min(20, "Please describe your request in at least 20 characters."),
  contactPreference: z.enum(contactPreferences, { errorMap: () => ({ message: "Please choose how we should contact you." }) }),
  consent: z.literal("on", { errorMap: () => ({ message: "Please confirm you have read the privacy notice." }) }),
});
export type InquiryInput = z.infer<typeof inquirySchema>;

export const bookingSchema = z.object({
  category: z.enum(inquiryCategories, { errorMap: () => ({ message: "Please choose a consultation type." }) }),
  start: z.string().datetime({ message: "Please choose a time slot." }),
  name: trimmed(120).min(2, "Please enter your full name."),
  email: z.string().trim().toLowerCase().max(200).email("Please enter a valid email address."),
  phone,
  meetingFormat: z.enum(["in_person", "online", "phone", "to_be_agreed"]),
  reason: trimmed(1000).min(10, "Please give a short reason for the meeting (at least 10 characters)."),
  consent: z.literal("on", { errorMap: () => ({ message: "Please confirm you have read the privacy notice." }) }),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export type FieldErrors = Partial<Record<string, string>>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Signals that a submission is likely automated. */
export function looksLikeSpam(form: FormData): boolean {
  if (String(form.get("website") ?? "").length > 0) return true; // honeypot
  const started = Number(form.get("startedAt") ?? 0);
  if (!started) return false; // no JS: rely on rate limiting
  return Date.now() - started < 2500;
}
