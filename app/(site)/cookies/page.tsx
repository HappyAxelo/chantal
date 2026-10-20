import { LegalPage } from "@/components/ui/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Cookie Policy", description: "The cookies used by this website.", path: "/cookies" });

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" path="/cookies">
      <p>This website does not use analytics, advertising or other non-essential cookies, so we do not show a cookie banner.</p>

      <h2>Strictly necessary cookies</h2>
      <p>Cookies are set only when an authorised administrator signs in to the private dashboard. They keep the session secure and expire automatically. Public visitors do not receive cookies from us.</p>

      <h2>If this changes</h2>
      <p>If we introduce analytics or other non-essential cookies in future, we will update this page and ask for your consent before setting them, where the law requires it.</p>
    </LegalPage>
  );
}
