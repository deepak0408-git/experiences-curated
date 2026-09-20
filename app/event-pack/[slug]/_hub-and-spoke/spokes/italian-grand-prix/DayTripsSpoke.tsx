import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Combines Monza's own in-park sightseeing (Monza Town & the Royal Villa —
// a 2km walk from the circuit that most GP visitors never make) with two
// genuine out-of-town excursions (the Alfa Romeo Museum in Arese, 12km from
// Monza, and Lake Como, a real day-trip-or-alternate-base option). 19 Sep
// 2026.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const monzaTown = linkedExperiences.find((e) => e.slug.includes("monza-town-royal-villa-"));
  const alfaRomeoMuseum = linkedExperiences.find((e) => e.slug.includes("alfa-romeo-museum-arese-"));
  const lakeComo = linkedExperiences.find((e) => e.slug.includes("lake-como-race-weekend-from-the-lake-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Italian Grand Prix"
      status="teaser"
      h1="A medieval town 2km from the circuit, or a lake most visitors never see"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every site and travel time above is real and free. The pack adds the actual day-by-day sequencing we'd run across race weekend — which day to make the Lake Como trip, and how to fit Monza Town in without cutting into session time."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Most Italian GP visitors never leave Parco di Monza — which means Monza&apos;s own medieval town centre,
        a genuine sightseeing stop 2km from the circuit, is a real opportunity most fans skip entirely. Beyond
        that, two proper excursions round out a Milan-based race weekend: motoring history 12km away, and a
        different pace entirely up at Lake Como.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Monza Town & the Royal Villa — 2km from the circuit</p>
      {monzaTown && (
        <div className="mb-8">
          <SpokeExperienceCard experience={monzaTown} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Two real excursions</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {alfaRomeoMuseum && <SpokeExperienceCard experience={alfaRomeoMuseum} isPro={isPro} hideProCtas />}
        {lakeComo && <SpokeExperienceCard experience={lakeComo} isPro={isPro} hideProCtas />}
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8 mt-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest logistics</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Monza Town and the Royal Villa are a genuine half-day stop, walkable from the circuit itself — easy to
          fit around a session day rather than needing one of its own. The Alfa Romeo Museum in Arese is a
          half-day trip from central Milan. Lake Como is the longer commitment — genuinely worth a full day away
          from the circuit, with a real commute trade-off if you&apos;re only there for a few hours rather than
          basing yourself lakeside.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How we&apos;d actually sequence it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a standard Friday-Sunday race weekend with a Thursday arrival, Monza Town fits naturally on
            Thursday afternoon or Friday morning before FP1 — it&apos;s close enough to the circuit that it doesn&apos;t
            eat into a full day. Save Lake Como for a dedicated day either before Thursday or after Sunday&apos;s
            race, not squeezed between sessions — the commute alone makes it a poor fit for a single afternoon.
            The Alfa Romeo Museum works well as a half-day stop from Milan on a non-session morning, ideally paired
            with lunch back in the city rather than at Arese itself.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The one combination that genuinely doesn&apos;t fit: don&apos;t try to pair a full Lake Como day with a
            same-day circuit session — the round trip alone consumes most of a day&apos;s worth of time, and
            arriving back late into a session evening isn&apos;t a trade most fans would actually choose once they
            see the real travel time involved.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
