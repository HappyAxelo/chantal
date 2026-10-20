import { describe, expect, it } from "vitest";
import { computeAvailability, type AvailabilityRule, type SlotSettings } from "@/lib/booking/slots";
import { addDays, weekdayOf, zonedDateString, zonedTimeString, zonedToUtc } from "@/lib/booking/time";

const settings = (tz = "UTC"): SlotSettings => ({ timezone: tz, slotMinutes: 60, bufferMinutes: 15, minNoticeHours: 24, maxDaysAhead: 30 });
const monday: AvailabilityRule = { id: "r1", weekday: 1, startTime: "09:00", endTime: "12:00", active: true };
// 2026-10-26 is a Monday.
const NOW = new Date("2026-10-20T10:00:00Z");

describe("timezone helpers", () => {
  it("converts wall-clock time in a zone to UTC", () => {
    expect(zonedToUtc("2026-07-01", "09:00", "Africa/Kigali").toISOString()).toBe("2026-07-01T07:00:00.000Z");
    expect(zonedToUtc("2026-01-15", "09:00", "Europe/London").toISOString()).toBe("2026-01-15T09:00:00.000Z");
    expect(zonedToUtc("2026-07-15", "09:00", "Europe/London").toISOString()).toBe("2026-07-15T08:00:00.000Z");
  });

  it("round-trips date and time strings", () => {
    const d = zonedToUtc("2026-11-03", "14:30", "America/New_York");
    expect(zonedDateString(d, "America/New_York")).toBe("2026-11-03");
    expect(zonedTimeString(d, "America/New_York")).toBe("14:30");
  });

  it("computes weekdays and adds days across month ends", () => {
    expect(weekdayOf("2026-10-26")).toBe(1);
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
  });
});

describe("computeAvailability", () => {
  it("generates slots from active rules on matching weekdays only", () => {
    const days = computeAvailability({ fromDate: "2026-10-26", days: 2, rules: [monday], busy: [], blocked: [], settings: settings(), now: NOW });
    expect(days[0]!.slots.map((s) => s.label)).toEqual(["09:00", "10:00", "11:00"]);
    expect(days[1]!.slots).toHaveLength(0);
  });

  it("ignores inactive rules", () => {
    const days = computeAvailability({ fromDate: "2026-10-26", days: 1, rules: [{ ...monday, active: false }], busy: [], blocked: [], settings: settings(), now: NOW });
    expect(days[0]!.slots).toHaveLength(0);
  });

  it("removes slots overlapping existing bookings, including the buffer", () => {
    const busy = [{ start: new Date("2026-10-26T10:00:00Z"), end: new Date("2026-10-26T11:00:00Z") }];
    const days = computeAvailability({ fromDate: "2026-10-26", days: 1, rules: [monday], busy, blocked: [], settings: settings(), now: NOW });
    // 09:00 ends at 10:00 but the 15-minute buffer starts at 09:45, so it is excluded; 11:00 starts inside buffer end 11:15.
    expect(days[0]!.slots.map((s) => s.label)).toEqual([]);
  });

  it("respects blocked periods", () => {
    const blocked = [{ start: new Date("2026-10-26T09:00:00Z"), end: new Date("2026-10-26T10:00:00Z") }];
    const days = computeAvailability({ fromDate: "2026-10-26", days: 1, rules: [monday], busy: [], blocked, settings: settings(), now: NOW });
    expect(days[0]!.slots.map((s) => s.label)).toEqual(["10:00", "11:00"]);
  });

  it("enforces minimum notice and the booking horizon", () => {
    const now = new Date("2026-10-25T09:30:00Z"); // 24h notice -> earliest 2026-10-26T09:30Z
    const days = computeAvailability({ fromDate: "2026-10-26", days: 1, rules: [monday], busy: [], blocked: [], settings: settings(), now });
    expect(days[0]!.slots.map((s) => s.label)).toEqual(["10:00", "11:00"]);

    const far = computeAvailability({ fromDate: "2027-01-04", days: 1, rules: [monday], busy: [], blocked: [], settings: settings(), now: NOW });
    expect(far[0]!.slots).toHaveLength(0);
  });

  it("produces UTC instants for a non-UTC business timezone", () => {
    const days = computeAvailability({ fromDate: "2026-10-26", days: 1, rules: [monday], busy: [], blocked: [], settings: settings("Africa/Nairobi"), now: NOW });
    expect(days[0]!.slots[0]).toMatchObject({ label: "09:00", start: "2026-10-26T06:00:00.000Z" });
  });
});
