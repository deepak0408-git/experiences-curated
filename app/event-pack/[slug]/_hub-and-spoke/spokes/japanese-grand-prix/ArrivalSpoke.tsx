import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Real content sourced from the seeded GP Square & Fan Zones experience
// (japanese-gp-suzuka-fan-zones), 22 Sep 2026 — three real fan zones (GP
// Square, West Fanzone, Ferris Wheel Fanzone), independently confirmed via
// suzukacircuit.jp and the official F1 ticketing site. Exact 2027
// gate-opening times not yet published — stated honestly per skill §2a-3.
// (Corrected 22 Sep 2026: page copy previously pointed users to japan.gp,
// an affiliate site, not official — now points to ticketing.formula1.com/japan.)
//
// Gates/prohibited-items sections added 30 Sep 2026 — this spoke was
// missing the actual arrival-day facts (gate-to-grandstand mapping,
// prohibited items, bag check, re-entry) that Brazilian GP's equivalent
// spoke has, because no seeded Suzuka experience covered them and none of
// this pack's other seed scripts sourced gate/prohibited-item facts either.
// Researched directly (per CLAUDE.md's research rule) rather than
// fabricated: gate-to-grandstand mapping from suzukacircuit.jp's official
// gate page (Main Gate serves Q1-2/R/S and V1/V2; 1st Corner Gate serves
// the first/second corner and S-curve stands, nearest Suzuka Circuit Ino
// Station; Poolside Gate serves the park/Inabe Station side; 8 gates total,
// some grandstands a genuine ~3km walk from the wrong gate). Prohibited
// items and bag-check/re-entry policy cross-verified against two
// independent sources — fanamp.com's dedicated "what you can and can't
// bring" 2026 guide and japan.gp's official "Rules for Visitors" page —
// both agreeing on the core list (weapons, glass, drones, cameras/lenses
// over 26cm, tripods/monopods, tents, bicycles/skates, outside food and
// alcohol, fireworks, generators, pets except service animals) and on
// mandatory bag search/metal detector screening with no-refund entry
// denial for refusing it.
//
// Gate times corrected same pass: japan.gp's official "Entering the
// Circuit" page (2027) actually does publish gate-open times — Main Gate
// 8:30am Thu, 8:00-8:15am Fri-Sun depending on gate, Chicane Gate 8:30am —
// so the prior "not yet published" line was stale, not still true.
//
// GA-specific arrival-timing guidance added same pass, per founder request
// for "2-3 hours before session start" advice: no Suzuka-specific source
// states a flat 2-3hr figure, so rather than force that number, used
// fastway1.com's "How to get the most out of General Admission F1 tickets"
// guide (the only source found with day-specific arrival guidance:
// practice ~30-45min early, qualifying ~1hr early, race day as early as
// gates-open or before) applied to Suzuka's own confirmed GA facts
// (first-come-first-served West Area, no assigned seat, no shelter — from
// the seeded General Admission experience, japanese-gp-suzuka-general-
// admission) and Suzuka's real 8:00-8:30am gate times above.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const fanZones = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-fan-zones"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Japanese Grand Prix"
      status="public"
      h1="8 gates, no re-entry, and a bag search at every one — what to know before you arrive"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Suzuka spreads across eight entrance gates, each serving a different part of the circuit, and every one
        runs a bag search. Picking the wrong gate for your grandstand can mean a genuine walk of up to 3km around
        the venue — worth checking before race morning, not after you&apos;re already there.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Gate times</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Thursday: Main Gate 8:30am, 1st Corner Gate 8:45am — several other gates stay closed until Friday.
          Friday through Sunday: most gates open 8:00-8:15am, with the Chicane Gate opening slightly later at
          8:30am. Check the gate-specific schedule closer to race week to confirm, since these can shift.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">If you're on General Admission</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          GA&apos;s West Area viewing spots are unreserved and first-come-first-served, with no assigned seat and
          no shelter from sun or rain — how early you arrive genuinely determines your view, more than it does
          for a grandstand ticket holder. As a rough guide:
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Friday practice + Sprint Qualifying" value="Arriving 30-45 minutes before the session starts is usually enough — Friday's crowds are the lightest of the weekend" />
          <FactRow label="Saturday Sprint + Grand Prix Qualifying" value="Arrive at least an hour before the first session — the West Area fills up faster than Friday" />
          <FactRow label="Sunday race day" value="Aim to be at the gate as early as it opens, or before — race day draws the biggest crowd of the weekend, and the best fence-line spots go to whoever gets there first" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Which gate for which grandstand</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Eight gates provide access to the circuit in total. The three most relevant to grandstand ticket holders:
        </p>
        <div className="flex flex-col gap-3">
          <FactRow label="Main Gate" value="The front entrance, walkable from the front parking lot. Closest gate to the final-corner grandstands (Q1, Q2, R, S) and the pit-straight grandstands (V1, V2) — also has the main gate shop and permanent toilets." />
          <FactRow label="1st Corner Gate (temporary)" value="Closest gate to Suzuka Circuit Ino Station. Serves the first corner, second corner, and S-curve stands directly, without needing to cut through the park or GP Square." />
          <FactRow label="Poolside Gate (temporary)" value="Near the park's adventure area, close to the Main Gate, connected to the route toward Suzuka Circuit Inabe Station. The most convenient gate if you're heading into Suzuka Circuit Park first." />
        </div>
      </div>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Check the closest entry gate to your specific grandstand before race day — entering through the wrong
          gate can mean a walk of up to 3km around the venue to reach your seat.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Prohibited items</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Every gate runs a bag search and metal detector screening. Refusing the search can get you denied
          entry with no refund — pack light and check your bag against this list before you leave your hotel.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Cameras & lenses" value="Any camera or lens exceeding 26cm in total physical length is banned, along with tripods and monopods" />
          <FactRow label="Drones & self-propelled vehicles" value="Drones, bicycles, roller skates, rollerblades, and scooters are all banned" />
          <FactRow label="Glass, outside food & alcohol" value="Glass bottles, outside alcohol, and outside food/drink are banned — an empty reusable water bottle is fine and can be refilled at stations on site" />
          <FactRow label="Tents, generators & fuel" value="Tents, marquees, generators, compressors, and fuel are all banned" />
          <FactRow label="Weapons & flammables" value="Knives, firearms, explosives, fireworks, smoke bombs, and laser pointers are all banned, as are pets other than certified service animals" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Re-entry</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          You can leave and re-enter the same day, but only if your ticket is scanned out at the exit and
          re-tagged by security — skip that step and you won&apos;t be let back in. Treat any mid-day trip out as
          something you plan for deliberately, not a casual option.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">GP Square — the main hub</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Built around an official F1 stage running appearances from drivers and team personnel across the
          weekend, alongside talk shows, entertainment programming, and live performances — the closest thing
          Suzuka has to a central meeting point when nothing&apos;s happening on track. The Fan Forum, held on the
          same stage, is where driver interviews and Q&amp;A sessions happen — a genuine chance to hear from teams
          directly, not just watch cars go past.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">West Fanzone — the hands-on one</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Food and drink booths, including a dedicated Pit Bar, sit alongside F1 sim racing setups and the F1
          Pitstop Challenge, where fans can try a timed pit stop themselves. Photo spots built around a podium
          replica and driver selfie boards round it out, and the entertainment lineup runs beyond motorsport into
          live music and, in recent years, ninjutsu performances — a distinctly Japanese addition that doesn&apos;t
          show up at any other round on the calendar.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ferris Wheel Fanzone — the quieter alternative</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sits inside Suzuka Circuit Park near the final corner — a real, standalone zone with its own goods
          shops, a show car on display, and photo spots, and a genuine option for anyone who&apos;d rather skip
          GP Square&apos;s bigger crowds. Close enough to the grandstands near the final sector that it pairs
          naturally with a walk through the theme park rather than being a separate trip.
        </p>
      </div>

      {fanZones && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={fanZones} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">No separate ticket needed</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          All three fan zones are included with any race weekend admission — General Admission, grandstand, or
          hospitality. Check the official schedule closer to the event for Fan Forum driver appearance timings
          specifically, since those are the one part of the fan zones worth timing your visit around.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Check your grandstand against the Main Gate / 1st Corner Gate / Poolside Gate split before race morning
          so you're not walking 3km around the venue, pack light enough to clear the bag search fast, and use
          Friday&apos;s lighter Sprint-weekend schedule to work through GP Square and the West Fanzone before the
          Saturday and Sunday crowds build. If you&apos;re on General Admission, treat Sunday differently from
          Friday and Saturday — gates-open-or-earlier for the race, not the 30-45 minute buffer that&apos;s fine
          for Friday practice.
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
