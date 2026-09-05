import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const firstTimerGuide = linkedExperiences.find((e) => e.slug.includes("us-gp-first-timer-guide"));
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
      h1="5 mistakes first-time visitors make at COTA"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The 2026 US Grand Prix is a standard weekend, not a sprint weekend — Austin ran the sprint format for three
        straight seasons but loses it for 2026. Friday brings two practice sessions (FP1 and FP2), Saturday brings
        a third practice session (FP3) followed by qualifying, and Sunday is race day itself — the only session
        where points are actually on the line. Here&apos;s what genuinely trips up a first-time visitor, drawn from
        real detail rather than generic advice.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — booking parking too late, or not at all</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Official COTA parking (Lots C, F, K, L, T, R, plus a Park &amp; Ride) starts at US$52/day, with Lot T near
          Turn 1 the closest and priciest at US$134.50/day — and first-timers consistently underestimate how
          quickly these sell out. A parking pass issued directly by COTA is required; showing up hoping to buy one
          at the gate on race day is a real, common way to end up parking far off-site or paying private-lot rates
          on FM-812 or Elroy Road instead (roughly US$60-150 for the full weekend).
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — not scanning your ticket out before leaving the grounds</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          If you&apos;re using a digital ticket and plan to leave the circuit and come back the same day, your
          ticket has to be scanned out at the gate before you go — skip that step and you may not be able to scan
          back in later. This trips up first-timers who duck out for a hotel break or a food run outside the
          grounds without realizing re-entry isn&apos;t automatic.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — bringing the wrong bag or the wrong chair</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Bags larger than 12&quot; x 12&quot; x 20&quot; aren&apos;t permitted (up to two bags per person, and they
          don&apos;t need to be clear) — arriving with an oversized bag means a real delay or a trip back to the
          car. General Admission ticket holders can bring a collapsible chair, but only with legs under 6 inches,
          and only in GA areas, never the grandstands; seat cushions are fine as long as they have no armrests.
          Coolers, glass containers, and selfie sticks are all turned away at the gate too.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — assuming General Admission means a bad view</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          COTA&apos;s GA tickets genuinely offer better value than most other circuits&apos; general admission —
          you move between open zones around the whole track rather than being fixed to one grandstand seat. The
          grassy hill near Turn 1 is consistently rated the standout GA vantage point for the whole weekend, not
          just a fallback option for people who couldn&apos;t afford a grandstand.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — not budgeting real time (or a real plan) for the walk and the traffic</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          First-timers consistently underestimate how far the walk from parking lot to gate actually is at COTA&apos;s
          scale — the shuttle service from Downtown (Waterloo Park) or Northeast Austin (Travis County Expo Center)
          drops you much closer to the Grand Plaza entrance, but shuttle passes sell out and need to be booked
          ahead, not decided on race morning. Rideshare drop-off runs through the McAngus lot specifically, often
          with its own walk or supplemental shuttle to the gates — budget for that extra leg rather than assuming
          a rideshare drops you at the entrance itself.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How to use the three days</p>
      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Friday — Practice" summary="The quietest, cheapest-feeling day — smaller crowds, a good day to explore fan zones and figure out the circuit layout before it gets busy." />
        <DayCard day="Saturday — Qualifying" summary="More intense than a lot of first-timers expect; grid position genuinely shapes Sunday's race — worth watching properly, not treating as a warm-up." />
        <DayCard day="Sunday — Race" summary="The big one. Arrive early, expect the fullest crowds, and budget real time for both entry and exit." />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Practical essentials</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">COTA is entirely cashless</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Bring a card (Visa, Discover, Mastercard all work) — don&apos;t assume cash gets you anything on-site.
              Water runs around US$4 and food/drink prices generally run high, so budget accordingly.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Free water refill stations</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Scattered around the circuit — bring a reusable bottle rather than buying water repeatedly.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Comfortable shoes, genuinely</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              You will walk a long way over a full day moving between grandstands, fan zones, and food areas.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">The official F1 USA / COTA app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Worth downloading before you arrive — it&apos;s the best way to find food and beverage stalls, and
              it&apos;s where your digital tickets live for most grandstand tiers.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The atmosphere</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Austin&apos;s crowd brings genuine party energy across the whole grid, not just for the favorites — a
          different feeling from some of F1&apos;s more reserved European rounds. It&apos;s one of the most
          beginner-friendly F1 weekends on the calendar: big, loud, unpretentious, genuinely fun even if you
          don&apos;t know every driver.
        </p>
      </div>

      {firstTimerGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={firstTimerGuide} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What actually matters most, first time</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book your parking or shuttle pass the moment your tickets are confirmed, not closer to race weekend —
            this is the single most common regret among first-timers, more than any seat choice. If you&apos;re
            going General Admission, head straight for the Turn 1 hill rather than treating GA as a fallback plan;
            it&apos;s a genuinely strong vantage point in its own right, not a discount version of a grandstand
            seat.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: circuitoftheamericas.com, austin.gp, Formula1.com, Mercedes-AMG F1.
      </p>
    </SpokeShell>
  );
}

function DayCard({ day, summary }: { day: string; summary: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-sm font-bold text-white mb-1">{day}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{summary}</p>
    </div>
  );
}
