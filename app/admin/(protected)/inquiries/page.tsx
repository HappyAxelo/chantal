import { updateInquiryAction } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { labelForCategory } from "@/lib/email/templates";
import { getStore, type InquiryStatus } from "@/lib/store";
import { inquiryCategories, timeframeLabels } from "@/lib/validation";

const statuses: InquiryStatus[] = ["new", "in_review", "responded", "closed", "spam"];
const statusLabel: Record<InquiryStatus, string> = { new: "New", in_review: "In review", responded: "Responded", closed: "Closed", spam: "Spam" };
const isDate = (v?: string) => (v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const filter = {
    status: statuses.includes(sp.status as InquiryStatus) ? (sp.status as InquiryStatus) : undefined,
    service: (inquiryCategories as readonly string[]).includes(sp.service ?? "") ? sp.service : undefined,
    from: isDate(sp.from),
    to: isDate(sp.to),
  };
  const list = await getStore().listInquiries(filter);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Inquiries</h1>

      <form method="get" className="flex flex-wrap items-end gap-3 border border-line bg-white p-4 text-sm" aria-label="Filter inquiries">
        <label>Status
          <select name="status" defaultValue={filter.status ?? ""} className="input mt-1 min-h-[40px] py-1.5">
            <option value="">All</option>
            {statuses.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
          </select>
        </label>
        <label>Service
          <select name="service" defaultValue={filter.service ?? ""} className="input mt-1 min-h-[40px] py-1.5">
            <option value="">All</option>
            {inquiryCategories.map((c) => <option key={c} value={c}>{labelForCategory(c)}</option>)}
          </select>
        </label>
        <label>From<input type="date" name="from" defaultValue={filter.from} className="input mt-1 min-h-[40px] py-1.5" /></label>
        <label>To<input type="date" name="to" defaultValue={filter.to} className="input mt-1 min-h-[40px] py-1.5" /></label>
        <button type="submit" className="btn-primary min-h-[40px] px-4 text-sm">Filter</button>
        <a href="/admin/inquiries" className="py-2 text-sm">Reset</a>
      </form>

      <p className="text-sm text-ink-muted">{list.length} {list.length === 1 ? "inquiry" : "inquiries"}</p>

      {list.length === 0 ? (
        <div className="border border-dashed border-line bg-white p-10 text-center text-ink-muted">No inquiries match these filters.</div>
      ) : (
        <ul className="space-y-3">
          {list.map((i) => (
            <li key={i.id} className="border border-line bg-white">
              <details className="group">
                <summary className="grid cursor-pointer list-none gap-2 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6">
                  <span className="w-fit rounded-sm border border-line px-2 py-0.5 text-xs font-semibold">{statusLabel[i.status]}</span>
                  <span>
                    <span className="font-semibold">{i.name}</span>
                    {i.organization && <span className="text-ink-muted"> · {i.organization}</span>}
                    <span className="block text-sm text-ink-muted">{labelForCategory(i.service)} · {timeframeLabels[i.timeframe as keyof typeof timeframeLabels] ?? i.timeframe}</span>
                  </span>
                  <span className="text-sm text-ink-muted">
                    <span className="font-mono">{i.reference}</span> · {new Date(i.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </summary>
                <div className="grid gap-6 border-t border-line p-4 lg:grid-cols-[1.5fr_1fr]">
                  <div>
                    <p className="whitespace-pre-line">{i.message}</p>
                    <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                      <dt className="text-ink-muted">Email</dt><dd><a href={`mailto:${i.email}?subject=${encodeURIComponent(`Re: your inquiry ${i.reference}`)}`}>{i.email}</a></dd>
                      {i.phone && (<><dt className="text-ink-muted">Phone</dt><dd>{i.phone}</dd></>)}
                      <dt className="text-ink-muted">Prefers</dt><dd className="capitalize">{i.contactPreference}</dd>
                      {i.jurisdiction && (<><dt className="text-ink-muted">Jurisdiction</dt><dd>{i.jurisdiction}</dd></>)}
                      {i.projectType && (<><dt className="text-ink-muted">Project type</dt><dd>{i.projectType}</dd></>)}
                      <dt className="text-ink-muted">Privacy notice</dt><dd>{i.privacyNoticeVersion}</dd>
                    </dl>
                  </div>
                  <form action={updateInquiryAction} className="space-y-3 text-sm">
                    <input type="hidden" name="id" value={i.id} />
                    <label className="block">Status
                      <select name="status" defaultValue={i.status} className="input mt-1 min-h-[40px] py-1.5">
                        {statuses.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
                      </select>
                    </label>
                    <label className="block">Private notes
                      <textarea name="adminNotes" defaultValue={i.adminNotes ?? ""} rows={3} maxLength={4000} className="input mt-1 min-h-0" />
                    </label>
                    <button type="submit" className="btn-primary min-h-[40px] px-4 text-sm">Save</button>
                  </form>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
