import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Fan Zone (included with every ticket) lives here per the founder's
// explicit spoke-mapping decision, 13 Sep 2026 — framed as part of what a
// visitor encounters once inside the gates, alongside real arrival/queue
// logistics, rather than grouped with the paid ticket tiers.
//
// Real, confirmed 2026 session times (founder-supplied screenshot from
// formula1.com/en/racing/2026/qatar, 13 Sep 2026, track-local time):
// Fri P1 16:30-17:30, P2 20:00-21:00; Sat P3 17:30-18:30, Quali 21:00-22:00;
// Sun Race 19:00. Every session lands in the afternoon or evening — no
// morning on-track activity at all across the weekend.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const fanZone = linkedExperiences.find((e) => e.slug.includes("qatar-gp-fan-zone-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="public"
      h1="Every session lands in the afternoon or evening — the Fan Zone behind Main Grandstand is the easiest way to fill the earlier hours"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Qatar&apos;s confirmed 2026 session times: Friday Practice 1 runs 16:30-17:30, Practice 2 20:00-21:00.
        Saturday Practice 3 runs 17:30-18:30, Qualifying 21:00-22:00. Sunday&apos;s race starts at 19:00. Gate-opening
        times themselves aren&apos;t published this far out, but expect gates several hours ahead of each day&apos;s
        first session — confirm exact times via formula1.com closer to race week.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Free metro and shuttle — no separate arrival cost</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Any valid race ticket includes a 3-day Doha Metro and shuttle pass — ride the Red Line to Lusail Station,
          then take the free shuttle straight to the circuit. See the Getting There guide for the full transit
          breakdown, including Karwa taxi as the faster paid alternative.
        </p>
      </div>

      {fanZone && (
        <div className="mb-8">
          <SpokeExperienceCard experience={fanZone} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Included with every ticket, no upgrade needed</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Fan Zone sits directly behind Main Grandstand, next to the circuit&apos;s main entrance and parking —
          an easy stop on the way in or out regardless of which stand you&apos;re sitting in. F1 driving simulators,
          a real Pit Stop Challenge where fans try changing an actual tyre against the clock, and free post-race
          concerts all run here on the same ticket you already bought.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Arrive with enough time to walk the Fan Zone before your first session, especially if you&apos;re
            traveling with kids — the Pit Stop Challenge and simulators run through the day, but the earlier arrival
            slots have noticeably shorter waits than the rush right before a headline session. Save the post-race
            concert for a night you don&apos;t have an early flight the next morning — Sunday&apos;s shuttle service
            runs until 2am specifically to cover it, which tells you how late the crowd genuinely stays.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
