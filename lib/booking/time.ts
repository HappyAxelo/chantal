/** Timezone helpers built on Intl, so no date library is needed. */

const dtfCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(tz: string): Intl.DateTimeFormat {
  let f = dtfCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    dtfCache.set(tz, f);
  }
  return f;
}

export function zonedParts(date: Date, tz: string) {
  const p: Record<string, number> = {};
  for (const part of partsFormatter(tz).formatToParts(date)) {
    if (part.type !== "literal") p[part.type] = Number(part.value);
  }
  return {
    year: p.year!,
    month: p.month!,
    day: p.day!,
    hour: p.hour! % 24,
    minute: p.minute!,
    second: p.second!,
  };
}

/** Offset (ms) of `tz` from UTC at the given instant. */
export function tzOffsetMs(date: Date, tz: string): number {
  const z = zonedParts(date, tz);
  const asUtc = Date.UTC(z.year, z.month - 1, z.day, z.hour, z.minute, z.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** Convert a wall-clock date ("YYYY-MM-DD") and time ("HH:MM") in `tz` to a UTC instant. */
export function zonedToUtc(date: string, time: string, tz: string): Date {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const [hh, mm] = time.split(":").map(Number) as [number, number];
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const off1 = tzOffsetMs(new Date(guess), tz);
  let ts = guess - off1;
  const off2 = tzOffsetMs(new Date(ts), tz);
  if (off2 !== off1) ts = guess - off2;
  return new Date(ts);
}

/** "YYYY-MM-DD" of an instant in `tz`. */
export function zonedDateString(date: Date, tz: string): string {
  const z = zonedParts(date, tz);
  return `${z.year}-${String(z.month).padStart(2, "0")}-${String(z.day).padStart(2, "0")}`;
}

export function zonedTimeString(date: Date, tz: string): string {
  const z = zonedParts(date, tz);
  return `${String(z.hour).padStart(2, "0")}:${String(z.minute).padStart(2, "0")}`;
}

/** Day of week (0 = Sunday) of a calendar date string. */
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

export function minutesOf(time: string): number {
  const [h, m] = time.split(":").map(Number) as [number, number];
  return h * 60 + m;
}

export function timeOf(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function formatDateTime(iso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

/** "Africa/Kigali" -> "Kigali time (Central Africa Time)". */
export function tzLabel(tz: string): string {
  const city = tz.split("/").pop()?.replace(/_/g, " ") ?? tz;
  try {
    const long = new Intl.DateTimeFormat("en-GB", { timeZone: tz, timeZoneName: "long" }).formatToParts(new Date()).find((p) => p.type === "timeZoneName")?.value;
    return long ? `${city} time (${long})` : `${city} time`;
  } catch {
    return tz;
  }
}
