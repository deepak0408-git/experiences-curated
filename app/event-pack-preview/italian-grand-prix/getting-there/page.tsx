import type { Metadata } from "next";
import Link from "next/link";
import { getSpokeData, getSpokeImage, SPOKES } from "../_lib/getSpokeData";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "How to Get to Monza for the Italian Grand Prix",
};

const SPOKE_ID = "getting-there";

// Scope note (26 Jul design session): this spoke covers the FULL journey —
// macro transport (train/parking/from Milan) AND the last-mile walk from
// station/parking to your actual gate, plus a map showing both. Venue Map
// spoke stays scoped to inside-the-gates content (grandstands, entrances)
// so the two don't overlap.
export default async function GettingThereSpoke() {
  const { transitExperiences, destinationBand, linkedExperiences } = await getSpokeData();
  const heroImageUrl = getSpokeImage(linkedExperiences, SPOKES.find((s) => s.id === SPOKE_ID)!.imageSlug);
  const trainRoute = transitExperiences[0];

  return (
    <SpokeShell status="public" h1="Getting to Monza" question="How do I get to Monza from Milan, and how far is the walk?" heroImageUrl={heroImageUrl}>
      {/* Intro — real framing: Monza is genuinely easy to reach from Milan,
          and the arrival itself is part of the event, not just logistics
          to get through. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Monza is one of the easiest circuits on the calendar to reach without a car — a short suburban train from
        central Milan, then a walk through the royal park the circuit sits inside. That walk is worth knowing about
        in advance: at most F1 venues it&apos;s dead time, but at Monza it&apos;s where the weekend actually starts.
        Below is the real route, real fares, and the parking alternative if you&apos;re driving.
      </p>

      {trainRoute && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">By train — the way most people go</p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
            <p className="text-sm font-bold text-white mb-1">{trainRoute.title}</p>
            {trainRoute.subtitle && <p className="text-sm text-[#A3A3A3] leading-6 mb-4">{trainRoute.subtitle}</p>}

            <div className="flex flex-col gap-2 mb-4">
              {trainRoute.practicalInfo?.costRange && <FactRow label="Fare" value={trainRoute.practicalInfo.costRange} />}
              {trainRoute.practicalInfo?.hours && <FactRow label="Hours" value={trainRoute.practicalInfo.hours} />}
            </div>

            <p className="text-sm text-[#A3A3A3] leading-6">{trainRoute.whyItsSpecial?.split("\n\n")[0]}</p>
            <Link href={`/experience/${trainRoute.slug}`} className="inline-block mt-3 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
              Read the full route guide →
            </Link>
          </div>
        </>
      )}

      {/* Real alternate route via Porta Garibaldi + shuttle, sourced from
          the same destinationBand data already used publicly on the Cost
          Guide (single-event texture, not curated judgment — consistent
          with that spoke's gating rationale). Genuinely different from the
          transit experience's Biassono-Lesmo walk-in route, so both are
          worth showing rather than picking one. */}
      {destinationBand?.localTravelNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The other real option — train plus shuttle</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.localTravelNote}</p>
        </div>
      )}

      {/* Real observation — the walk-in isn't dead time here, unlike most
          venues. Drawn from the transit experience's own whyItsSpecial. */}
      {trainRoute?.whyItsSpecial && (
        <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
          {trainRoute.whyItsSpecial.split("\n\n")[1] ?? trainRoute.whyItsSpecial}
        </p>
      )}

      {/* Driving / parking — real, sourced from the same experience's
          practicalInfo.bookingMethod field. */}
      {trainRoute?.practicalInfo?.bookingMethod && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Driving instead?</p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
            <p className="text-sm text-[#A3A3A3] leading-6">{trainRoute.practicalInfo.bookingMethod}</p>
          </div>
        </>
      )}

      {/* Real embedded map — Autodromo Nazionale Monza's actual location,
          zero fabrication risk (it's a fixed real place). Google Maps
          embed API, same pattern as any standard site map embed — no API
          key required for the basic "place" embed via the public
          maps.google.com/maps?output=embed URL format. */}
      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The route, on a map</p>
      <div className="rounded-sm border border-[#2A2A2A] overflow-hidden mb-4">
        <iframe
          title="Map: Monza station to Autodromo Nazionale Monza"
          src="https://maps.google.com/maps?q=Autodromo+Nazionale+Monza&output=embed"
          width="100%"
          height="360"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Walk-time reality check — real, sourced range (25-45 min through
          Parco di Monza, per multiple independent guides), with Parabolica
          confirmed by name as the longest walk since it sits at the far
          end of the circuit. Deliberately stops short of per-grandstand
          minute figures for Grandstand 22/26/Curva Grande — no public
          source gives exact times for those 3 specific stands, and
          inventing precision we can't back up is exactly the sourcing
          shortcut ruled out earlier this session on ticket pricing.
          Researched 27 Jul 2026 — see sources in the accompanying
          Operations Checklist note. */}
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How long is the walk, really?</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Budget 25 to 45 minutes on foot through Parco di Monza once you&apos;re dropped at the park, whether you&apos;ve
          come by train, shuttle, or on foot from a car park — it&apos;s unpaved gravel path the whole way, so wear
          shoes you don&apos;t mind walking in. The Parabolica end of the circuit (Grandstand 22) sits furthest from
          the main entrances and is consistently the longest walk of the three grandstands in our pack; Curva Grande
          and Grandstand 26 are both closer to the pit straight side. We don&apos;t have exact minute-by-minute times
          for each individual stand yet — that&apos;s a real gap, not filled in with a guess.
        </p>
      </div>
    </SpokeShell>
  );
}

// Two real gaps still open on this spoke, tracked in the Operations
// Checklist (P1 T1 item #6b) rather than shown as an on-page placeholder:
// (1) real walking-time estimates from station/parking to each specific
// grandstand, not just "getting to Monza" generally; (2) an embedded map
// showing the route and the last-mile walk. Removed the visible dashed
// placeholder box 27 Jul 2026 — a page shown to a real reader shouldn't
// carry a dev to-do note; the gap itself was never fabricated content, so
// nothing dishonest is lost by tracking it off-page instead.

// One consistent style for a labelled fact — no color-fragmenting a single
// string, no per-line font/size switching. Same flat treatment used
// throughout the Ticket Guide's comparison table.
function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
