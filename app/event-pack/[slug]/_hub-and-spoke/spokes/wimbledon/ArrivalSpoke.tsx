import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Content ported from INSIDER_TIPS["wimbledon-2026"]["Queue"] and the real
// "The Wimbledon Queue" experience — the real, already-approved classic-
// pack copy. Distinct from Tickets (which covers the ballot/resale
// purchase decision) — this spoke covers the physical act of arriving and
// queuing at the gates.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const theQueue = linkedExperiences.find((e) => e.slug.includes("the-wimbledon-queue"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="public"
      h1="Midday the day before for Centre Court, 5-6am for a grounds pass"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Queue is one of Wimbledon&apos;s real, functioning traditions — an organised, friendly overnight line
        for day tickets, run by the club itself, not an informal scramble. How early you need to arrive depends
        entirely on what you&apos;re queuing for.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">When to arrive</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">For Centre Court</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Join by midday the day before and camp overnight. Queue cards are issued from mid-afternoon, one per
            person present — the whole party needs to be there to be counted.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">For a grounds pass</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Arriving by 5-6am on the morning is usually enough — the line moves steadily once gates open at 10:30am.
          </p>
        </div>
      </div>

      {theQueue && (
        <div className="mb-8">
          <SpokeExperienceCard experience={theQueue} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Gates open at 10:30am daily</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Day tickets are released to queuers at 9:30am, ahead of the 10:30am gate opening. Bring layers, a
          waterproof, and something to sit on — the wait is real regardless of how well-organised the line is.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
Source: wimbledon.com, AELTC published Queue guidance and gate times.
      </p>
    </SpokeShell>
  );
}
