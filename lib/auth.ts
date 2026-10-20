import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isProduction, supabaseConfigured } from "@/lib/env";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export interface AdminUser {
  email: string;
  role: "owner" | "admin" | "staff";
  mode: "supabase" | "dev";
}

/*
 * Two modes:
 *  - Supabase Auth (production): email + password, and the user must have a
 *    row in `profiles` with an admin role. Enable MFA in Supabase for owners.
 *  - Development fallback: ADMIN_DEV_PASSWORD with an HMAC-signed cookie.
 *    Refused in production.
 */

const DEV_COOKIE = "adm_dev";
const DEV_TTL_MS = 8 * 3600_000;

function devSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32
    ? process.env.ADMIN_SESSION_SECRET
    : null;
}

export function devAuthAvailable(): boolean {
  return !isProduction && !supabaseConfigured && Boolean(process.env.ADMIN_DEV_PASSWORD) && Boolean(devSecret());
}

function sign(payload: string): string {
  return createHmac("sha256", devSecret()!).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function signIn(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (supabaseConfigured) {
    const sb = await supabaseServer();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { ok: false, error: "Invalid email or password." };
    const role = await roleFor(data.user.id);
    if (!role) {
      await sb.auth.signOut();
      return { ok: false, error: "This account does not have dashboard access." };
    }
    return { ok: true };
  }
  if (devAuthAvailable()) {
    if (!safeEqual(password, process.env.ADMIN_DEV_PASSWORD!)) return { ok: false, error: "Invalid email or password." };
    const payload = `${email}|${Date.now() + DEV_TTL_MS}`;
    (await cookies()).set(DEV_COOKIE, `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`, {
      httpOnly: true, sameSite: "strict", secure: isProduction, path: "/", maxAge: DEV_TTL_MS / 1000,
    });
    return { ok: true };
  }
  return { ok: false, error: "Sign-in is not configured. See README: Admin access." };
}

export async function signOut(): Promise<void> {
  if (supabaseConfigured) await (await supabaseServer()).auth.signOut();
  (await cookies()).delete(DEV_COOKIE);
}

async function roleFor(userId: string): Promise<AdminUser["role"] | null> {
  const { data } = await supabaseAdmin().from("profiles").select("role").eq("id", userId).maybeSingle();
  const role = data?.role as AdminUser["role"] | undefined;
  return role && ["owner", "admin", "staff"].includes(role) ? role : null;
}

export async function currentAdmin(): Promise<AdminUser | null> {
  if (supabaseConfigured) {
    const sb = await supabaseServer();
    const { data } = await sb.auth.getUser(); // verifies the JWT with Supabase
    if (!data.user) return null;
    const role = await roleFor(data.user.id);
    return role ? { email: data.user.email ?? "", role, mode: "supabase" } : null;
  }
  if (!devAuthAvailable()) return null;
  const raw = (await cookies()).get(DEV_COOKIE)?.value;
  if (!raw) return null;
  const [b64, sig] = raw.split(".");
  if (!b64 || !sig) return null;
  const payload = Buffer.from(b64, "base64url").toString();
  if (!safeEqual(sig, sign(payload))) return null;
  const [email, exp] = payload.split("|");
  if (!email || Number(exp) < Date.now()) return null;
  return { email, role: "owner", mode: "dev" };
}

/** Call at the top of every admin page and admin server action. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
