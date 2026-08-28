import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasProSubscription } from "@/lib/pro";
import { createElement } from "react";
import type { ReactElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { FullPackPdfDocument } from "./FullPackPdfDocument";
import { getSpokeData } from "@/app/event-pack/[slug]/_hub-and-spoke/_lib/getSpokeData";
import { PDF_CONTENT_BY_EVENT } from "./pdfContentRegistry";
import { INTRO_BY_EVENT, QUICK_REFERENCE_BY_EVENT } from "@/app/event-pack/[slug]/_hub-and-spoke/HubPage";
import { TRAVEL_BRIEF_GENERIC_SECTION_BUILDERS } from "./travelBriefGenericSectionBuilders";

// Travel Brief PDF — build-pro-pdf skill Part B. A genuinely shorter,
// lighter document than Full Pack (target under 5 pages; Full Pack ran
// ~30), NOT a trimmed re-label of it. Real scope, corrected 28 Aug 2026:
//   - Hub section (venue intro + Quick Reference + Pre-Trip Brief)
//   - Exactly 3 spokes: Getting There, Weather, Arrival
//   - Cost and Tickets are deliberately EXCLUDED — not for length, but
//     because a Pro subscriber downloading this has already bought their
//     ticket and already knows the price. Cost/ticket-tier comparison
//     content is a pre-purchase decision aid, irrelevant post-purchase.
//     (An earlier version of this route scoped 5 spokes including these
//     two — that was corrected, don't reintroduce them.)
//   - No verdicts (Pro-gated "which X we'd pick" content) for the 3
//     included spokes (moot today — none of the 3 carry a verdicts field
//     on their source spokes anyway, but stays explicit in case that
//     changes)
//   - Experience cards are bare (title/subtitle only) — no Google rating,
//     no whyItsSpecial, no neighborhood. Keeps page count down; do not
//     re-enrich these without being asked.
// The other 9 spokes (Cost, Tickets, Hotels, First-Timer's Guide, Where to
// Eat, Day Trips, Itinerary, Map, Luxury) are absent entirely — not
// stubbed, not summarized.
//
// Reuses FullPackPdfDocument.tsx's section components as-is (same file,
// same props shapes) — only which sections get built, and what's passed
// into them, differs from full/route.ts. See build-pro-pdf skill §8.
//
// Mirrors classic pack's app/api/pack/pdf/route.ts auth/Pro-gate pattern
// exactly — independent server-side re-check, not just a hidden button.
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
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const content = PDF_CONTENT_BY_EVENT[slug];
  const introConfig = INTRO_BY_EVENT[slug];
  if (!content || !introConfig) {
    return NextResponse.json({ error: "No Travel Brief content configured for this event yet" }, { status: 404 });
  }

  const { event, linkedExperiences } = await getSpokeData(slug);

  // --- Hub section (identical construction to full/route.ts) ---
  const quickReference: Array<{ label: string; value: string; href?: string; linkLabel?: string }> = [];
  if (event.venueName && event.venueAddress) {
    quickReference.push({
      label: "Address",
      value: `${event.venueName}, ${event.venueAddress}`,
      href: `https://maps.google.com/?q=${encodeURIComponent(`${event.venueName}, ${event.venueAddress}`)}`,
      linkLabel: "Open in Maps",
    });
  }
  if (event.ticketingUrl) {
    quickReference.push({
      label: "Official ticketing",
      value: new URL(event.ticketingUrl).hostname.replace("www.", ""),
      href: event.ticketingUrl,
      linkLabel: "Visit",
    });
  }
  quickReference.push(...(QUICK_REFERENCE_BY_EVENT[slug] ?? []));

  const hubSection = {
    venueLine: introConfig.venueLine,
    introText: introConfig.introText,
    quickReference,
    preTripBriefLines: event.preTripBriefLines ?? null,
    preTripBriefLiveAt: event.preTripBriefLiveAt ?? null,
    preTripBriefUpdatedAt: event.preTripBriefUpdatedAt ? new Date(event.preTripBriefUpdatedAt) : null,
  };

  // --- Bare experience-card lookup — title/subtitle only, no rating, no
  //     whyItsSpecial, no neighborhood. Deliberately less than Full Pack's
  //     toExpCard — this is what keeps Travel Brief short. ---
  const toBareExpCard = (s: string) => {
    const exp = linkedExperiences.find((e) => e.slug.includes(s));
    if (!exp) return null;
    return {
      title: exp.title,
      subtitle: exp.subtitle,
      whyItsSpecial: null,
      neighborhood: null,
      googleMapsRating: null,
      googleMapsReviewCount: null,
    };
  };
  const lookupBareMany = (slugs: string[]) => slugs.map(toBareExpCard).filter((e): e is NonNullable<typeof e> => Boolean(e));

  // --- Getting There / Weather / Arrival — Wimbledon reuses the typed
  //     Full Pack section components directly; every other event's content
  //     shape doesn't match those field names (see full/route.ts's same
  //     split) so it goes through a per-event generic-block builder
  //     instead (see travelBriefGenericSectionBuilders.ts), using the bare
  //     (title/subtitle-only) card lookup. ---
  let gettingThereSection = null;
  let weatherSection = null;
  let arrivalSection = null;

  if (slug === "wimbledon") {
    gettingThereSection = content.gettingThere
      ? { ...content.gettingThere, experiences: lookupBareMany(["traveling-to-the-all-england-club"]), sectionLabel: "Section 1 of 3" }
      : null;
    weatherSection = content.weather
      ? { ...content.weather, experiences: lookupBareMany(["wimbledon-when-it-rains"]), sectionLabel: "Section 2 of 3" }
      : null;
    arrivalSection = content.arrival
      ? { ...content.arrival, experiences: lookupBareMany(["the-wimbledon-queue"]), sectionLabel: "Section 3 of 3" }
      : null;
  }

  const travelBriefBuilder = TRAVEL_BRIEF_GENERIC_SECTION_BUILDERS[slug];
  const genericSections = travelBriefBuilder ? travelBriefBuilder(content, lookupBareMany) : undefined;

  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const docElement = createElement(FullPackPdfDocument, {
    eventName: event.name,
    dateStr,
    userEmail: user.email,
    hub: hubSection,
    cost: null,
    tickets: null,
    hotels: null,
    gettingThere: gettingThereSection,
    weather: weatherSection,
    firstTimerGuide: null,
    whereToEat: null,
    dayTrips: null,
    itinerary: null,
    arrival: arrivalSection,
    map: null,
    luxury: null,
    genericSections,
    documentLabel: "Travel Brief",
    hideBuildingOutNote: true,
  }) as ReactElement<DocumentProps>;

  const buffer = await renderToBuffer(docElement);

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}-travel-brief.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
