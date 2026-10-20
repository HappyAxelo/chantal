"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/appointments", label: "Appointments" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/availability", label: "Availability" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Dashboard" className="mx-auto max-w-7xl overflow-x-auto px-4 md:px-6">
      <ul className="flex gap-6 text-sm">
        {items.map((i) => {
          const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
          return (
            <li key={i.href}>
              <Link href={i.href} aria-current={active ? "page" : undefined}
                className={`block border-b-2 py-3 font-medium no-underline ${active ? "border-navy text-navy" : "border-transparent text-ink-muted hover:text-navy"}`}>
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
