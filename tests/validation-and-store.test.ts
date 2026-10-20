import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { bookingSchema, inquirySchema, looksLikeSpam } from "@/lib/validation";
import { makeReference } from "@/lib/reference";
import { esc } from "@/lib/email/templates";

const validInquiry = {
  name: "Test Person",
  email: "Test@Example.com",
  service: "procurement",
  timeframe: "flexible",
  message: "We need help reviewing tender documents for an upcoming procurement.",
  contactPreference: "email",
  consent: "on",
};

describe("inquiry validation", () => {
  it("accepts a valid inquiry and normalises email", () => {
    const r = inquirySchema.safeParse(validInquiry);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("test@example.com");
  });

  it("requires consent, a real email and a meaningful message", () => {
    expect(inquirySchema.safeParse({ ...validInquiry, consent: undefined }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...validInquiry, email: "nope" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...validInquiry, message: "too short" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...validInquiry, service: "litigation" }).success).toBe(false);
  });

  it("rejects malformed phone numbers but allows blank", () => {
    expect(inquirySchema.safeParse({ ...validInquiry, phone: "" }).success).toBe(true);
    expect(inquirySchema.safeParse({ ...validInquiry, phone: "<script>" }).success).toBe(false);
  });
});

describe("booking validation", () => {
  it("requires an ISO start time", () => {
    const base = { category: "general", name: "A Person", email: "a@b.co", meetingFormat: "to_be_agreed", reason: "Initial discussion", consent: "on" };
    expect(bookingSchema.safeParse({ ...base, start: "2026-10-26T09:00:00.000Z" }).success).toBe(true);
    expect(bookingSchema.safeParse({ ...base, start: "tomorrow" }).success).toBe(false);
  });
});

describe("spam heuristics", () => {
  it("flags honeypot and instant submissions", () => {
    const hp = new FormData(); hp.set("website", "http://spam");
    expect(looksLikeSpam(hp)).toBe(true);
    const fast = new FormData(); fast.set("startedAt", String(Date.now()));
    expect(looksLikeSpam(fast)).toBe(true);
    const ok = new FormData(); ok.set("startedAt", String(Date.now() - 10_000));
    expect(looksLikeSpam(ok)).toBe(false);
  });
});

describe("references and escaping", () => {
  it("generates unique, readable references", () => {
    const refs = new Set(Array.from({ length: 500 }, () => makeReference("BK")));
    expect(refs.size).toBe(500);
    expect([...refs][0]).toMatch(/^BK-\d{6}-[2-9A-HJKMNP-Z]{6}$/);
  });

  it("escapes HTML in email content", () => {
    expect(esc(`<img src=x onerror="a">`)).toBe("&lt;img src=x onerror=&quot;a&quot;&gt;");
  });
});

describe("local store", () => {
  const cwd = process.cwd();
  let dir = "";
  beforeAll(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "store-"));
    process.chdir(dir);
  });
  afterAll(async () => {
    process.chdir(cwd);
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("prevents concurrent double-booking of the same slot", async () => {
    const { localStore } = await import("@/lib/store/local");
    const make = (ref: string) => localStore.createAppointment({
      reference: ref, clientName: "A", clientEmail: "a@b.co", clientPhone: null, category: "general",
      startAt: "2030-01-07T09:00:00.000Z", endAt: "2030-01-07T10:00:00.000Z", timezone: "UTC",
      meetingFormat: "to_be_agreed", reason: "Test", privacyNoticeVersion: "test",
    });
    const results = await Promise.all([make("BK-1"), make("BK-2"), make("BK-3")]);
    expect(results.filter((r) => r.ok)).toHaveLength(1);

    // Declining frees the slot again.
    const winner = results.find((r) => r.ok);
    if (winner?.ok) await localStore.updateAppointment(winner.appointment.id, { status: "declined" });
    expect((await make("BK-4")).ok).toBe(true);
  });
});
