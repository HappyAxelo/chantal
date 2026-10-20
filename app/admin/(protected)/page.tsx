import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { readiness } from "@/lib/readiness";
import { getStore } from "@/lib/store";

export default async function AdminOverview() {
  await requireAdmin();
  const counts = await getStore().counts();
  const checklist = readiness();
  const open = checklist.filter((c) => !c.done);

  const tiles = [
    { label: "Booking requests awaiting approval", value: counts.pendingAppointments, href: "/admin/appointments?status=pending" },
    { label: "Upcoming confirmed appointments", value: counts.upcomingConfirmed, href: "/admin/appointments?status=confirmed" },
    { label: "New inquiries", value: counts.newInquiries, href: "/admin/inquiries?status=new" },
    { label: "Inquiries in the last 30 days", value: counts.inquiriesLast30, href: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-10">
      <h1 className="text-3xl">Overview</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link href={t.href} className="block border border-line bg-white p-5 no-underline hover:border-navy/40">
              <span className="block font-serif text-4xl text-navy">{t.value}</span>
              <span className="mt-2 block text-sm text-ink-muted">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="launch" className="border border-line bg-white">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line px-5 py-4">
          <h2 id="launch" className="text-xl">Launch checklist</h2>
          <p className="text-sm text-ink-muted">{checklist.length - open.length} of {checklist.length} complete</p>
        </div>
        <ul className="divide-y divide-line">
          {checklist.map((c) => (
            <li key={c.item} className="grid grid-cols-[1.5rem_1fr_auto] items-start gap-3 px-5 py-3 text-sm">
              <span aria-hidden="true" className={c.done ? "text-success" : "text-bronze"}>{c.done ? "✓" : "○"}</span>
              <span><span className="font-semibold">{c.area}:</span> {c.item}<span className="sr-only">{c.done ? " (done)" : " (to do)"}</span></span>
              <code className="text-xs text-ink-muted">{c.where}</code>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
