import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const foodVillage = linkedExperiences.find((e) => e.slug.includes("grand-slam-oval-food-village"));
  const coffeeGuide = linkedExperiences.find((e) => e.slug.includes("melbourne-coffee-food-culture-guide"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="teaser"
      h1="Real Melbourne restaurants on the grounds, and the city's own coffee scene beyond it"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real food village names and Melbourne's coffee picks are free above. Unlocking adds our verdict on which grounds food is genuinely worth the queue, and how to fit Melbourne's café culture around a match day without missing a session."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Melbourne is Australia&apos;s food capital by reputation, and the Australian Open genuinely delivers on
        that reputation rather than falling back on generic stadium catering — Grand Slam Oval carries real
        Melbourne restaurant names, and the city itself is a short tram ride away for anyone with a rest day or a
        gap between sessions.
      </p>

      {foodVillage && (
        <div className="mb-8">
          <SpokeExperienceCard experience={foodVillage} isPro={isPro} />
        </div>
      )}

      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Beyond the grounds, Melbourne&apos;s reputation as the city that built the modern flat white is real, not
        marketing — the café scene here genuinely earns the &quot;coffee capital&quot; claim Sydney disputes every
        year.
      </p>
      {coffeeGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={coffeeGuide} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What&apos;s actually worth the queue on the grounds</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Grand Slam Oval&apos;s named restaurant stalls are worth prioritizing over the generic concession
            options scattered through the wider precinct — real Melbourne kitchens, not stadium catering
            contractors, and the quality gap is genuinely noticeable. Go early in your session window rather than
            right before a marquee match starts, since the best stalls draw real queues once a big match lets out.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Fitting a coffee run into a match day</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            If you&apos;re staying in East Melbourne or the CBD (see the{" "}
            <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Stay guide
            </a>
            ), a proper coffee stop before you head to Melbourne Park is genuinely realistic — most of the named
            laneway cafés are walkable from a CBD hotel and open well before gates do. Save a full CBD detour for a
            rest day rather than squeezing it into a match-day morning; see the{" "}
            <a href={`/event-pack/${eventSlug}/day-trips`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Day Trips guide
            </a>{" "}
            for how that day fits into a longer trip.
          </p>
        </div>
      )}

    </SpokeShell>
  );
}
