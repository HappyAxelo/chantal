"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "./nav";

/** Disclosure-pattern dropdown: button toggles a list of links; Esc and outside click close it. */
export function ServicesMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const pathname = usePathname();
  const active = pathname.startsWith("/services");

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex min-h-[44px] items-center gap-1 px-1 text-[0.95rem] font-medium transition-colors hover:text-navy ${active ? "text-navy" : "text-ink"}`}
      >
        Services
        <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div id={id} hidden={!open} className="absolute left-1/2 top-full z-50 mt-3 w-[22rem] -translate-x-1/2 rounded border border-line bg-white p-2 shadow-lift">
        <ul>
          {items.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="block rounded-sm px-4 py-2.5 text-[0.95rem] text-ink no-underline hover:bg-canvas hover:text-navy">
                {s.label}
              </Link>
            </li>
          ))}
          <li className="mt-1 border-t border-line pt-1">
            <Link href="/services" className="block rounded-sm px-4 py-2.5 text-sm font-semibold text-navy no-underline hover:bg-canvas">
              All services
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
