"use client";

import { useActionState, useState } from "react";
import {
  addBlockedAction,
  addRuleAction,
  rescheduleAppointmentAction,
  setAppointmentStatusAction,
  type AdminActionState,
} from "@/app/actions/admin";

/** Submit button that asks for confirmation before running a destructive or client-visible action. */
export function ConfirmButton({ message, children, className = "" }: { message: string; children: React.ReactNode; className?: string }) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!window.confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}

function Feedback({ state }: { state: AdminActionState }) {
  if (state.error) return <p role="alert" className="text-sm font-medium text-danger">{state.error}</p>;
  if (state.ok) return <p role="status" className="text-sm text-success">Saved.</p>;
  return null;
}

const small = "inline-flex min-h-[36px] items-center rounded px-3 text-sm font-semibold";

export function AppointmentActions({ id, status, timezone }: { id: string; status: string; timezone: string }) {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(setAppointmentStatusAction, {});
  const [rState, rAction, rPending] = useActionState<AdminActionState, FormData>(rescheduleAppointmentAction, {});
  const [showReschedule, setShowReschedule] = useState(false);
  const active = status === "pending" || status === "confirmed";

  const statusForm = (value: string, label: string, cls: string, confirmMsg?: string) => (
    <form action={action} key={value}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={value} />
      {confirmMsg ? (
        <ConfirmButton message={confirmMsg} className={`${small} ${cls}`}>{label}</ConfirmButton>
      ) : (
        <button type="submit" className={`${small} ${cls}`}>{label}</button>
      )}
    </form>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" aria-busy={pending}>
        {status === "pending" && statusForm("confirmed", "Approve", "bg-navy text-white", "Confirm this appointment? The client will be emailed.")}
        {active && (
          <button type="button" onClick={() => setShowReschedule((v) => !v)} className={`${small} border border-line text-navy`} aria-expanded={showReschedule}>Reschedule</button>
        )}
        {status === "pending" && statusForm("declined", "Decline", "border border-danger/40 text-danger", "Decline this request? The client will be emailed.")}
        {status === "confirmed" && statusForm("completed", "Mark completed", "border border-line text-ink")}
        {status === "confirmed" && statusForm("cancelled", "Cancel", "border border-danger/40 text-danger", "Cancel this appointment? The client will be emailed.")}
      </div>
      <Feedback state={state} />

      {showReschedule && (
        <form action={rAction} className="flex flex-wrap items-end gap-2 border-t border-line pt-3" aria-busy={rPending}>
          <input type="hidden" name="id" value={id} />
          <label className="text-xs text-ink-muted">Date<input type="date" name="date" required className="input mt-1 min-h-[36px] py-1 text-sm" /></label>
          <label className="text-xs text-ink-muted">Time ({timezone})<input type="time" name="time" required step={900} className="input mt-1 min-h-[36px] py-1 text-sm" /></label>
          <ConfirmButton message="Move this appointment and confirm the new time? The client will be emailed." className={`${small} bg-navy text-white`}>Save new time</ConfirmButton>
          <div className="w-full"><Feedback state={rState} /></div>
        </form>
      )}
    </div>
  );
}

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function RuleForm() {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(addRuleAction, {});
  return (
    <form action={action} className="flex flex-wrap items-end gap-3" aria-busy={pending}>
      <label className="text-sm">Day
        <select name="weekday" className="input mt-1 min-h-[40px] py-1.5" defaultValue="1">
          {weekdays.map((d, i) => <option key={d} value={i}>{d}</option>)}
        </select>
      </label>
      <label className="text-sm">From<input type="time" name="startTime" defaultValue="09:00" required className="input mt-1 min-h-[40px] py-1.5" /></label>
      <label className="text-sm">To<input type="time" name="endTime" defaultValue="17:00" required className="input mt-1 min-h-[40px] py-1.5" /></label>
      <button type="submit" disabled={pending} className="btn-primary min-h-[40px] px-4 text-sm">Add hours</button>
      <div className="w-full"><Feedback state={state} /></div>
    </form>
  );
}

export function BlockedForm() {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(addBlockedAction, {});
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(4,auto)_1fr_auto] lg:items-end" aria-busy={pending}>
      <label className="text-sm">From date<input type="date" name="startDate" required className="input mt-1 min-h-[40px] py-1.5" /></label>
      <label className="text-sm">Time <span className="text-ink-muted">(optional)</span><input type="time" name="startTime" className="input mt-1 min-h-[40px] py-1.5" /></label>
      <label className="text-sm">To date<input type="date" name="endDate" required className="input mt-1 min-h-[40px] py-1.5" /></label>
      <label className="text-sm">Time <span className="text-ink-muted">(optional)</span><input type="time" name="endTime" className="input mt-1 min-h-[40px] py-1.5" /></label>
      <label className="text-sm">Private reason<input type="text" name="reason" maxLength={200} className="input mt-1 min-h-[40px] py-1.5" /></label>
      <button type="submit" disabled={pending} className="btn-primary min-h-[40px] px-4 text-sm">Block</button>
      <div className="sm:col-span-2 lg:col-span-6"><Feedback state={state} /></div>
    </form>
  );
}
