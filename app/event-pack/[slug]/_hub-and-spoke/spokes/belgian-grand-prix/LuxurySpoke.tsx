import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Real content sourced from the seeded Paddock Club — Belgian Grand Prix
// experience, 12 Oct 2026. Whole-trip luxury coverage (hotel referenced
// from HotelsSpoke rather than duplicated, per the one-experience-one-spoke
// rule) — no premium-transit or off-venue-luxury experience exists among
// the 20 seeded experiences, an honest gap rather than an invented one.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const paddockClub = linkedExperiences.find((e) => e.slug.includes("paddock-club-belgian-gp-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Belgian Grand Prix"
      status="teaser"
      h1="Paddock Club above the pit straight, or Gold 1 as the honest grandstand alternative"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's real is free above — Paddock Club's real tier and the Gold 1 grandstand alternative. The pack adds F1's own Paddock Club product in full, plus our direct verdict on whether the hospitality premium is worth it for a first Spa weekend."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A luxury Belgian Grand Prix weekend stacks a genuine hospitality decision on top of an already large race
        weekend — Spa&apos;s own scale means a premium product that includes transport, food, and proximity to the
        action matters more here than at a compact stadium circuit.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Paddock Club — the genuine top tier</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        F1 Paddock Club sits above the team garages, with real proximity to the sport itself — an open bar, food,
        and the kind of access a grandstand ticket simply doesn&apos;t offer. Sold directly through F1
        Experiences, not the official circuit ticketing site. Full breakdown below.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Gold 1 — the premium seat that isn't hospitality</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Worth naming here even though it&apos;s a grandstand ticket, not a hospitality product: Gold 1, the Pit
        Grandstand, covers pit lane activity and the start/finish straight with full cover — a genuine premium
        seat at a fraction of Paddock Club&apos;s price. Full breakdown in the{" "}
        <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Ticket Guide
        </a>
        .
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A genuine luxury stay</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Spa and Stavelot both have real hotel options, though neither town runs a dedicated five-star property the
        way a major city host would — the full breakdown of both areas&apos; strongest picks lives in the{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Where to Stay guide
        </a>
        .
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {paddockClub && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Paddock Club, in full</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                A grandstand sells you one great view of the racing. Paddock Club sells you the whole day around
                it — food, bars, and real proximity to the sport itself, at the circuit most drivers themselves
                call their favourite on the calendar.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard eventSlug={eventSlug} experience={paddockClub} isPro={isPro} />
              </div>
            </>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking Paddock Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Treat the on-sale window as the real deadline, not a date to check back closer to race weekend — the
            top hospitality tier at any F1 race has a track record of selling out well ahead of other tiers, sold
            directly through{" "}
            <a
              href="https://f1experiences.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              f1experiences.com
            </a>
            .
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
