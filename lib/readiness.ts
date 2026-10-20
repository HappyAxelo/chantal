import { allArticles } from "@/content/articles";
import { allServices } from "@/content/services";
import { enabledMeetingFormats, site } from "@/content/site";
import { emailMode, adminRecipient } from "@/lib/email/send";
import { supabaseConfigured } from "@/lib/env";

export interface ReadinessItem {
  area: string;
  item: string;
  done: boolean;
  where: string;
}

/** Launch checklist shown in the dashboard and by `npm run check:content`. */
export function readiness(): ReadinessItem[] {
  const c = "content/site.ts";
  return [
    { area: "Brand", item: "Official company name supplied", done: Boolean(site.company.name), where: c },
    { area: "Brand", item: "FIDIC credential designation and status confirmed", done: site.owner.credential.verified, where: c },
    { area: "Founder", item: "Biography and background supplied", done: Boolean(site.owner.biography && site.owner.professionalBackground), where: c },
    { area: "Founder", item: "Qualifications listed", done: site.owner.qualifications.length > 0, where: c },
    { area: "Founder", item: "Approved portrait added", done: Boolean(site.owner.portrait), where: c },
    { area: "Location", item: "City and country confirmed", done: Boolean(site.location.city && site.location.country), where: c },
    { area: "Location", item: "Service areas, governing law and languages confirmed", done: Boolean(site.location.serviceAreas.length && site.location.governingLaw && site.location.languages.length), where: c },
    { area: "Contact", item: "Verified email or telephone published", done: Boolean(site.contact.email || site.contact.phone), where: c },
    { area: "Services", item: "Scope confirmed for every published service", done: allServices().filter((s) => s.status === "published").every((s) => s.scopeConfirmed), where: "content/services.ts" },
    { area: "Services", item: "Notarial services: authorisation confirmed (or left disabled)", done: !site.features.notarialServices || allServices().some((s) => s.category === "notarial" && s.scopeConfirmed), where: "content/services.ts" },
    { area: "Booking", item: "Business timezone confirmed", done: site.booking.timezoneConfirmed, where: c },
    { area: "Booking", item: "Meeting formats confirmed", done: enabledMeetingFormats().length > 0, where: c },
    { area: "Booking", item: "Cancellation and rescheduling policy written", done: Boolean(site.booking.cancellationPolicy), where: c },
    { area: "Legal", item: "Privacy, terms, disclaimer and cookies reviewed by a qualified professional", done: site.legal.reviewed, where: c },
    { area: "Insights", item: "At least one article reviewed and published (or section disabled)", done: !site.features.insights || allArticles().some((a) => a.status === "published"), where: "content/articles.ts" },
    { area: "Infrastructure", item: "Supabase configured", done: supabaseConfigured, where: ".env" },
    { area: "Infrastructure", item: "Live email configured (EMAIL_MODE=live)", done: emailMode() === "live", where: ".env" },
    { area: "Infrastructure", item: "Admin notification address set", done: Boolean(adminRecipient()), where: ".env" },
    { area: "Infrastructure", item: "Public site URL set", done: Boolean(process.env.NEXT_PUBLIC_SITE_URL), where: ".env" },
  ];
}
