import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "first-timer-guide";

// No dedicated First-Timer's Guide experience exists among Belgian GP's 20
// seeded experiences — written directly from facts already established
// elsewhere in this pack (circuit length, micro-climate from WeatherSpoke,
// exit-queue timing from GettingThereSpoke's seeded experience, Gold 3's
// sell-out pattern from TicketsSpoke), not invented. 12 Oct 2026.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Belgian Grand Prix"
      status="public"
      h1="A 7km circuit most fans roam, not sit still at — here's what genuinely trips up a first visit"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Spa-Francorchamps is the longest circuit on the F1 calendar, and that single fact shapes almost everything
        about how a first-time visit actually goes — more walking, more weather variation, and a genuinely
        different strategy than a compact, purpose-built stadium circuit. Here&apos;s what trips up most
        first-timers.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Pick a strategy — roam or commit, don&apos;t try both poorly</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          At 7 kilometres, Spa is too large to casually wander the whole circuit in a day the way you might at a
          compact stadium venue. Most experienced visitors do a version of the same plan: roam on Friday to find
          preferred spots on a Bronze GA ticket, then commit to a fixed grandstand or chosen bankside position for
          qualifying and the race. Deciding this before you arrive, rather than improvising on the day, makes a
          real difference.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Eau Rouge is uphill, not flat — and it's steeper than TV makes it look</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Eau Rouge/Raidillon is a compression-then-climb sequence that every driver on the grid rates as one of
          the toughest corners in motorsport — the gradient and the blind crest are both far more dramatic in
          person than any broadcast angle conveys. If you only watch one corner in person all weekend, this is the
          one most regulars would pick.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Arrive before 09:30 for a fence-side spot on race day</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          On Sunday, the Kemmel Straight bank and other popular General Admission spots fill by around 09:30 — a
          genuinely early cutoff for a race that doesn&apos;t start until mid-afternoon. If a specific fence-side
          view matters to you, build your morning around arriving well before that window, not after breakfast.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Plan your exit before the race ends, not after</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sunday exit queues on the circuit&apos;s single-carriageway roads regularly run two hours after the
          chequered flag. Most regulars either stay for the full podium ceremony and accept the wait, or walk to
          a nearby town like Stavelot and let the worst of the traffic clear before moving — deciding which one
          you&apos;re doing ahead of time beats discovering the queue in the moment.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Weather that changes corner to corner, not just hour to hour</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          July in the Ardennes runs 18–26°C at peak, but Spa&apos;s own micro-climate means one part of the
          circuit can be dry while another, a few kilometres away, is in a downpour. A waterproof you keep on you
          all day, not back at your seat or the hotel, matters more here than at almost any other circuit on the
          calendar — full detail in the{" "}
          <a href={`/event-pack/${eventSlug}/weather`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Weather &amp; What to Pack guide
          </a>
          .
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Practical essentials</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">The official Formula 1 app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Schedule changes, Fan Zone driver appearances, and session timing updates in real time — often
              posted here first. Worth downloading before you travel.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A packable rain layer</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Non-negotiable here regardless of how the morning looks — the micro-climate means a clear sky at
              your seat tells you almost nothing about the rest of the circuit.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A fold-up chair, if you&apos;re on Bronze GA</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Most of the circuit has no cover outside the paid grandstands — worth packing given how much ground
              Bronze GA actually covers at a 7km circuit.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Comfortable walking shoes, genuinely</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              This is the longest circuit on the calendar — moving between sections on a roaming day covers real
              distance, more so than at a compact stadium venue.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Ear defenders</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Standard for any trackside F1 weekend, worth packing regardless of which section you&apos;re in.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Recalibrate your expectations</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Spa isn&apos;t a circuit you watch from one seat the way a compact stadium venue encourages — the scale
          and the forest setting reward movement and planning over sitting still, and the corner most drivers
          themselves name as their favourite on the entire calendar is worth building a plan around.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What actually matters most, first time</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Book your ticket and shuttle early — Gold 3 at Raidillon and the day-return shuttle bookings both have a
          track record of selling out well ahead of race weekend. Decide your roam-or-commit strategy before you
          arrive, not on the day. Everything else — the exit-queue timing, the corner-to-corner weather, the sheer
          distance of the circuit — is manageable with the detail already in this pack.
        </p>
      </div>
    </SpokeShell>
  );
}
