import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import Link from "next/link";

const SPOKE_ID = "where-to-eat";

// Real seeded experiences, ported from the classic pack: Eating at the US
// Open (on-grounds concessions), Jackson Heights: The Food Mile and
// Flushing's Golden Mall (real Queens neighborhood food, genuinely
// distinct from a tourist-restaurant default). Rooftop Dinner Then the
// Night Session added here per founder direction (better fit than Itinerary).
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const eatingAtOpen = linkedExperiences.find((e) => e.slug.includes("eating-at-the-us-open"));
  const jacksonHeights = linkedExperiences.find((e) => e.slug.includes("jackson-heights-food-mile"));
  const goldenMall = linkedExperiences.find((e) => e.slug.includes("flushings-golden-mall"));
  const rooftopDinner = linkedExperiences.find((e) => e.slug.includes("us-open-rooftop-night-session"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="US Open"
      status="teaser"
      h1="What's actually on the grounds, plus the Queens food most visitors miss"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's on the grounds and Queens' real food scene are both free above — real, checkable facts. Unlocking adds our pick for a proper pre-night-session dinner and how to sequence it so you're not rushing from a restaurant table to your seat."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        US Open food splits into two real questions: what to eat without leaving the grounds, and what Queens itself
        actually eats — arguably the most genuinely diverse food borough in the country, sitting a few subway stops
        from the tennis.
      </p>

      {eatingAtOpen && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={eatingAtOpen} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What Queens actually eats</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Jackson Heights and Flushing are both a short subway ride from the grounds and worth a dedicated meal, not
        just a quick bite between sessions.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {jacksonHeights && <SpokeExperienceCard eventSlug={eventSlug} experience={jacksonHeights} isPro={isPro} />}
        {goldenMall && <SpokeExperienceCard eventSlug={eventSlug} experience={goldenMall} isPro={isPro} />}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">A rooftop dinner before the night session</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          For a night session specifically, a proper sit-down dinner beforehand — rather than grounds concessions —
          is a real way to make the evening feel like an occasion rather than a rushed match. See the real pick
          below.
        </p>
      </div>
      {rooftopDinner && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={rooftopDinner} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d sequence a night-session dinner</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Book the rooftop dinner for an early seating, well ahead of a 6pm gate time — a leisurely meal that runs
            long enough to risk missing the day session&apos;s final matches on the outer courts defeats the point.
            See the full{" "}
            <Link href={`/event-pack/${eventSlug}/arrival`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Arrival Guide
            </Link>{" "}
            for exactly how much of a buffer to build in before a night session.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: usopen.org (on-grounds concessions).
      </p>
    </SpokeShell>
  );
}
