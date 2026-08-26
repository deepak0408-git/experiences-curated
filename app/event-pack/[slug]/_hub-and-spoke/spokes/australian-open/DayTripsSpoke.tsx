import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// 5 real day-trip/neighbourhood experiences map here: Great Ocean Road and
// Yarra Valley (full-day, genuine rest-day trips), St Kilda (half-day, one
// tram ride), Federation Square & CBD Laneways and A Day in Melbourne
// (both short pre/post-match detours, not rest-day trips on their own).
// Grid rule per skill: odd count of 5 needs the last card spanning full
// width (sm:col-span-2) rather than forcing a 3-column layout.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const greatOceanRoad = linkedExperiences.find((e) => e.slug.includes("great-ocean-road-twelve-apostles-daytrip"));
  const yarraValley = linkedExperiences.find((e) => e.slug.includes("yarra-valley-melbourne-wine-daytrip"));
  const stKilda = linkedExperiences.find((e) => e.slug.includes("st-kilda-beaches-melbourne-park"));
  const fedSquare = linkedExperiences.find((e) => e.slug.includes("federation-square-cbd-laneways"));
  const melbourneCityDay = linkedExperiences.find((e) => e.slug.includes("melbourne-laneways-coffee-city-day"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="teaser"
      h1="One full rest day, or a few short hours — both are real options here"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real five options and their honest time commitments are free above. Unlocking adds our verdict on which day trip actually fits a tournament-length trip, and how to sequence it around your session tickets without losing a match you care about."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Australian Open runs across two weeks, and unlike a single-day fixture, that genuinely leaves room for
        a day away from tennis — or several short ones. What you choose depends entirely on how much time you
        actually have between sessions.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {greatOceanRoad && <SpokeExperienceCard experience={greatOceanRoad} isPro={isPro} />}
        {yarraValley && <SpokeExperienceCard experience={yarraValley} isPro={isPro} />}
        {stKilda && <SpokeExperienceCard experience={stKilda} isPro={isPro} />}
        {fedSquare && <SpokeExperienceCard experience={fedSquare} isPro={isPro} />}
        {melbourneCityDay && (
          <div className="sm:col-span-2">
            <SpokeExperienceCard experience={melbourneCityDay} isPro={isPro} />
          </div>
        )}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which one we&apos;d pick, and when</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            The Great Ocean Road is a genuine 12-hour commitment — it needs a full day with no session booked at
            all, so pick a day in the tournament&apos;s first week when the schedule is dense enough that missing
            one full day&apos;s play doesn&apos;t cost you a specific match you wanted to see. Yarra Valley is a
            shorter, more forgiving half-day-plus trip if you&apos;d rather keep an evening session on the table.
            St Kilda, Federation Square, and a laneways-and-coffee CBD morning all work as genuine same-day
            additions — a sunset penguin colony, a street-art laneway walk, or an hour in Melbourne&apos;s famous
            coffee culture before or after a session, not a day trip that competes with the tennis at all.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking around your tickets</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            If you already know which days you&apos;re holding reserved seats for, book the Great Ocean Road or
            Yarra Valley tour on a day session you&apos;re skipping entirely, not around a night session — both
            trips return to Melbourne in the early evening, which leaves a night session genuinely reachable
            afterward if the timing works, but building your day-trip choice around protecting your best ticket
            is the safer plan. See the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>{" "}
            for the real session structure.
          </p>
        </div>
      )}

    </SpokeShell>
  );
}
