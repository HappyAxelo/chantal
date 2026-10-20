import Link from "next/link";
import { site } from "@/content/site";
import { brandName, legalName } from "@/lib/brand";
import { LogoMark } from "@/components/ui/Logo";
import { DraftNote } from "@/components/ui/DraftNote";
import { navigation } from "./nav";

export function Footer() {
  const { main, services } = navigation();
  const { office } = site.location;
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-[#0f1a31] text-white/70">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark light />
            <span className="font-serif text-lg text-white">{brandName()}</span>
          </div>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed">{site.company.shortDescription}</p>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-eyebrow text-white">Services</h2>
          <ul className="space-y-2.5 text-[0.95rem]">
            {services.map((s) => (
              <li key={s.href}><Link href={s.href} className="text-white/70 no-underline hover:text-white">{s.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-eyebrow text-white">Navigate</h2>
          <ul className="space-y-2.5 text-[0.95rem]">
            <li><Link href="/" className="text-white/70 no-underline hover:text-white">Home</Link></li>
            {main.map((m) => (
              <li key={m.href}><Link href={m.href} className="text-white/70 no-underline hover:text-white">{m.label}</Link></li>
            ))}
            <li><Link href="/book" className="text-white/70 no-underline hover:text-white">Book a Consultation</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-xs font-semibold uppercase tracking-eyebrow text-white">Contact</h2>
          <ul className="space-y-2.5 text-[0.95rem]">
            {site.contact.email && (
              <li><a href={`mailto:${site.contact.email}`} className="text-white/70 no-underline hover:text-white">{site.contact.email}</a></li>
            )}
            {site.contact.phone && (
              <li><a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="text-white/70 no-underline hover:text-white">{site.contact.phone}</a></li>
            )}
            {office && (
              <li>
                <address className="not-italic">
                  {office.street}<br />{office.city}{office.postalCode ? ` ${office.postalCode}` : ""}<br />{office.country}
                </address>
              </li>
            )}
            {site.location.hours && <li>{site.location.hours}</li>}
            <li><Link href="/contact" className="text-white/70 no-underline hover:text-white">Send an inquiry</Link></li>
          </ul>
          {!site.contact.email && !site.contact.phone && <DraftNote>contact email, phone, office address and hours (shown only once supplied).</DraftNote>}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>© {year} {legalName()}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="/privacy" className="text-white/70 no-underline hover:text-white">Privacy</Link></li>
            <li><Link href="/terms" className="text-white/70 no-underline hover:text-white">Terms of use</Link></li>
            <li><Link href="/disclaimer" className="text-white/70 no-underline hover:text-white">Disclaimer</Link></li>
            <li><Link href="/cookies" className="text-white/70 no-underline hover:text-white">Cookies</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
