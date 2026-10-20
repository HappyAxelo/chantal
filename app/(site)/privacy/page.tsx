import Link from "next/link";
import { site } from "@/content/site";
import { LegalPage } from "@/components/ui/LegalPage";
import { DraftNote } from "@/components/ui/DraftNote";
import { legalName } from "@/lib/brand";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Privacy Policy", description: "How we collect, use, store and protect personal information submitted through this website.", path: "/privacy" });

export default function PrivacyPage() {
  const controller = site.legal.dataController ?? legalName();
  const months = site.legal.inquiryRetentionMonths;
  return (
    <LegalPage title="Privacy Policy" path="/privacy">
      <p>This policy explains how {controller} (&ldquo;we&rdquo;) handles personal information submitted through this website. Privacy notice version: {site.legal.privacyNoticeVersion}.</p>

      <h2>Who is responsible for your information</h2>
      <p>{controller} is responsible for the personal information described in this policy.{site.contact.email && <> You can contact us about privacy at <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.</>}</p>
      <DraftNote>legal name and address of the data controller, privacy contact, and any registration required under applicable data protection law.</DraftNote>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Inquiries:</strong> your name, email, and optionally your organisation, telephone number, jurisdiction, project type, timeframe, contact preference and a short description of your request.</li>
        <li><strong>Appointment requests:</strong> your name, email, optional telephone number, consultation type, chosen time, meeting format and a short reason for the meeting.</li>
        <li><strong>Technical data:</strong> your IP address is processed temporarily to protect our forms against abuse. Our hosting provider may keep standard server logs.</li>
      </ul>
      <p>We ask you not to submit confidential documents, identification documents, passwords, financial account details or other sensitive information through the website forms.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to your inquiry and arrange, confirm, reschedule or cancel appointments.</li>
        <li>To keep a record of requests received, so we can follow up and manage our work.</li>
        <li>To protect the website against spam and misuse.</li>
      </ul>
      <p>We do not sell your information or use it for advertising. We do not use analytics or advertising cookies on this website.</p>
      <DraftNote>the legal basis for each use (for example consent, steps prior to entering a contract, or legitimate interests), as required by the applicable law.</DraftNote>

      <h2>Who we share it with</h2>
      <p>We use service providers to run this website: hosting, a database provider and an email delivery provider. They process information on our behalf and only as needed to provide their services. Where these providers are located in another country, appropriate safeguards are applied as required by applicable law.</p>
      <DraftNote>named processors (e.g. Vercel, Supabase, Resend), their locations, and the transfer safeguards relied on.</DraftNote>

      <h2>How long we keep it</h2>
      <p>Inquiries and appointment requests that do not lead to an engagement are kept for up to {months} months and then deleted. If you become a client, records are kept in line with our engagement terms and any legal retention obligations.</p>

      <h2>Security</h2>
      <p>Information is transmitted over encrypted connections and stored with access restricted to authorised personnel. No system is completely secure, so please do not send sensitive information through the website.</p>

      <h2>Your rights</h2>
      <p>Depending on the law that applies to you, you may have the right to access, correct or delete your information, to object to or restrict certain uses, and to complain to a data protection authority. To make a request, please <Link href="/contact">contact us</Link>.</p>
      <DraftNote>the supervisory authority and any jurisdiction-specific rights.</DraftNote>

      <h2>Changes</h2>
      <p>We may update this policy. The version and date at the top of this page show when it last changed.</p>
    </LegalPage>
  );
}
