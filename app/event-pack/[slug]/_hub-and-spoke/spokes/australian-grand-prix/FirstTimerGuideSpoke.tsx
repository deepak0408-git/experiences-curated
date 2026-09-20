import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Real content sourced from the seeded First Timer's Guide (first-timers-
// guide-albert-park-mu9cdxo6), 20 Sep 2026: the earplugs/one-spot-discipline
// tip, no on-site parking, no public wifi inside the circuit, real food
// pricing, and the Thursday/Friday exploration tip.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const firstTimerGuide = linkedExperiences.find((e) => e.slug.includes("first-timers-guide-albert-park-mu9cdxo6"));
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
      h1="5 mistakes first-time visitors make at Albert Park"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Albert Park is genuinely friendly to first-timers compared to most F1 circuits — free transit, a real
        General Admission option, no on-site parking to worry about. Here&apos;s what actually trips people up,
        drawn from the real detail in this pack rather than generic advice.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — underestimating the noise</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Modern F1 cars are genuinely louder in person than any broadcast conveys, especially near the fast
          sections. Foam earplugs prevent the dull-headache feeling a lot of first-timers mistake for tiredness by
          mid-afternoon.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — constantly repositioning on the Park Pass</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Park Pass veterans almost always commit to one primary viewing spot rather than roaming the circuit
          looking for something better. Constant repositioning tends to mean missing the actual racing while
          you&apos;re walking between corners.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — driving in</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          There&apos;s no on-site parking at Albert Park, full stop — road closures around the circuit make driving
          pointless even if you wanted to. The free tram/train system is the only sensible way in.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — relying on data or wifi inside the circuit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          There&apos;s no public wifi inside the venue, and phone signal gets genuinely unreliable in a crowd this
          size. Download the official Grand Prix app for maps, timing screens, and session schedules before you
          leave your hotel — not once you&apos;re already inside.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — bringing an umbrella, or no cash for circuit food</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Umbrellas are banned at the gate — a packable rain jacket is the only real in-venue option. And there are
          no ATMs inside the circuit either, so sort a card or cash before you arrive; circuit food runs at real
          event pricing (most proper meals $10-15, a beer around $8), so budget for it if you&apos;re not bringing
          your own.
        </p>
      </div>

      {firstTimerGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={firstTimerGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Practical essentials</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">The official F1 Race Guide app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Covers every circuit on the calendar, including Albert Park — interactive circuit maps, real-time
              schedule alerts, and geotagged points for grandstands, food, and Fan Zone activities. Download it
              before you leave, given the lack of in-venue wifi.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">myki and the PTV app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Load myki before race day if you&apos;ll be boarding anywhere outside the free Town Hall/State
              Library/Anzac zone — a ticket-machine queue at a busy station on race morning is a real time cost.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Foam earplugs</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Cheap, easy to forget, and genuinely useful — the noise up close is louder than broadcast ever
              conveys.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A reusable water bottle</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              A full race day at Albert Park means real hours outdoors between gates, grandstands, and the Fan
              Zone — treat hydration as part of the plan, not an afterthought.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Comfortable shoes, genuinely</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Albert Park&apos;s gates are spread around a 5km perimeter — expect real distance on foot both inside
              the venue and getting between grandstands.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">The rain jacket, packed every day</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Melbourne&apos;s April weather is mild on average but genuinely variable — with umbrellas banned at
              the gate, a packable rain jacket earns its space even on a morning that starts clear.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Card or cash sorted before you arrive</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              There are no ATMs inside the circuit — decide how you&apos;re paying for food and merchandise before
              you get to the gate.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The genuine first-timer trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Thursday and Friday are the days to actually explore the circuit — smaller crowds, easier movement
          between grandstands and general admission areas, and a real chance to scope out where you&apos;ll want
          to be before the weekend crowds arrive. Merchandise sizes and popular items also sell out by Sunday, so
          shop early if there&apos;s a specific item you want.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What actually matters most, first time</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Download the official app and load your transit card before you leave your accommodation — both problems
          are invisible until you&apos;re already inside the circuit with no signal and a queue at the ticket
          machine. Everything else — the earplugs, the rain jacket, picking one Park Pass spot and sticking with
          it — is manageable with the detail already in this pack.
        </p>
      </div>
    </SpokeShell>
  );
}
