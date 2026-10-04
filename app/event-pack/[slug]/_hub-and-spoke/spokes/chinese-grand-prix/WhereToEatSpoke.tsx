import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// Three real, seeded dining experiences cover this trip's actual spread:
// Anting Old Street (near-venue casual, real Ming/Qing-era river town),
// Nanxiang Xiaolongbao (budget/casual, the real historic birthplace of
// Shanghai's soup dumpling, also in Jiading District), and Mr & Mrs Bund
// (upscale, downtown — a genuine Bund fine-dining destination, no
// circuit-adjacent equivalent exists). No bookingLinks set on any of the
// three as of this build — affiliate opportunity not yet actioned, flagged
// for the curator per feedback_affiliate_link_generation.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const antingOldStreet = linkedExperiences.find((e) => e.slug.includes("chinese-gp-anting-old-street-"));
  const nanxiang = linkedExperiences.find((e) => e.slug.includes("chinese-gp-nanxiang-xiaolongbao-"));
  const mrMrsBund = linkedExperiences.find((e) => e.slug.includes("chinese-gp-upscale-dining-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Chinese Grand Prix"
      status="teaser"
      h1="Real Ming-era street food near the circuit, or a proper Bund dinner downtown"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The three real picks — near-venue, budget, and upscale — are free above. The pack adds our direct verdict on how to sequence all three across a race weekend, plus a genuine budget street-food shortlist beyond the one named pick, the kind of detail most guides skip entirely."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Eating well during Chinese Grand Prix weekend means understanding a real geographic split. Near the circuit,
        Jiading District offers genuine, inexpensive local character — not a resort-town food court. A proper
        upscale meal, by contrast, means committing to the roughly hour-long trip downtown to the Bund, where
        Shanghai&apos;s serious dining scene actually lives.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Near the circuit — Anting Old Street</p>
      {antingOldStreet && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={antingOldStreet} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Budget &amp; genuinely historic — Nanxiang</p>
      {nanxiang && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={nanxiang} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Upscale — a proper Shanghai dinner downtown</p>
      {mrMrsBund && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={mrMrsBund} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book the upscale meal ahead</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Mr &amp; Mrs Bund&apos;s demand comes from its own standing reputation in Shanghai&apos;s dining scene,
          entirely separate from race-weekend tourism — book well ahead of your trip, not once you land, and treat
          it as a full-evening plan on a rest day rather than something to squeeze between sessions.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d sequence the three</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Anting Old Street and Nanxiang both sit within Jiading, close enough to combine into one relaxed morning
            or afternoon before a session day — Anting for casual snacks and a walk through a genuine 1,800-year-old
            river town, Nanxiang if the historic-food angle matters more than proximity. Save Mr &amp; Mrs Bund for
            the evening before or after the race weekend specifically — the round trip from Jiading alone runs close
            to two hours on top of the meal, so it never fits comfortably around a session day without cutting into
            sleep or race-morning prep.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Beyond the one named budget pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Nanxiang&apos;s old town has multiple century-old dumpling houses along Nanxiang Old Street, not just
            Guyi Garden Restaurant — Rihuaxuan and Changxinglou are both genuine alternatives with their own long
            histories, worth knowing about if the main pick has a wait. Anting Old Street similarly isn&apos;t a
            single-restaurant destination — it&apos;s a working street of snack vendors, tea shops, and fruit
            sellers, so treat it as somewhere to graze across a few stops rather than plan one sit-down meal.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
