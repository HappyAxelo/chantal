"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitInquiry, type FormState } from "@/app/actions/public";
import { timeframeLabels, timeframes } from "@/lib/options";
import { Field, pageStartedAt, SensitiveDataWarning, SpamTrap } from "./Field";

const initial: FormState = { status: "idle" };

export function InquiryForm({ categories, defaultService, responseStandard, privacyVersion }: {
  categories: { id: string; label: string }[];
  defaultService?: string;
  responseStandard: string | null;
  privacyVersion: string;
}) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const [startedAt, setStartedAt] = useState(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const e = state.fieldErrors ?? {};

  useEffect(() => setStartedAt(pageStartedAt()), []);
  useEffect(() => {
    if (state.status === "success") statusRef.current?.focus();
    if (state.status === "error") {
      const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      (firstInvalid ?? statusRef.current)?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border border-line bg-white p-8 outline-none md:p-10">
        <p className="eyebrow mb-3">Inquiry received</p>
        <h2 className="text-3xl">Thank you. Your inquiry has been received.</h2>
        <dl className="mt-6 border-y border-line py-4">
          <dt className="text-sm text-ink-muted">Your reference</dt>
          <dd className="mt-1 font-mono text-xl tracking-wide text-navy">{state.reference}</dd>
        </dl>
        <h3 className="mt-6 text-xl">What happens next</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted">
          <li>{responseStandard ?? "We will review your inquiry and contact you using your preferred method."}</li>
          <li>Please keep your reference number for any related correspondence.</li>
          <li>If your matter is time-sensitive, you can also <Link href="/book">request a consultation slot</Link>.</li>
        </ul>
        <p className="mt-6 text-sm text-ink-muted">Submitting an inquiry does not by itself create an engagement or professional relationship.</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={action}
      // With JS, submit in a transition so React does not reset the fields on a validation error.
      onSubmit={(ev) => {
        ev.preventDefault();
        const fd = new FormData(ev.currentTarget);
        startTransition(() => action(fd));
      }}
      noValidate
      className="relative space-y-6"
    >
      <SpamTrap startedAt={startedAt} />
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {state.status === "error" && state.message && (
          <p role="alert" className="border-l-2 border-danger bg-danger/5 px-4 py-3 text-[0.95rem] font-medium text-danger">{state.message}</p>
        )}
      </div>

      <SensitiveDataWarning />

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Full name" name="name" required error={e.name}>
          {(p) => <input {...p} className="input" autoComplete="name" maxLength={120} />}
        </Field>
        <Field label="Organisation" name="organization" optional error={e.organization}>
          {(p) => <input {...p} className="input" autoComplete="organization" maxLength={160} />}
        </Field>
        <Field label="Email" name="email" required error={e.email}>
          {(p) => <input {...p} type="email" className="input" autoComplete="email" maxLength={200} />}
        </Field>
        <Field label="Telephone" name="phone" optional error={e.phone}>
          {(p) => <input {...p} type="tel" className="input" autoComplete="tel" maxLength={40} />}
        </Field>
        <Field label="Service of interest" name="service" required error={e.service}>
          {(p) => (
            <select {...p} className="input" defaultValue={defaultService ?? ""}>
              <option value="" disabled>Select a service</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.label.replace(/ consultation$/, "")}</option>)}
            </select>
          )}
        </Field>
        <Field label="Country or jurisdiction" name="jurisdiction" optional hint="Where the matter or contract is based, if relevant." error={e.jurisdiction}>
          {(p) => <input {...p} className="input" autoComplete="country-name" maxLength={120} />}
        </Field>
        <Field label="Project or contract type" name="projectType" optional hint="For example: road works contract, consultancy agreement, supply tender." error={e.projectType}>
          {(p) => <input {...p} className="input" maxLength={160} />}
        </Field>
        <Field label="Desired timeframe" name="timeframe" required error={e.timeframe}>
          {(p) => (
            <select {...p} className="input" defaultValue="">
              <option value="" disabled>Select a timeframe</option>
              {timeframes.map((t) => <option key={t} value={t}>{timeframeLabels[t]}</option>)}
            </select>
          )}
        </Field>
      </div>

      <Field label="Brief description of your request" name="message" required hint="A short, non-confidential summary is enough. 20 to 3,000 characters." error={e.message}>
        {(p) => <textarea {...p} className="input" rows={6} maxLength={3000} />}
      </Field>

      <fieldset>
        <legend className="field-label">Preferred method of contact</legend>
        <div className="flex flex-wrap gap-6" aria-describedby={e.contactPreference ? "cp-err" : undefined}>
          {[["email", "Email"], ["phone", "Telephone"]].map(([v, l]) => (
            <label key={v} className="inline-flex min-h-[44px] cursor-pointer items-center gap-2.5">
              <input type="radio" name="contactPreference" value={v} defaultChecked={v === "email"} className="h-5 w-5 accent-navy" />
              {l}
            </label>
          ))}
        </div>
        {e.contactPreference && <p id="cp-err" className="field-error">{e.contactPreference}</p>}
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="consent" className="mt-1 h-5 w-5 shrink-0 accent-navy" aria-invalid={e.consent ? true : undefined} aria-describedby={e.consent ? "consent-err" : undefined} />
          <span className="text-[0.95rem]">
            I have read the <Link href="/privacy" target="_blank">privacy notice</Link> and agree to my information being used to respond to this inquiry.
          </span>
        </label>
        {e.consent && <p id="consent-err" className="field-error">{e.consent}</p>}
        <p className="field-hint">Privacy notice version {privacyVersion}.</p>
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">Submitting an inquiry does not create an engagement or professional relationship.</p>
        <button type="submit" disabled={pending} className="btn-primary min-w-[200px] disabled:cursor-wait disabled:opacity-70">
          {pending ? "Sending…" : "Send Inquiry"}
        </button>
      </div>
    </form>
  );
}
