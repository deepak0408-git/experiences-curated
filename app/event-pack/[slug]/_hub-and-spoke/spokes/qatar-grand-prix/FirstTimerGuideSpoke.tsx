import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Real, sourced facts pulled from across this pack: reseller risk (Tickets
// spoke's official-only warning), night-race temperature swing (Weather
// spoke), Uber not reliably handling circuit departures (Getting There
// spoke), self-drive traffic/parking caveats (Getting There spoke), and
// Qatar's real conservative-culture dress and alcohol norms — a genuine
// orientation gap for a reader with zero prior Gulf-state context, per
// skill §2d. Essential apps (§2g) and the Doha City Highlights Tour
// (qatar-gp-doha-fan-city-tour-) round out this pack's "get oriented" pick
// — moved here from the Itinerary spoke, and Pearl-Katara moved out to
// Day Trips, both per founder instruction 14 Sep 2026.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const dohaTour = linkedExperiences.find((e) => e.slug.includes("qatar-gp-doha-fan-city-tour-"));
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
      h1="5 mistakes first-time visitors make in Qatar"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Qatar is a genuinely different kind of F1 destination for anyone whose only other trips have been in Europe
        or the Americas — modern, safe, and easy to navigate, but a night race with real cultural norms and its own
        booking quirks. Here&apos;s what genuinely trips up a first-time visitor, drawn from the real detail in this
        pack rather than generic advice.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — buying from an unverified reseller</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          With GA gone and demand real, buy directly from the official F1 ticketing site first. If official tickets
          are sold out for the tier you want, P1 Travel is a genuine authorized partner — named directly on multiple
          circuits&apos; own official reseller lists. Not every listing that shows up in a search is legitimate.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — packing for the daytime heat and stopping there</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Every session runs after dark, and overnight lows can dip into the high teens Celsius. A single
          warm-weather outfit gets you through the day and leaves you cold for the race itself — pack a real layer,
          not just sunscreen.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — counting on Uber for the circuit departure</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Uber can get you to Lusail, but doesn&apos;t reliably handle pickups from the circuit after the race.
          Karwa, Qatar&apos;s own metered taxi app, is the one that consistently works for the return trip — install
          it before race day, not at the exit gate with everyone else.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — driving yourself without a plan</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Self-driving is possible, but the Al Khor Coastal Road after the Wadi Al Wasah junction is a known
          race-day bottleneck, and parking is free but limited. The Doha Metro Red Line plus the free ticket-holder
          shuttle is genuinely the easier default — it&apos;s already included with any race ticket.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — expecting a normal high-street bar scene</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Alcohol is legal in Qatar, but only in licensed venues — hotel bars, restaurants inside major hotels, and
          select hospitality areas at the circuit. It isn&apos;t sold in supermarkets or casually available in
          public the way it might be at home. Plan evenings around hotel-based venues rather than expecting to find
          a normal bar on the street.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Dress and alcohol — the real rules, not guesswork</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Shoulders and knees covered is the safe default in public areas outside the circuit — malls, the souq,
          museums, and the street. Inside the circuit itself, standard race-day clothing (t-shirts, shorts) is fine;
          the norm applies to the wider city, not the race weekend crowd specifically.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Alcohol is legal and served, but only in licensed venues — hotel bars, restaurants inside major hotels, and
          select hospitality areas at the circuit. It isn&apos;t sold in supermarkets or casually available in
          public the way it might be at home, and public intoxication is taken seriously. Plan your evenings around
          hotel-based venues rather than expecting a normal high-street bar scene.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps and practical basics</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Karwa</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Qatar&apos;s own metered taxi app — the most reliable option for getting around Doha generally, and
              specifically the one that handles circuit departures after the race when Uber often can&apos;t.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Ooredoo or Vodafone Qatar (tourist SIM)</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both carriers sell short-term tourist SIMs at Hamad International Airport on arrival — worth doing
              immediately, since reliable data makes every other app on this list actually usable.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">The official F1 Race Guide app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Interactive circuit maps, real-time schedule alerts, and geotagged points for grandstands, food, and
              fan-zone activities at Lusail specifically. Download it before you land.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Money and payments</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Qatari Riyal (QAR) is the local currency, pegged to the US dollar at roughly 3.64 QAR per US$1 — a
          stable, predictable exchange rate, unlike destinations where the rate genuinely fluctuates during your
          trip. Cards are widely accepted at hotels, malls, and most restaurants; the souq and smaller vendors still
          favor cash, so carry some riyals for Souq Waqif specifically.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Get oriented — the honest entry point if you're unsure where to start</p>
      {dohaTour && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={dohaTour} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The genuine first-timer trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Don&apos;t let Qatar&apos;s reputation as an unfamiliar Gulf destination make the trip feel harder to plan
          than it is — the real friction points are specific and manageable (book tickets early, pack a layer,
          install Karwa), not a vague sense that the whole country requires special handling.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do on arrival</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Buy a tourist SIM at the airport the moment you land — Karwa, the metro app, and the F1 app all need real
          data to be useful, and Hamad International&apos;s arrivals hall makes this a five-minute stop, not a
          hunt. If your flight lands with an afternoon free before the race weekend starts, the Doha city
          highlights tour is the single best way to get oriented to the city&apos;s actual rhythm in one sitting —
          a genuine head start that tells you more than a guidebook can, and helps you decide which district to
          come back to independently.
        </p>
      </div>
    </SpokeShell>
  );
}
