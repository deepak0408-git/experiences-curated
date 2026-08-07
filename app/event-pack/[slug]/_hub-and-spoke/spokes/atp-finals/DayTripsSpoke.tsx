import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const barolo = linkedExperiences.find((e) => e.slug.includes("atp-finals-barolo-langhe-daytrip"));
  const juventusMuseum = linkedExperiences.find((e) => e.slug.includes("atp-finals-juventus-museum"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Nitto ATP Finals"
      status="teaser"
      h1="Barolo's wine hills, or a second sporting story in the city"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real destinations and travel times are all free above. The Event Pack adds our actual verdict — which specific day of your trip to spend on Barolo given the tournament's own session schedule, and how to fit a day trip in without missing a session you actually want to see."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The ATP Finals' round-robin schedule means you're not tied to the arena every single day of your trip — the
        group stage runs six days with two sessions daily, which leaves real room to build a day trip or a
        non-tennis day into a longer visit.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {barolo && <SpokeExperienceCard experience={barolo} isPro={isPro} />}
        {juventusMuseum && <SpokeExperienceCard experience={juventusMuseum} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How to fit Barolo into the tournament week</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Plan your Barolo day around a session you're comfortable missing entirely, not one you're hoping to catch
            on return — the roughly 1.5-hour drive each way, plus a genuine half-day in the region itself, doesn't
            leave realistic margin for an afternoon session on the same day. If your trip spans multiple group-stage
            days, pick the day with the players or matchup you're least attached to for the day trip, and protect
            your must-see sessions on either side of it.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
