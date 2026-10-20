import Link from "next/link";
import { site } from "@/content/site";
import { LegalPage } from "@/components/ui/LegalPage";
import { DraftNote } from "@/components/ui/DraftNote";
import { legalName } from "@/lib/brand";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Terms of Use", description: "Terms governing the use of this website.", path: "/terms" });

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" path="/terms">
      <p>These terms apply to your use of this website, operated by {legalName()}. By using the website you accept these terms.</p>

      <h2>Information only</h2>
      <p>Content on this website is general information. It is not professional or legal advice and should not be relied on for any specific matter. See our <Link href="/disclaimer">professional services disclaimer</Link>.</p>

      <h2>No engagement through the website</h2>
      <p>Sending an inquiry or an appointment request does not create an engagement, a professional relationship or any duty of confidentiality beyond what is described in our <Link href="/privacy">privacy policy</Link>. An engagement exists only once we have agreed its scope and terms with you in writing.</p>

      <h2>Appointments</h2>
      <p>Appointment requests are subject to confirmation. A time shown as available is not reserved until we confirm it.</p>

      <h2>Acceptable use</h2>
      <p>You must not misuse the website, including by submitting false information, attempting to gain unauthorised access, or interfering with its operation.</p>

      <h2>Intellectual property</h2>
      <p>The content and design of this website belong to {legalName()} or its licensors. You may view and print pages for your own reference. Any references to third-party standard forms, including FIDIC, are descriptive only and do not imply affiliation or endorsement.</p>

      <h2>Liability</h2>
      <p>To the extent permitted by law, we are not liable for loss arising from reliance on website content or from the website being unavailable.</p>

      <h2>Governing law</h2>
      <p>{site.location.governingLaw ? `These terms are governed by the laws of ${site.location.governingLaw}.` : "These terms are governed by the law stated in this section once confirmed."}</p>
      <DraftNote>governing law and jurisdiction for these terms.</DraftNote>
    </LegalPage>
  );
}
