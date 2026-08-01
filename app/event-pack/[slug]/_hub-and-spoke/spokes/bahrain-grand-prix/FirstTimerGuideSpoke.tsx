import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "first-timer-guide";

export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell eventSlug={eventSlug} eventId={event.id} eventCurrency={event.packCurrency} spokeId={SPOKE_ID} justPurchased={justPurchased} eventName="Bahrain Grand Prix" status="public" h1="5 mistakes first-time visitors make" question="What do I need to know for my first Sepang race weekend?" heroImageUrl={heroImageUrl} isUnlocked={isUnlocked}>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This isn&apos;t Malaysia&apos;s bid finally paying off, and it isn&apos;t simply &quot;F1 comes back.&quot;
        Understanding what this weekend actually is changes how you should plan it — here&apos;s what genuinely
        trips up a first-time visitor, drawn from the real detail in this pack rather than generic advice.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — thinking this is Malaysia&apos;s own race</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The race is officially still the Bahrain Grand Prix, run at Sepang because a regional conflict disrupted
          the Gulf calendar — not because Malaysia campaigned to get its home round back. Malaysia didn&apos;t win a
          bid; Sepang was available, certified, and close enough to the original slot to absorb a race that would
          otherwise have disappeared. That context genuinely changes how you read the whole weekend, including why
          2026 ticketing and logistics are still being finalised later than you&apos;d expect for an established
          Grand Prix.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — assuming any grandstand shows you the same race</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sepang&apos;s four stands are built around genuinely different ideas of what&apos;s worth watching — the
          Main Grandstand gives you the ceremony of the grid, lights and podium; K1 gives you real, repeated
          overtaking at Turn 1; Grandstand F gives you the widest single view of a car under sustained load through
          Turns 6-8; the Hill Stand trades a roof and an assigned seat for flexibility and price. Buying whichever
          stand is cheapest or most famous without checking what it actually shows you is the single most common
          first-timer regret.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — underestimating the weather</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sepang&apos;s rain doesn&apos;t build gradually — the 2009 race was red-flagged after a clear afternoon
          turned into a monsoon inside a handful of laps. A covered stand isn&apos;t a luxury preference here,
          it&apos;s a real practical consideration, especially if you&apos;ve booked general admission at the Hill
          Stand, where the canopy covers only part of the embankment.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — basing yourself at the circuit instead of the city</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sepang&apos;s own hotel stock is thin and mostly airport-transit-oriented. Kuala Lumpur is genuinely
          45-60 minutes away, but that distance buys you a real, world-class city — restaurants, nightlife, the
          Golden Triangle — for the two-thirds of the trip you&apos;re not actually at the track. The exception is a
          traveler prioritising a zero-friction race-morning commute over city time, for whom the airport-adjacent
          Sama-Sama Hotel is a genuine, deliberate alternative, not a downgrade.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — missing what this race means to the fans around you</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Nearly 191,000 fans attended a single Sepang MotoGP weekend in 2025 — real, current, measured demand for
          motorsport in Malaysia, not nostalgia. For a generation of Malaysian fans under roughly 25, this genuinely
          is a first Grand Prix, not a return — Sepang&apos;s F1 years ended when they were children, if they were
          born at all. Arriving as a visiting fan into that specific moment is worth being aware of, not just
          background trivia.
        </p>
      </div>

      {/* Practical essentials — a genuinely different layer from the 5
          mistakes above (tactical gate-day checklist vs. how-to-think-about-
          the-weekend editorial). Added 1 Aug 2026 after the user flagged
          this gap against generic "first-timer guide" search results for
          other F1/motorsport events. Sourced per-item, not invented — see
          inline notes on what's Sepang-confirmed vs. general practice. No
          F1-2026-specific gate rules exist yet for this newly-relocated
          race, so prohibited items and accessibility are sourced from
          Sepang International Circuit's own published MotoGP visitor rules
          (same venue/operator, the closest real proxy available) rather
          than F1 boilerplate. */}
      <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4 pt-10 border-t border-[#2A2A2A]">Practical essentials</p>

      <p className="text-sm font-bold text-white mb-2">What&apos;s not allowed through the gates</p>
      <p className="text-xs text-[#6A6A6A] mb-3">
        F1-specific 2026 gate rules for this relocated race haven&apos;t been published yet — this list is Sepang
        International Circuit&apos;s own published visitor rules for its recent MotoGP weekends, the closest real
        proxy available since it&apos;s the same venue and operator.
      </p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Outside food and drink (one sealed bottle of water up to 600ml is the exception), alcohol, glass containers
          (sunglasses and prescription glasses are fine), opened or broken-seal beverage containers, chairs and
          stools, tents or beach shelters, weapons or dangerous objects, fireworks, laser pointers, pets, oversized
          flags or banners (over 1m), drones, professional cameras or video cameras (personal non-commercial
          photography is fine), bicycles, scooters, skateboards or roller blades, and amplifying devices. Items are
          confiscated on discovery.
        </p>
      </div>

      <p className="text-sm font-bold text-white mb-2">Essential apps to download before you land</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-white mb-1">Grab</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Malaysia&apos;s dominant ride-hailing app — around 65% of foreign tourists in the country use it.
              Upfront pricing before you book and cashless payment make it the easiest way to move between the city
              and the circuit outside of the trains.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Touch &apos;n Go eWallet</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Malaysia&apos;s fare-gate and toll payment app for LRT, MRT, and KTM. Worth knowing before you rely on
              it: tourist self-registration is currently open to ASEAN passport holders only (Brunei, Cambodia,
              Indonesia, Laos, Myanmar, the Philippines, Singapore, Thailand, Vietnam). If you&apos;re travelling on a
              non-ASEAN passport, you can&apos;t yet sign up for your own account — budget for cash or a card at
              station ticket machines instead.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">F1 Official App</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Live timing and the race control messages feed — yellow flags, safety car deployments, investigations,
              and penalties as they&apos;re issued. Genuinely useful trackside, not just for watching at home.
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm font-bold text-white mb-2">What to actually carry</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Your ticket and a government photo ID or passport, some cash alongside cards (official ticketing accepts
          Visa, Mastercard, and digital wallets, but that doesn&apos;t guarantee every food or merchandise vendor on
          site does), and a portable power bank — a venue this size, this crowded, on one phone network, will drain
          a battery fast on photos and messaging alone.
        </p>
      </div>

      <p className="text-sm font-bold text-white mb-2">Accessibility</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sepang provides designated wheelchair seating at the Main Grandstand, dedicated disabled parking, an
          internal pick-up service, and a direct assistance line (+603 8703 2434) — confirmed via the circuit&apos;s
          own published accessibility information for recent race weekends. Contact the circuit ahead of race weekend
          to confirm 2026 arrangements before you travel.
        </p>
      </div>

      <p className="text-sm font-bold text-white mb-2">Getting out afterward</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The drive to KLIA is normally 15-20 minutes, but Sepang&apos;s single-corridor road access means that
          stretches to 30-40 minutes by car once a race weekend actually ends — sometimes worse on the highway
          approach. The train is the more reliable exit: KLIA Transit to Salak Tinggi, then a short Grab ride, runs
          around 45 minutes total and sidesteps the road congestion that can push a bus back well over an hour.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: grab.com/my, touchngo.com.my/consumer/international-tourists (ASEAN-only tourist registration,
        confirmed current as of 2026), formula1.com/en/timing/f1-live.
      </p>
    </SpokeShell>
  );
}
