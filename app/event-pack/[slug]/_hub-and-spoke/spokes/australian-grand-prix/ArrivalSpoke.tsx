import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Real content sourced from the seeded Arrival & Queue Guide experience
// (arrival-queue-guide-gates-bag-policy-mu9caq03), 20 Sep 2026: seven
// non-sequential gates, 8:30am opening, prohibited items list, and the real
// 90-minutes-before-open queue benchmark for Brocky's Hill. Fan Zone and
// Lakeside Festival both sit here per the founder-agreed spoke mapping
// (20 Sep 2026) — both are race-week, in-park fan program content, distinct
// from the day-trip/sightseeing set.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const arrivalGuide = linkedExperiences.find((e) => e.slug.includes("arrival-queue-guide-gates-bag-policy-mu9caq03"));
  const fanZone = linkedExperiences.find((e) => e.slug.includes("fan-zone-melbourne-walk-fan-forum-mu9cfep3"));
  const lakesideFestival = linkedExperiences.find((e) => e.slug.includes("lakeside-festival-albert-park-mu9cgpaz"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Grand Prix"
      status="public"
      h1="Seven gates, not sequential, plus the real queue benchmark for the best GA spots"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Albert Park has seven entry gates — numbered 1, 2, 3, 5, 8, 9, and 10, not sequential, which trips up a lot
        of first-timers looking for a Gate 4 or Gate 6 that doesn&apos;t exist. Gates typically open at 8:30am
        Friday through Sunday, with Thursday&apos;s practice day opening slightly later at 9:30am.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Which gate to use</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Grandstand ticket holders have their gate printed on the ticket itself. Park Pass general admission
          holders can use Gates 2 through 10 — Gate 1 is best avoided, since it tends to be the most congested.
          Every gate runs a security check and bag search, and this is where queue length is decided more than
          anything else — coming without a bag, or having one person in your group carry everyone&apos;s bags, gets
          you through noticeably faster via the no-bag line.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Prohibited items</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-2">
          <FactRow label="Glass bottles, alcohol, hard-cased eskies" value="Banned — soft coolers and polystyrene eskies are fine" />
          <FactRow label="Drones" value="Flying one at the circuit is a criminal offence, not just a confiscation" />
          <FactRow label="Umbrellas & laser pointers" value="Banned — bring a rain jacket instead" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The real queue benchmark for the best GA spots</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Serious regulars chasing the best Park Pass spots — Brocky&apos;s Hill, the Turn 2 mound — are known to
          queue at Gates 8 or 9 up to 90 minutes before gates actually open on Sunday. If claiming a specific
          general admission spot is the priority, that&apos;s the real benchmark to plan against, not a rough
          guess. If you don&apos;t need a specific spot, Thursday and Friday are meaningfully quieter days to
          arrive later and still get a reasonable position.
        </p>
      </div>

      {arrivalGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={arrivalGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3 mt-4">Once you're inside — the Fan Zone and Lakeside Festival</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {fanZone && <SpokeExperienceCard eventSlug={eventSlug} experience={fanZone} isPro={isPro} />}
        {lakesideFestival && <SpokeExperienceCard eventSlug={eventSlug} experience={lakesideFestival} isPro={isPro} />}
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Knowing which gate to head for before you leave your accommodation, rather than following the crowd once
          you&apos;re near the circuit, is the single biggest time-saver here. Albert Park&apos;s gates are spread
          around a 5km perimeter, and walking from the wrong side of the lake to correct your mistake can cost
          20-30 minutes you&apos;d rather spend inside.
        </p>
      </div>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
