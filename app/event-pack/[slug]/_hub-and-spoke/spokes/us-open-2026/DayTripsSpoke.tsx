import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Two in-city/no-travel-time options (A Morning in Queens Before the
// Tennis, Flushing Meadows-Corona Park, Queens: A Day Beyond the Courts —
// ported from the classic pack) plus two new real outward day trips
// (Atlantic City, Hudson Valley — researched fresh for this migration,
// per founder direction 5 Oct 2026) satisfying the day-trip rule's outward
// anchor requirement, same dual pattern French Open used for Versailles
// vs. Auteuil/Montmartre. A third, standalone museums piece (Queens Museum
// + the Met + MoMA, added per founder direction 5 Oct 2026) spans both
// registers — Queens Museum is a real no-travel-time option, the Met/MoMA
// are the Manhattan trip — so it gets its own section rather than being
// forced into either bucket above.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const morningInQueens = linkedExperiences.find((e) => e.slug.includes("us-open-queens-food-tour"));
  const queensDay = linkedExperiences.find((e) => e.slug.includes("queens-a-day-beyond-the-courts"));
  const park = linkedExperiences.find((e) => e.slug.includes("flushing-meadows-corona-park"));
  const atlanticCity = linkedExperiences.find((e) => e.slug.includes("atlantic-city-day-trip"));
  const hudsonValley = linkedExperiences.find((e) => e.slug.includes("hudson-valley-day-trip"));
  const nycMuseums = linkedExperiences.find((e) => e.slug.includes("nyc-museums-day-trip"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="US Open"
      status="teaser"
      h1="Queens itself for a short break, or a real day out of the city entirely"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real destinations and travel times are all free above — no guessing. What it can't tell you is which day of your specific trip to give up for a day out without costing you a match you'd regret missing. Unlocking adds that verdict."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        With the tournament running two full weeks, there&apos;s real room to build a genuine non-grounds day into a
        longer trip — either a short, no-travel-time break right in Queens, or a full day out of the city entirely
        to Atlantic City or the Hudson Valley.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Staying close — Queens itself</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Flushing Meadows-Corona Park surrounds the grounds, and the neighborhoods around it are a genuine, no-travel-
        time break without leaving the borough.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {morningInQueens && <SpokeExperienceCard eventSlug={eventSlug} experience={morningInQueens} isPro={isPro} />}
        {park && <SpokeExperienceCard eventSlug={eventSlug} experience={park} isPro={isPro} />}
      </div>
      <div className="mb-8">
        {queensDay && <SpokeExperienceCard eventSlug={eventSlug} experience={queensDay} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A real day out of the city</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Atlantic City and the Hudson Valley are genuinely different registers of day trip — one loud and
        unapologetically commercial, the other a quiet art-world escape upriver. Both cost a real chunk of the day
        in travel, so pick based on which kind of rest day you actually want.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {atlanticCity && <SpokeExperienceCard eventSlug={eventSlug} experience={atlanticCity} isPro={isPro} />}
        {hudsonValley && <SpokeExperienceCard eventSlug={eventSlug} experience={hudsonValley} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The museums — close by, or a full Manhattan trip</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Queens Museum is a genuine no-travel-time option inside Flushing Meadows-Corona Park itself. The Met and
        MoMA are the real Manhattan trip, for a day with more travel time to spend.
      </p>
      <div className="mb-8">
        {nycMuseums && <SpokeExperienceCard eventSlug={eventSlug} experience={nycMuseums} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">When to take it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            An early-round weekday is the easiest day to give up — a Grounds Admission pass covers everything that
            matters on the days you are on-site, so missing one mid-tournament day costs the least. Avoid pulling a
            full outward day trip around finals weekend, when the tournament&apos;s best atmosphere concentrates
            into a handful of specific days.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Atlantic City or Hudson Valley?</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Atlantic City is the pick if a loud, unstructured day away from the controlled intensity of a Grand Slam
            is genuinely the point — real five-hour round-trip cost, worth it for someone chasing a change of
            register, not efficiency. The Hudson Valley is the sharper choice for a quieter, shorter round trip built
            around one great museum and a walkable town — plan it for a Friday through Monday, since Dia:Beacon is
            closed Tuesday through Thursday.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
