/**
 * Draft preview mode shows clearly-labelled placeholders for information the
 * owner has not yet supplied. It is on in `next dev` and can be enabled on a
 * staging deployment with NEXT_PUBLIC_DRAFT_PREVIEW=true. It must stay off on
 * the public production site.
 */
export const draftPreview =
  process.env.NEXT_PUBLIC_DRAFT_PREVIEW === "true" || process.env.NODE_ENV === "development";

export const isProduction = process.env.NODE_ENV === "production";

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/**
 * The local JSON store exists so forms, booking and the dashboard can be
 * exercised before Supabase is provisioned. It is refused in production
 * unless explicitly allowed (e.g. a single-instance staging box).
 */
export const localStoreAllowed = !isProduction || process.env.ALLOW_LOCAL_STORE === "true";
