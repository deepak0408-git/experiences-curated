import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real factual columns sourced from the 6 seeded ticket/grandstand
// experiences (Grandstand 1 — Centrale, Grandstand 5 — Piscina, General
// Admission — Lesmo & Ascari, Grandstand 22 — Parabolica, Grandstand 26 —
// Pit Lane/Grid/Podium, Curva Grande GA), 19 Sep 2026. Unlike Interlagos,
// Monza DOES sell General Admission (Prato) — a genuinely different
// structure from several sibling F1 events on this pack platform.
//
// Pricing note: 2027 F1 ticket prices are not published anywhere yet.
// planner_ticket_tier_cost now has edition_year: 2027 rows for this event,
// but they are a direct copy of real 2026 pricing (the founder's explicit
// 19 Sep 2026 call — go live now, re-research once real 2027 prices exist).
// The "On pricing" box below discloses this rather than presenting the
// carried-forward numbers as confirmed 2027 prices. See
// scripts/seed-italian-gp-2027-copy-2026-placeholder.mjs and memory
// project_italian_gp_2027_planner_placeholder.
const TIER_META = [
  {
    tierKey: "GA — Lesmo & Ascari",
    name: "General Admission — Lesmo & Ascari",
    shows: "The technical middle of the lap — two tightening corners into the Ascari chicane",
    seating: "Prato (park) GA — Lesmo 2 has proper tiered bleachers and a screen; Lesmo 1 is fence-only",
    exposure: "Uncovered, limited shade",
  },
  {
    tierKey: "GA — Curva Grande",
    name: "General Admission — Curva Grande",
    shows: "The high-speed sweep where cars hit 340 km/h on entry — the default first-timer GA pick",
    seating: "Prato (park) GA — grass bank, no reserved spot",
    exposure: "Uncovered, limited shade",
  },
  {
    tierKey: "Grandstand 5",
    name: "Grandstand 5 — Piscina",
    shows: "Full-throttle acceleration off the grid, caught close before the Prima Variante braking zone",
    seating: "Covered, reserved, 3-day package only",
    exposure: "Covered",
  },
  {
    tierKey: "Grandstand 22",
    name: "Grandstand 22 — Parabolica",
    shows: "The final corner — cars braking from 335km/h into the right-hander that feeds the main straight",
    seating: "Covered, reserved",
    exposure: "Covered",
  },
  {
    tierKey: "Grandstand 26",
    name: "Grandstand 26 — Pit Lane, Grid & Podium",
    shows: "Pit lane opposite, grid positions in front, podium dead centre",
    seating: "Covered, reserved",
    exposure: "Covered",
  },
  {
    tierKey: "Grandstand 1",
    name: "Grandstand 1 — Centrale",
    shows: "Opposite the start line, halfway down the pit straight — the oldest, most expensive seat at Monza",
    seating: "Reserved plastic bleacher chairs, rows A-M; cover varies by row per conflicting sources",
    exposure: "Partial — east-facing, afternoon shade builds regardless of row",
  },
];

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const grandstand1 = linkedExperiences.find((e) => e.slug.includes("italian-gp-grandstand-1-centrale-"));
  const grandstand5 = linkedExperiences.find((e) => e.slug.includes("italian-gp-grandstand-5-piscina-"));
  const gaLesmoAscari = linkedExperiences.find((e) => e.slug.includes("italian-gp-ga-lesmo-ascari-"));
  const grandstand22 = linkedExperiences.find((e) => e.slug.includes("grandstand-22-parabolica-corner-"));
  const grandstand26 = linkedExperiences.find((e) => e.slug.includes("grandstand-26-pit-lane-grid-podium-"));
  const curvaGrande = linkedExperiences.find((e) => e.slug.includes("curva-grande-general-admission-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Italian Grand Prix"
      status="teaser"
      h1="Six real seats, from a €50 park pass to Monza's priciest grandstand"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The six real options and what each one shows you are free above. The pack adds our direct verdict on GA vs. grandstand for a first Monza trip, the exact seats within Grandstand 1 worth paying extra for, and which stand to move on first before it sells out — this is Ferrari's home race, and demand here outpaces most of the calendar."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Monza sells both structures most F1 fans have experienced somewhere else on the calendar: a General
        Admission (Prato) day pass that gets you into the park to roam between viewing spots, and reserved
        numbered grandstand seats along the lap. That&apos;s different from a no-GA circuit like Interlagos — here
        the real decision is GA vs. grandstand, not which grandstand letter. We cover the six most popular options
        below — the ones fans actually ask us about and the ones that best represent each part of the lap, not
        every numbered grandstand at the circuit.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy your ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Buy directly from monzanet.it, the circuit&apos;s own official ticketing platform, and be ready early —
          this is Ferrari&apos;s home race, and several stands have historically sold out well ahead of race
          weekend given the Tifosi turnout. Every F1 ticket ultimately traces back to the promoter, and buying
          direct means no markup and no risk of a fraudulent listing.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled in, P1
          Travel is a genuine authorized F1 ticket partner — named directly on multiple circuits&apos; own official
          reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in business since 2007.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.monzanet.it/en/tickets/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
          >
            Official Monza tickets →
          </a>
          <a
            href="https://www.p1travel.com/en/series/formula-1-2027?organizers=grand-prix-italy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
          >
            P1 Travel — Italian GP →
          </a>
        </div>
      </div>

      <p className="hidden md:block text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Side by side</p>
      <p className="md:hidden text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Options compared</p>
      <div className="hidden md:block overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-1/4 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Tier</th>
              <th className="w-2/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows</th>
              <th className="w-[17.5%] text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating</th>
              <th className="w-[17.5%] text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover</th>
            </tr>
          </thead>
          <tbody>
            {TIER_META.map((t) => (
              <tr key={t.name} className="border-b border-[#2A2A2A] last:border-0">
                <td className="py-3 pr-4 text-white font-bold align-top">{t.name}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{t.shows}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{t.seating}</td>
                <td className="py-3 text-[#A3A3A3] align-top">{t.exposure}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 mb-4">
        {TIER_META.map((t) => (
          <div key={t.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-2">{t.name}</p>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows: </span>
                {t.shows}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating: </span>
                {t.seating}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover: </span>
                {t.exposure}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">On pricing</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          2027 Monza ticket prices haven&apos;t been published yet. The figures shown here are real 2026 prices —
          General Admission (Prato) ran roughly €50 Friday, €70 Saturday, €100 Sunday, and around €450 for the full
          weekend; Grandstand 5&apos;s 3-day package was €989 (discounted to €959) — carried forward as the closest
          real reference point for 2027 until Monza confirms next year&apos;s pricing. We&apos;ll update this the
          moment 2027 prices go live. Confirm current pricing and availability directly on monzanet.it before buying.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which seat we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Monza weekend on a grandstand budget, Grandstand 26 is the strongest all-round pick
            — covered, reserved seating with pit lane opposite, the grid in front, and the podium dead centre. If
            you want the deepest Tifosi atmosphere over sightline precision, Grandstand 1 is the honest splurge:
            the oldest stand still standing, opposite the start line, at genuinely the highest price on the
            calendar. On a General Admission budget, Lesmo 2&apos;s bleacher-and-screen setup within the
            Lesmo-Ascari stretch beats the more obvious Curva Grande default for anyone who actually wants to
            follow the driving, not just hear the noise.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {grandstand26 && <SpokeExperienceCard experience={grandstand26} isPro={isPro} />}
            {grandstand1 && <SpokeExperienceCard experience={grandstand1} isPro={isPro} />}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {gaLesmoAscari && <SpokeExperienceCard experience={gaLesmoAscari} isPro={isPro} />}
            {curvaGrande && <SpokeExperienceCard experience={curvaGrande} isPro={isPro} />}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {grandstand5 && <SpokeExperienceCard experience={grandstand5} isPro={isPro} />}
            {grandstand22 && <SpokeExperienceCard experience={grandstand22} isPro={isPro} />}
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Paddock Club and Champions Club sit above all six of these as a genuinely different product —
            hospitality, not just a seat. Both get the full breakdown, including real booking mechanics, in the{" "}
            <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Luxury Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where to actually buy</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy the moment 2027 tickets open on monzanet.it if a specific stand matters to you — Grandstand 1 and
            Grandstand 5 both have a track record of selling through early, and this is Ferrari&apos;s home race,
            which pushes demand higher across the board than almost anywhere else on the F1 calendar.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
