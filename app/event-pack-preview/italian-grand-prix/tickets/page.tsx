import type { Metadata } from "next";
import Link from "next/link";
import { getSpokeData, getSpokeImage, SPOKES } from "../_lib/getSpokeData";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "Monza Grandstand vs General Admission — Italian GP Ticket Guide",
};

const SPOKE_ID = "tickets";

// Real ticket tiers, described by what they GIVE YOU, with a rough
// indicative price band per tier (not exact live prices — those move
// often enough that republishing them risks showing a stale number).
// Bands are rounded from real verified data, not invented: General
// Admission from real 3-day GA listings (€120-179 historically, rounds to
// ~€100-200); Standard Reserved from 21A/21B/22/16-Ascari's live prices
// (€599-899, rounds to ~€600-1,200 to cover the visible spread); Premium
// from Grandstand 6C's live €1,199 plus headroom for Centrale/26-class
// stands (sold out, no live price, but real venues at this tier); VIP
// Hospitality from Ultimate/Schumacher Lounge's live €4,990-5,990.
// Every named grandstand example verified directly against the live
// f1italy.com ticket listing (fetched 27 Jul 2026, full 76-item listing).
// Same discipline as Cost Guide: no reused planner-cost-calculation
// numbers, this is a separate context (deciding WHAT to buy, not
// budgeting) with its own real sourcing.
const TIERS = [
  {
    name: "General Admission",
    gives: "Open grass/parkland viewing around the circuit — no assigned seat, no fixed sightline. Move around freely between vantage points across the weekend.",
    examples: "Prato, Interno Parabolica",
    priceBand: "Roughly €100–200 for the weekend",
    seating: "Unreserved, standing/grass",
    exposure: "Fully exposed — no cover",
    included: "Circuit access only",
  },
  {
    name: "Standard Reserved",
    gives: "A fixed, numbered seat with a guaranteed sightline at one specific point on the circuit for the whole weekend.",
    examples: "Grandstand 21A/21B, Grandstand 22 (Parabolica), Grandstand 16 (Ascari)",
    priceBand: "Roughly €600–1,200 for the weekend",
    seating: "Reserved seat",
    exposure: "Mostly exposed — some stands partially covered",
    included: "Seat only",
  },
  {
    name: "Premium Grandstand",
    gives: "A reserved seat at the circuit's highest-demand locations — start/finish straight, podium sightlines, pit lane views.",
    examples: "Grandstand 1 (Centrale), Grandstand 26 (Laterale Destra), Grandstand 6C",
    priceBand: "Roughly €1,200–1,500+ for the weekend",
    seating: "Reserved seat, marquee location",
    exposure: "Often covered, varies by stand",
    included: "Seat only, best sightlines on track",
  },
  {
    name: "VIP Hospitality",
    gives: "Lounge access with food and drink included, alongside your circuit viewing — a genuinely different product from a seat, not just a pricier one.",
    examples: "Ultimate Lounge, Schumacher Lounge",
    priceBand: "Roughly €5,000+ for the weekend",
    seating: "Lounge + reserved viewing area",
    exposure: "Covered lounge access",
    included: "Food, drink, hospitality lounge",
  },
];

