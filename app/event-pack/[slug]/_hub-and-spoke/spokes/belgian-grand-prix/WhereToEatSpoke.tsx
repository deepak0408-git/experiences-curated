import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// Two real, seeded dining experiences cover the trip's actual range: Domino
// Steak House in Spa (a sit-down restaurant pick) and Belgian Race Weekend
// Street Food (the trackside Fan Zone food offer — frites, waffles,
// stoofvlees). 12 Oct 2026.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const dominoSteakHouse = linkedExperiences.find((e) => e.slug.includes("domino-steak-house-spa-"));
  const streetFood = linkedExperiences.find((e) => e.slug.includes("belgian-race-weekend-street-food-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

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
      h1="Frites and stoofvlees trackside, or a proper steakhouse evening in Spa"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Both real picks are free above. The pack adds our direct verdict on booking windows for Saturday evening in Spa town, plus the Fan Zone's own food timing tactics — when to eat to avoid the worst of the queue."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Race weekend eating at Spa splits cleanly in two: the Fan Zone&apos;s trackside food market — Belgian
        frites, waffles, and stoofvlees done properly, better quality than most F1 circuits manage — and Spa
        town&apos;s own range of brasseries and steakhouses for a proper sit-down evening once the day&apos;s
        sessions are done.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Trackside — the Fan Zone food market</p>
      {streetFood && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={streetFood} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Spa town — a proper evening out</p>
      {dominoSteakHouse && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={dominoSteakHouse} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book ahead for Saturday evening</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Spa town fills on qualifying Saturday — anything worth booking in town should be reserved ahead rather
          than treated as a walk-in option, since the town&apos;s restaurant stock is genuinely limited for a
          race-weekend crowd this size.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d actually sequence it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Eat trackside before 11:00 or after 14:30 on race Sunday specifically — the food queue at peak
            mid-morning runs 20+ minutes, and frites sell out at two of the three Fan Zone stalls by early
            afternoon. Save Domino Steak House or a similar Spa-town pick for Friday or Saturday evening, once the
            day&apos;s sessions are done and you&apos;re not racing a dinner reservation against a grandstand seat.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The booking detail that actually matters</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book your Spa-town dinner as early as you book your grandstand ticket, not closer to the date — race
            weekend is the Ardennes&apos; busiest period of the year for restaurants as much as hotels, and walk-ins
            become unreliable by around 8pm once qualifying Saturday&apos;s crowd fills the town.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
