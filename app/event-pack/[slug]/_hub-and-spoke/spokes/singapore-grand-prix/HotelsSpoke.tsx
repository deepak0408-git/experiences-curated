import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isSpokeUnlocked } from "../../_lib/getSpokeData";
import { getMiniPackPricing } from "@/lib/packPricing";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, justPurchasedProductType, isPro, purchasedProductTypes } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = isSpokeUnlocked(SPOKE_ID, { hasPurchased, purchasedProductTypes });
  const miniPack = getMiniPackPricing(eventSlug)?.hotels;
  const miniPackOption = miniPack
    ? { ...miniPack, productType: "hotels_guide" as const, owned: purchasedProductTypes.has("hotels_guide") }
    : undefined;
  const trackHotels = linkedExperiences.find((e) => e.slug.includes("singapore-gp-trackside-hotels"));
  const clarkeQuay = linkedExperiences.find((e) => e.slug.includes("singapore-gp-clarke-quay-stay"));
  const chinatown = linkedExperiences.find((e) => e.slug.includes("singapore-gp-chinatown-stay"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      justPurchasedProductType={justPurchasedProductType}
      eventName="Singapore Grand Prix"
      status="teaser"
      h1="Trackside, riverside, or value — the real Singapore stay decision"
      question="Where should I stay for the Singapore GP?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      miniPackOption={miniPackOption}
      ctaCopy="Buy the Where to Stay Guide alone, or the full Event Pack, to unlock hotel ratings, our actual recommendation for your priorities — trackside, riverside, or value — plus the exact room category to request at each property and direct booking notes."
    >
      {/* Free teaser — the three-way decision framed, no hotel cards, no
          ratings, no booking detail. Everything else in this spoke is gated
          behind isUnlocked (full pack or the Where to Stay Guide mini-pack)
          — whole-spoke gating per the mini-packs pilot design, replacing the
          previous "free factual content + gated verdict" split this spoke
          used before. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Marina Bay Street Circuit wraps around downtown Singapore, so unlike most Grand Prix venues, this genuinely
        is a three-way decision, not a default.
      </p>

      {/* !isUnlocked gate added 15 Sep 2026 — redundant once the full
          hotel cards below are visible, and the founder wants a
          purchaser's page to match production exactly with no added
          content once unlocked. */}
      {!isUnlocked && (
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-sm text-[#A3A3A3]">
            <span className="text-white font-bold">Trackside (Marina Bay):</span>{" "}a genuine circuit view from your room, if that matters enough to pay the premium
          </p>
          <p className="text-sm text-[#A3A3A3]">
            <span className="text-white font-bold">Clarke Quay:</span>{" "}a short MRT ride from the circuit with a completely different evening on offer
          </p>
          <p className="text-sm text-[#A3A3A3]">
            <span className="text-white font-bold">Chinatown:</span>{" "}real neighbourhood character, two MRT lines to the circuit, roughly half the trackside rate
          </p>
        </div>
      )}

      {isUnlocked && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {trackHotels && (
              <div className="sm:col-span-2">
                <SpokeExperienceCard eventSlug={eventSlug} experience={trackHotels} isPro={isPro} hideProCtas />
              </div>
            )}
            {clarkeQuay && <SpokeExperienceCard eventSlug={eventSlug} experience={clarkeQuay} isPro={isPro} hideProCtas />}
            {chinatown && <SpokeExperienceCard eventSlug={eventSlug} experience={chinatown} isPro={isPro} hideProCtas />}
          </div>
        </>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which base we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a first Singapore GP, Chinatown is the right call for most people — real neighbourhood character, two
            MRT lines to the circuit, at roughly half Marina Bay&apos;s trackside rates. Marina Bay only earns its
            premium if a genuine circuit view from your room matters to you specifically, ask for a track-facing room
            category when booking, it&apos;s not automatic. Clarke Quay is the pick if the nightlife itself is part of
            the draw, a short MRT ride (not a walk) from the circuit with a completely different evening on offer.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking windows &amp; contacts</p>
          <div className="flex flex-col gap-3 mb-6">
            <HotelBookingCard name="The Ritz-Carlton, Millenia" url="https://www.booking.com/hotel/sg/the-ritz-carlton-millenia-singapore.html" note="Request a track-facing or bay-facing room category specifically — the panoramic view is tied to specific rooms, not hotel-wide." />
            <HotelBookingCard name="Pan Pacific Singapore" url="https://www.booking.com/hotel/sg/panpacificsingapore.html" note="Book early for race week — this is the relative value pick of the trackside three, and inventory sells out fast." />
            <HotelBookingCard name="Swissotel The Stamford" url="https://www.booking.com/hotel/sg/swissotelsingapore.html" note="Ask about 65th-floor lounge access on higher floors — food and wine are included in the room rate at that tier." />
            <HotelBookingCard name="Holiday Inn Express Clarke Quay" url="https://www.booking.com/hotel/sg/holiday-inn-express-singapore-clarke-quay.html" note="Book direct or via Booking.com — the district gets genuinely loud into the night, factor that in if an early practice session means you need real sleep." />
            <HotelBookingCard name="Park Regis by Prince Singapore" url="https://www.booking.com/hotel/sg/park-regis-singapore.html" note="Newly renovated but thin-walled — request a corner or higher-floor room if noise from the corridor is a concern." />
            <HotelBookingCard name="Aurum Royal (formerly The Scarlet)" url="https://www.booking.com/hotel/sg/the-scarlet.html" note="Rebranded from The Scarlet — older reviews elsewhere may still reference the old name. Check current room categories before booking." />
            <HotelBookingCard name="Heritage Collection on Chinatown" url="https://www.booking.com/hotel/sg/hometown-inn.html" note="No elevator — factor that in if luggage or mobility is a concern. Request a skylight or windowed room category specifically." />
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function HotelBookingCard({ name, url, note }: { name: string; url: string; note: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
        <p className="text-sm font-bold text-white">{name}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
          Book direct ↗
        </a>
      </div>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
    </div>
  );
}
