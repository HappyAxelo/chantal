import Link from "next/link";
import { saveAppointmentNotesAction } from "@/app/actions/admin";
import { AppointmentActions } from "@/components/admin/AdminForms";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/booking/time";
import { labelForCategory, labelForFormat } from "@/lib/email/templates";
import { getStore, type AppointmentStatus } from "@/lib/store";

const statuses: AppointmentStatus[] = ["pending", "confirmed", "declined", "cancelled", "completed"];
const badge: Record<AppointmentStatus, string> = {
  pending: "bg-[#fbf3e2] text-[#7a5418] border-[#e7cf9e]",
  confirmed: "bg-success/10 text-success border-success/30",
  declined: "bg-canvas text-ink-muted border-line",
  cancelled: "bg-canvas text-ink-muted border-line",
  completed: "bg-slate-soft text-navy border-slate/30",
};

export default async function AppointmentsPage({ searchParams }: { searchParams: Promise<{ status?: string; all?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = statuses.includes(sp.status as AppointmentStatus) ? (sp.status as AppointmentStatus) : undefined;
  const upcomingOnly = sp.all !== "1";
  const list = await getStore().listAppointments({ status, upcomingOnly });

  const qs = (p: Record<string, string | undefined>) => {
    const u = new URLSearchParams(Object.entries({ status, all: upcomingOnly ? undefined : "1", ...p }).filter(([, v]) => v) as [string, string][]);
    const s = u.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl">Appointments</h1>
        <nav aria-label="Filter appointments" className="flex flex-wrap gap-2 text-sm">
          <Link href={`/admin/appointments${qs({ status: undefined })}`} className={`rounded-sm border px-3 py-1.5 no-underline ${!status ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>All statuses</Link>
          {statuses.map((s) => (
            <Link key={s} href={`/admin/appointments${qs({ status: s })}`} className={`rounded-sm border px-3 py-1.5 capitalize no-underline ${status === s ? "border-navy bg-navy text-white" : "border-line bg-white"}`}>{s}</Link>
          ))}
          <Link href={`/admin/appointments${qs({ all: upcomingOnly ? "1" : undefined })}`} className="rounded-sm border border-line bg-white px-3 py-1.5 no-underline">
            {upcomingOnly ? "Include past" : "Upcoming only"}
          </Link>
        </nav>
      </div>

      {list.length === 0 ? (
        <div className="border border-dashed border-line bg-white p-10 text-center text-ink-muted">No appointments match this filter.</div>
      ) : (
        <ul className="space-y-4">
          {list.map((a) => (
            <li key={a.id} className="grid gap-6 border border-line bg-white p-5 lg:grid-cols-[1.3fr_1fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-sm border px-2 py-0.5 text-xs font-semibold capitalize ${badge[a.status]}`}>{a.status}</span>
                  <span className="font-mono text-sm text-ink-muted">{a.reference}</span>
                </div>
                <p className="mt-3 font-serif text-xl text-navy">{formatDateTime(a.startAt, a.timezone)}</p>
                <p className="text-sm text-ink-muted">{a.timezone} · {labelForCategory(a.category)} · {labelForFormat(a.meetingFormat)}</p>
                <p className="mt-3 whitespace-pre-line text-sm">{a.reason}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold">{a.clientName}</p>
                <p><a href={`mailto:${a.clientEmail}`}>{a.clientEmail}</a></p>
                {a.clientPhone && <p>{a.clientPhone}</p>}
                <p className="mt-2 text-xs text-ink-muted">Requested {new Date(a.createdAt).toLocaleString("en-GB", { timeZone: a.timezone })}</p>
                <form action={saveAppointmentNotesAction} className="mt-3 space-y-2">
                  <input type="hidden" name="id" value={a.id} />
                  <label className="block text-xs font-semibold text-ink-muted" htmlFor={`n-${a.id}`}>Private notes (never sent to client)</label>
                  <textarea id={`n-${a.id}`} name="adminNotes" defaultValue={a.adminNotes ?? ""} rows={2} maxLength={4000} className="input min-h-0 text-sm" />
                  <button type="submit" className="text-xs font-semibold text-navy underline">Save notes</button>
                </form>
              </div>
              <AppointmentActions id={a.id} status={a.status} timezone={a.timezone} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
