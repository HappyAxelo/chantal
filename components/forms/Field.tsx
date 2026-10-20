import { useId } from "react";

/** Label + control + hint + error wiring with aria-describedby / aria-invalid. */
export function Field({
  label, name, error, hint, required, optional, children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: (props: { id: string; name: string; "aria-invalid"?: true; "aria-describedby"?: string; required?: boolean }) => React.ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-muted">(optional)</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": [hintId, errId].filter(Boolean).join(" ") || undefined,
        required,
      })}
      {hint && <p id={hintId} className="field-hint">{hint}</p>}
      {error && <p id={errId} className="field-error">{error}</p>}
    </div>
  );
}

/**
 * Page navigation start. Used as the form "start" time because a visitor may begin
 * typing into server-rendered fields before hydration; a mount timestamp would then be
 * too recent and flag a genuine submission as automated.
 */
export function pageStartedAt(): number {
  return Math.round(performance.timeOrigin);
}

/** Hidden anti-spam fields: honeypot + form start time. */
export function SpamTrap({ startedAt }: { startedAt: number }) {
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name="startedAt" value={startedAt || ""} />
    </>
  );
}

export function SensitiveDataWarning() {
  return (
    <div className="flex gap-3 border-l-2 border-bronze-soft bg-canvas px-4 py-3 text-[0.92rem] text-ink" role="note">
      <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-bronze" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 3 5 6v5.5c0 4.4 3 7.9 7 9.5 4-1.6 7-5.1 7-9.5V6z" /><path d="M12 9v4M12 16h.01" />
      </svg>
      <p>
        Please do not submit confidential documents, identification documents, passwords, financial account details, or other
        sensitive information through this form.
      </p>
    </div>
  );
}
