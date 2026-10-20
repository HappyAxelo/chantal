import { addDays, minutesOf, timeOf, weekdayOf, zonedDateString, zonedToUtc } from "./time";

export interface AvailabilityRule {
  id: string;
  weekday: number; // 0 = Sunday
  startTime: string; // "HH:MM" business-local
  endTime: string;
  active: boolean;
}

export interface Interval {
  start: Date;
  end: Date;
}

export interface SlotSettings {
  timezone: string;
  slotMinutes: number;
  bufferMinutes: number;
  minNoticeHours: number;
  maxDaysAhead: number;
}

export interface Slot {
  start: string; // ISO UTC
  end: string;
  label: string; // business-local "HH:MM"
}

export interface DayAvailability {
  date: string;
  slots: Slot[];
}

function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

/**
 * Compute bookable slots for each date in [fromDate, fromDate + days).
 * `busy` = existing pending/confirmed appointments (buffer is applied around them);
 * `blocked` = owner-defined blocked periods.
 */
export function computeAvailability(params: {
  fromDate: string;
  days: number;
  rules: AvailabilityRule[];
  busy: Interval[];
  blocked: Interval[];
  settings: SlotSettings;
  now: Date;
}): DayAvailability[] {
  const { fromDate, days, rules, busy, blocked, settings, now } = params;
  const earliest = new Date(now.getTime() + settings.minNoticeHours * 3600_000);
  const today = zonedDateString(now, settings.timezone);
  const lastDate = addDays(today, settings.maxDaysAhead);
  const bufferMs = settings.bufferMinutes * 60_000;
  const padded = busy.map((b) => ({ start: new Date(b.start.getTime() - bufferMs), end: new Date(b.end.getTime() + bufferMs) }));

  const out: DayAvailability[] = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(fromDate, i);
    const slots: Slot[] = [];
    if (date >= today && date <= lastDate) {
      const dayRules = rules.filter((r) => r.active && r.weekday === weekdayOf(date));
      for (const rule of dayRules) {
        const endMin = minutesOf(rule.endTime);
        for (let m = minutesOf(rule.startTime); m + settings.slotMinutes <= endMin; m += settings.slotMinutes) {
          const start = zonedToUtc(date, timeOf(m), settings.timezone);
          const end = new Date(start.getTime() + settings.slotMinutes * 60_000);
          const candidate = { start, end };
          if (start < earliest) continue;
          if (blocked.some((b) => overlaps(candidate, b))) continue;
          if (padded.some((b) => overlaps(candidate, b))) continue;
          slots.push({ start: start.toISOString(), end: end.toISOString(), label: timeOf(m) });
        }
      }
      slots.sort((a, b) => a.start.localeCompare(b.start));
    }
    out.push({ date, slots });
  }
  return out;
}
