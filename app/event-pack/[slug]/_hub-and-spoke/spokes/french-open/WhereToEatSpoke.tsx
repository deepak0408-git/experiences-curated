import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import Link from "next/link";

const SPOKE_ID = "where-to-eat";

// Real seeded experiences: What to Eat Inside Roland Garros (concessions,
// Le Jardin des Chefs) and Everyday Parisian Eating (baguette/jambon-beurre
// culture). Luxury Dining lives in the Luxury spoke per the agreed
// spoke-mapping, cross-referenced here rather than duplicated.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const insideFood = linkedExperiences.find((e) => e.slug.includes("what-to-eat-inside-roland-garros"));
  const everydayEating = linkedExperiences.find((e) => e.slug.includes("everyday-parisian-eating-baguette-jambon-beurre"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="teaser"
      h1="What's actually on the grounds, plus the everyday food most visitors miss"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's on the grounds and how Parisians actually eat are both free above — real, checkable facts. Unlocking adds our verdict on which luxury restaurant fits which kind of night, and the specific baguette worth a genuine detour."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Roland-Garros food splits into two real questions: what to eat without leaving the grounds, and what Paris
        itself actually eats — a genuinely different, better answer than the tourist-restaurant version most
        visitors default to.
      </p>

      {insideFood && (
        <div className="mb-8">
          <SpokeExperienceCard experience={insideFood} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What Parisians actually eat</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Skip the tourist-trap crêpe stand for a morning boulangerie stop instead — it's cheaper, better, and closer
        to how the city actually eats lunch.
      </p>
      <div className="mb-8">
        {everydayEating && <SpokeExperienceCard experience={everydayEating} isPro={isPro} />}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Bringing your own food</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Bringing your own food onto the grounds is explicitly permitted — a real way to manage cost across a long
          tournament day. Alcohol and sharp cutlery are the exceptions (see the{" "}
          <Link href={`/event-pack/${eventSlug}/weather`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Weather guide
          </Link>{" "}
          for the full bag-policy detail).
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book for a proper dinner</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            La Grande Cascade or Le Pré Catelan for a genuine special-occasion night out, both in the Bois de
            Boulogne a short taxi from the venue — see the full{" "}
            <Link href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </Link>{" "}
            for the real comparison between them and Blanc. For anything less formal, the 16th arrondissement has
            genuine neighborhood restaurants around Auteuil worth walking to rather than settling for whatever's
            closest to the Métro exit.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The one baguette worth a detour</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The 2026 Grand Prix de la Baguette winner was Fournil Didot in the 14th arrondissement — a genuine trek
            from Roland-Garros, but worth knowing about if chasing the officially "best" baguette in Paris matters
            to you. Closer to the venue, Boulangerie Patisserie à la Flûte Enchantée in Passy is a well-regarded,
            realistic stop on the way to or from a match day.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: rolandgarros.com (on-grounds concessions), paris.fr (Grand Prix de la Baguette).
      </p>
    </SpokeShell>
  );
}
