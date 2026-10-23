/**
 * Central business configuration.
 *
 * RULE: anything that is a factual claim about the business stays `null`
 * (or `verified: false`) until the owner supplies and confirms it. Unverified
 * values are shown as labelled placeholders in draft preview and are hidden on
 * the public production site. Run `npm run check:content` for a launch checklist.
 */

export interface VerifiedText {
  value: string;
  verified: boolean;
}

export const site = {
  company: {
    /** Official registered name (confirmed by the owner). Used in legal text, copyright and structured data. */
    name: "LexBridge Advisory Ltd" as string | null,
    /** Shorter name for the logo, page titles and emails. */
    displayName: "LexBridge Advisory" as string | null,
    /** Shown only in draft preview while `name` is null. */
    placeholderName: "[COMPANY NAME]",
    /** Descriptor shown beneath the brand mark. */
    descriptor: "Procurement & Contract Advisory",
    shortDescription:
      "FIDIC contract administration, quantity surveying, contract management, claims, procurement, governance, commercial agreements and training.",
  },

  owner: {
    name: "Chantal Nishimwe",
    /** Confirmed by the owner (2026-10-20): FIDIC Certified Contract Manager (FCCM). */
    credential: { value: "FIDIC Certified Contract Manager (FCCM)", verified: true } as VerifiedText,
    /** Post-nominal shown after the name, e.g. "Chantal Nishimwe, FCCM". */
    postNominals: "FCCM" as string | null,
    role: "Founder",
    /** Each field stays null until supplied by the owner. Never invent these. */
    biography: null as string | null,
    professionalBackground: null as string | null,
    qualifications: [] as string[],
    expertise: [] as string[],
    philosophy: null as string | null,
    memberships: [] as string[],
    /** Path under /public once an approved portrait exists, e.g. "/images/chantal-nishimwe.jpg". */
    portrait: "/images/chantal-nishimwe.jpg" as string | null,
  },

  location: {
    /** Confirmed by the owner: based in Kigali, Rwanda. */
    city: "Kigali" as string | null,
    country: "Rwanda" as string | null,
    serviceAreas: [] as string[],
    governingLaw: null as string | null,
    office: null as null | {
      street: string;
      city: string;
      region?: string;
      postalCode?: string;
      country: string;
    },
    languages: [] as string[],
    /** Human-readable office hours, e.g. "Monday–Friday, 08:30–17:00". */
    hours: null as string | null,
  },

  contact: {
    email: null as string | null,
    phone: null as string | null,
  },

  social: {
    linkedin: null as string | null,
  },

  booking: {
    /** IANA timezone used for availability and displayed to clients. Confirm before launch. */
    timezone: "Africa/Kigali",
    timezoneConfirmed: true,
    slotMinutes: 60,
    bufferMinutes: 15,
    minNoticeHours: 24,
    maxDaysAhead: 45,
    /** Enable each format only once the owner confirms it is offered. */
    meetingFormats: {
      in_person: true,
      online: true,
      phone: true,
    },
    /** Free text shown on the booking page; null hides it. */
    cancellationPolicy: null as string | null,
  },

  features: {
    insights: true,
    /** Keep false until jurisdiction, appointment and permitted scope are confirmed. */
    notarialServices: false,
  },

  /** e.g. "We aim to reply within two working days." Null = make no promise. */
  responseStandard: null as string | null,

  legal: {
    privacyNoticeVersion: "2026-10-draft",
    /** Set true only after a qualified professional has reviewed the legal pages. */
    reviewed: false,
    lastUpdated: "2026-10-20",
    /** Data controller name for the privacy policy; defaults to company name. */
    dataController: null as string | null,
    inquiryRetentionMonths: 24,
  },
} as const;

export type MeetingFormat = keyof typeof site.booking.meetingFormats;

export const meetingFormatLabels: Record<MeetingFormat, string> = {
  in_person: "In person",
  online: "Online video call",
  phone: "Telephone",
};

export function enabledMeetingFormats(): MeetingFormat[] {
  return (Object.keys(site.booking.meetingFormats) as MeetingFormat[]).filter(
    (k) => site.booking.meetingFormats[k],
  );
}
