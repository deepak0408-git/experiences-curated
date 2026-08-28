import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasProSubscription } from "@/lib/pro";
import { createElement } from "react";
import type { ReactElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { SpokePdfDocument } from "./SpokePdfDocument";
import { wimbledonCostSpokeContent } from "./wimbledonCostContent";
import { getSpokeData } from "@/app/event-pack/[slug]/_hub-and-spoke/_lib/getSpokeData";

// PILOT ONLY — proof of concept for one event (Wimbledon), one spoke
// (Cost), to validate the "reuse getSpokeData(), don't refactor the
// spoke files" approach for the hub-and-spoke "Take it offline" PDF
// feature before committing to the full 7-event x 12-spoke build-out.
// Hardcoded to "wimbledon" + Cost spoke content — not a general-purpose
// route. Mirrors app/api/pack/pdf/route.ts's auth/Pro-gate pattern
// exactly (independent server-side re-check, not just a hidden button).
const TRIP_NIGHTS = 4;
const EUROPE_RANGE_EXCLUDED_ORIGINS = ["London", "Barcelona", "Amsterdam", "Zurich", "Moscow"];

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  let user: { email?: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Stale/invalid refresh token — treat exactly like "not signed in"
  }
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const isPro = await hasProSubscription(user.email);
  if (!isPro) {
    return NextResponse.json({ error: "Pro required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") ?? "brief";
  const isBrief = mode === "brief";

  const { event, hotels, tickets, destinationBand, flights } = await getSpokeData("wimbledon");

  const budgetHotel = hotels.find((h) => h.tier === "budget");
  const moderateHotel = hotels.find((h) => h.tier === "moderate");
  const splurgeHotel = hotels.find((h) => h.tier === "splurge");
  const luxuryHotel = hotels.find((h) => h.tier === "luxury");

  const tier1Ticket = tickets.find((t) => t.tier === "tier1");
  const tier2Ticket = tickets.find((t) => t.tier === "tier2");
  const tier3Ticket = tickets.find((t) => t.tier === "tier3");
  const tier4Ticket = tickets.find((t) => t.tier === "tier4");

  const tripTotal = (hotel: typeof moderateHotel, ticket: typeof tier2Ticket) => {
    if (!hotel) return null;
    const stayLow = Number(hotel.costLow) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelLow) + Number(destinationBand.foodPerDayLow)) * TRIP_NIGHTS : 0);
    const stayHigh = Number(hotel.costHigh) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0);
    const ticketLow = ticket ? Number(ticket.costLow) : 0;
    const ticketHigh = ticket ? Number(ticket.costHigh) : 0;
    return { low: Math.round(stayLow + ticketLow), high: Math.round(stayHigh + ticketHigh) };
  };

  const moderateTotal = tripTotal(moderateHotel, tier2Ticket);

  const profiles = [
    { label: "Budget", total: tripTotal(budgetHotel, tier1Ticket), hotelNote: "A budget London hotel or SW19 guesthouse", ticketNote: "Grounds Pass" },
    { label: "Moderate", total: tripTotal(moderateHotel, tier2Ticket), hotelNote: "A solid 3-star hotel", ticketNote: "Show Courts ticket" },
    { label: "Splurge", total: tripTotal(splurgeHotel, tier3Ticket), hotelNote: "A 4-star hotel", ticketNote: "Centre Court ticket" },
    { label: "Luxury", total: tripTotal(luxuryHotel, tier4Ticket), hotelNote: "London's top hotels", ticketNote: "The Lawn hospitality" },
  ].filter((p) => p.total !== null || [budgetHotel, moderateHotel, splurgeHotel, luxuryHotel].some(Boolean));

  const categoryRows = [
    tier2Ticket && { label: "Ticket (Show Courts)", low: Number(tier2Ticket.costLow), high: Number(tier2Ticket.costHigh), unit: "one day" },
    moderateHotel && { label: "Hotel", low: Number(moderateHotel.costLow) * TRIP_NIGHTS, high: Number(moderateHotel.costHigh) * TRIP_NIGHTS, unit: `for ${TRIP_NIGHTS} nights` },
    destinationBand && { label: "Local travel", low: Number(destinationBand.localTravelLow) * TRIP_NIGHTS, high: Number(destinationBand.localTravelHigh) * TRIP_NIGHTS, unit: `for ${TRIP_NIGHTS} days` },
    destinationBand && { label: "Food", low: Number(destinationBand.foodPerDayLow) * TRIP_NIGHTS, high: Number(destinationBand.foodPerDayHigh) * TRIP_NIGHTS, unit: `for ${TRIP_NIGHTS} days` },
  ].filter((r): r is { label: string; low: number; high: number; unit: string } => Boolean(r));

  const europeFlights = flights.filter((f) => f.region === "Europe" && !EUROPE_RANGE_EXCLUDED_ORIGINS.includes(f.originMarket));
  const flightRange = europeFlights.length
    ? { low: Math.min(...europeFlights.map((f) => Number(f.costLow))), high: Math.max(...europeFlights.map((f) => Number(f.costHigh))) }
    : null;

  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const docElement = createElement(SpokePdfDocument, {
    eventName: "Wimbledon",
    dateStr,
    userEmail: user.email,
    isBrief,
    intro: wimbledonCostSpokeContent.intro,
    moderateTotal,
    tripNights: TRIP_NIGHTS,
    profiles,
    categoryRows,
    bookingTimingTrap: wimbledonCostSpokeContent.bookingTimingTrap,
    flightRange,
    flightsNote: wimbledonCostSpokeContent.flightsNote,
    crossLinks: wimbledonCostSpokeContent.crossLinks,
    verdicts: wimbledonCostSpokeContent.verdicts,
  }) as ReactElement<DocumentProps>;

  const buffer = await renderToBuffer(docElement);

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="wimbledon-cost-guide-${mode}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
