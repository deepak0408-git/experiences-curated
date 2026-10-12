import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Combines Spa town's own thermal-city sightseeing (13km from the circuit,
// genuinely walkable range for most visitors) with Stavelot's abbey and
// circuit museum (5km, closest to the gates) and a real outward day trip
// into the wider Ardennes (La Roche, Durbuy, Han-sur-Lesse). 12 Oct 2026.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const spaTown = linkedExperiences.find((e) => e.slug.includes("spa-town-thermal-city-belgian-gp-"));
  const stavelot = linkedExperiences.find((e) => e.slug.includes("stavelot-abbey-circuit-museum-"));
  const ardennesBeyond = linkedExperiences.find((e) => e.slug.includes("ardennes-beyond-the-circuit-"));
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
      h1="A thermal spa town, a medieval abbey, and the wider Ardennes beyond both"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every site and travel time above is real and free. The pack adds our direct verdict on how to actually sequence race weekend around them — which day suits Spa town, which suits the wider Ardennes trip, and how to avoid cutting into session time."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Belgian Ardennes rewards time beyond the circuit more than most F1 host regions — Spa town&apos;s own
        thermal-spa history gives the race its name, Stavelot&apos;s abbey and circuit museum sit a short walk
        from the gates themselves, and the wider Ardennes — river valleys, medieval towns, genuine natural
        caves — is a real day-trip destination most GP visitors never make time for.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Spa Town — the thermal city, 13km from the circuit</p>
      {spaTown && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={spaTown} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Stavelot — abbey, circuit museum, and town</p>
      {stavelot && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={stavelot} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The wider Ardennes — a genuine outward day trip</p>
      {ardennesBeyond && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={ardennesBeyond} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8 mt-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest logistics</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Stavelot&apos;s abbey and museum are a genuine half-day stop, easy to fit around a session day given how
          close it sits to the circuit. Spa town is a similar half-day commitment, worth pairing with a dinner
          reservation in town. The wider Ardennes trip — La Roche-en-Ardenne, Durbuy, Han-sur-Lesse — is the
          longer commitment, genuinely worth a full day away from the circuit rather than squeezed between
          sessions.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How we&apos;d actually sequence it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a standard Friday-Sunday race weekend with a Thursday arrival, Stavelot&apos;s abbey and museum fit
            naturally on Thursday afternoon or Friday morning before the first session — close enough to the
            circuit that it doesn&apos;t cost you a full day. Spa town works well as a Saturday-evening pairing
            with dinner, once qualifying is done. Save the wider Ardennes day trip for Monday, after Sunday&apos;s
            race, rather than squeezed between sessions — the drive out to La Roche, Durbuy, or Han-sur-Lesse is a
            real commitment, not a quick detour.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The one combination that genuinely doesn&apos;t fit: don&apos;t try to pair the full Ardennes day trip
            with a same-day circuit session — the round trip alone consumes most of a day, and arriving back late
            into a session evening isn&apos;t a trade most fans would choose once they see the real travel time
            involved.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
