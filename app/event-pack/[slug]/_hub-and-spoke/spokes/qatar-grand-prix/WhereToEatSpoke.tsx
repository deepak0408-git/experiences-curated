import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// Three real, seeded dining experiences: Qatari Cuisine in Souq Waqif
// (Shay Al Shomous + Al Aker Sweets, multi-venue), Sawa by Sanad (modern
// Levantine, Msheireb), and Parisa (Persian atmosphere dining, Souq
// Waqif). All sourced 13 Sep 2026.
//
// Gated section, 14 Sep 2026: founder flagged the unlocked content as too
// thin to justify the paywall — no closed-day fact exists for any of these
// 3 venues (all run daily, unlike São Paulo's Maní/Mondays), so instead
// this adds a real, verified bookable add-on matching São Paulo's pattern —
// GetYourGuide's "Souq Waqif Guided Tour with Authentic Arabic Food
// Tasting" (Falcon Souq, food-market tasting stop, guided Souq Waqif walk,
// ~2hrs), confirmed live via screenshot (founder, 14 Sep 2026): 4.8/11
// reviews, From ₹3,822 → ₹3,058/person, free cancellation 24hrs ahead.
// Price converted INR→USD at the day's rate (₹95.59 = $1) and rounded up
// to US$32 per standing pricing rules — not a fabricated figure.
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
      ctaCopy="Three real picks, three real price points, all free above. What the pack adds is which one to book on which night, our direct read on Sawa's tasting menu versus à la carte, and a bookable guided food tour through Souq Waqif and the Falcon Souq for anyone who'd rather not navigate the market alone."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Doha&apos;s food scene runs from genuinely inexpensive souq stalls to Michelin-listed fine dining, often
        within a few blocks of each other. These three picks span that range: an authentic Qatari home-cooking spot,
        a modern Levantine sharing-plate destination, and a Persian restaurant whose interior alone justifies the
        booking.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {qatariCuisine && <SpokeExperienceCard experience={qatariCuisine} isPro={isPro} />}
        {sawa && <SpokeExperienceCard experience={sawa} isPro={isPro} />}
        {parisa && (
          <div className="sm:col-span-2">
            <SpokeExperienceCard experience={parisa} isPro={isPro} />
          </div>
        )}
      </div>

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
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Order à la carte and lean into the sharing format rather than a fixed tasting menu — the trolley-service
            dishes are built to land in the middle of the table, and a tasting menu&apos;s smaller, individually
            plated courses undercut exactly what makes Sawa&apos;s dinner service worth booking in the first place.
          </p>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
            <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
              Prefer a guided introduction to the souq over navigating it alone? A ~2-hour tour covers Falcon Souq,
              a local food-market stop with tasting included, and a guided walk through Souq Waqif itself — from
              around US$32 per person, free cancellation up to 24 hours ahead.
            </p>
            <a
              href="https://www.getyourguide.com/doha-l1885/souq-waqif-guided-tour-with-authentic-arabic-food-tasting-t1126405/?partner_id=HCNITTS&utm_medium=online_publisher"
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
            >
              Book the Souq Waqif Guided Food Tour →
            </a>
          </div>
        </div>
      )}
    </SpokeShell>
  );
}
