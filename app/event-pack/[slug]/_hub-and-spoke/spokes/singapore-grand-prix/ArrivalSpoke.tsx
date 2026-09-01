import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Gate/zone/MRT mapping sourced directly from the official Singapore GP
// Circuit Park Map (singaporegp.sg, confirmed current as of 06 Jun 2023,
// re-verified against the same map 3 Aug 2026 — no gate renumbering since).
// Corrects a real error: an earlier version of this spoke had Gate 1 as
// "The Concourse/PARKROYAL" and Gate 2 as "Conrad Centennial/Suntec" — the
// real map has Gate 1 at Republic Blvd (Zone 1/Wharf side) and Gate 2 at
// Temasek Ave (Zone 2, Promenade MRT/Millenia Walk side).
const GATES = [
  { name: "Gate 1 — Republic Blvd", landmark: "The Wharf, Zone 1 side", mrt: "Nicoll Highway (CC5)" },
  { name: "Gate 2 — Temasek Ave", landmark: "Millenia Walk, Zone 2 side", mrt: "Promenade (CC4/DT15)" },
  { name: "Gate 3A / 3B — Stamford", landmark: "Swissôtel The Stamford, Civilian War Memorial, Zone 4 side", mrt: "City Hall (EW13/NS25) or Esplanade (CC3)" },
  { name: "Gate 4 — Empress", landmark: "Asian Civilisations Museum, Zone 4 side", mrt: "Raffles Place (EW14/NS26)" },
  { name: "Gate 5 — Fullerton", landmark: "One Fullerton, The Fullerton Hotel", mrt: "Raffles Place (EW14/NS26)" },
  { name: "Gate 6 — Jubilee", landmark: "Esplanade Park", mrt: "Esplanade (CC3) or City Hall (EW13/NS25)" },
  { name: "Gate 7 — Marina Square", landmark: "PARKROYAL Collection Marina Bay, Zone 2 side", mrt: "Promenade (CC4/DT15)" },
  { name: "Gate 8 — Helix", landmark: "ArtScience Museum, Bayfront side", mrt: "Bayfront (CE1/DT16)" },
];

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const orientation = linkedExperiences.find((e) => e.slug.includes("singapore-gp-first-timer-orientation"));
  const turn1 = linkedExperiences.find((e) => e.slug.includes("singapore-gp-turn1-grandstand"));
  const stamford = linkedExperiences.find((e) => e.slug.includes("singapore-gp-stamford-grandstand"));
  const padang = linkedExperiences.find((e) => e.slug.includes("singapore-gp-padang-grandstand"));
  const walkabout = linkedExperiences.find((e) => e.slug.includes("singapore-gp-zone4-walkabout"));
  const f1Village = linkedExperiences.find((e) => e.slug.includes("singapore-gp-f1-village"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
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
      h1="Which gate, and when to arrive"
      question="What time should I arrive at Marina Bay Street Circuit gates?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Eight named gates ring the circuit — 3A and 3B share the Stamford name, which is why some guides say
        &quot;nine&quot; — each tied to a specific zone and MRT station, not interchangeable. Your recommended gate
        is printed on the back of your ticket; check it rather than guessing from whichever entrance looks closest
        on a map, since a Zone 1 ticket at a Zone 4 gate means walking the long way around, not a quick fix.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Every gate, by zone and MRT</p>
      <div className="flex flex-col gap-3 mb-8">
        {GATES.map((g) => (
          <div key={g.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-1">{g.name}</p>
            <p className="text-sm text-[#A3A3A3] leading-6">{g.landmark} — nearest MRT: {g.mrt}.</p>
          </div>
        ))}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">When to actually arrive, by session</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          2026 is a Sprint weekend — Friday: Practice 1, 4:30-5:30pm, then Sprint Qualifying, 8:30-9:14pm. Saturday:
          the Sprint race, 5-6pm, then Qualifying, 9-10pm. Sunday: the Grand Prix itself, 8pm. Arrive 60-90 minutes
          before whichever session you&apos;re there for — gates typically open a few hours ahead of the day&apos;s
          first session, but exact 2026 gate-opening times aren&apos;t published yet, so build in the buffer rather
          than cutting it close on an unconfirmed number.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Arrival strategy actually differs by stand</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {turn1 && <SpokeExperienceCard experience={turn1} isPro={isPro} />}
        {stamford && <SpokeExperienceCard experience={stamford} isPro={isPro} />}
        {padang && <SpokeExperienceCard experience={padang} isPro={isPro} />}
        {walkabout && <SpokeExperienceCard experience={walkabout} isPro={isPro} />}
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Reserved grandstands (Turn 1, Stamford, and most named stands)</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Your seat is yours regardless of arrival time, so the 60-90 minute window is really about clearing
            security without the closer-to-session-time crush and having time in the Fan Zone, not claiming ground.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Padang Grandstand</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Its real draw is proximity to the Padang Stage, not the racing view — if you&apos;re also going for the
            concert, arrive with enough buffer to do both without rushing between the two.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Zone 4 Walkabout (general admission)</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            No reserved seat means arrival time genuinely determines your view — get to a viewing platform early if
            a specific sightline (or being close for the Padang Stage set after) matters to you, rather than taking
            whatever's left once the zone fills up.
          </p>
        </div>
      </div>

      {f1Village && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What's actually in the Fan Zone</p>
          <SpokeExperienceCard experience={f1Village} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting through security faster</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Most gates have an express lane for anyone entering without a bag — bags get searched, so travelling light
          genuinely speeds up entry. One clear plastic bottle of water or soft drink, 600ml or under, is the only
          outside drink allowed through; everything else gets left behind or confiscated.
        </p>
      </div>

      {orientation && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">First time at Marina Bay?</p>
          <SpokeExperienceCard experience={orientation} isPro={isPro} />
        </div>
      )}

      <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Leaving your seat mid-session</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          At Turn 1, Stamford, and every other reserved grandstand, your seat is yours for the whole session
          regardless of when you step out, so a food or bathroom break doesn&apos;t cost you your view. Padang is
          the same for the seat itself, but factor in walking time back from Padang Stage if you left for the
          concert. Zone 4 Walkabout is different: there&apos;s no reserved return to your exact spot, so treat a
          mid-session break as a real trade-off, bring water and snacks in with you rather than planning to step
          out and back.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: official Singapore GP Circuit Park Map (singaporegp.sg, gate/zone/MRT data), formula1.com 2026
        session calendar, singaporegp.sg prohibited items page (600ml bottle rule). Verified 3 Aug 2026.
      </p>
    </SpokeShell>
  );
}
