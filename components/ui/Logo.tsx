import Link from "next/link";
import { site } from "@/content/site";
import { brandName } from "@/lib/brand";

/**
 * LexBridge mark: a suspension bridge reduced to its structure (two towers,
 * a deck and one bronze cable), i.e. a sound connection between two parties.
 * Original artwork; the same geometry is used for app/icon.svg.
 */
export function LogoMark({ className = "h-9 w-9", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" fill={light ? "transparent" : "rgb(var(--navy))"} stroke={light ? "rgba(255,255,255,.55)" : "none"} />
      <path d="M12 30V11M28 30V11" fill="none" stroke="#fff" strokeWidth="2.25" />
      <path d="M7 25h26" fill="none" stroke="#fff" strokeWidth="1.5" />
      <path d="M7 25 12 12.5Q20 33 28 12.5L33 25" fill="none" stroke="rgb(var(--bronze-soft))" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M16 20.2V25M20 22.8V25M24 20.2V25" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth=".9" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3 no-underline" aria-label={`${brandName()}, home`}>
      <LogoMark light={light} />
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-[1.15rem] tracking-tight ${light ? "text-white" : "text-navy"}`}>{brandName()}</span>
        <span className={`mt-1 hidden text-[0.66rem] sm:block font-semibold uppercase tracking-eyebrow ${light ? "text-white/60" : "text-ink-muted"}`}>
          {site.company.descriptor}
        </span>
      </span>
    </Link>
  );
}
