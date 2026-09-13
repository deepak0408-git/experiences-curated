import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Per the founder's explicit spoke-mapping decision, 13 Sep 2026: all 4
// sightseeing/cultural picks (Museum of Islamic Art, National Museum of
// Qatar, The Pearl & Katara, Souq Waqif) plus the desert safari day trip
// live here, rather than being split across First-Timer Guide/Map — Doha
// itself is a genuine city-break destination, not a satellite town, so this
// spoke covers "what to do beyond the race" broadly rather than literal
// out-of-town excursions only.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const desertSafari = linkedExperiences.find((e) => e.slug.includes("qatar-gp-khor-al-adaid-"));
  const miaExp = linkedExperiences.find((e) => e.slug.includes("qatar-gp-museum-islamic-art-"));
  const nmoqExp = linkedExperiences.find((e) => e.slug.includes("qatar-gp-national-museum-qatar-"));
  const pearlKatara = linkedExperiences.find((e) => e.slug.includes("qatar-gp-pearl-katara-"));
  const souqWaqif = linkedExperiences.find((e) => e.slug.includes("qatar-gp-souq-waqif-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="teaser"
      h1="A desert reserve where the Gulf meets the dunes, and a city with two world-class museums"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The five real picks above are free — what the pack adds is sequencing: which day to do the desert safari around your session times, which museum to skip if you only have one afternoon, and the one souq evening we'd never trade for anything else on this list."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Doha isn&apos;t a satellite town built around one weekend of racing — it&apos;s a real city with its own
        architecture, history, and desert landscape, and race weekend leaves real time to see a genuine slice of it.
        These five picks cover the range: one full-day desert excursion, two architecturally significant museums, and
        two walkable city districts.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Khor Al Adaid — the Inland Sea desert safari</p>
      {desertSafari && (
        <div className="mb-8">
          <SpokeExperienceCard experience={desertSafari} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Doha's two landmark museums</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {miaExp && <SpokeExperienceCard experience={miaExp} isPro={isPro} />}
        {nmoqExp && <SpokeExperienceCard experience={nmoqExp} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Two city districts, both best in the evening</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {pearlKatara && <SpokeExperienceCard experience={pearlKatara} isPro={isPro} />}
        {souqWaqif && <SpokeExperienceCard experience={souqWaqif} isPro={isPro} />}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Only one guided tour if you're short on time</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Multiple operators run a single 4-hour guided loop covering the Corniche, Souq Waqif, Katara, and The
          Pearl in one afternoon, with hotel pickup included, from around $29 per person shared. It won&apos;t
          replace visiting each place properly, but it&apos;s a real option if you&apos;re flying in purely for the
          race and worried about missing the city entirely.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d sequence these</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Put the desert safari on your arrival day or a rest day before the race weekend proper begins — tours run
            4-8 hours door-to-door, best scheduled afternoon into evening, and it&apos;s the one item on this list
            that genuinely conflicts with a full day at the circuit. If you only have time for one museum, the
            National Museum of Qatar edges out the Museum of Islamic Art for a first-timer — its desert-rose
            architecture and the preserved royal palace inside it tell a more specifically Qatari story, where MIA&apos;s
            collection, while genuinely excellent, covers the wider Islamic world rather than Qatar itself.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The evening we wouldn&apos;t trade</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Souq Waqif at night, timed for whichever evening you&apos;re not at the circuit, is the single highest-value
            few hours on this list — a rebuilt 19th-century-style market with a working falcon hospital, genuinely
            free to walk, and the closest thing Doha has to old-city atmosphere. Pair it with a Pearl/Katara evening
            walk on a different night rather than trying to do both districts in one trip — each rewards slowing
            down, and rushing between them undercuts what makes either worthwhile.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
