import type { Metadata } from "next";
import Link from "next/link";
import { getSpokeData, getSpokeImage, SPOKES } from "../_lib/getSpokeData";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "Where to Stay for the Italian Grand Prix — Monza Hotels by Budget",
};

const SPOKE_ID = "hotels";

// Real named examples per price tier — same pattern as the Ticket Guide's
// TIERS.examples. Pulled directly from the real costRange text already
// written on our 3 accommodation experiences (staying-in-milan,
// hotel-de-la-ville, lake-como), not invented or star-rated: we don't have
// verified star ratings for these properties, so we name them and describe
// their real category instead of assigning a rating we can't back up.
const TIER_EXAMPLES: Record<string, string> = {
  budget: "BB Hotels Smarthotel Re Milano Nord (Milan, Sesto San Giovanni)",
  moderate: "Hyatt Centric Milan, Hotel Olivedo & Albergo Milano (Lake Como)",
  splurge: "Hilton Milan, Hotel Belvedere (Bellagio, Lake Como)",
  luxury: "Hotel de la Ville, Monza — the only luxury property inside Monza itself",
};

export default async function HotelsSpoke({
  searchParams,
}: {
  searchParams: Promise<{ unlocked?: string }>;
}) {
  const { hotels, accommodationExperiences, linkedExperiences } = await getSpokeData();
  const heroImageUrl = getSpokeImage(linkedExperiences, SPOKES.find((s) => s.id === SPOKE_ID)!.imageSlug);

  // PILOT ONLY — see cost/page.tsx for the full explanation of this pattern.
  const { unlocked: unlockedParam } = await searchParams;
  const isUnlocked = unlockedParam === "1";

  const milan = accommodationExperiences.find((e) => e.slug.includes("staying-in-milan"));
  const dellaVille = accommodationExperiences.find((e) => e.slug.includes("hotel-de-la-ville"));
  const como = accommodationExperiences.find((e) => e.slug.includes("lake-como"));

  return (
    <SpokeShell
      status="teaser"
      h1="Where to stay for the Italian GP"
      question="Where should I stay for Monza F1?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      unlockPreviewHref="/event-pack-preview/italian-grand-prix/hotels?unlocked=1"
      ctaCopy="Every price and every property above is real and free — the pack doesn't unlock more listings, it unlocks the verdict. Which of these three areas actually fits your trip, in plain terms, plus the real booking windows and contacts for the properties worth planning ahead for (Hotel de la Ville sells out by February for a September race)."
    >
      {/* Intro — real framing, not a numbers dump. Monza's own hotel stock
          is small and expensive relative to what a 9-minute train ride to
          Milan buys instead — that tension is the actual story of "where to
          stay for Monza," not a neutral list of three towns. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Monza itself has almost nowhere to stay — a handful of hotels for a race weekend that pulls in six-figure
        crowds, and prices reflect that scarcity. Most experienced visitors don&apos;t fight it: they base in Milan,
        Monza&apos;s own town, or further out on Lake Como, and each of those three answers a slightly different
        question about what kind of race weekend you actually want. Below are real, currently listed price ranges by
        tier, and three real stay options we&apos;ve vetted in our pack — one for each area.
      </p>

      {/* Price tiers — same pattern as Ticket Guide's TIERS: real named
          examples under each price band, not a bare number. Named
          properties are pulled from the real costRange text already
          written on our accommodation experiences; we don't have verified
          star ratings for these hotels, so we name the actual properties
          and their real category instead of assigning an unverified
          rating. */}
      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Price by tier, per night</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {hotels.map((h) => (
          <div key={h.tier} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white capitalize">{h.tier}</span>
              <span className="text-sm text-[#A3A3A3] font-mono">
                ${Math.round(Number(h.costLow))}–${Math.round(Number(h.costHigh))}/night
              </span>
            </div>
            {TIER_EXAMPLES[h.tier] && (
              <p className="text-xs text-[#6A6A6A] mt-2">
                <span className="text-[#AAFF00]">Examples:</span> {TIER_EXAMPLES[h.tier]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Real observation, same "money paragraph" pattern as Cost Guide —
          an actual takeaway, not just numbers sitting next to each other. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The jump from budget to moderate is small — under $20 a night on the low end. The real jump is
        moderate-to-splurge, where race-weekend demand pushes Monza&apos;s scarce luxury stock (Hotel de la Ville is
        effectively the only one) well past what the same category costs in Milan on a normal weekend. If budget is
        tight, that argues for Milan or Como over Monza almost by default — you get more hotel for the same money
        the further you are from the circuit gates.
      </p>

      {/* Three real stay options — full curated commentary, not a bare
          listing. This is the actual content of "where to stay," not a
          teaser for it — the verdict of *which one fits your trip* is what
          the pack unlocks below, not the existence of these three options. */}
      {accommodationExperiences.length > 0 && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The three real options</p>
          <div className="flex flex-col gap-4 mb-8">
            {accommodationExperiences.map((e) => (
              <div key={e.id} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
                <p className="text-sm font-bold text-white">{e.title}</p>
                {e.subtitle && <p className="text-xs text-[#6A6A6A] mt-1 mb-3">{e.subtitle}</p>}
                <p className="text-sm text-[#A3A3A3] leading-6 mt-3">{e.whyItsSpecial?.split("\n\n")[0]}</p>
                <Link href={`/experience/${e.slug}`} className="inline-block mt-3 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
                  Read the full guide →
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Real local money-saving detail — stays public, same rationale as
          the equivalent note on the Cost Guide (single-event texture, not
          curated judgment). */}
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing, whichever area you pick</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Race weekend drives demand across the whole region, not just next to the circuit — Milan hotels fill up too,
          not only Monza&apos;s. Book as early as you can regardless of area. Hotel de la Ville, Monza&apos;s one
          luxury option, typically sells out by February or March for a September race.
        </p>
      </div>

      {/* UNLOCKED CONTENT — the actual verdict: which area fits which trip.
          Sourced from PackView's real "Where to stay" intro (same source
          already used for the Cost Guide's equivalent section) plus each
          experience's own real howToBook / bookingMethod fields. Locked 27
          Jul 2026 design session — Cost Guide covers this at the money
          level ("we'd base you in Milan"), this section is the deeper,
          area-by-area version with the actual booking mechanics. */}
      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which area we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a first Monza trip, base in Milan. The train is 9 minutes, which stops the commute being a real
            trade-off, and in exchange you get a proper city for the ten-plus hours a day you&apos;re not at the
            circuit — a much wider range of hotels, restaurants, and an actual nightlife scene once the day session
            ends. Hotel de la Ville is the right call only if you want to walk to the circuit and back and spend the
            whole weekend inside the event rather than commuting to it — it&apos;s genuinely worth it for that specific
            experience, not because Milan is a compromise. Lake Como is the right call only if you&apos;re extending
            into a longer Italian holiday around the race, or you&apos;ve done Monza once already and want a
            different shape to the trip the second time — budget close to two hours door to door, not the 40 minutes
            some older guides suggest.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking windows &amp; contacts</p>
          <div className="flex flex-col gap-3">
            {milan?.practicalInfo?.bookingMethod && <AreaBookingCard title="Milan" detail={milan.practicalInfo.bookingMethod} />}
            {dellaVille?.practicalInfo?.howToBook && <AreaBookingCard title="Hotel de la Ville, Monza" detail={dellaVille.practicalInfo.howToBook} />}
            {como?.practicalInfo?.bookingMethod && <AreaBookingCard title="Lake Como" detail={como.practicalInfo.bookingMethod} />}
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function AreaBookingCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
