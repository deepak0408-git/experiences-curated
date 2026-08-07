import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const tramGuide = linkedExperiences.find((e) => e.slug.includes("atp-finals-getting-to-inalpi-arena"));
  const airportGuide = linkedExperiences.find((e) => e.slug.includes("atp-finals-airport-to-city"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Nitto ATP Finals"
      status="public"
      h1="Getting around Turin — and to Inalpi Arena"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Turin's transit map looks deceptively simple — a single metro line — which trips up first-time visitors who
        assume it covers everything. Inalpi Arena isn't on the metro at all, so getting there means tram, and
        knowing that before you land saves working it out with luggage on arrival.
      </p>

      <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
        Turin Airport (Caselle) has its own SFM train station, running every 30 minutes to Porta Susa (about 30
        minutes), where you connect onward via metro or tram. Buy the Integrato B combined ticket (~€4.20) to cover
        both legs in one purchase. Sebastopoli tram stop (lines 4 and 10) is the real route to Inalpi Arena — about a
        5-minute walk from the arena's general admission entrance, with tram 4 running direct from Porta Nuova
        station.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {airportGuide && <SpokeExperienceCard experience={airportGuide} isPro={isPro} />}
        {tramGuide && <SpokeExperienceCard experience={tramGuide} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Around the city</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A single GTT ticket (~€2) covers 90 minutes across bus, tram, and metro. The free TO Move app handles
          purchase, validation, and real-time vehicle tracking — worth installing before you land. If you're moving
          around for more than a day, a 48 or 72-hour Special Tour Ticket is better value than single fares.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">On session days</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Expect trams 4 and 10 to be genuinely busier than usual on session days — build extra time in before an
          evening session, when match-goers and regular commuters overlap.
        </p>
      </div>
    </SpokeShell>
  );
}
