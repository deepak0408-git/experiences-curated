import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "arrival";

// Gate/section mapping cross-checked against the official Hungaroring
// circuit map (gpticketshop.hu, founder-supplied screenshots, 16 Oct 2026):
// Gate 8 (T1, Pit Exit 1), Gate 7 (Hungaroring, Hungaroring Platinum, Grid 1,
// Grid 2, Grand Prix 2), Gate 6 (Grand Prix 1, Apex 1, Apex 2, Fan), Gate 2
// (Chicane 1/2/4), Gates 3/4/5 (General Admission). Bag policy, umbrella
// rule, and gate-8-for-grandstands-only confirmed via hungaroring.hu's
// official 2026 FAQ. Gate opening time (7:30am) and the 6-gate structure
// corroborated via oversteer48.com, with "Chicane 3"/"Grid 3"/"Pit Exit 2"
// references dropped as not reflected on the official map.
//
// Free shuttle + other arrival tactics added 17 Oct 2026, sourced directly
// from hungaroring.hu/site/en/races/2026-formula-1-aws-magyar-nagydij/travel-2026
// (the circuit's own official 2026 travel page — the only edition with a
// live page at research time; this pack covers the 2027 event). Exact times
// are the 2026 edition's confirmed schedule, presented as the expected
// structure rather than a 2027 guarantee, since 2027's own page isn't live
// yet — matches this pack's existing HÉV/metro route framing in
// GettingThereSpoke. Shuttle times: Kerepes HÉV station to Gate 3, Fri-Sun
// 7:00am-2:50pm; return Gate 3 to Gödöllő railway station, Fri/Sat
// 4:00-8:00pm, Sun 4:45-9:00pm. City Shuttle (paid, Budapest-Hungaroring
// direct), Főtaxi official taxi partner, and Budapest Card transit
// inclusion are all real, confirmed services on the same official page.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
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
      h1="Gates open 7:30am, and the one you use depends on your ticket, not your preference"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Spectator gates open at 7:30am on Friday, Saturday, and Sunday of race weekend — earlier than a lot of
        first-timers expect, and worth building your morning around if a specific grandstand seat matters to you.
        The Hungaroring runs five real public entrances, and which one you use genuinely matters, not just a
        formality: walking up to the wrong gate on a full house day means a long walk around the perimeter instead
        of a short stroll in.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Free shuttle tactics — the structure beyond just "it exists"</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-2">
          <FactRow label="Outbound window" value="Kerepes HÉV station to Gate 3, roughly 7:00am-2:50pm across Friday, Saturday and Sunday on the most recent edition's confirmed schedule — don't assume it runs all day, and don't plan to arrive on the last departure if you want any buffer." />
          <FactRow label="It's timed to trains, not a fixed clock" value="The shuttle runs to match HÉV arrivals at Kerepes, not a published departure board — the real tactic is catching an earlier train than you think you need, since a 5-10 minute gap at the platform is normal, not a sign something's wrong." />
          <FactRow label="Return leg uses a different station entirely" value="Gate 3 back to Gödöllő railway station, not Kerepes — Gödöllő has more frequent onward trains to Keleti, which is the real reason the route isn't a simple reversal, not an inconsistency." />
          <FactRow label="Return window closes earlier than you'd expect" value="Roughly 4:00-8:00pm Friday/Saturday, a little later on Sunday — if you're staying at the circuit for a post-session fan event or autograph session, check the last shuttle time before you commit to staying, since missing it means a much longer walk or a taxi at surge pricing." />
          <FactRow label="Walking alternative exists" value="Szilasliget HÉV station is about a 30-minute walk to the circuit gates — a real option if the Kerepes shuttle queue looks long and you'd rather walk than wait." />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Other real ways in, beyond the free shuttle</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-2">
          <FactRow label="City Shuttle (paid, direct from Budapest)" value="A separate paid bus service runs directly between central Budapest and the circuit, no metro or HÉV leg required — real money for real convenience if the public-transport chain feels like too many moving parts on race morning." />
          <FactRow label="Taxi — book through the official partner" value="Főtaxi is the circuit's official taxi partner, with a dedicated return rank near Gate 8 — the practical advantage over a random app-hailed car is a guaranteed, organised pickup point after the race rather than trying to flag one down in a crowd of tens of thousands." />
          <FactRow label="Budapest Card holders get transit included" value="72-hour, 72-hour PLUS, 72-hour FLEXI and 96-hour Budapest Card tiers include dedicated public transport to and from the circuit on race weekend — worth checking if you're already planning to buy one for general Budapest sightseeing." />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Which gate for which section</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-2">
          <FactRow label="Gate 8" value="T1 and Pit Exit 1 grandstands — reserved for grandstand ticket holders, also the recommended gate for wheelchair users and reduced mobility" />
          <FactRow label="Gate 7" value="Hungaroring and Hungaroring Platinum grandstands (the covered main stand), Grid 1, Grid 2, Grand Prix 2" />
          <FactRow label="Gate 6" value="Grand Prix 1, Apex 1, Apex 2, Fan grandstands, plus General Admission viewing" />
          <FactRow label="Gate 2" value="Chicane 1, Chicane 2, Chicane 4 grandstands, plus General Admission viewing" />
          <FactRow label="Gates 3, 4 & 5" value="General Admission hillside viewing along the outer loop" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Bag policy — stricter than some F1 circuits</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          20 litres maximum, including any camera and its accessories. There&apos;s no bag storage at the gates, so
          an oversized bag means arranging alternative storage before you arrive, not leaving it with security.
          Water is capped at 1 litre per person; up to three sandwiches or equivalent food is allowed in.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Cameras & lenses" value="Allowed for personal use only, and must fit inside the 20-litre bag limit along with everything else" />
          <FactRow label="Umbrellas" value="Only small, foldable umbrellas are allowed — and they can't be used once you're in a grandstand" />
          <FactRow label="Chairs" value="Camping and fishing chairs are banned, per the official Terms and Conditions" />
          <FactRow label="Parasols & cool boxes" value="Not permitted" />
          <FactRow label="Flags" value="Allowed only on plastic poles — confiscated if used in a way that disrupts the event or endangers others" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Strollers and medical items are genuinely fine</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Strollers, medication, and medical aids including insulin are all explicitly permitted — worth knowing if
          you&apos;re travelling with young kids or managing a condition, since some circuits are stricter here
          than the Hungaroring actually is.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Check your e-ticket for the recommended gate before you leave your hotel — it&apos;s usually the gate
          closest to your actual grandstand, and confirming it the night before beats guessing on a packed race
          morning. If you&apos;re parking inside Gate 2, remember it switched to paid parking from 2026, and if
          you&apos;re on Gate 8, that entrance is genuinely grandstand-only — General Admission ticket holders
          should head to Gate 6, 2, 3, 4, or 5 instead. On the free shuttle specifically: catch an earlier HÉV train
          than feels necessary, since the shuttle runs to match arrivals rather than a fixed schedule, and on the
          way home, confirm the last Gate 3-to-Gödöllő departure before you linger for a post-session fan event —
          missing it turns a short, free ride into a long walk or a surge-priced taxi.
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
