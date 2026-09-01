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

  const bellagioCaesars = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-bellagio-caesars-dining"));
  const fremontDining = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-fremont-downtown-dining"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="teaser"
      h1="A fine-dining weekend and a locals' weekend, ten minutes apart"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Both real picks above are free — the pack adds exactly which night to book each on around your session schedule, and the reservation-timing detail that matters most during a week when every Strip restaurant sees genuine demand spikes."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Las Vegas gives you two genuinely different dining weekends depending on where you eat. The Strip runs some
        of the best-credentialed restaurants in the world, minutes from the circuit. Fremont Street, ten minutes
        downtown, runs on a completely different food economy — where locals actually eat, at a fraction of Strip
        prices.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {bellagioCaesars && <SpokeExperienceCard experience={bellagioCaesars} isPro={isPro} />}
        {fremontDining && <SpokeExperienceCard experience={fremontDining} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d actually plan the two nights</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Book Le Cirque or Restaurant Guy Savoy for a night without a session immediately after — qualifying
            night or the evening before the race — since both are genuine multi-course experiences, not quick
            pre-race meals. Save the Fremont Street trip for Thursday or Friday, when the Strip&apos;s own merchandise
            and race-week crowds haven&apos;t peaked yet and a downtown detour is easiest to fit in.
          </p>
          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4">
            <p className="text-sm font-bold text-white mb-1.5">Book Strip restaurants weeks ahead for race weekend</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both Le Cirque and Restaurant Guy Savoy see genuine demand spikes from F1 visitors specifically during
              race weekend — reservations that would be easy to get on a normal week can book out. Le Thai on
              Fremont Street doesn&apos;t take reservations for smaller parties, so plan for a possible wait on
              weekend nights instead.
            </p>
          </div>
        </div>
      )}
    </SpokeShell>
  );
}
