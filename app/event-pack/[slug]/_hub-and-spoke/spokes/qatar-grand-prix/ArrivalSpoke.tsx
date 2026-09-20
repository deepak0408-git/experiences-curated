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
//
// Prohibited items + no-re-entry section added 14 Sep 2026 (previously
// missing entirely, unlike São Paulo's ArrivalSpoke) — sourced from the
// official ticketing site, tickets.gp/en/f1/f1qatar/at-the-circuit/
// rules-for-visitors (redirected from qatar.gp's own rules-for-visitors
// page, 14 Sep 2026): 75cm bag size limit, no outside food/drink except
// baby food, professional cameras/large rigs/drones need authorization,
// banned items include weapons, glass, laser pointers, two-way radios,
// musical instruments over 120cm, banners over 2x1.5m, animals except
// assistance dogs. No re-entry once you leave the security perimeter —
// corroborated across independent search results (oversteer48.com, The
// Peninsula Qatar, marhaba.qa), matching the same rule at every other F1
// venue in this pack. Fan Zone now explicitly framed (why it matters, not
// just dropped in) before its card, matching São Paulo's pattern.
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
      h1="Bag checks at every gate, no re-entry once you're in, and a Fan Zone that fills the wait"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Exact 2026 gate-opening times haven&apos;t been published yet — expect roughly 2-3 hours before each
        day&apos;s first session, in line with other F1 venues' published gate times against their own session
        schedules. Qatar&apos;s confirmed 2026 session times: Friday Practice 1 runs 16:30-17:30, Practice 2
        20:00-21:00. Saturday Practice 3 runs 17:30-18:30, Qualifying 21:00-22:00. Sunday&apos;s race starts at
        19:00 — on race day specifically, arrive on the earlier end of that window, since it&apos;s the busiest
        crowd of the weekend. Confirm the exact gate time via formula1.com once it&apos;s published closer to race
        week.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Free metro and shuttle — no separate arrival cost</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Any valid race ticket includes a 3-day Doha Metro and shuttle pass — ride the Red Line to Lusail Station,
          then take the free shuttle straight to the circuit. See the Getting There guide for the full transit
          breakdown, including Karwa taxi as the faster paid alternative.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Three access tunnels, not one main gate</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Part of the 2023 rebuild, the tunnels were built specifically to spread arriving and departing crowds
          across multiple routes into the venue rather than funneling everyone through a single main entrance —
          real infrastructure for a circuit that nearly sextupled its capacity without changing its footprint.
          Which tunnel and gate you actually want depends on your grandstand, and that assignment isn&apos;t
          published in advance — check the official Qatar GP app&apos;s Maps feature or on-site signage and
          marshals once you arrive, rather than guessing based on your drop-off point.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Prohibited items</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Every entrance runs an airport-style security check, and the list is longer than most first-timers expect
          — worth checking against your own bag before you leave the hotel.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Bags" value="No dimension over 75cm — backpacks and handbags within that limit are fine" />
          <FactRow label="Food and drink" value="Banned, except baby food and snacks for young children" />
          <FactRow label="Cameras and drones" value="Personal cameras fine — professional broadcasting rigs and drones need organizer authorization" />
          <FactRow label="Also banned" value="Glass containers, laser pointers, two-way radios, musical instruments over 120cm, banners over 2x1.5m, animals except registered assistance dogs" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">There&apos;s no re-entry</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Once you leave the circuit&apos;s security perimeter, you can&apos;t come back in the same day, even with a
          valid ticket. Plan for the whole day, not a version of the day with a break in the middle.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The Fan Zone fills the wait</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
        Sitting directly behind Main Grandstand, next to the circuit&apos;s main entrance and parking, the Fan Zone
        is the natural stop for the daytime hours every session leaves open — no separate ticket or upgrade needed,
        and it absorbs the same crowd already flowing in and out through that entrance.
      </p>

      {fanZone && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={fanZone} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Arrive 2-3 hours ahead of your first session, on the earlier end for Friday and race day specifically —
          it clears the bag check before the crowd peaks and leaves real time to walk the Fan Zone, especially if
          you&apos;re traveling with kids. The Pit Stop Challenge and simulators run through the day, but the
          earlier arrival slots have noticeably shorter waits than the rush right before a headline session. Save
          the post-race concert for a night you don&apos;t have an early flight the next morning — Sunday&apos;s
          shuttle service runs until 2am specifically to cover it, which tells you how late the crowd genuinely
          stays.
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
