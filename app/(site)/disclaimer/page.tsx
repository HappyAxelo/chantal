import { LegalPage } from "@/components/ui/LegalPage";
import { legalName } from "@/lib/brand";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Professional Services Disclaimer", description: "The scope and limits of the services and information provided by this practice.", path: "/disclaimer" });

export default function DisclaimerPage() {
  return (
    <LegalPage title="Professional Services Disclaimer" path="/disclaimer">
      <h2>General information</h2>
      <p>Articles, service descriptions and other content on this website are general information. They do not take account of your contract, your jurisdiction or your circumstances and are not a substitute for advice on a specific matter.</p>

      <h2>Scope of services</h2>
      <p>{legalName()} provides advisory, contract administration and documentation support services within the scope described on this website and agreed in each engagement. Unless expressly stated and confirmed on this website, we do not provide court representation, formal legal opinions or other services reserved by law to licensed professionals. Where your matter requires such services, we will tell you.</p>

      <h2>No guaranteed outcomes</h2>
      <p>We cannot guarantee any outcome that depends on a court, tribunal, regulator, contracting authority, engineer, counterparty or other third party, including the award of a contract or the success of a claim.</p>

      <h2>No relationship through the website</h2>
      <p>Using this website, sending an inquiry or requesting an appointment does not create a client relationship, legal privilege or professional duty. An engagement begins only when scope and terms are agreed in writing.</p>

      <h2>Third-party standards</h2>
      <p>References to FIDIC or other standard forms of contract are descriptive. This practice is not affiliated with, accredited by or endorsed by FIDIC unless expressly stated. Clients should obtain licensed copies of any standard forms they use.</p>
    </LegalPage>
  );
}
