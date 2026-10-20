import { NextResponse, type NextRequest } from "next/server";
import { site } from "@/content/site";
import { getAvailability, todayInBusinessTz } from "@/lib/booking/availability";
import { rateLimit } from "@/lib/rate-limit";
import { storeAvailable } from "@/lib/store";

export const dynamic = "force-dynamic";

/** GET /api/availability — bookable slots from today up to the booking horizon. */
export async function GET(_req: NextRequest) {
  if (!(await rateLimit("availability", 60, 60_000))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  if (!storeAvailable()) {
    return NextResponse.json({ error: "Booking is not available yet" }, { status: 503 });
  }
  try {
    const from = todayInBusinessTz();
    const days = await getAvailability(from, site.booking.maxDaysAhead + 1);
    return NextResponse.json(
      { timezone: site.booking.timezone, slotMinutes: site.booking.slotMinutes, days },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Availability could not be loaded" }, { status: 500 });
  }
}
