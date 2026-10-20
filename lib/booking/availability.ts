import { site } from "@/content/site";
import { getStore } from "@/lib/store";
import { addDays, zonedDateString, zonedToUtc } from "./time";
import { computeAvailability, type DayAvailability, type SlotSettings } from "./slots";

export function slotSettings(): SlotSettings {
  const b = site.booking;
  return { timezone: b.timezone, slotMinutes: b.slotMinutes, bufferMinutes: b.bufferMinutes, minNoticeHours: b.minNoticeHours, maxDaysAhead: b.maxDaysAhead };
}

/** Live availability from rules, blocked periods and existing bookings. */
export async function getAvailability(fromDate: string, days: number, now = new Date()): Promise<DayAvailability[]> {
  const settings = slotSettings();
  const store = getStore();
  const rangeStart = zonedToUtc(fromDate, "00:00", settings.timezone);
  const rangeEnd = zonedToUtc(addDays(fromDate, days + 1), "00:00", settings.timezone);
  const [rules, blocked, busy] = await Promise.all([
    store.listRules(),
    store.listBlocked(),
    store.busyIntervals(new Date(rangeStart.getTime() - 86400_000), new Date(rangeEnd.getTime() + 86400_000)),
  ]);
  return computeAvailability({
    fromDate,
    days,
    rules,
    busy,
    blocked: blocked.map((b) => ({ start: new Date(b.startAt), end: new Date(b.endAt) })),
    settings,
    now,
  });
}

/** True if `startIso` is currently a bookable slot start. */
export async function isSlotAvailable(startIso: string): Promise<boolean> {
  const tz = site.booking.timezone;
  const date = zonedDateString(new Date(startIso), tz);
  const [day] = await getAvailability(date, 1);
  return Boolean(day?.slots.some((s) => s.start === new Date(startIso).toISOString()));
}

export function todayInBusinessTz(now = new Date()): string {
  return zonedDateString(now, site.booking.timezone);
}
