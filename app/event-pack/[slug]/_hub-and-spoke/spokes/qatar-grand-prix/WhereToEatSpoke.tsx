import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// Three real, seeded dining experiences: Qatari Cuisine in Souq Waqif
// (Shay Al Shomous + Al Aker Sweets, multi-venue), Sawa by Sanad (modern
// Levantine, Msheireb), and Parisa (Persian atmosphere dining, Souq
// Waqif). All sourced 13 Sep 2026.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const qatariCuisine = linkedExperiences.find((e) => e.slug.includes("qatar-gp-qatari-cuisine-souq-"));
  const sawa = linkedExperiences.find((e) => e.slug.includes("qatar-gp-sawa-by-sanad-"));
  const parisa = linkedExperiences.find((e) => e.slug.includes("qatar-gp-parisa-atmosphere-dining-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="teaser"
      h1="A real home-cooking institution, a Michelin-listed sharing menu, and a mirrored Persian dining room"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Three real picks, three real price points, all free above. What the pack adds is which one to book on which night — the reservation windows that actually matter, and our direct read on whether Sawa's tasting menu or à la carte gets you the better trolley-theatre experience."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Doha&apos;s food scene runs from genuinely inexpensive souq stalls to Michelin-listed fine dining, often
        within a few blocks of each other. These three picks span that range: an authentic Qatari home-cooking spot,
        a modern Levantine sharing-plate destination, and a Persian restaurant whose interior alone justifies the
        booking.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Qatari Cuisine in Souq Waqif — genuinely inexpensive, genuinely local</p>
      {qatariCuisine && (
        <div className="mb-8">
          <SpokeExperienceCard experience={qatariCuisine} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Sawa by Sanad — Michelin-listed, Msheireb Downtown</p>
      {sawa && (
        <div className="mb-8">
          <SpokeExperienceCard experience={sawa} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Parisa — Persian atmosphere dining, Souq Waqif</p>
      {parisa && (
        <div className="mb-8">
          <SpokeExperienceCard experience={parisa} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book ahead for the two sit-down picks</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sawa by Sanad and Parisa both recommend reservations, especially on weekends and peak evening hours — Sawa
          via OpenTable, Parisa direct or through major booking platforms. Qatari Cuisine&apos;s two souq stops are
          walk-in only, no booking needed either way.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which night we&apos;d book each</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Save Parisa for whichever evening you&apos;re also doing Souq Waqif itself — the restaurant sits inside
            the souq, so the two naturally pair into one night out rather than two separate trips. Book Sawa for a
            night you want an actual sit-down dinner away from race-day crowds; its trolley-service theatre only
            really shows up at dinner, so lunch there is a genuinely different, lower-key experience if that&apos;s
            what you&apos;re after instead. Shay Al Shomous is a breakfast-and-daytime stop, not a dinner pick — build
            it into a morning before a race session, not an evening plan.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Our direct read on Sawa</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Order à la carte and lean into the sharing format rather than a fixed tasting menu — the trolley-service
            dishes are built to land in the middle of the table, and a tasting menu&apos;s smaller, individually
            plated courses undercut exactly what makes Sawa&apos;s dinner service worth booking in the first place.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
