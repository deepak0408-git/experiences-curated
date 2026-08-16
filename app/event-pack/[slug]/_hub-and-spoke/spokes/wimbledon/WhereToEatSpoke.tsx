import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// Rebuilt 15 Aug 2026 per direct founder review. Real changes: (1) The
// Crooked Billet and The Black Lamb cards now sit in a 2-column grid, not
// stacked single-column — matching the standing rule that consecutive
// cards with no interleaved text between them always use a 2-column grid
// (see hub-and-spoke-event-pack SKILL.md); (2) real on-grounds detail
// added — where the shortest strawberries/Pimm's lines actually are, and
// that Henman Hill genuinely has its own Pimm's tent so you don't need to
// leave the Hill to get one; (3) strawberries-and-cream price corrected to
// £2.85 (2026 event price; was stale at £2.50, which hasn't been accurate
// since the 2025 rise to £2.70 — researched via WebSearch, 15 Aug 2026);
// (4) "Where we'd actually book" deepened with the real Black Lamb detail
// already in its own practicalInfo.howToBook (jazz nights, table-hold
// tactic); (5) internal source line replaced with a reader-facing footer;
// (6) CTA rewritten to state the free/paid split explicitly, per founder
// direction.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const eating = linkedExperiences.find((e) => e.slug.includes("wimbledon-eating"));
  const crookedBillet = linkedExperiences.find((e) => e.slug.includes("dinner-at-the-crooked-billet"));
  const blackLamb = linkedExperiences.find((e) => e.slug.includes("dinner-at-the-black-lamb"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="teaser"
      h1="The strawberries, plus where SW19 actually eats after the last match"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Eating on the grounds is free above — real tactics, not a sales pitch. What it can't tell you is where to eat when the day's over: The Crooked Billet and The Black Lamb both fill for the nights that matter, and turning up without a table on Middle Saturday means a chain on the Broadway instead. Unlocking adds our verdict on which one fits your night, the exact booking window before the Fortnight's biggest days sell out, and the direct-call move that gets you a table when the website says fully booked."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The strawberries first: yes, get them. The Wimbledon strawberries-and-cream ritual is worth doing once for
        the ritual alone, queue included — £2.85 for a portion, picked before dawn (up from £2.50 in 2024 and £2.70
        in 2025, so expect another small rise by the time you go). After that, the real food question is how to eat
        well around the tournament without overpaying or ending at a chain on the Broadway.
      </p>

      {eating && (
        <div className="mb-8">
          <SpokeExperienceCard experience={eating} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Eating on the grounds — the real tactics</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Shortest strawberries queue</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The main stalls run a genuine queue through peak afternoon hours (roughly 8 minutes at busiest). Go
            straight after gates open, or after 5pm — by late afternoon much of the day&apos;s early crowd has
            either left or is heading out, and the line moves noticeably faster.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Eating on Henman Hill</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            You don&apos;t need to leave the Hill for either ritual — it has its own Pimm&apos;s tent, and
            strawberries and cream can be carried straight up. Bring your own picnic food too (no alcohol from
            outside, no glass) rather than queueing twice for both a match view and a meal.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Pimm&apos;s</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          A Wimbledon fixture since 1971; official stalls are scattered across the grounds, not just on the Hill. No
          glass and no alcohol brought in from outside the grounds — check the AELTC website for the current
          year&apos;s rules before packing if you want to bring your own.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Two real village picks</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {crookedBillet && <SpokeExperienceCard experience={crookedBillet} isPro={isPro} />}
        {blackLamb && <SpokeExperienceCard experience={blackLamb} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Both are real village pubs rather than tournament-adjacent chains — pick whichever fits the night. The
            Black Lamb runs live jazz from 7pm on Wednesdays, worth timing a booking around if you want the fuller
            atmosphere; tables from 7pm onward get a genuine two-hour sitting, versus 90 minutes for anything booked
            before 6:45pm. If the set menu shows sold out for your date online, call the restaurant directly on 020
            8947 8278 — during the Fortnight they sometimes hold back a small number of tables that never make it
            onto the online booking system.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Village tables fill fast on the biggest match days (Middle Saturday, semi-finals, finals weekend) — book
            at least two weeks ahead for any evening sitting during the Fortnight, and earlier still for those
            specific nights, especially if the day&apos;s play has run long and the whole grounds crowd is looking
            for dinner at once.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: wimbledon.com (on-grounds food and drink), theblacklamb-restaurant.com.
      </p>
    </SpokeShell>
  );
}
