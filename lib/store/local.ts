import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { AvailabilityRule, Interval } from "@/lib/booking/slots";
import {
  ACTIVE_STATUSES,
  type AppointmentRecord,
  type BlockedPeriod,
  type InquiryRecord,
  type Store,
} from "./types";

/**
 * Development store: a JSON file in .data/ (git-ignored). All reads and
 * writes go through one in-process queue so the conflict check and insert
 * for a booking happen atomically within this server process. It is NOT
 * suitable for multi-instance or serverless production — use Supabase.
 */

interface Data {
  inquiries: InquiryRecord[];
  appointments: AppointmentRecord[];
  rules: AvailabilityRule[];
  blocked: BlockedPeriod[];
}

const FILE = path.join(process.cwd(), ".data", "store.json");

function seed(): Data {
  // Sample hours so booking can be exercised locally. These are NOT the
  // business's confirmed hours; production availability is set in /admin.
  const rules: AvailabilityRule[] = [1, 2, 3, 4, 5].map((weekday) => ({
    id: randomUUID(),
    weekday,
    startTime: "09:00",
    endTime: "16:00",
    active: true,
  }));
  return { inquiries: [], appointments: [], rules, blocked: [] };
}

let queue: Promise<unknown> = Promise.resolve();

function exclusive<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function load(): Promise<Data> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Data;
  } catch {
    const data = seed();
    await save(data);
    return data;
  }
}

async function save(data: Data): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

function overlapsActive(data: Data, start: string, end: string, exceptId?: string): boolean {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return data.appointments.some(
    (a) =>
      a.id !== exceptId &&
      ACTIVE_STATUSES.includes(a.status) &&
      new Date(a.startAt).getTime() < e &&
      s < new Date(a.endAt).getTime(),
  );
}

const now = () => new Date().toISOString();

export const localStore: Store = {
  kind: "local",

  createInquiry: (input) =>
    exclusive(async () => {
      const data = await load();
      const rec: InquiryRecord = { ...input, id: randomUUID(), status: "new", adminNotes: null, createdAt: now(), updatedAt: now() };
      data.inquiries.push(rec);
      await save(data);
      return rec;
    }),

  listInquiries: (filter) =>
    exclusive(async () => {
      const data = await load();
      return data.inquiries
        .filter((i) => (!filter.status || i.status === filter.status) && (!filter.service || i.service === filter.service))
        .filter((i) => (!filter.from || i.createdAt.slice(0, 10) >= filter.from) && (!filter.to || i.createdAt.slice(0, 10) <= filter.to))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }),

  updateInquiry: (id, patch) =>
    exclusive(async () => {
      const data = await load();
      const rec = data.inquiries.find((i) => i.id === id);
      if (!rec) return null;
      if (patch.status) rec.status = patch.status;
      if (patch.adminNotes !== undefined) rec.adminNotes = patch.adminNotes;
      rec.updatedAt = now();
      await save(data);
      return rec;
    }),

  createAppointment: (input) =>
    exclusive(async () => {
      const data = await load();
      if (overlapsActive(data, input.startAt, input.endAt)) return { ok: false, reason: "conflict" } as const;
      const rec: AppointmentRecord = { ...input, id: randomUUID(), status: "pending", adminNotes: null, createdAt: now(), updatedAt: now() };
      data.appointments.push(rec);
      await save(data);
      return { ok: true, appointment: rec } as const;
    }),

  listAppointments: (filter) =>
    exclusive(async () => {
      const data = await load();
      const t = now();
      return data.appointments
        .filter((a) => (!filter.status || a.status === filter.status) && (!filter.upcomingOnly || a.endAt >= t))
        .sort((a, b) => a.startAt.localeCompare(b.startAt));
    }),

  getAppointment: (id) =>
    exclusive(async () => (await load()).appointments.find((a) => a.id === id) ?? null),

  updateAppointment: (id, patch) =>
    exclusive(async () => {
      const data = await load();
      const rec = data.appointments.find((a) => a.id === id);
      if (!rec) return { ok: false, reason: "not_found" } as const;
      const next = { ...rec, ...Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== undefined)) } as AppointmentRecord;
      if (ACTIVE_STATUSES.includes(next.status) && overlapsActive(data, next.startAt, next.endAt, id)) {
        return { ok: false, reason: "conflict" } as const;
      }
      Object.assign(rec, next, { updatedAt: now() });
      await save(data);
      return { ok: true, appointment: rec } as const;
    }),

  busyIntervals: (from, to) =>
    exclusive(async () => {
      const data = await load();
      return data.appointments
        .filter((a) => ACTIVE_STATUSES.includes(a.status))
        .map((a) => ({ start: new Date(a.startAt), end: new Date(a.endAt) }))
        .filter((i: Interval) => i.start < to && from < i.end);
    }),

  listRules: () => exclusive(async () => (await load()).rules.sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime))),

  addRule: (rule) =>
    exclusive(async () => {
      const data = await load();
      data.rules.push({ ...rule, id: randomUUID() });
      await save(data);
    }),

  setRuleActive: (id, active) =>
    exclusive(async () => {
      const data = await load();
      const r = data.rules.find((x) => x.id === id);
      if (r) r.active = active;
      await save(data);
    }),

  deleteRule: (id) =>
    exclusive(async () => {
      const data = await load();
      data.rules = data.rules.filter((r) => r.id !== id);
      await save(data);
    }),

  listBlocked: () => exclusive(async () => (await load()).blocked.sort((a, b) => a.startAt.localeCompare(b.startAt))),

  addBlocked: (input) =>
    exclusive(async () => {
      const data = await load();
      data.blocked.push({ ...input, id: randomUUID(), createdAt: now() });
      await save(data);
    }),

  deleteBlocked: (id) =>
    exclusive(async () => {
      const data = await load();
      data.blocked = data.blocked.filter((b) => b.id !== id);
      await save(data);
    }),

  counts: () =>
    exclusive(async () => {
      const data = await load();
      const t = now();
      const cutoff = new Date(Date.now() - 30 * 86400_000).toISOString();
      return {
        newInquiries: data.inquiries.filter((i) => i.status === "new").length,
        pendingAppointments: data.appointments.filter((a) => a.status === "pending" && a.endAt >= t).length,
        upcomingConfirmed: data.appointments.filter((a) => a.status === "confirmed" && a.endAt >= t).length,
        inquiriesLast30: data.inquiries.filter((i) => i.createdAt >= cutoff).length,
      };
    }),
};
