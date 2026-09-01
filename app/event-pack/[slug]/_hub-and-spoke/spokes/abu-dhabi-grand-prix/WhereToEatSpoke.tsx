import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const cipriani = linkedExperiences.find((e) => e.slug.includes("cipriani-yas-island"));
  const diningWalk = linkedExperiences.find((e) => e.slug.includes("yas-marina-dining-walk"));
  const shawarma = linkedExperiences.find((e) => e.slug.includes("cheap-shawarma-abu-dhabi-dubai"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Abu Dhabi Grand Prix"
      status="teaser"
      h1="From marina fine dining to AED 10 shawarma — the real range"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every pick and price above is real and free. The pack adds our actual reservation strategy for race week specifically — when to book, and the one genuine trade-off between the marina scene and the city's own everyday food culture."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Yas Marina&apos;s own dining runs splurge-tier by design — this is the real range across the whole trip,
        from genuine fine dining on the marina to real, everyday local institutions in both Abu Dhabi and Dubai
        where a full meal costs a fraction of anything trackside.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Splurge — trackside fine dining</p>
      {cipriani && (
        <div className="mb-8">
          <SpokeExperienceCard experience={cipriani} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Casual to mid-range — the marina walk</p>
      {diningWalk && (
        <div className="mb-8">
          <SpokeExperienceCard experience={diningWalk} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Budget — real local institutions</p>
      {shawarma && (
        <div className="mb-8">
          <SpokeExperienceCard experience={shawarma} isPro={isPro} hideProCtas />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Reserving for race week specifically</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Cipriani is consistently one of the hardest reservations on Yas Island during Grand Prix weekend —
            book well ahead of race week rather than trying your luck with a walk-in, and request terrace or window
            seating specifically if a track view matters to you, since the dining room extends beyond the
            marina-facing sections. Stars &apos;N&apos; Bars, Aquarium, and Diablito along the marina walk fill
            fastest in the two hours before and after each day&apos;s headline session — outside those windows,
            walk-in availability is genuinely realistic.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The real trade worth knowing: the marina scene is spectacular for atmosphere but genuinely expensive
            across the board. Bait El Khetyar and Al Mallah aren&apos;t backup options — they&apos;re a real,
            deliberate way to eat well for a fraction of the price on any evening you&apos;re not specifically
            chasing the marina view.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
