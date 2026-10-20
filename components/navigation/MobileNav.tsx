"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { NavItem } from "./nav";

/**
 * Mobile drawer: modal dialog with focus moved in, Esc to close, body scroll locked.
 * Rendered into <body> via a portal: the sticky header uses backdrop-filter, which would
 * otherwise become the containing block for position:fixed and clip the drawer.
 */
export function MobileNav({ main, services }: { main: NavItem[]; services: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && dialogRef.current) {
        const els = dialogRef.current.querySelectorAll<HTMLElement>("a,button");
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="inline-flex h-11 w-11 items-center justify-center rounded text-navy hover:bg-canvas lg:hidden"
      >
        <span className="sr-only">Open menu</span>
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            id="mobile-nav"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-lift"
          >
            <div className="flex h-[var(--header-h)] items-center justify-between border-b border-line px-5">
              <span className="eyebrow">Menu</span>
              <button type="button" onClick={() => setOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded text-navy hover:bg-canvas">
                <span className="sr-only">Close menu</span>
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 px-5 py-4">
              <ul className="divide-y divide-line">
                <li><Link href="/" className="block py-3.5 text-lg text-navy no-underline">Home</Link></li>
                {main.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block py-3.5 text-lg text-navy no-underline" aria-current={pathname === item.href ? "page" : undefined}>
                      {item.label}
                    </Link>
                    {item.href === "/services" && (
                      <ul className="mb-3 ml-3 border-l border-line pl-4">
                        {services.map((s) => (
                          <li key={s.href}>
                            <Link href={s.href} className="block py-2 text-[0.95rem] text-ink-muted no-underline hover:text-navy">{s.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-line p-5">
              <Link href="/book" className="btn-primary w-full">Book a Consultation</Link>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
