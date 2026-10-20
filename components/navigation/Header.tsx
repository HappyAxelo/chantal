import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { navigation } from "./nav";
import { ServicesMenu } from "./ServicesMenu";
import { MobileNav } from "./MobileNav";

export function Header() {
  const { main, services } = navigation();
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[70] focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="container flex h-[var(--header-h)] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          <Link href="/" className="text-[0.95rem] font-medium text-ink no-underline hover:text-navy">Home</Link>
          {main.map((item) =>
            item.href === "/services" ? (
              <ServicesMenu key={item.href} items={services} />
            ) : (
              <Link key={item.href} href={item.href} className="text-[0.95rem] font-medium text-ink no-underline hover:text-navy">
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/book" className="btn-primary hidden min-h-[44px] px-5 sm:inline-flex">Book a Consultation</Link>
          <MobileNav main={main} services={services} />
        </div>
      </div>
    </header>
  );
}
