import Link from "next/link";
import { bookingCategories } from "@/content/services";
import { enabledMeetingFormats, site } from "@/content/site";
import { PageHero } from "@/components/ui/PageHero";
import { DraftNote } from "@/components/ui/DraftNote";
import { BookingForm } from "@/components/forms/BookingForm";
import { pageMeta } from "@/lib/seo";
import { storeAvailable } from "@/lib/store";

export const metadata = pageMeta({
  title: "Book a Consultation",
  description: "Request an initial consultation on a FIDIC, contract, quantity surveying, claims or procurement matter. Choose a time and we will confirm your appointment.",
  path: "/book",
});

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const categories = bookingCategories();
  const { service } = await searchParams;
  const defaultCategory = categories.some((c) => c.id === service) ? service : undefined;
  const b = site.booking;

  return (
    <>
      <PageHero
        eyebrow="Book a consultation"
        title="Request an initial consultation"
        lede="Choose a consultation type and a time that suits you. We will review your request and confirm the appointment by email."
        crumbs={[{ label: "Book a Consultation", href: "/book" }]}
      />
      <section className="section">
        <div className="container grid gap-14 lg:grid-cols-[1.8fr_1fr]">
          <div>
            {!b.timezoneConfirmed && <DraftNote>business timezone (currently {b.timezone}), slot length, notice period and which meeting formats are offered (content/site.ts). Weekly availability is managed in the admin dashboard.</DraftNote>}
            {storeAvailable() ? (
              <BookingForm categories={categories} defaultCategory={defaultCategory} formats={enabledMeetingFormats()} cancellationPolicy={b.cancellationPolicy} />
            ) : (
              <div className="border border-line bg-canvas p-8">
                <h2 className="text-2xl">Online booking is not available at the moment</h2>
                <p className="mt-3 text-ink-muted">Please <Link href="/contact">send us an inquiry</Link> and we will contact you to arrange a time.</p>
              </div>
            )}
          </div>
          <aside className="space-y-6 text-[0.95rem]">
            <div className="border border-line p-7">
              <h2 className="text-xl">What to expect</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">
                <li>Your chosen time is held as a <strong className="text-ink">request</strong> until we confirm it.</li>
                <li>You will receive a reference number immediately, and an email confirmation once the appointment is accepted.</li>
                <li>Appointments last up to {b.slotMinutes} minutes.</li>
                <li>Please do not send documents in advance unless we ask, and only through the channel we agree.</li>
              </ul>
            </div>
            <div className="border border-line bg-canvas p-7">
              <h2 className="text-xl">Rescheduling and cancellation</h2>
              <p className="mt-3 text-ink-muted">{b.cancellationPolicy ?? "To change or cancel a request, reply to your confirmation email or contact us quoting your reference number."}</p>
              {!b.cancellationPolicy && <DraftNote>cancellation and rescheduling policy (notice period, any fees).</DraftNote>}
            </div>
            <p className="text-ink-muted">Prefer to write first? <Link href="/contact">Send an inquiry</Link>.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
