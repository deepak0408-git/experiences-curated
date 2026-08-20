import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const perthStadium = linkedExperiences.find((e) => e.slug.includes("perth-stadium-series-opener"));
  const adelaideOval = linkedExperiences.find((e) => e.slug.includes("adelaide-oval-most-beautiful-ground"));
  const mcg = linkedExperiences.find((e) => e.slug.includes("mcg-boxing-day-test"));
  const scg = linkedExperiences.find((e) => e.slug.includes("scg-fourth-test-sydney-summer"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="public"
      h1="Four grounds, four different arrival realities — Boxing Day is not a normal Test day"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        General Admission at any of the four grounds means unreserved seating on the day — arriving early genuinely
        earns you a better spot, the same way it does at any Test venue. What changes ground to ground is how much
        that actually matters: Perth Stadium&apos;s own dedicated train station removes most of the arrival
        friction other grounds have, while the MCG on Boxing Day is genuinely one of the highest-attendance single
        days in world cricket and needs real margin built in.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {perthStadium && <SpokeExperienceCard experience={perthStadium} isPro={isPro} />}
        {adelaideOval && <SpokeExperienceCard experience={adelaideOval} isPro={isPro} />}
        {mcg && <SpokeExperienceCard experience={mcg} isPro={isPro} />}
        {scg && <SpokeExperienceCard experience={scg} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Boxing Day at the MCG is a different scale of arrival</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The MCG&apos;s own Boxing Day Test regularly draws crowds among the largest single-day cricket attendances
          anywhere in the world. If you&apos;re on a General Admission ticket for this specific day, treat arrival
          timing with real seriousness — get to the ground meaningfully earlier than you would for any other Test
          on this tour, since both the transport network and the gates themselves are handling a genuinely different
          volume of people than a standard Test day at any of the other three grounds.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-sm font-bold text-white mb-2">Exact gate-opening times aren&apos;t published yet</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Cricket Australia hasn&apos;t published session start times or gate-opening times for this specific
          2026-27 series as of this writing — we won&apos;t invent them. Expect gates to open roughly 1-2 hours
          before the scheduled first-session start, in line with standard CA Test match practice, and confirm exact
          times via cricket.com.au closer to each Test.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: cricket.com.au (standard CA Test-match arrival practice); each venue's own transit network
        (Transperth, Adelaide Metro, PTV, Opal Travel).
      </p>
    </SpokeShell>
  );
}
