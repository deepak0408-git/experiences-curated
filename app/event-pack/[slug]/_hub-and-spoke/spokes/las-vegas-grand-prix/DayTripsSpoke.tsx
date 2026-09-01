import Link from "next/link";
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

  const redRock = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-red-rock-canyon"));
  const hooverDam = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-hoover-dam"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="teaser"
      h1="Two real ways to see Nevada beyond the Strip's neon"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Both real day trips above are free — the pack adds exactly which day to build one into your itinerary without eating into race-day time, and the specific booking window that avoids a wasted trip."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Race weekend runs entirely on the Strip, but Las Vegas sits inside a genuinely dramatic desert landscape —
        both of these are real half-day trips, not novelty detours, and both are less than 45 minutes from the
        circuit.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {redRock && <SpokeExperienceCard experience={redRock} isPro={isPro} />}
        {hooverDam && <SpokeExperienceCard experience={hooverDam} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which day we&apos;d actually build this into</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Both trips fit best on the day before practice starts, or a genuine rest morning if your ticket only
            covers Friday and Saturday — neither needs a full day, so don&apos;t sacrifice a session to fit one in.
            Red Rock Canyon requires a Recreation.gov timed-entry reservation for the Scenic Drive between 8am and
            5pm through the entire November race window — book that slot before you land, not on the morning of.
          </p>
          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4">
            <p className="text-sm font-bold text-white mb-1.5">Neither requires a rental car if you&apos;re on a schedule</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              A guided tour with hotel pickup covers both destinations without the reservation logistics of driving
              yourself — a real option if race-week road closures make you wary of driving anywhere near the Strip
              on your own.
            </p>
          </div>
        </div>
      )}

      <p className="text-sm text-[#A3A3A3] leading-7 mt-8">
        For the exact hour-by-hour version of this, sequenced against real race session times, see the{" "}
        <Link href={`/event-pack/${eventSlug}/itinerary`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Trip Schedule
        </Link>
        .
      </p>
    </SpokeShell>
  );
}
