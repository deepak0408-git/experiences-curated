import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Combines Melbourne's in-city sightseeing (A Day in Melbourne, Federation
// Square, St Kilda — all reused from Australian Open 2027) with the two
// genuine out-of-city day trips (Great Ocean Road, Yarra Valley — also
// reused) into one spoke with two clearly labelled sections, matching the
// pattern already used on Brazilian GP and Australian Open 2027 for a
// destination city that's the trip itself, not a satellite town.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const aDayInMelbourne = linkedExperiences.find((e) => e.slug.includes("melbourne-laneways-coffee-city-day-msvqcgan"));
  const federationSquare = linkedExperiences.find((e) => e.slug.includes("federation-square-cbd-laneways-29z0co"));
  const stKilda = linkedExperiences.find((e) => e.slug.includes("st-kilda-beaches-melbourne-park-27rh1c"));
  const greatOceanRoad = linkedExperiences.find((e) => e.slug.includes("great-ocean-road-twelve-apostles-daytrip-msxbk23p"));
  const yarraValley = linkedExperiences.find((e) => e.slug.includes("yarra-valley-melbourne-wine-daytrip-msvq7o08"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Grand Prix"
      status="teaser"
      h1="Laneways and a penguin colony in the city, or a full day on the coast"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every site and travel time above is real and free. The pack adds the actual day-by-day sequencing we'd run across a Sprint weekend — which day to do the Great Ocean Road, and the one combination that genuinely doesn't fit around Sunday's race."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Melbourne is the destination here, not a satellite town near the circuit — so race weekend downtime is
        genuinely worth planning around. That spans in-city sightseeing you can fit around a session day, and two
        real excursions worth a full day away from Albert Park.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">In the city — a half-day at a time</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {aDayInMelbourne && <SpokeExperienceCard eventSlug={eventSlug} experience={aDayInMelbourne} isPro={isPro} hideProCtas />}
        {federationSquare && <SpokeExperienceCard eventSlug={eventSlug} experience={federationSquare} isPro={isPro} hideProCtas />}
        <div className="sm:col-span-2">
          {stKilda && <SpokeExperienceCard eventSlug={eventSlug} experience={stKilda} isPro={isPro} hideProCtas />}
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3 mt-8">Out of the city — real day trips</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {greatOceanRoad && <SpokeExperienceCard eventSlug={eventSlug} experience={greatOceanRoad} isPro={isPro} hideProCtas />}
        {yarraValley && <SpokeExperienceCard eventSlug={eventSlug} experience={yarraValley} isPro={isPro} hideProCtas />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest logistics</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              A Day in Melbourne, Federation Square, and St Kilda are all genuine half-day stops you can fit around a
              session day — St Kilda&apos;s penguin viewing is free but capped at 150 people per session, so book ahead
              if that&apos;s the draw. The Great Ocean Road is a full 12-13 hour round trip and genuinely needs a whole
              day off, not a half-day squeeze — self-driving isn&apos;t recommended given the after-dark return leg, so
              a guided coach tour is the realistic option. Yarra Valley is closer to an hour each way by car (not the
              30 minutes some tourism copy claims) — public transport works against a genuine day trip here, so a
              hired car, driver, or tour that includes transport is the realistic way to do it.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How we&apos;d actually sequence it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a Sprint-format weekend — Practice 1 and Sprint Qualifying Friday, Sprint Race and Qualifying
            Saturday, the Grand Prix Sunday — Thursday is genuinely your best full day off, since it&apos;s before
            any on-track action starts. That&apos;s the day to run the Great Ocean Road if it matters to you; trying
            to squeeze a 12-13 hour round trip around a Friday or Saturday session day risks missing part of the
            action either way. Yarra Valley&apos;s shorter round trip fits more easily into a Thursday afternoon or
            a quieter Friday morning before Sprint Qualifying. Federation Square and St Kilda both work well as a
            Sunday-morning stop before the race itself, or as a wind-down after Saturday&apos;s Sprint Race and
            Qualifying double-header.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The one combination that genuinely doesn&apos;t fit: don&apos;t try to pair the Great Ocean Road with
            Sunday&apos;s race-day arrival timing — the tour&apos;s own return window runs into the evening, and
            Sunday&apos;s Grand Prix is the one session day you don&apos;t want to be arriving in Melbourne
            exhausted from a coastal day trip rather than well-rested for the main event.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
