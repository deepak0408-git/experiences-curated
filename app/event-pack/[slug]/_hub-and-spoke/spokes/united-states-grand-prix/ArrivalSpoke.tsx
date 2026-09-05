import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const generalAdmission = linkedExperiences.find((e) => e.slug.includes("us-gp-general-admission"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="United States Grand Prix"
      status="public"
      h1="Gates open early — here's what to expect on arrival"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        COTA hasn&apos;t published exact 2026 gate-opening times as of this guide. Based on the pattern in recent
        race weekends, expect gates to open roughly 9:00-10:00am each day of the 23-25 October weekend — confirm
        exact times via the official COTA app closer to race week. What&apos;s already reliable is the shuttle
        schedule and the ticket-delivery mechanics below.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Two official shuttle routes</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Downtown shuttle picks up at Waterloo Park/Moody Amphitheater on Red River Street and drops off
          right outside the Grand Plaza gates on COTA Boulevard — a 3-day pass runs US$172.03, a single day
          US$68.31. The Northeast Austin shuttle runs from the Travis County Expo Center (enter via Gate 1 off
          Decker Lane, near US-290/183 and the 130 Tollway), with a free parking lot and air-conditioned buses —
          a 3-day pass runs US$102.88, a single day US$45.26. Both routes run continuously starting 60 minutes
          before gates open each day; the last inbound shuttle departs 2pm on Sunday and 6:30pm Friday/Saturday,
          with return service ending 60 minutes after the music ends on concert nights. Buy your pass ahead of
          time — these sell out, and this isn&apos;t a walk-up option on race morning.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ticket delivery — digital, not physical (mostly)</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Every reserved-seat grandstand ticket (Main Grandstand, Turn 1, Turn 15) is digital-only, delivered
          through the official app closer to race weekend — download it and load your ticket before you leave the
          hotel. General Admission is the one real exception: those wristbands are physically mailed 4-6 weeks
          ahead, not issued digitally, so confirm your shipping address is current if you&apos;re buying GA.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Getting to your seat once you&apos;re inside</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          COTA is a large circuit — budget real walking time between the gates and your specific grandstand,
          especially for Turn 1 and Turn 15, which sit well away from the main entrance. If you&apos;re on a
          General Admission ticket, popular spots (Turn 1 especially) fill in fast enough on race morning that
          arriving well before gates open matters more than for any reserved-seat tier.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Leaving your seat mid-session</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Whether stepping out for food or the restroom costs you your spot depends entirely on your ticket type. In
        a reserved grandstand (Main, Turn 1, Turn 15), your seat is yours for the session regardless of when you
        return — a break doesn&apos;t cost you your view. General Admission is a genuine grounds pass with no
        assigned or reserved location, so there&apos;s no official guarantee you&apos;ll get the exact patch of
        hill or fence-line back once you leave it — treat a mid-session break as a real trade-off, and bring water
        and snacks in with you rather than planning to step out, especially at Turn 1 in the hour before the race
        start when the crowd is at its densest.
      </p>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Re-entry, if you leave the grounds entirely</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Re-entry is permitted the same day, but your ticket has to be scanned out at the gate before you leave
          — skip that step and you may not be able to scan back in. Expect a second security screening on the way
          back in too, so budget real time for it, not just the walk.
        </p>
      </div>

      {generalAdmission && (
        <div className="mb-8">
          <SpokeExperienceCard experience={generalAdmission} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            For race day specifically — the single heaviest-traffic day of the weekend — book the Downtown shuttle
            over driving yourself if you&apos;re staying centrally; the drop-off right at the Grand Plaza gates
            beats the walk from any COTA-run parking lot, and it removes the parking-sellout risk (see the
            First-Timer Guide) entirely. If you&apos;re on General Admission and Turn 1 is your target spot, treat
            gate-opening time as a hard deadline, not a suggestion — arrive at the gate itself, not just at COTA,
            by the time it opens, since the walk from the shuttle drop-off or parking lot to Turn 1 already eats
            into that early-arrival advantage.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: help.thecircuit.com, circuitoftheamericas.com (shuttle pricing and schedule), kvue.com, kxan.com.
      </p>
    </SpokeShell>
  );
}
