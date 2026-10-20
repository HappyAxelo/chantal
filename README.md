# LexBridge Advisory Ltd — website

Website for a procurement, contract management and FIDIC-related advisory practice: public pages, an inquiry form, appointment booking with live availability, and a protected admin dashboard.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 3 · zod · Supabase (Postgres + Auth) · Resend (REST API) · Vitest.

---

## Quick start (development)

```bash
npm install
cp .env.example .env.local   # then set ADMIN_DEV_PASSWORD and ADMIN_SESSION_SECRET
npm run dev                  # http://localhost:3000
npm test                     # unit tests
npm run typecheck
```

Without Supabase configured, development uses a **local JSON store** (`.data/store.json`, git-ignored). It is seeded with *sample* weekday hours so booking can be tried. Those hours are not the business's real hours. Emails are not sent; they are written to `.data/outbox/` as HTML so you can preview them.

Admin dashboard: `/admin`. In development, sign in with any email plus `ADMIN_DEV_PASSWORD`. Development sign-in is disabled in production.

---

## The "verified facts only" rule

No claim about the business is invented. Every unconfirmed fact is either `null` or `verified: false` in **`content/site.ts`** (or `scopeConfirmed: false` in `content/services.ts`).

| Mode | Unconfirmed items |
| --- | --- |
| `next dev`, or `NEXT_PUBLIC_DRAFT_PREVIEW=true` (staging) | Shown as dashed **"To confirm:"** notes. The whole site is `noindex` and robots.txt disallows everything. |
| Production | Hidden. The brand falls back to the owner's name until `company.name` is set. |

The **Launch checklist** on `/admin` lists every open item and the file where it lives.

What the owner needs to supply:

- **Company:** ~~official company name~~ — done: LexBridge Advisory Ltd (`company.name`; shown as "LexBridge Advisory" via `company.displayName`).
- **FIDIC credential:** ~~exact designation~~ — done: FIDIC Certified Contract Manager (FCCM), shown as "Chantal Nishimwe, FCCM".
- **Founder profile:** biography, background, qualifications, memberships and an approved portrait.
- **Location:** Kigali, Rwanda is confirmed. Still needed: service areas, governing law, street address, office hours and working languages.
- **Contact:** a verified email and/or phone number.
- **Services:** confirmation of every scope item on each service page, then `scopeConfirmed: true`.
- **Booking:**
  - ~~Business timezone~~ — done: Africa/Kigali.
  - ~~Meeting formats~~ — done: in person, online video call, telephone.
  - A cancellation policy.
- **Notarial services:** keep this disabled until jurisdiction, appointment and permitted scope are confirmed. To activate it, set `status: "published"` on the service and `features.notarialServices: true`.
- **Legal pages:** the privacy, terms, disclaimer and cookie pages are jurisdiction-neutral templates. They must be reviewed by a qualified professional before setting `legal.reviewed: true`.
- **Insights:** the four articles are original drafts. They appear in production only after review, `status: "published"` and a `publishedAt` date. Until at least one is published, Insights is hidden from navigation and returns 404.

---

## Content management

Business details, services and articles live in typed files under `content/`, so changes are versioned and reviewed through Git. A database CMS would be heavier than this site currently needs. Operational data is managed in the dashboard:

| Dashboard section | What it does |
| --- | --- |
| Overview | Counts and launch checklist |
| Appointments | Filter; approve, decline, reschedule (conflict-checked), cancel, complete; private notes |
| Inquiries | Filter by status, service, date; update status; private notes |
| Availability | Weekly hours; blocked dates and times |

Not yet built in the dashboard: editing service copy, articles and business details. Those are file edits today. If the owner needs to edit them without a developer, the next step is moving `content/` into Supabase tables or a headless CMS.

---

## Production setup

### 1. Supabase
1. Create a project. Run `supabase/migrations/20261020000000_initial_schema.sql`, either in the SQL editor or with `supabase db push`.
2. The migration sets up:
   - Row Level Security on every table, with **no anon access**.
   - Public submissions only through validated server actions, using the server-only service-role key.
   - An exclusion constraint (`appointments_no_overlap`) that makes double-booking impossible at the database level.
3. Create the owner user in **Authentication → Users**, then make them an admin:
   ```sql
   insert into public.profiles (id, full_name, role)
   values ('<auth-user-uuid>', 'Chantal Nishimwe', 'owner');
   ```
   Enable MFA in Supabase Auth for admin accounts.
4. Add your weekly hours in `/admin/availability`. No hours means no online booking; visitors are pointed to the inquiry form.

### 2. Email (Resend)
Verify a sending domain in Resend, then set:
- `EMAIL_MODE=live`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_NOTIFICATION_EMAIL`

On staging, set `EMAIL_REDIRECT_TO` so no real client is emailed.

Emails sent:

| Recipient | Emails |
| --- | --- |
| Client | Inquiry received; booking requested (clearly marked *not yet confirmed*); confirmed; rescheduled; cancelled; declined |
| Admin | New inquiry; new booking |

Private admin notes are never included in client emails.

### 3. Deploy (Vercel)
Set every variable from `.env.example`. `NEXT_PUBLIC_SITE_URL` must be the real domain. **Do not** set `NEXT_PUBLIC_DRAFT_PREVIEW` on production. HTTPS and security headers (HSTS, `X-Frame-Options`, etc.) are configured in `next.config.ts`.

If Supabase is not configured in production, the forms report "temporarily unavailable" and store nothing. They never pretend to succeed.

---

## Security notes

- **Validation:** all input is validated server-side with zod. Email content is HTML-escaped. JSON-LD is escaped.
- **Spam:** a honeypot field, a minimum fill-time check and per-IP rate limits.
  - The limiter is in memory, so it only works per server instance. For serverless or multi-instance hosting, swap `lib/rate-limit.ts` for Upstash Redis.
  - Add Cloudflare Turnstile if spam becomes a problem.
- **Admin authorisation:** every admin page and server action calls `requireAdmin()`. The middleware only refreshes sessions; hidden URLs are not treated as security.
- **No document uploads:** both forms warn visitors not to send confidential documents or ID. If secure uploads are needed later, use private Supabase Storage with short-lived signed URLs, type and size checks, and a retention policy.
- **Data retention:** default is 24 months for unconverted inquiries (`legal.inquiryRetentionMonths`). Deletion is not automated yet. Schedule a Supabase cron job or delete manually.

---

## Design decisions

- **Visual system:** colour tokens are CSS variables in `app/globals.css`; Tailwind only maps names to them. Fonts are Newsreader (headings) and Inter (body).
- **Logo:** an original LexBridge mark: a suspension bridge (two towers, a deck and a bronze cable) in `components/ui/Logo.tsx`, with the favicon in `app/icon.svg`. There is no FIDIC branding anywhere.
- **Imagery:** the hero uses an original line illustration. No stock photography and no gavels. Add approved photography under `public/` and set `owner.portrait`.
- **Motion:** CSS only, disabled under `prefers-reduced-motion`. Framer Motion was not used, which keeps page weight down.
- **shadcn/ui:** not used. The small component set is built directly on the design tokens.
- **Appointments schema:** stores `start_at`/`end_at` (`timestamptz`) plus the display timezone, instead of separate date and time columns. This is what lets the database prevent overlaps.
- **Fonts at build time:** `next/font/google` downloads fonts during the build. One build here failed on a transient network error. Self-host the fonts if your CI has unreliable network access.
