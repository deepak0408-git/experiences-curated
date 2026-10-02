import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import { getSpokesForEvent, type SpokeStatus } from "../_lib/getSpokeData";
import { getPackPricing } from "../_lib/packPricing";
import DodoCheckout from "../../_components/DodoCheckout";
import LocalCurrencyHint from "../../_components/LocalCurrencyHint";
import SpokeActionSidebar from "./SpokeActionSidebar";
import { hasTicketIntelligence } from "../../../../ticket-intelligence/[slug]/_lib/getSeatingData";

// Spokes where "Find the best seat" earns its place in the sidebar — the
// fan is already thinking about cost/tickets/hospitality on these three,
// unlike e.g. Where to Eat or Day Trips. Founder direction, 30 Sep 2026:
// roll out to Cost/Tickets/Luxury only, every F1 event (sport-only gate,
// same as the experience-page sidebar's showTicketIntelligenceLink — see
// that file's comment for why this isn't per-experience/per-spoke content
// filtered yet).
const TICKET_INTELLIGENCE_SPOKE_IDS = new Set(["cost", "tickets", "luxury"]);

// Shared shell for every spoke page — slug-driven so it works for any
// hub_and_spoke event, not just one. Structure copied from the pilot;
// href/breadcrumb now derived from eventSlug + SPOKES_BY_EVENT lookup.
// eventId/eventCurrency are required for real checkout and currency
// conversion — every spoke already has them from its own getSpokeData()
// call, so they're passed as props here rather than re-querying the DB a
// second time just for these two fields. spokeId lets checkout redirect
// back to the SAME spoke it was initiated from, instead of always
// bouncing to the hub — fixed 1 Aug 2026, previously every spoke's
// successUrl pointed at /event-pack/${eventSlug} regardless of origin.
export default async function SpokeShell({
  eventSlug,
  eventId,
  eventName,
  eventCurrency,
  eventSport,
  spokeId,
  status,
  h1,
  question,
  ctaCopy,
  heroImageUrl,
  heroImagePosition,
  isUnlocked = false,
  justPurchased = false,
  justPurchasedProductType = "full_pack",
  miniPackOption,
  children,
}: {
  eventSlug: string;
  eventId: string;
  eventName: string;
  eventCurrency: string | null;
  // DB sport enum (e.g. "formula_one") — passed through from each spoke's
  // own getSpokeData() call, same pattern as eventId/eventCurrency (see
  // comment above), for the sidebar's "See upcoming X events" link.
  eventSport?: string | null;
  spokeId: string;
  status: SpokeStatus;
  h1: string;
  question: string;
  ctaCopy?: string;
  heroImageUrl?: string | null;
  heroImagePosition?: string;
  isUnlocked?: boolean;
  justPurchased?: boolean;
  // Mini-packs pilot — see MINI_PACK_LABEL_BY_PRODUCT_TYPE below. Defaults
  // to "full_pack" so every spoke that doesn't pass this explicitly (i.e.
  // every spoke without a mini-pack) keeps the original "whole pack
  // unlocked" banner copy.
  justPurchasedProductType?: string;
  // Mini-packs pilot (Bahrain GP / Singapore GP / Shanghai Masters, Sep
  // 2026) — only passed by the 3 piloted spokes (Tickets/Hotels/Itinerary).
  // Renders a second, cheaper buy option alongside the full-pack CTA below.
  // `owned` suppresses the mini-pack CTA once that specific product is
  // already purchased (the full-pack CTA still shows unless isUnlocked).
  miniPackOption?: { dodoProductId: string; priceDisplay: string; label: string; productType: "tickets_guide" | "hotels_guide" | "itinerary_guide"; owned: boolean };
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const spokes = getSpokesForEvent(eventSlug);
  const pricing = await getPackPricing(eventSlug, eventCurrency);

  // "Next spoke" navigation — added 15 Aug 2026 per direct UX feedback.
  // Follows SPOKES_BY_EVENT's own declared array order (already a
  // deliberate sequence — cost, tickets, hotels, getting-there, weather,
  // first-timer-guide, where-to-eat, day-trips, itinerary, arrival, map,
  // luxury), wrapping from the last spoke (luxury) back to the first
  // (cost). No separate order constant needed — the array order IS the
  // order, for every hub-and-spoke event, not just Wimbledon.
  const currentIdx = spokes.findIndex((s) => s.id === spokeId);
  const nextSpoke = currentIdx === -1 ? null : spokes[(currentIdx + 1) % spokes.length];

  const showTicketIntelligence =
    TICKET_INTELLIGENCE_SPOKE_IDS.has(spokeId) && (await hasTicketIntelligence(eventId));

  // Full-gate pilot (Bahrain GP, 29 Sep 2026) — env-var-driven so it can be
  // reverted with zero code change, just by clearing FULLY_GATED_EVENTS.
  // Comma-separated slugs, same format convention as FREE_EVENT_SLUGS. When
  // a spoke's eventSlug is listed here, its entire children body is hidden
  // (not just the closing CTA block) until isUnlocked — full pack or a
  // spoke's own mini-pack. Business reason: 3 months of free teaser content
  // across every hub-and-spoke event produced zero pack purchases; founder
  // wants zero free content on Bahrain GP specifically, 3 days out from the
  // race. Blank/unset env var → isFullyGated is always false → every
  // existing event (including Bahrain GP's own status="public"/"teaser"
  // split) renders exactly as it did before this change — this variable is
  // the ONLY thing that can alter behavior, spokeConfig.ts status values are
  // untouched.
  const fullyGatedEvents = (process.env.FULLY_GATED_EVENTS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isFullyGated = fullyGatedEvents.includes(eventSlug);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />

      {heroImageUrl && (
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden bg-[#0A0A0A]">
          <Image
            src={heroImageUrl}
            alt=""
            fill
            className="object-cover opacity-90"
            style={heroImagePosition ? { objectPosition: heroImagePosition } : undefined}
            sizes="100vw"
            priority
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-12">
        <nav className="flex items-center justify-between gap-2 text-xs text-[#6A6A6A] mb-6">
          <Link href={`/event-pack/${eventSlug}`} className="text-[#AAFF00] hover:text-[#BBFF33] transition-colors">
            ← All {spokes.length} {eventName} planning guides
          </Link>
          {nextSpoke && (
            <Link href={`/event-pack/${eventSlug}/${nextSpoke.id}`} className="text-[#AAFF00] hover:text-[#BBFF33] transition-colors">
              Next: {nextSpoke.label} →
            </Link>
          )}
        </nav>

        {/* Status badge + title/subtitle kept OUTSIDE the reordering grid
            below so they always render first on every screen size. Mobile
            order is Title/Subtitle → Sidebar → rest of the spoke content
            (founder request, 28 Sep 2026 — same fix already applied to the
            experience template and Price Radar). */}
        <div className="max-w-3xl">
        <div className="mb-2">
          {isUnlocked ? (
            <span className="inline-block text-[10px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm bg-black/30 text-[#AAFF00] border-[#AAFF00]/50">
              ✓ Unlocked — you own this pack
            </span>
          ) : (
            <StatusBadge status={status} isFullyGated={isFullyGated} miniPackPriceDisplay={miniPackOption && !miniPackOption.owned ? miniPackOption.priceDisplay : undefined} />
          )}
        </div>
        {/* h1 is the literal search-style question — best SEO signal for
            how a visitor actually phrases this in Google. The shorter
            editorial phrase (the `h1` prop, historically the visible
            heading before this swap) now renders as a secondary h2 line
            underneath. Swapped 29 Jul 2026 per explicit user SEO
            direction — do not revert without re-confirming. */}
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">{question}</h1>
        <h2 className="text-sm text-[#6A6A6A] font-semibold mb-8">{h1}</h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start mt-8 lg:mt-0">
        <article className="max-w-3xl order-2 lg:order-1">

        {/* One-time celebratory banner — justPurchased is derived server-side
            from the real purchases.createdAt timestamp (see
            getPurchaseStatus), never from a client-controlled query param.
            A ?purchased=1-style flag would be trivially fakeable by hand-
            editing the URL; this can't be, since it's checked against our
            own DB write.

            Mini-packs pilot — copy now branches on justPurchasedProductType
            instead of always claiming the whole event pack is unlocked.
            Same fix as HubPage.tsx's banner, caught live by the founder,
            15 Sep 2026. */}
        {justPurchased && (
          <div className="mb-6 rounded-sm border border-[#AAFF00]/40 bg-[#AAFF00]/10 px-5 py-4">
            {justPurchasedProductType === "full_pack" ? (
              <>
                <p className="text-sm font-black text-[#AAFF00]">🎉 You&apos;re in — {eventName} is unlocked</p>
                <p className="text-xs text-[#A3A3A3] mt-1">Every guide in this pack now shows our full curated picks and booking detail.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-black text-[#AAFF00]">
                  🎉 You&apos;re in — {MINI_PACK_LABEL_BY_PRODUCT_TYPE[justPurchasedProductType] ?? "your guide"} is unlocked
                </p>
                <p className="text-xs text-[#A3A3A3] mt-1">
                  This guide now shows {MINI_PACK_UNLOCK_DESCRIPTION_BY_PRODUCT_TYPE[justPurchasedProductType] ?? "our full curated picks and booking detail"}. Every other guide stays as it was —
                  get the full Event Pack for everything at once.
                </p>
              </>
            )}
          </div>
        )}

        {(!isFullyGated || isUnlocked) && children}

        {(status === "teaser" || isFullyGated) && !isUnlocked && (
          <div className="mt-10 rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-6">
            {/* Mini-packs pilot — when this spoke has its own mini-pack
                (Tickets/Hotels/Itinerary on the 3 piloted events) and the
                buyer doesn't already own it, THAT becomes the primary CTA,
                not the full pack. Reasoning per founder direction, 15 Sep
                2026: a visitor landing on e.g. the Tickets spoke came here
                wanting the Tickets Guide specifically — that should be the
                first, most prominent offer, with the full pack demoted to
                a secondary "or get everything" nudge underneath. Every
                other spoke (no miniPackOption) keeps the original
                full-pack-is-primary layout unchanged. */}
            {miniPackOption && !miniPackOption.owned && !pricing?.freeAccessEnabled ? (
              <>
                <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Get the {miniPackOption.label}</p>
                <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
                  {(isFullyGated ? undefined : ctaCopy) ?? DEFAULT_CTA_COPY_BY_SPOKE[spokeId] ?? `Unlock the full ${miniPackOption.label.toLowerCase()} — our actual verdict and the tactical detail.`}
                </p>
                <p className="text-2xl font-black text-white mb-4">
                  {miniPackOption.priceDisplay}
                  <LocalCurrencyHint baseAmount={parseFloat(miniPackOption.priceDisplay.replace(/[^0-9.]/g, ""))} baseCurrency={pricing?.currency ?? "USD"} />
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {miniPackOption.dodoProductId ? (
                    <DodoCheckout
                      productId={miniPackOption.dodoProductId}
                      sportingEventId={eventId}
                      eventSlug={eventSlug}
                      eventName={eventName}
                      priceTier="standard"
                      productType={miniPackOption.productType}
                      successUrl={user?.email
                        ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${eventSlug}/${spokeId}`
                        : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${eventSlug}/welcome?spoke=${spokeId}`}
                      buttonClassName="inline-flex items-center px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                      label={`Buy ${miniPackOption.label} →`}
                    />
                  ) : (
                    <span className="text-xs text-[#6A6A6A]">Checkout coming soon.</span>
                  )}
                </div>

                {/* Secondary nudge — full pack as the "get everything"
                    upgrade, in case it's the more economical choice for
                    someone who wants more than just this one guide. */}
                <div className="mt-4 pt-4 border-t border-[#AAFF00]/20 flex items-center justify-between gap-3">
                  <p className="text-xs text-[#A3A3A3]">
                    Or get every guide in the{" "}
                    {pricing ? (
                      <>
                        Event Pack —{" "}
                        <span className="text-white font-bold">
                          {pricing.priceDisplay}
                          <LocalCurrencyHint baseAmount={parseFloat(pricing.priceDisplay.replace(/[^0-9.]/g, ""))} baseCurrency={pricing.currency} />
                        </span>
                      </>
                    ) : (
                      "Event Pack"
                    )}
                  </p>
                  {pricing?.dodoProductId ? (
                    <DodoCheckout
                      productId={pricing.dodoProductId}
                      sportingEventId={eventId}
                      eventSlug={eventSlug}
                      eventName={eventName}
                      priceTier={pricing.isEarlyBird ? "early_bird" : "standard"}
                      successUrl={user?.email
                        ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${eventSlug}/${spokeId}`
                        : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${eventSlug}/welcome?spoke=${spokeId}`}
                      buttonClassName="flex-shrink-0 inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00]/50 text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00]/10 transition-colors"
                      label="Get the Guide"
                    />
                  ) : (
                    <Link
                      href={`/event-pack/${eventSlug}`}
                      className="flex-shrink-0 inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00]/50 text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00]/10 transition-colors"
                    >
                      Get the Guide
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Get the full picture</p>
                <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
                  {(isFullyGated ? undefined : ctaCopy) ?? DEFAULT_CTA_COPY_BY_SPOKE[spokeId] ?? "The Event Pack adds our single curated recommendation and the tactical detail — booking lead times, contacts, and which option is actually worth it."}
                </p>
                {pricing?.freeAccessEnabled ? (
                  <>
                    <p className="text-2xl font-black text-white mb-1">Free</p>
                    <p className="text-xs text-[#6A6A6A] mb-4">Free access, no card needed</p>
                  </>
                ) : (
                  pricing && (
                    <p className="text-2xl font-black text-white mb-4">
                      {pricing.priceDisplay}
                      <LocalCurrencyHint baseAmount={parseFloat(pricing.priceDisplay.replace(/[^0-9.]/g, ""))} baseCurrency={pricing.currency} />
                      {pricing.isEarlyBird && pricing.earlyBirdDisplay !== pricing.standardDisplay && (
                        <span className="block text-xs font-normal text-[#6A6A6A] mt-0.5">
                          Rises to {pricing.standardDisplay} after{" "}
                          {new Date(pricing.earlyBirdCutoff).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                        </span>
                      )}
                    </p>
                  )
                )}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Free-event branch mirrors the classic pack's exact markup
                      (page.tsx ~line 742) — a real "Sign in for free access"
                      CTA, not a no-button dead end. Anonymous visitors still
                      need to sign in to actually get free access
                      (grantFreeAccess only runs for a logged-in user). */}
                  {pricing?.freeAccessEnabled ? (
                    <Link
                      href={`/sign-in?next=/event-pack/${eventSlug}/${spokeId}`}
                      className="inline-flex items-center px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                    >
                      Sign in for free access
                    </Link>
                  ) : pricing?.dodoProductId ? (
                    <DodoCheckout
                      productId={pricing.dodoProductId}
                      sportingEventId={eventId}
                      eventSlug={eventSlug}
                      eventName={eventName}
                      priceTier={pricing.isEarlyBird ? "early_bird" : "standard"}
                      successUrl={user?.email
                        ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${eventSlug}/${spokeId}`
                        : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${eventSlug}/welcome?spoke=${spokeId}`}
                      buttonClassName="inline-flex items-center px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                      label="Get the Guide →"
                    />
                  ) : (
                    <Link
                      href={`/event-pack/${eventSlug}`}
                      className="inline-flex items-center px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                    >
                      Get the Guide →
                    </Link>
                  )}
                </div>

                {/* Mini-packs pilot — this branch is reached when
                    miniPackOption is present but already owned (the
                    full-pack CTA above still shows, since owning the
                    mini-pack alone doesn't grant the full pack), or when
                    it's a free event (mini-packs never apply to a free
                    event). */}
                {miniPackOption && miniPackOption.owned && (
                  <div className="mt-4 pt-4 border-t border-[#AAFF00]/20">
                    <p className="text-xs text-[#AAFF00] font-black">✓ You already have the {miniPackOption.label}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        </article>

        <div className="order-1 lg:order-2 lg:sticky lg:top-8 lg:mt-6">
          <SpokeActionSidebar
            eventSlug={eventSlug}
            showTicketIntelligence={showTicketIntelligence}
            sport={eventSport ?? undefined}
            spokeId={spokeId}
            spokeLabel={spokes.find((s) => s.id === spokeId)?.label}
          />
        </div>
        </div>

        {/* Bottom back-link — mirrors the one at the top so a reader who
            finishes the page doesn't have to scroll all the way back up
            just to return to the hub. Added 4 Aug 2026 per direct UX
            feedback. Right-aligned "Next spoke" link added 15 Aug 2026,
            same reasoning — a reader who reaches the bottom shouldn't have
            to scroll up to see where to go next either. */}
        <nav className="flex items-center justify-between gap-2 text-xs text-[#6A6A6A] mt-12 pt-6 border-t border-[#2A2A2A]">
          <Link href={`/event-pack/${eventSlug}`} className="text-[#AAFF00] hover:text-[#BBFF33] transition-colors">
            ← All {spokes.length} {eventName} planning guides
          </Link>
          {nextSpoke && (
            <Link href={`/event-pack/${eventSlug}/${nextSpoke.id}`} className="text-[#AAFF00] hover:text-[#BBFF33] transition-colors">
              Next: {nextSpoke.label} →
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}

export const STATUS_LABEL: Record<SpokeStatus, string> = {
  public: "Free",
  teaser: "Free · Pack unlocks more",
  gated: "Pack exclusive",
};

// Full-gate pilot (Bahrain GP, 29 Sep 2026) — venue/city-agnostic CTA copy
// per spoke id. Used two ways: (1) as the ctaCopy fallback for any spoke
// without its own prop set, same as before; (2) as the FORCED copy for
// every spoke whenever isFullyGated is true, overriding that spoke's own
// ctaCopy entirely (see the isFullyGated ? undefined : ctaCopy check at
// both call sites below). This second behavior is deliberate, not a bug:
// per-spoke ctaCopy strings are written assuming partial-teaser gating
// (some free content visible above the CTA — "above", "named above",
// "free above", etc.) and go stale/wrong the instant that spoke's content
// is fully hidden. Rather than auditing every spoke file's copy before
// adding a new event to FULLY_GATED_EVENTS, full-gate mode always uses
// this map, which is written to never assume anything is visible above
// it. This makes adding a slug to FULLY_GATED_EVENTS a genuinely
// zero-review operation — no per-event or per-spoke copy check required,
// ever. Founder-approved copy, 29 Sep 2026 — do not add place names, hotel
// names, or other event-specific facts here; that's what breaks the
// zero-review guarantee (see feedback_bahrain_gp_full_gate memory).
export const DEFAULT_CTA_COPY_BY_SPOKE: Record<string, string> = {
  cost: "The Event Pack unlocks the full cost breakdown including flights, hotels, tickets, food and local transport. In addition, it provides our pick for hotel area and ticket tier for your budget, plus the booking-timing detail that matters most.",
  tickets: "Buy the Ticket Guide alone, or the full Event Pack, to unlock which seat we'd actually pick, real pricing for every tier, and the buying detail that matters.",
  hotels: "Buy the Where to Stay Guide alone, or the full Event Pack, to unlock the per-hotel breakdown, booking links, and which base we'd actually pick for your priorities.",
  "getting-there": "The Event Pack unlocks our full transport breakdown — train, shuttle, and driving detail for getting to and from the venue.",
  weather: "The Event Pack unlocks our real packing list and stand-specific advice for staying comfortable through the full event.",
  "first-timer-guide": "The Event Pack unlocks our full first-timer orientation — what actually surprises visitors, and how to avoid the common mistakes.",
  "where-to-eat": "The Event Pack unlocks our real picks for where to eat, which specific dishes to order and why, and the full guide to each venue.",
  "day-trips": "The Event Pack unlocks our real day-trip picks, the detail on each one, which one we'd pick for your free day, and how to fit it around the event.",
  itinerary: "Buy the Itinerary Guide alone, or the full Event Pack, to unlock the full hour-by-hour itinerary, sequenced against real transit times and opening hours.",
  arrival: "The Event Pack unlocks our stand-by-stand arrival strategy, gate and queue timing, and which entrance to use.",
  map: "The Event Pack unlocks our full venue breakdown — where the facilities actually are.",
  luxury: "The Event Pack unlocks the full luxury breakdown — real contacts, prices, and the booking timeline for the best hospitality options.",
};

// Mini-packs pilot — product-type-keyed label for "you're in" banners, so
// they can name the specific guide a mini-pack buyer just bought instead
// of always claiming the whole event pack. Shared between this file's own
// banner and HubPage.tsx's, so the two never drift out of sync.
export const MINI_PACK_LABEL_BY_PRODUCT_TYPE: Record<string, string> = {
  tickets_guide: "the Ticket Guide",
  hotels_guide: "the Where to Stay Guide",
  itinerary_guide: "the Itinerary Guide",
};

// Mini-packs pilot — what each mini-pack banner should say it unlocked, so
// "you're in" copy doesn't wrongly promise "booking detail" for the
// Itinerary Guide, which unlocks the hour-by-hour schedule, not a booking
// action (caught live by the founder, 15 Sep 2026). Tickets/Hotels
// genuinely do unlock buy links/booking contacts, so they keep that phrase.
export const MINI_PACK_UNLOCK_DESCRIPTION_BY_PRODUCT_TYPE: Record<string, string> = {
  tickets_guide: "our full curated picks and booking detail",
  hotels_guide: "our full curated picks and booking detail",
  itinerary_guide: "the full hour-by-hour itinerary",
};

// Mini-packs pilot — miniPackPriceDisplay is passed whenever this spoke has
// its own mini-pack (Tickets/Hotels/Itinerary on the 3 piloted events).
// STATUS_LABEL's "teaser" copy ("Free · Pack unlocks more") is wrong for
// these — whole-spoke gating means they're no longer free at all — so this
// shows the real "Unlock for US$X" price instead, same fix and same
// amber-over-green reasoning as the hub grid tile badge (caught live by
// the founder, 15 Sep 2026 — this top-of-page badge still said "Free"
// after the hub tile version had already been fixed).
function StatusBadge({ status, isFullyGated, miniPackPriceDisplay }: { status: SpokeStatus; isFullyGated?: boolean; miniPackPriceDisplay?: string }) {
  if (miniPackPriceDisplay) {
    return (
      <span className="inline-block text-[10px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm bg-black/30 text-amber-400 border-amber-400/50">
        Unlock for {miniPackPriceDisplay}
      </span>
    );
  }
  // Full-gate pilot — a "Free" or "Free · Pack unlocks more" badge would be
  // actively misleading once the body content itself is hidden behind the
  // paywall, regardless of the spoke's underlying status. isFullyGated is
  // only ever true for an event listed in FULLY_GATED_EVENTS (see SpokeShell
  // above); every other event's badge is untouched.
  if (isFullyGated) {
    return (
      <span className="inline-block text-[10px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm bg-black/30 text-amber-400 border-amber-400/50">
        Pack exclusive
      </span>
    );
  }
  const isTeaser = status === "teaser";
  return (
    <span
      className={`inline-block text-[10px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm bg-black/30 ${
        isTeaser ? "text-[#AAFF00] border-[#AAFF00]/50" : "text-white/70 border-white/20"
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
