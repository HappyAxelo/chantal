"use client";

import Link from "next/link";
import { startTransition, useActionState, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { submitBooking, type FormState } from "@/app/actions/public";
import { tzLabel } from "@/lib/booking/time";
import { Field, pageStartedAt, SensitiveDataWarning, SpamTrap } from "./Field";

interface Slot { start: string; end: string; label: string }
interface Day { date: string; slots: Slot[] }
interface AvailabilityResponse { timezone: string; slotMinutes: number; days: Day[] }

type Format = "in_person" | "online" | "phone";
const formatLabels: Record<Format, string> = { in_person: "In person", online: "Online video call", phone: "Telephone" };

const STEPS = ["Consultation", "Date & time", "Your details", "Review"] as const;
const initial: FormState = { status: "idle" };

const fmtDateLong = (date: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00Z`));
const fmtMonth = (ym: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", month: "long", year: "numeric" }).format(new Date(`${ym}-01T00:00:00Z`));
const fmtInZone = (iso: string, tz: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));

function localZone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "UTC"; }
}

export function BookingForm({ categories, defaultCategory, formats, cancellationPolicy }: {
  categories: { id: string; label: string }[];
  defaultCategory?: string;
  formats: Format[];
  cancellationPolicy: string | null;
}) {
  const [state, action, pending] = useActionState(submitBooking, initial);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(defaultCategory ?? "");
  const [avail, setAvail] = useState<AvailabilityResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", meetingFormat: formats.length === 1 ? formats[0]! : "", reason: "", consent: false });
  const [stepError, setStepError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const userTz = useMemo(localZone, []);
  const e = state.fieldErrors ?? {};

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/availability", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as AvailabilityResponse;
      setAvail(data);
      const first = data.days.find((d) => d.slots.length > 0);
      setMonth((m) => m ?? (first ?? data.days[0])?.date.slice(0, 7) ?? null);
    } catch {
      setLoadError("Availability could not be loaded. Please try again, or send us an inquiry instead.");
    }
  }, []);

  useEffect(() => { setStartedAt(pageStartedAt()); void load(); }, [load]);

  // Server reported a problem: go back to the relevant step and refresh slots if needed.
  useEffect(() => {
    if (state.status === "success") { resultRef.current?.focus(); return; }
    if (state.status !== "error") return;
    if (e.category) setStep(0);
    else if (e.start) { setSlot(null); setStep(1); void load(); }
    else if (e.name || e.email || e.phone || e.meetingFormat || e.reason || e.consent) setStep(2);
    headingRef.current?.focus();
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const dayMap = useMemo(() => new Map(avail?.days.map((d) => [d.date, d]) ?? []), [avail]);
  const months = useMemo(() => Array.from(new Set(avail?.days.map((d) => d.date.slice(0, 7)) ?? [])), [avail]);
  const anyAvailability = avail?.days.some((d) => d.slots.length > 0) ?? false;
  const tz = avail?.timezone ?? "UTC";

  function go(next: number) {
    setStepError(null);
    if (next > step) {
      if (step === 0 && !category) return setStepError("Please choose a consultation type.");
      if (step === 1 && !slot) return setStepError("Please choose a date and an available time.");
      if (step === 2) {
        if (details.name.trim().length < 2) return setStepError("Please enter your full name.");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(details.email.trim())) return setStepError("Please enter a valid email address.");
        if (formats.length > 0 && !details.meetingFormat) return setStepError("Please choose a meeting format.");
        if (details.reason.trim().length < 10) return setStepError("Please give a short reason for the meeting (at least 10 characters).");
        if (!details.consent) return setStepError("Please confirm you have read the privacy notice.");
      }
    }
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  if (state.status === "success" && state.reference && state.booking) {
    const b = state.booking;
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="border border-line bg-white p-8 outline-none md:p-10">
        <p className="eyebrow mb-3">Request received</p>
        <h2 className="text-3xl">Your appointment request has been received</h2>
        <p className="mt-4 text-lg text-ink">
          <strong>This is not yet a confirmed appointment.</strong> The time is held for you while we review the request.
          You will receive a separate confirmation, or a proposal for another time.
        </p>
        <dl className="mt-8 grid gap-x-8 gap-y-4 border-y border-line py-6 sm:grid-cols-2">
          <div><dt className="text-sm text-ink-muted">Reference</dt><dd className="mt-1 font-mono text-lg tracking-wide text-navy">{state.reference}</dd></div>
          <div><dt className="text-sm text-ink-muted">Status</dt><dd className="mt-1 font-semibold">Requested, awaiting confirmation</dd></div>
          <div><dt className="text-sm text-ink-muted">Consultation</dt><dd className="mt-1">{categories.find((c) => c.id === b.category)?.label}</dd></div>
          <div><dt className="text-sm text-ink-muted">Requested time</dt><dd className="mt-1">{fmtInZone(b.start, b.timezone)} <span className="text-ink-muted">({tzLabel(b.timezone)})</span></dd></div>
        </dl>
        <h3 className="mt-6 text-xl">Need to change or cancel?</h3>
        <p className="mt-2 text-ink-muted">
          {cancellationPolicy ?? "Reply to your confirmation email, or send us an inquiry quoting your reference number."}
        </p>
        <Link href="/contact" className="btn-secondary mt-6">Contact us</Link>
      </div>
    );
  }

  const slotDayLabel = slot && date ? `${fmtDateLong(date)} at ${slot.label}` : "";

  return (
    <form
      action={action}
      onSubmit={(ev) => {
        ev.preventDefault();
        if (step !== 3) return;
        const fd = new FormData(ev.currentTarget);
        startTransition(() => action(fd));
      }}
      noValidate
      className="relative"
    >
      <SpamTrap startedAt={startedAt} />
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="start" value={slot?.start ?? ""} />
      <input type="hidden" name="name" value={details.name} />
      <input type="hidden" name="email" value={details.email} />
      <input type="hidden" name="phone" value={details.phone} />
      <input type="hidden" name="meetingFormat" value={formats.length ? details.meetingFormat : "to_be_agreed"} />
      <input type="hidden" name="reason" value={details.reason} />
      {details.consent && <input type="hidden" name="consent" value="on" />}

      {/* Progress */}
      <ol className="mb-10 grid grid-cols-4 gap-2" aria-label="Booking steps">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1 ${i <= step ? "bg-navy" : "bg-line"}`} />
            <span className={`mt-2 block text-xs font-semibold uppercase tracking-wide sm:text-[0.78rem] ${i === step ? "text-navy" : "text-ink-muted"}`}>
              <span className="sr-only">Step {i + 1} of 4: </span>{label}
            </span>
          </li>
        ))}
      </ol>

      <h2 ref={headingRef} tabIndex={-1} className="mb-6 text-2xl outline-none md:text-3xl">
        {["Choose a consultation type", "Choose a date and time", "Your details", "Review your request"][step]}
      </h2>

      <div aria-live="assertive">
        {(stepError || (state.status === "error" && state.message)) && (
          <p role="alert" className="mb-6 border-l-2 border-danger bg-danger/5 px-4 py-3 text-[0.95rem] font-medium text-danger">
            {stepError ?? state.message}
          </p>
        )}
      </div>

      {/* Step 1 */}
      <div hidden={step !== 0}>
        <fieldset>
          <legend className="sr-only">Consultation type</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((c) => (
              <label key={c.id} className={`flex min-h-[64px] cursor-pointer items-center gap-3 border px-5 py-4 transition-colors ${category === c.id ? "border-navy bg-navy/[0.03]" : "border-line hover:border-navy/40"}`}>
                <input type="radio" name="_category" value={c.id} checked={category === c.id} onChange={() => setCategory(c.id)} className="h-5 w-5 accent-navy" />
                <span className="font-medium">{c.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {e.category && <p className="field-error">{e.category}</p>}
      </div>

      {/* Step 2 */}
      <div hidden={step !== 1}>
        {!avail && !loadError && <p className="text-ink-muted" role="status">Loading availability…</p>}
        {loadError && (
          <div className="space-y-3">
            <p className="text-danger" role="alert">{loadError}</p>
            <button type="button" className="btn-secondary" onClick={() => void load()}>Try again</button>
          </div>
        )}
        {avail && !anyAvailability && (
          <div className="border border-line bg-canvas p-6">
            <p className="font-medium">There are no appointment times available online at the moment.</p>
            <p className="mt-2 text-ink-muted">Please <Link href="/contact">send us an inquiry</Link> and we will contact you to arrange a time.</p>
          </div>
        )}
        {avail && anyAvailability && month && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <MonthGrid
              month={month}
              months={months}
              onMonth={setMonth}
              dayMap={dayMap}
              selected={date}
              onSelect={(d) => { setDate(d); setSlot(null); }}
            />
            <div>
              <p className="mb-3 text-sm text-ink-muted">
                Times shown in <strong className="text-ink">{tzLabel(tz)}</strong>.
                {userTz !== tz && <> Your device is set to {tzLabel(userTz)}.</>}
              </p>
              {!date && <p className="border border-dashed border-line p-6 text-ink-muted">Select a highlighted date to see available times.</p>}
              {date && (
                <fieldset>
                  <legend className="mb-3 font-semibold text-navy">{fmtDateLong(date)}</legend>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {(dayMap.get(date)?.slots ?? []).map((s) => (
                      <label key={s.start} className={`flex min-h-[48px] cursor-pointer items-center justify-center border text-[0.95rem] font-medium transition-colors ${slot?.start === s.start ? "border-navy bg-navy text-white" : "border-line hover:border-navy/50"}`}>
                        <input type="radio" name="_slot" value={s.start} className="sr-only" checked={slot?.start === s.start} onChange={() => setSlot(s)} />
                        {s.label}
                        {userTz !== tz && <span className="sr-only"> ({fmtInZone(s.start, userTz)} your time)</span>}
                      </label>
                    ))}
                  </div>
                  {slot && userTz !== tz && (
                    <p className="mt-3 text-sm text-ink-muted">In your timezone: {fmtInZone(slot.start, userTz)}</p>
                  )}
                </fieldset>
              )}
              {e.start && <p className="field-error">{e.start}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Step 3 */}
      <div hidden={step !== 2} className="space-y-6">
        <SensitiveDataWarning />
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Full name" name="_name" required error={e.name}>
            {(p) => <input {...p} className="input" autoComplete="name" maxLength={120} value={details.name} onChange={(ev) => setDetails({ ...details, name: ev.target.value })} />}
          </Field>
          <Field label="Email" name="_email" required error={e.email}>
            {(p) => <input {...p} type="email" className="input" autoComplete="email" maxLength={200} value={details.email} onChange={(ev) => setDetails({ ...details, email: ev.target.value })} />}
          </Field>
          <Field label="Telephone" name="_phone" optional error={e.phone}>
            {(p) => <input {...p} type="tel" className="input" autoComplete="tel" maxLength={40} value={details.phone} onChange={(ev) => setDetails({ ...details, phone: ev.target.value })} />}
          </Field>
          {formats.length > 0 && (
            <Field label="Preferred meeting format" name="_meetingFormat" required error={e.meetingFormat}>
              {(p) => (
                <select {...p} className="input" value={details.meetingFormat} onChange={(ev) => setDetails({ ...details, meetingFormat: ev.target.value })}>
                  <option value="" disabled>Select a format</option>
                  {formats.map((f) => <option key={f} value={f}>{formatLabels[f]}</option>)}
                </select>
              )}
            </Field>
          )}
        </div>
        {formats.length === 0 && <p className="text-sm text-ink-muted">The meeting format (for example in person, video or telephone) will be agreed when we confirm your appointment.</p>}
        <Field label="Reason for the meeting" name="_reason" required hint="A short, non-confidential description. 10 to 1,000 characters." error={e.reason}>
          {(p) => <textarea {...p} className="input" rows={4} maxLength={1000} value={details.reason} onChange={(ev) => setDetails({ ...details, reason: ev.target.value })} />}
        </Field>
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-navy" checked={details.consent} onChange={(ev) => setDetails({ ...details, consent: ev.target.checked })} aria-invalid={e.consent ? true : undefined} />
            <span className="text-[0.95rem]">I have read the <Link href="/privacy" target="_blank">privacy notice</Link> and agree to my information being used to arrange this appointment.</span>
          </label>
          {e.consent && <p className="field-error">{e.consent}</p>}
        </div>
      </div>

      {/* Step 4 */}
      <div hidden={step !== 3}>
        <dl className="divide-y divide-line border-y border-line">
          {[
            ["Consultation", categories.find((c) => c.id === category)?.label ?? "", 0],
            ["Date and time", `${slotDayLabel} (${tzLabel(tz)})`, 1],
            ["Name", details.name, 2],
            ["Email", details.email, 2],
            ["Telephone", details.phone || "Not provided", 2],
            ["Meeting format", formats.length ? formatLabels[details.meetingFormat as Format] ?? "" : "To be agreed", 2],
            ["Reason", details.reason, 2],
          ].map(([k, v, target]) => (
            <div key={k as string} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr_auto] sm:gap-6">
              <dt className="text-sm text-ink-muted">{k}</dt>
              <dd className="whitespace-pre-line break-words">{v}</dd>
              <dd><button type="button" className="text-sm font-semibold text-navy underline" onClick={() => go(target as number)}>Edit<span className="sr-only"> {k}</span></button></dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[0.95rem] text-ink-muted">
          Submitting sends a <strong className="text-ink">request</strong>. Your appointment is confirmed only when you receive our confirmation.
          A booking request does not create an engagement or professional relationship.
        </p>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        {step > 0 ? <button type="button" onClick={() => go(step - 1)} className="btn-secondary">Back</button> : <span />}
        {/* Distinct keys: React must replace (not mutate) the button, otherwise the click that
            reaches the review step is treated by the browser as a click on the new submit button. */}
        {step < 3 ? (
          <button key="continue" type="button" onClick={() => go(step + 1)} className="btn-primary min-w-[180px]" disabled={step === 1 && !!avail && !anyAvailability}>Continue</button>
        ) : (
          <button key="submit" type="submit" disabled={pending} className="btn-primary min-w-[220px] disabled:cursor-wait disabled:opacity-70">
            {pending ? "Submitting…" : "Submit Booking Request"}
          </button>
        )}
      </div>
    </form>
  );
}

function MonthGrid({ month, months, onMonth, dayMap, selected, onSelect }: {
  month: string;
  months: string[];
  onMonth: (m: string) => void;
  dayMap: Map<string, Day>;
  selected: string | null;
  onSelect: (d: string) => void;
}) {
  const [y, m] = month.split("-").map(Number) as [number, number];
  const first = new Date(Date.UTC(y, m - 1, 1));
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // Monday-first
  const idx = months.indexOf(month);
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`)];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center border border-line disabled:opacity-30" disabled={idx <= 0} onClick={() => onMonth(months[idx - 1]!)}>
          <span className="sr-only">Previous month</span><span aria-hidden="true">‹</span>
        </button>
        <p className="font-semibold text-navy" aria-live="polite">{fmtMonth(month)}</p>
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center border border-line disabled:opacity-30" disabled={idx >= months.length - 1} onClick={() => onMonth(months[idx + 1]!)}>
          <span className="sr-only">Next month</span><span aria-hidden="true">›</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center" role="group" aria-label={`Dates in ${fmtMonth(month)}`}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d} className="pb-1 text-xs font-semibold uppercase text-ink-muted" aria-hidden="true">{d}</span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const count = dayMap.get(d)?.slots.length ?? 0;
          const isSel = selected === d;
          return (
            <button
              key={d}
              type="button"
              disabled={count === 0}
              aria-pressed={isSel}
              aria-label={`${fmtDateLong(d)}, ${count === 0 ? "no availability" : `${count} time${count === 1 ? "" : "s"} available`}`}
              onClick={() => onSelect(d)}
              className={`relative flex aspect-square min-h-[40px] items-center justify-center text-[0.95rem] transition-colors ${
                isSel ? "bg-navy text-white" : count > 0 ? "border border-navy/25 font-semibold text-navy hover:border-navy" : "text-ink-muted/50"
              }`}
            >
              {Number(d.slice(8))}
              {count > 0 && !isSel && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-bronze-soft" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-ink-muted">Dates with a dot have available times.</p>
    </div>
  );
}
