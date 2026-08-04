import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "tickets";

// Real factual columns — sourced from singaporegp.sg official grandstand
// pages, all 16 stands, plus oversteer48.com independent section reviews.
// See seed-singapore-gp-*.mjs editorialNote fields for full sourcing.
// This list intentionally does NOT map to plannerTicketTierCost's tier1-4
// (used on the Cost spoke) — that table's eventTierLabel field was seeded
// from a different, unreconciled source (single-day/hospitality product
// names like "Twenty 3", "Torque @ Flyer") that doesn't match these 16
// named stands. Flagged, not silently forced into a fake mapping — see
// feedback_scope_assumptions_and_currency_sweep memory, 2 Aug 2026.
const STANDS = [
  { slug: "singapore-gp-turn1-grandstand", name: "Turn 1", shows: "Start-line braking from 290km/h into Turns 1-3", seating: "Reserved (A2-A9, book A3-A6 for real sightlines)", exposure: "Uncovered", price: 1698, priceBand: "S$1,698 (3-day)" },
  { slug: "singapore-gp-stamford-grandstand", name: "Stamford", shows: "Turn 7 — bumpy braking zone, real overtaking history", seating: "Reserved (A1-A7)", exposure: "Uncovered", price: 608, priceBand: "S$608 (3-day) — cheapest grandstand" },
  { slug: "singapore-gp-padang-grandstand", name: "Padang", shows: "Turn 9-10 straight — weak racing view, strong concert proximity", seating: "Reserved (A/B sections)", exposure: "Uncovered", price: 738, priceBand: "S$738 (3-day)" },
  { slug: null, name: "Super Pit", shows: "Race start, lap-one jostling into Turns 1-3", seating: "Reserved", exposure: "Uncovered", price: 2498, priceBand: "S$2,498 (3-day) — priciest grandstand" },
  { slug: null, name: "Pit", shows: "Race start straight — where most overtaking happens off the line", seating: "Reserved", exposure: "Uncovered", price: 1798, priceBand: "S$1,798 (3-day)" },
  { slug: null, name: "Turn 2", shows: "Unrivalled view of all 20 cars into the first three corners off the line", seating: "Reserved", exposure: "Uncovered", price: 1798, priceBand: "S$1,798 (3-day)" },
  { slug: null, name: "Pit Exit", shows: "Cars accelerating back onto the circuit after pit stops", seating: "Reserved", exposure: "Uncovered", price: 1698, priceBand: "S$1,698 (3-day)" },
  { slug: null, name: "Raffles", shows: "Turn 5 area, near the Padang and Esplanade", seating: "Reserved", exposure: "Uncovered", price: 1208, priceBand: "S$1,208 (3-day)" },
  { slug: null, name: "Bay", shows: "Turns 18-19 — one of the biggest stands on the F1 calendar (27,000 seats), cars diving through tight, wall-lined corners before the final straight", seating: "Reserved", exposure: "Uncovered", price: Infinity, priceBand: "Not separately listed on singaporegp.sg — may be sold under a different name (Marina Bay/Bayfront) in 2026, confirm before booking" },
  { slug: null, name: "Marina Bay", shows: "Turns 18-19 from a different angle, Singapore Flyer lit up behind the track", seating: "Reserved", exposure: "Uncovered", price: 1798, priceBand: "S$1,798 (3-day)" },
  { slug: null, name: "Bayfront", shows: "Turns 16-18 — braking out of a high-speed straight, run past the Flyer", seating: "Reserved", exposure: "Uncovered", price: 1428, priceBand: "S$1,428 (3-day)" },
  { slug: null, name: "Promenade", shows: "Turns 16-18 — braking out of a high-speed straight, run past the Flyer", seating: "Reserved", exposure: "Uncovered", price: 1428, priceBand: "S$1,428 (3-day)" },
  { slug: null, name: "Skyline", shows: "Turns 17-18, right before pit entry — where drivers are most likely to make a mistake under pressure", seating: "Reserved", exposure: "Uncovered", price: 1568, priceBand: "S$1,568 (3-day)" },
  { slug: null, name: "Republic", shows: "Turn 5's kink into the first DRS zone — includes a free Singapore Flyer ride", seating: "Reserved", exposure: "Uncovered", price: 988, priceBand: "S$988 (3-day)" },
  { slug: null, name: "Connaught", shows: "Turn 14 — a tight DRS-zone corner with genuine wheel-to-wheel racing", seating: "Reserved", exposure: "Uncovered", price: 738, priceBand: "S$738 (3-day)" },
  { slug: null, name: "Empress", shows: "Turns 11-12 — peak braking across the Anderson Bridge", seating: "Reserved", exposure: "Uncovered", price: 738, priceBand: "S$738 (3-day)" },
  { slug: null, name: "Zone 4 Walkabout", shows: "Standing room, roams Zone 4 viewing platforms — includes Padang Stage concerts", seating: "Standing", exposure: "Uncovered", price: 198, priceBand: "S$198–548" },
  { slug: null, name: "Premier Walkabout", shows: "Standing room, roams all four zones", seating: "Standing", exposure: "Uncovered", price: 298, priceBand: "S$298–728" },
].sort((a, b) => a.price - b.price);

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("singapore-gp-ticket-guide"));
  const turn1 = linkedExperiences.find((e) => e.slug.includes("singapore-gp-turn1-grandstand"));
  const stamford = linkedExperiences.find((e) => e.slug.includes("singapore-gp-stamford-grandstand"));
  const padang = linkedExperiences.find((e) => e.slug.includes("singapore-gp-padang-grandstand"));
  const walkabout = linkedExperiences.find((e) => e.slug.includes("singapore-gp-zone4-walkabout"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Singapore Grand Prix"
      status="teaser"
      h1="Grandstand or Walkabout — the real Singapore GP ticket decision"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The tiers, what they show, and real 2026 prices are all free above. The Event Pack adds our actual verdict — which stand we'd pick for a first Singapore GP and why — plus the real, experience-level detail for every stand, not just a summary."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Sixteen named grandstands and two Walkabout tiers span Marina Bay Street Circuit, from S$608 to S$2,498 for
        three days. They&apos;re built around genuinely different ideas of what&apos;s worth watching, not just
        different price points for the same experience.
      </p>

      <p className="hidden md:block text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Side by side</p>
      <p className="md:hidden text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Options compared</p>
      <div className="hidden md:block overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Stand</th>
              <th className="w-2/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows</th>
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating</th>
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover</th>
              <th className="w-1/5 text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Price</th>
            </tr>
          </thead>
          <tbody>
            {STANDS.map((s) => (
              <tr key={s.name} className="border-b border-[#2A2A2A] last:border-0">
                <td className="py-3 pr-4 text-white font-bold align-top">{s.name}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{s.shows}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{s.seating}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{s.exposure}</td>
                <td className="py-3 text-[#AAFF00] align-top">{s.priceBand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 mb-8">
        {STANDS.map((s) => (
          <div key={s.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
              <p className="text-sm font-bold text-white">{s.name}</p>
              <p className="text-xs font-black text-[#AAFF00]">{s.priceBand}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">What it shows: </span>
                {s.shows}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Seating: </span>
                {s.seating}
              </p>
              <p className="text-sm text-[#A3A3A3] leading-6">
                <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Weather cover: </span>
                {s.exposure}
              </p>
            </div>
          </div>
        ))}
      </div>

      {ticketGuide && (
        <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
          The full breakdown of all 16 grandstands, both Walkabout tiers, and which one we&apos;d actually pick lives
          in the{" "}
          <Link href={`/experience/${ticketGuide.slug}`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            complete ticket guide
          </Link>
          .
        </p>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which stand we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Singapore GP, Stamford is the right call for pure value — real racing at a corner
            that&apos;s caught out world champions, for a third of the top tier&apos;s price. If proximity to the
            start matters more, Turn 1&apos;s sections A3-A6 give the closest thing to a start-line seat on the
            circuit. Padang is the honest exception: buy it for the Padang Stage concerts, not the racing, its view
            of Turns 9-10 is genuinely weak. If the concerts matter as much as the race, Zone 4 Walkabout gets you
            both for the lowest price at the event.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What each is actually like</p>
          <div className="flex flex-col gap-4 mb-6">
            {stamford?.whyItsSpecial && (
              <TierExperienceCard title="Stamford Grandstand" summary="Best value racing seat on the circuit." detail={stamford.whyItsSpecial} slug={stamford.slug} />
            )}
            {turn1?.whyItsSpecial && (
              <TierExperienceCard title="Turn 1 Grandstand" summary="The closest thing to a start-line seat." detail={turn1.whyItsSpecial} slug={turn1.slug} />
            )}
            {padang?.whyItsSpecial && (
              <TierExperienceCard title="Padang Grandstand" summary="A concert ticket that happens to include a race." detail={padang.whyItsSpecial} slug={padang.slug} />
            )}
            {walkabout?.whyItsSpecial && (
              <TierExperienceCard title="Zone 4 Walkabout" summary="No seat, real racing, the lowest price at the race." detail={walkabout.whyItsSpecial} slug={walkabout.slug} />
            )}
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Buy only through official channels</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy via{" "}
            <a href="https://tickets.formula1.com/en/f1-3301-singapore" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              tickets.formula1.com
            </a>{" "}
            or{" "}
            <a href="https://singaporegp.sg" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              singaporegp.sg
            </a>{" "}
            only — most 3-day grandstands and Sunday-inclusive tickets have historically sold out well before race
            week, so don&apos;t wait to decide once you know your tier.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}

function TierExperienceCard({ title, summary, detail, slug }: { title: string; summary: string; detail: string; slug?: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
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
