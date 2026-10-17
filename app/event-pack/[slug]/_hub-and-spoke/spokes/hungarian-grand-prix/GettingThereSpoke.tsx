import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Real content sourced from the seeded "Getting to the Hungaroring" experience
// (getting-to-hungaroring-), 16 Oct 2026: M2 metro to Örs vezér tere, HÉV
// suburban rail toward Kerepes, free circuit shuttle to Gate 3, asymmetric
// return route via Gödöllő station.
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettingThereGuide = linkedExperiences.find((e) => e.slug.includes("getting-to-hungaroring-"));
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
      eventName="Hungarian Grand Prix"
      status="public"
      h1="Metro, then suburban rail, then a free shuttle — three legs, no car needed"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Hungaroring sits 25 minutes from central Budapest, close enough that the standard public transport
        route is genuinely the default choice most visitors make, not a fallback for people without a car. No
        booking required beyond a standard BKK ticket, and the route is the same every day of race weekend.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">M2 metro, HÉV, then the free shuttle</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Start on the M2 red metro line and ride it to its final stop, Örs vezér tere (change at Deák Ferenc tér
          first if you&apos;re coming from the M1 or M3 lines). At Örs vezér tere, cross to the opposite corner of
          the intersection through the underpass to find the HÉV suburban rail platform. The HÉV trains from this
          stop head toward Kerepes, Gödöllő, and Mogyoród — take one toward Kerepes, where a free F1 shuttle bus
          runs directly to Gate 3, timed to match train arrivals.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The route home is genuinely different, not a simple reversal</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The free shuttle only runs from Kerepes station on the way out — on the way back, it drops at Gödöllő
          Railway Station instead, which has more frequent trains than Kerepes anyway. Don&apos;t assume you&apos;ll
          retrace your exact outbound route in reverse, and budget real time for the shuttle queue after the race
          finishes, since tens of thousands of people are trying to leave Gate 3 at once.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">The official Formula 1 app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Fastest way to catch session timing and any weather-driven schedule changes in real time, often
              posted here before anywhere else. Download before you travel.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">BudapestGO</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Budapest&apos;s official transit app — covers the M2 metro and HÉV suburban rail in one place,
              including live departure times and route planning for getting to Örs vezér tere from wherever
              you&apos;re staying.
            </p>
          </div>
        </div>
      </div>

      {gettingThereGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={gettingThereGuide} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Buy a standard BKK ticket before you leave your hotel rather than at Örs vezér tere on race morning, when
          queues build fast as the crowd grows. And remember the return route uses Gödöllő station, not Kerepes —
          build in extra time for the shuttle queue after the flag, since the whole crowd is heading the same
          direction at once.
        </p>
      </div>
    </SpokeShell>
  );
}
