import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "first-timer-guide";

// Real content drawn from the Hungaroring's own history and reputation
// (karting-circuit comparison, natural-bowl terrain — both widely sourced
// facts), cross-referenced against this pack's own Cost/Tickets/Map/Weather
// spokes for consistency (gate times, bag policy, cover status, GA
// sightlines). No dedicated "first-timer" experience exists among the 20
// seeded Hungarian GP experiences — this spoke renders with no linked
// SpokeExperienceCard, matching sibling events with the same gap.
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
      eventName="Hungarian Grand Prix"
      status="public"
      h1="The calendar's cheapest ticket, and the hardest circuit on it to actually pass on"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Hungaroring doesn&apos;t look like most F1 circuits on a map — a tight, continuous run of corners
        that&apos;s been compared to a karting track more than once, sitting in a natural bowl outside Budapest
        that gives General Admission spectators a real, elevated view across multiple corners at once. It&apos;s
        also the one circuit on the calendar where a genuinely cheap ticket doesn&apos;t mean a compromised view —
        here&apos;s what actually trips up a first-time visitor.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Turn 1 is the one place to actually watch the race decide itself</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Hungaroring has a real, long-standing reputation as one of the hardest circuits on the calendar to
          overtake on — most positions set early and hold until strategy reshuffles them later. Turn 1, officially
          Piquet corner since F1&apos;s 2025 naming of every Hungaroring turn, is the genuine exception: the
          corner Nelson Piquet passed Ayrton Senna around the outside at on lap 68 of the very first 1986 race, and
          still the one place a pass reliably sticks. If watching real racing matters more than the broader
          atmosphere, that&apos;s where to put your attention.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">General Admission is genuinely strong here, not a fallback</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The circuit sits in a natural bowl, which means the hillside GA areas give real, elevated sightlines
          across several corners at once — a genuinely different experience from a flat circuit where General
          Admission usually means standing at one fence line with a single narrow view. Combined with the
          calendar&apos;s cheapest ticket tier, this is a real reason Hungary is a strong pick for a budget-
          conscious first Grand Prix.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Bring a card, not cash</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The circuit runs a fully cashless payment system — any cash you bring has to be loaded onto a Festipay
          card at the gate, refundable fee-free afterward. Budget more than you&apos;d expect for food and drink
          on-site, roughly 10,000-15,000 forint (around US$27-40) per person per day, despite the circuit&apos;s
          reputation for affordable tickets.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where you base yourself matters</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Budapest, 25 minutes away by metro and suburban rail, is the right default hotel base for almost
          everyone — picking a hotel without an M2 stop nearby costs you time every single morning of the
          weekend, and it&apos;s an easy detail to overlook when you&apos;re booking on price or brand alone
          rather than transit access.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Don&apos;t treat Budapest as an afterthought</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Two things genuinely trip up first-time visitors here, and both come down to the same mistake —
          treating this as a circuit trip with a city attached, rather than a real capital-city trip that happens
          to include a race weekend. The Széchenyi Thermal Bath is easy to skip entirely if you&apos;re only
          thinking about session times, but it&apos;s one of the calendar&apos;s genuine non-race highlights —
          Europe&apos;s largest medicinal bath complex, and a real half-day worth building in deliberately. And
          Budapest itself rewards actual time, not just an evening after each session — first-timers who treat
          the city as a place to sleep between sessions consistently regret not blocking out a proper day for it.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Weather that can turn fast</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Late July regularly pushes past 30°C with real afternoon thunderstorms that can roll in on an otherwise
          clear morning. Only a small, foldable umbrella is allowed through the gate, and it can&apos;t be used
          inside a grandstand — a packable rain layer is the more reliable call, especially in an uncovered stand
          or on the General Admission hillside.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Practical essentials</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">The official Formula 1 app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Covers every circuit on the calendar, including the Hungaroring — session timing, schedule changes,
              and live updates, often posted here before anywhere else. Worth downloading before you land.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">BudapestGO</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The city&apos;s official transit app — covers the M2 metro and HÉV suburban rail you&apos;ll use to
              reach the circuit, plus getting around Budapest itself on non-session days.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A Festipay-loaded card, not loose cash</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The circuit is cashless — load cash onto a Festipay card at the gate if you don&apos;t want to use a
              bank card directly, and claim any unused balance back fee-free at the end of the weekend.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A refillable water bottle</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Free drinking water is available throughout the circuit — genuinely worth using across three full
              days of late-July heat with limited shade outside the covered main grandstand.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A packable rain layer, even with the umbrella rule</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Umbrellas allowed here are small and can&apos;t be used in a grandstand anyway — a jacket keeps both
              hands free and covers the real afternoon-storm risk without the hassle.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Comfortable shoes for the hillside</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              General Admission here means genuinely walking the natural bowl terrain to find and hold a spot, not
              a flat, paved stroll between fixed viewing points.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Recalibrate your expectations</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          If you&apos;ve been to a faster, flatter circuit elsewhere on the calendar, the Hungaroring&apos;s
          technical, hard-to-pass character is a genuinely different kind of race weekend — the reward here is
          watching cars work through a continuous sequence of corners under real pressure, not chasing wheel-to-
          wheel overtaking all afternoon. Set that expectation before you arrive and the circuit&apos;s real
          strengths — the natural-bowl GA sightlines, the Piquet corner history, the affordability — land better.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What actually matters most, first time</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Book your ticket and hotel earlier than you&apos;d think necessary — even the calendar&apos;s cheapest
          event has its own sell-out patterns, and the covered main grandstand goes first every year given
          it&apos;s the only weather-proof seat. Everything else — the M2-then-HÉV-then-shuttle route, the
          cashless payment system, the layering for a hot day that can turn stormy — is manageable with the detail
          already in this pack.
        </p>
      </div>
    </SpokeShell>
  );
}