export default async function TicketsSpoke({
  searchParams,
}: {
  searchParams: Promise<{ unlocked?: string }>;
}) {
  const { linkedExperiences } = await getSpokeData();
  const heroImageUrl = getSpokeImage(linkedExperiences, SPOKES.find((s) => s.id === SPOKE_ID)!.imageSlug);

  // PILOT ONLY — see the same note on the Cost Guide spoke. No real
  // purchase check exists yet.
  const { unlocked: unlockedParam } = await searchParams;
  const isUnlocked = unlockedParam === "1";

  const curvaGrande = linkedExperiences.find((e) => e.slug.includes("curva-grande"));
  const grandstand22 = linkedExperiences.find((e) => e.slug.includes("grandstand-22"));
  const grandstand26 = linkedExperiences.find((e) => e.slug.includes("grandstand-26"));
  const fanZone = linkedExperiences.find((e) => e.slug.includes("fan-zone"));

  return (
    <SpokeShell
      status="teaser"
      h1="Which Italian GP ticket should you buy?"
      question="Monza grandstand vs general admission — what's the difference?"
      ctaCopy="The tiers, what they give you, and real named examples are all free above. The Event Pack adds our actual verdict — which tier we'd pick and why, based on view, weather exposure, and what kind of trip you're building — plus the same real per-tier experience detail (what it's genuinely like to sit there) you won't find pre-assembled anywhere else."
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      unlockPreviewHref="/event-pack-preview/italian-grand-prix/tickets?unlocked=1"
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Monza sells four real kinds of ticket, and the difference between them is what you actually get, not just
        how much you pay. The price bands below are rough and rounded on purpose — exact prices shift often enough
        that we&apos;d rather point you to the real thing for a firm number than risk showing you something stale.
        What follows is what each tier genuinely gives you, with real named examples, verified directly against the
        official ticketing site.
      </p>

      <div className="flex flex-col gap-4 mb-8">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <p className="text-sm font-black text-white">{tier.name}</p>
              <p className="text-xs text-[#AAFF00] whitespace-nowrap">{tier.priceBand}</p>
            </div>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-3">{tier.gives}</p>
            <p className="text-xs text-[#6A6A6A]">
              <span className="text-[#AAFF00]">Examples:</span> {tier.examples}
            </p>
          </div>
        ))}
      </div>

      <a
        href="https://www.f1italy.com/en/tickets"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors mb-8"
      >
        See live prices &amp; availability on the official site →
      </a>

      {/* Comparison table — free, factual columns only (seating type,
          exposure, inclusions). No "best for"/verdict column here — that's
          the gated judgment layer below. Split locked 27 Jul 2026. */}
      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Side by side</p>
      <div className="overflow-x-auto mb-8">
        <table className="w-full min-w-[720px] text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Tier</th>
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Rough price</th>
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating</th>
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather exposure</th>
              <th className="w-1/5 text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Included</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((tier) => (
              <tr key={tier.name} className="border-b border-[#2A2A2A] last:border-0">
                <td className="w-1/5 py-3 pr-4 text-white font-bold align-top">{tier.name}</td>
                <td className="w-1/5 py-3 pr-4 text-[#A3A3A3] align-top">{tier.priceBand}</td>
                <td className="w-1/5 py-3 pr-4 text-[#A3A3A3] align-top">{tier.seating}</td>
                <td className="w-1/5 py-3 pr-4 text-[#A3A3A3] align-top">{tier.exposure}</td>
                <td className="w-1/5 py-3 text-[#A3A3A3] align-top">{tier.included}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#6A6A6A]">
        Wondering which one is actually worth the money for your budget?{" "}
        <Link href="/event-pack-preview/italian-grand-prix/cost" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          See the Cost Guide
        </Link>
        .
      </p>

      {/* UNLOCKED CONTENT — the real verdict + the experiential detail.
          Every line traces to the real whyItsSpecial content already
          written for these experiences. Scoped narrowly per the 27 Jul
          2026 design session: money verdict lives on Cost Guide,
          hospitality-tier comparison lives on Luxury Guide — this unlock
          is specifically "which of these 4 real categories, and what's it
          actually like." */}
      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For most first-time visitors, Standard Reserved beats both General Admission and Premium — GA saves you
            money but costs you a fixed view for the whole weekend, and Premium&apos;s extra cost buys marginally
            better sightlines you often can&apos;t appreciate on a first visit anyway. Grandstand 22 at the Parabolica
            is the one we&apos;d point a first-timer to: covered, at the corner that decides most of the lap, and
            priced below the marquee straight-line stands. If it&apos;s within budget, Grandstand 26 is the one
            exception worth the jump to Premium — it&apos;s opposite the pit lane and dead centre on the podium, so
            you&apos;re watching the race operationally (pit stops, strategy, the podium itself) rather than just the
            racing at one corner. Worth it if the occasion matters as much as the technical side of the sport;
            skippable if it doesn&apos;t.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What each is actually like</p>
          <div className="flex flex-col gap-4">
            {/* Images dropped from all 3 cards (27 Jul 2026) — none of the
                real available photos reliably represent the actual view
                from the stand (Grandstand 22's was a distant hillside
                shot even after a focal-point crop; Grandstand 26's was a
                blurred close-up of a car, not the pit lane/grid/podium
                view the card describes). Showing a photo that doesn't
                match the claim is worse than showing no photo — same
                honesty standard as the ticket-price sourcing issue
                earlier this session, applied to imagery. */}
            {curvaGrande?.whyItsSpecial && (
              <TierExperienceCard
                title="General Admission — Curva Grande"
                summary="Closest to the cars, no seat at all."
                detail={curvaGrande.whyItsSpecial}
                slug={curvaGrande.slug}
              />
            )}
            {grandstand22?.whyItsSpecial && (
              <TierExperienceCard
                title="Grandstand 22 — The Parabolica Corner"
                summary="The technical choice: a covered seat at the braking zone that decides the lap."
                detail={grandstand22.whyItsSpecial}
                slug={grandstand22.slug}
              />
            )}
            {grandstand26?.whyItsSpecial && (
              <TierExperienceCard
                title="Grandstand 26 — Pit Lane, Grid & Podium"
                summary="The prestige choice: pit lane opposite, grid in front, podium dead centre."
                detail={grandstand26.whyItsSpecial}
                slug={grandstand26.slug}
              />
            )}
          </div>

          {fanZone?.whyItsSpecial && (
            <div className="mt-6 rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Included with every tier</p>
              <p className="text-sm text-[#A3A3A3] leading-6">{fanZone.whyItsSpecial}</p>
            </div>
          )}
        </div>
      )}
    </SpokeShell>
  );
}

function TierExperienceCard({
  title,
  summary,
  detail,
  slug,
}: {
  title: string;
  summary: string;
  detail: string;
  // Links to the real, already-published experience page for this stand —
  // more detail lives there (practical info, full-size hero, etc.) than
  // fits in this summary card. The site's existing 3-free-reads cap
  // applies there automatically, nothing to replicate here.
  slug?: string;
}) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      {/* No image on these cards (27 Jul 2026) — none of the real available
          photos reliably represent the actual view from the stand
          (Grandstand 22's was a distant hillside shot even after a
          focal-point crop; Grandstand 26's was a blurred close-up of a
          car, not the pit lane/grid/podium view the card describes).
          Showing a photo that doesn't match the claim is worse than
          showing no photo. */}
      <p className="text-sm font-bold text-white mb-1">{title}</p>
      <p className="text-xs text-[#6A6A6A] mb-3">{summary}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
      {slug && (
        <Link href={`/experience/${slug}`} className="inline-block mt-3 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
          Read the full guide to this stand →
        </Link>
      )}
    </div>
  );
}
