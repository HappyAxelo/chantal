import { headers } from "next/headers";

/**
 * Fixed-window, in-memory rate limiter. Effective on a single server
 * instance; on serverless/multi-instance hosting, swap for a shared store
 * (e.g. Upstash Redis) behind the same function signature.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function rateLimit(action: string, limit: number, windowMs: number): Promise<boolean> {
  const key = `${action}:${await clientIp()}`;
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 10_000) {
      for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
    }
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}
