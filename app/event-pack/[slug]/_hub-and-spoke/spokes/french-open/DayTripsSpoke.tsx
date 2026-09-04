import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Roland-Garros sits inside Paris, so the usual "day trip to a nearby city"
// rule maps differently here — Versailles is the genuine outward day trip,
// while Village d'Auteuil and Montmartre are the two in-city neighborhood
// options for a shorter, no-travel-time rest day.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const versailles = linkedExperiences.find((e) => e.slug.includes("versailles-day-trip"));
  const auteuil = linkedExperiences.find((e) => e.slug.includes("village-dauteuil-neighborhood"));
  const montmartre = linkedExperiences.find((e) => e.slug.includes("montmartre-neighborhood"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="teaser"
      h1="Versailles for a full day out, or two very different Paris neighborhoods for a shorter one"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real destinations and travel times are all free above — no guessing. What it can't tell you is which day of your specific trip to give up for Versailles without costing you a match you'd regret missing. Unlocking adds that verdict, plus the exact booking window before Versailles' timed-entry slots fill for your dates."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        With the tournament running two full weeks, there&apos;s real room to build a genuine non-match day into a
        longer trip — either a full outward day trip to Versailles, or a shorter, no-travel-time break in one of
        two very different Paris neighborhoods.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Versailles — a real day out</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        RER C runs directly from central Paris to Versailles in 35-45 minutes, no change required. This is the
        genuine day-trip-outside-the-city option, since Roland-Garros sits inside Paris itself, unlike most events
        with a nearby-city day-trip anchor.
      </p>
      <div className="mb-8">
        {versailles && <SpokeExperienceCard experience={versailles} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Or a shorter break inside Paris</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Village d&apos;Auteuil sits a short walk from the venue itself — a genuine former village with hidden Art
        Nouveau architecture most Roland-Garros visitors never see. Montmartre is the opposite register entirely,
        a genuine cross-city trip to the hilltop neighborhood where modern art actually happened.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {auteuil && <SpokeExperienceCard experience={auteuil} isPro={isPro} />}
        {montmartre && <SpokeExperienceCard experience={montmartre} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">When to take it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            An early-round weekday (rather than a weekend or a marquee second-week day) is the easiest day to give
            up — the Grounds Pass covers everything that matters on the days you are on-site, so missing one
            mid-tournament day costs the least. Avoid pulling a day around the finals weekend, when the
            tournament's best atmosphere is concentrated into a handful of specific days.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Fitting Versailles into the trip</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book Versailles timed-entry tickets in advance via en.chateauversailles.fr — slots genuinely sell out
            during May-June, which overlaps directly with the tournament. Plan to leave central Paris by
            mid-morning: the palace plus even a partial walk through the gardens is a genuine full day, and there's
            no realistic way to fit an afternoon session back at Roland-Garros on the same day.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: en.chateauversailles.fr, RATP.
      </p>
    </SpokeShell>
  );
}
