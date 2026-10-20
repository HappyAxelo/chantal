import { deleteBlockedAction, deleteRuleAction, toggleRuleAction } from "@/app/actions/admin";
import { BlockedForm, ConfirmButton, RuleForm } from "@/components/admin/AdminForms";
import { site } from "@/content/site";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/booking/time";
import { getStore } from "@/lib/store";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function AvailabilityPage() {
  await requireAdmin();
  const store = getStore();
  const [rules, blocked] = await Promise.all([store.listRules(), store.listBlocked()]);
  const b = site.booking;
  const upcomingBlocked = blocked.filter((x) => x.endAt >= new Date().toISOString());

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl">Availability</h1>
        <p className="mt-2 max-w-3xl text-sm text-ink-muted">
          All times are in the business timezone <strong>{b.timezone}</strong>{!b.timezoneConfirmed && " (not yet confirmed)"}. Slots are {b.slotMinutes} minutes with a {b.bufferMinutes}-minute buffer around existing bookings,
          require {b.minNoticeHours} hours&rsquo; notice and can be booked up to {b.maxDaysAhead} days ahead. These settings are in <code>content/site.ts</code>.
        </p>
      </div>

      <section className="border border-line bg-white" aria-labelledby="weekly">
        <h2 id="weekly" className="border-b border-line px-5 py-4 text-xl">Weekly hours</h2>
        {rules.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink-muted">No weekly hours yet, so clients cannot book online. Add your first block of hours below.</p>
        ) : (
          <ul className="divide-y divide-line">
            {rules.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                <span className={r.active ? "" : "text-ink-muted line-through"}>
                  <span className="inline-block w-28 font-semibold">{weekdays[r.weekday]}</span>{r.startTime}–{r.endTime}
                </span>
                <span className="flex gap-3">
                  <form action={toggleRuleAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="active" value={String(!r.active)} />
                    <button type="submit" className="font-semibold text-navy underline">{r.active ? "Pause" : "Resume"}</button>
                  </form>
                  <form action={deleteRuleAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <ConfirmButton message="Delete these hours? Existing bookings are not affected." className="font-semibold text-danger underline">Delete</ConfirmButton>
                  </form>
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-line bg-canvas px-5 py-4"><RuleForm /></div>
      </section>

      <section className="border border-line bg-white" aria-labelledby="blocked">
        <h2 id="blocked" className="border-b border-line px-5 py-4 text-xl">Blocked dates and times</h2>
        <p className="px-5 pt-4 text-sm text-ink-muted">Block holidays, travel or other unavailability. Existing bookings in a blocked period are not cancelled automatically.</p>
        {upcomingBlocked.length === 0 ? (
          <p className="px-5 py-4 text-sm text-ink-muted">No upcoming blocked periods.</p>
        ) : (
          <ul className="divide-y divide-line">
            {upcomingBlocked.map((x) => (
              <li key={x.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                <span>{formatDateTime(x.startAt, b.timezone)} → {formatDateTime(x.endAt, b.timezone)}{x.reason && <span className="text-ink-muted"> · {x.reason}</span>}</span>
                <form action={deleteBlockedAction}>
                  <input type="hidden" name="id" value={x.id} />
                  <ConfirmButton message="Remove this blocked period?" className="font-semibold text-danger underline">Remove</ConfirmButton>
                </form>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-line bg-canvas px-5 py-4"><BlockedForm /></div>
      </section>
    </div>
  );
}
