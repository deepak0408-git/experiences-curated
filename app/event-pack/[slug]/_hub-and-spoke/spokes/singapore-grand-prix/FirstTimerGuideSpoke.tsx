import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "first-timer-guide";

export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const orientation = linkedExperiences.find((e) => e.slug.includes("singapore-gp-first-timer-orientation"));
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Singapore Grand Prix"
      status="public"
      h1="5 mistakes first-time visitors make"
      question="What do I need to know for my first Singapore GP?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Singapore isn&apos;t a race you can wing on generic Grand Prix knowledge. The night-race format, the zone
        system, and a genuine heat hazard designation are specific enough to catch out a first-timer who&apos;s
        only been to a daytime European race before — here&apos;s what actually trips people up.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — treating it as a normal daytime race weekend</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          This is F1&apos;s only true night race, run entirely under floodlights. That flips the usual rhythm: real
          daytime is available before each day&apos;s sessions start, most other Grand Prix cities don&apos;t give
          you that trade-off, and a first-timer who plans around a normal 10am-to-4pm schedule wastes it sitting in
          a hotel room. Build sightseeing into the mornings deliberately, not as an afterthought.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — assuming your ticket covers the whole circuit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Marina Bay Street Circuit splits into four numbered zones plus a restricted Paddock Zone, and most tickets
          only cover one. Zone 1 holds the Paddock, the Singapore Flyer, and several of the best-known grandstands;
          Zone 4 holds the Padang Stage. Buying a ticket without checking which zone it actually grants access to is
          the single most common first-timer regret here, especially for anyone who cares which concert stage they
          can reach.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — underestimating the heat, or overestimating the umbrella</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Singapore was declared F1&apos;s first-ever official &quot;heat hazard&quot; race — real, current
          recognition of how demanding the daytime heat and humidity genuinely are, even though the race itself runs
          at night. Separately: large and golf-style umbrellas are banned inside every grandstand, and even a
          permitted small one can only be opened in a genuinely heavy downpour, not casually, since it blocks the
          view behind you. A poncho is the practical default, hydration and pacing are not optional extras.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — planning Grab or a taxi as your race-night backup</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Rolling road closures around the circuit shut and reopen on a staged schedule across the whole weekend,
          not once for the whole event — a pickup point that worked Thursday can be sealed Saturday. Once closures
          are active, ride-hail and taxi drivers actively avoid the perimeter, surge pricing regularly hits 3-5x,
          and post-race waits run 45-60 minutes even when a car is matched. The MRT, extended to 1am specifically
          for race weekend, is the genuinely reliable option — treat Grab as a last resort, not a fallback.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — missing that this is also a music festival</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Ten stages run all weekend, headlined this year by Lana Del Rey, The Killers, and JJ Lin, culminating each
          night on the Padang Stage. A first-timer who treats the concerts as background noise misses half of why
          this specific weekend is unlike any other stop on the calendar — check which zone your ticket covers if a
          specific headliner actually matters to you, since not every ticket reaches the Padang Stage.
        </p>
      </div>

      {/* Practical essentials — a genuinely different layer from the 5
          mistakes above (tactical gate-day checklist vs. how-to-think-about-
          the-weekend editorial), matching the Bahrain GP FirstTimerGuideSpoke
          pattern. Sourced per-item from singaporegp.sg's own official pages
          where available — stronger sourcing tier than Bahrain's MotoGP-venue
          proxy, since Singapore's 2026 gate rules and accessibility info are
          already published for this exact race, not inferred from a
          different event at the same venue. */}
      <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4 pt-10 border-t border-[#2A2A2A]">Practical essentials</p>

      <p className="text-sm font-bold text-white mb-2">What&apos;s not allowed through the gates</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          One clear plastic bottle of water or soft drink, 600ml or under — no other outside food or drink. Bag
          checks happen at every gate and every Paddock Club entrance, and anyone entering the entertainment area
          gets checked too — refusal can mean no entry, no refund. Beyond food and drink, expect the usual
          large-event restrictions: professional/detachable-lens cameras, tripods and selfie sticks, drones, large
          umbrellas, folding chairs, and glass containers are all confiscated on discovery.
        </p>
      </div>

      <p className="text-sm font-bold text-white mb-2">Essential apps to download before you land</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-white mb-1">F1 Official App</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Live timing and the race control messages feed — yellow flags, safety car deployments, investigations,
              and penalties as they&apos;re issued. Also useful for checking which viewing platforms have big
              screens in sightline.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">SimplyGo</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Lets you tap a credit or debit card directly on MRT/bus fare gates without buying a physical EZ-Link
              card first — the simplest option if you&apos;d rather not carry an extra card.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Grab</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Singapore&apos;s dominant ride-hailing app, useful for every day of the trip except race night itself
              — see Mistake 4 above for why it genuinely isn&apos;t reliable once circuit road closures are active.
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm font-bold text-white mb-2">What to actually carry</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Your ticket and photo ID, cash alongside cards (not every vendor takes cards), a reusable water bottle for
          the refill stations placed around the circuit, and a portable power bank — heavy phone use across a hot,
          crowded weekend drains a battery fast.
        </p>
      </div>

      <p className="text-sm font-bold text-white mb-2">Accessibility</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Singapore GP runs dedicated Wheelchair Accessible Platforms at multiple points around the circuit
          (including Turn 1 and Empress), each letting a wheelchair user bring up to two companions, who purchase
          the same ticket and get seating beside the wheelchair slots. Wheelchair users and companions typically use
          Gate 4 (nearest MRT: Raffles Place). Not every path through the Circuit Park is wheelchair-friendly, some
          walkways, gates, and over/underpasses restrict access, so call the organisers directly (+65 6229 7777) to
          confirm your specific platform and route before travelling.
        </p>
      </div>

      <p className="text-sm font-bold text-white mb-2">Getting out afterward</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Changi Airport sits on the East-West Line, roughly 50 minutes by MRT from Raffles Place next to Marina
          Bay — plan that into any tight departure the morning after the race. MRT service is extended to 1am
          specifically for race weekend, but arrive at your station 15-20 minutes before the last train, crowds
          move slower than usual. A taxi to the airport normally runs about 30 minutes, but treat that as
          optimistic on race night specifically — see Mistake 4 on why Grab and taxis are the less reliable option
          once the circuit perimeter is in closure.
        </p>
      </div>

      {orientation?.whyItsSpecial && (
        <p className="text-sm text-[#A3A3A3] leading-7 mt-8">{orientation.whyItsSpecial}</p>
      )}

      {orientation && (
        <Link href={`/experience/${orientation.slug}`} className="inline-block mt-6 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
          Read the full first-timer orientation guide →
        </Link>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: singaporegp.sg official prohibited items and accessibility pages, f1-singapore.com, blog.sgtrains.com
        (MRT extended hours and airport transit), singapore-spirit.com (Grab surge pricing and road-closure
        behaviour), BBC Sport (heat hazard designation). Verified 3 Aug 2026.
      </p>
    </SpokeShell>
  );
}
