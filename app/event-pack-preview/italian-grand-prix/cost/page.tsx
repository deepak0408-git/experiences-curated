import type { Metadata } from "next";
import { getSpokeData, getSpokeImage, SPOKES } from "../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "How Much Does the Italian Grand Prix Cost? — Budget Guide",
};

const TRIP_NIGHTS = 3;
const SPOKE_ID = "cost";

export default async function CostSpoke({
  searchParams,
}: {
  searchParams: Promise<{ unlocked?: string }>;
}) {
  const { tickets, hotels, destinationBand, linkedExperiences } = await getSpokeData();
  const heroImageUrl = getSpokeImage(linkedExperiences, SPOKES.find((s) => s.id === SPOKE_ID)!.imageSlug);

  // PILOT ONLY — ?unlocked=1 simulates the post-purchase view. There is no
  // real purchase check wired up yet; this is purely so the unlocked
  // content can be reviewed before the actual checkout-unlock mechanism
  // (Operations Checklist item #5) is built. Never ship this pattern for
  // real — a real implementation checks an actual purchase/session record.
  const { unlocked: unlockedParam } = await searchParams;
  const isUnlocked = unlockedParam === "1";

  const grandstand22 = linkedExperiences.find((e) => e.slug.includes("grandstand-22"));
  const grandstand26 = linkedExperiences.find((e) => e.slug.includes("grandstand-26"));
  const curvaGrande = linkedExperiences.find((e) => e.slug.includes("curva-grande"));

  const tier1 = tickets.find((t) => t.tier === "tier1"); // GA
  const tier2 = tickets.find((t) => t.tier === "tier2"); // Grandstand
  const tier3 = tickets.find((t) => t.tier === "tier3"); // Hospitality
  const budgetHotel = hotels.find((h) => h.tier === "budget");
  const moderateHotel = hotels.find((h) => h.tier === "moderate");
  const splurgeHotel = hotels.find((h) => h.tier === "splurge");

  const profiles = [
    { label: "Budget", ticket: tier1, hotel: budgetHotel, note: "General admission + a basic, well-reviewed hotel" },
    { label: "Moderate", ticket: tier2, hotel: moderateHotel, note: "Grandstand seat + a 3–4 star hotel" },
    { label: "Splurge", ticket: tier3, hotel: splurgeHotel, note: "Hospitality tier + an upscale, higher-end hotel" },
  ].filter((p) => p.ticket && p.hotel);

  const tripTotal = (ticket: typeof tier1, hotel: typeof budgetHotel) => {
    if (!ticket || !hotel) return null;
    const low = Number(ticket.costLow) + Number(hotel.costLow) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelLow) + Number(destinationBand.foodPerDayLow)) * TRIP_NIGHTS : 0);
    const high = Number(ticket.costHigh) + Number(hotel.costHigh) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0);
    return { low: Math.round(low), high: Math.round(high) };
  };

  const moderateTotal = tripTotal(tier2, moderateHotel);

  return (
    <SpokeShell
      status="teaser"
      h1="How much does a Monza weekend cost?"
      question="How much does a trip to the Italian Grand Prix cost?"
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. Given your budget, which tier we'd actually pick for a first Monza trip and why, plus the booking lead times and contacts for the tiers worth planning ahead for. What each tier is actually like to attend lives in the Ticket Guide; the hospitality tiers above a standard ticket get their own real comparison in the Luxury Guide."
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      unlockPreviewHref="/event-pack-preview/italian-grand-prix/cost?unlocked=1"
    >
      {/* Intro — real authored context, not just a numbers dump. Fact
          checked 27 Jul 2026: Monza is the 7th cheapest race on the 2026
          F1 calendar by ticket price (per the 2026 F1 Ticket Price
          Ranking) — a genuinely sourced claim, not an invented one. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Monza is one of the more affordable weekends on the F1 calendar — the seventh cheapest by ticket price this
        season, according to the 2026 ranking. That said, &quot;affordable for F1&quot; still covers a wide range: a
        General Admission ticket and a budget hotel look nothing like a grandstand seat and a proper stay in Milan.
Below is what each version of this trip actually costs, researched directly from real published ticket and hotel
        prices rather than estimated or assumed, and broken down the way you&apos;d actually spend it — not one
        blended average that doesn&apos;t match anyone&apos;s real trip.
      </p>

      {/* Headline range */}
      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            Grandstand ticket, a 3–4 star hotel, food and local transport for {TRIP_NIGHTS} nights.{" "}
            <a href="#flights" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Flights not included — here&apos;s why ↓
            </a>
          </p>
        </div>
      )}

      {/* Trip profiles */}
      {profiles.length > 0 && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Three ways to do this trip</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {profiles.map((p) => {
              const total = tripTotal(p.ticket, p.hotel);
              return (
                <div key={p.label} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                  <p className="text-xs font-black tracking-widest uppercase text-white mb-1">{p.label}</p>
                  <p className="text-lg font-black text-[#AAFF00]">
                    {total ? formatMoneyRange(total.low, total.high) : "—"}
                  </p>
                  <p className="text-xs text-[#6A6A6A] mt-1">{p.note}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Category breakdown */}
      {(tier2 || moderateHotel || destinationBand) && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">Where the money goes</p>
          <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — grandstand ticket, 3–4 star hotel.</p>
          <div className="flex flex-col gap-2 mb-8">
            {tier2 && (
              <CategoryRow label="Ticket" low={Number(tier2.costLow)} high={Number(tier2.costHigh)} unit="" />
            )}
            {moderateHotel && (
              <CategoryRow label="Hotel" low={Number(moderateHotel.costLow) * TRIP_NIGHTS} high={Number(moderateHotel.costHigh) * TRIP_NIGHTS} unit={`for ${TRIP_NIGHTS} nights`} />
            )}
            {destinationBand && (
              <>
                <CategoryRow label="Local travel" low={Number(destinationBand.localTravelLow) * TRIP_NIGHTS} high={Number(destinationBand.localTravelHigh) * TRIP_NIGHTS} unit={`for ${TRIP_NIGHTS} days`} />
                <CategoryRow label="Food" low={Number(destinationBand.foodPerDayLow) * TRIP_NIGHTS} high={Number(destinationBand.foodPerDayHigh) * TRIP_NIGHTS} unit={`for ${TRIP_NIGHTS} days`} />
              </>
            )}
          </div>
        </>
      )}

      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The ticket tier is actually the bigger swing here, not the hotel — General Admission and a Grandstand seat
        can be a difference of over $700, more than most people expect going in. Hotel still moves the number a lot
        (a budget room and a splurge stay for the same three nights can be a few hundred dollars apart), but if
        you&apos;re trying to control cost, decide your ticket tier first. It&apos;s the single line item most worth
        getting right.
      </p>

      {/* Real local insight — genuinely differentiated content, stays
          public. This is single-event depth/color (same category as the
          Weather or Getting There spokes), not the curated judgment the
          Event Pack sells — gating it wouldn't protect anything, since
          it's not Trip Planner territory either (that's cross-event
          matching, this is single-event texture). Locked 27 Jul 2026
          design session. */}
      {destinationBand?.localTravelNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting around, cheaply</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.localTravelNote}</p>
        </div>
      )}
      {destinationBand?.foodNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A local money-saving trick</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.foodNote}</p>
        </div>
      )}

      {/* Flights — deliberately excluded from the total above rather than
          shown as a misleading single global range (Mumbai and Paris don't
          cost the same to reach Milan). This is real product architecture,
          not a disclaimer: flight cost is origin-dependent, comparison-
          shaped data — genuinely Trip Planner territory (it already asks
          for origin market and shows a real flights estimate), not Cost
          Guide territory (single-event depth, origin-agnostic). Locked 27
          Jul 2026 design session — see the Planner-vs-Pack boundary
          decision in Operations Checklist item #5. */}
      <div id="flights" className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 scroll-mt-20">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What about flights?</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Left out of the total above on purpose — a single number would be misleading when Milan is a 2-hour flight
          for some readers and a 12-hour one for others. Tell the Planner where you&apos;re starting from and it&apos;ll
          give you a real range for your actual route.
        </p>
        <a
          href="/planner"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check flight costs from your city →
        </a>
      </div>

      {/* UNLOCKED CONTENT — only renders when isUnlocked. Every claim here
          traces to real, already-written content: the recommendation is
          drawn from PackView's "On the grounds" section intro
          (italian-gp-2026), the booking detail is the real howToBook field
          on Grandstand 22/26/Curva Grande. Nothing here is invented for
          the pilot. Scoped narrowly to the MONEY decision only — what each
          tier is physically like belongs to Ticket Guide, hospitality-tier
          comparison belongs to Luxury Guide (locked 27 Jul 2026, to avoid
          three spokes claiming the same underlying insight). */}
      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {/* Scoped to the whole cost picture, not just tickets — this page
              is "how much does a Monza weekend cost," and cost has 2 real
              decisions in it: which ticket tier, and where to base
              yourself. Local travel/food stay free-only since there's no
              further recommendation content for those beyond the facts
              already public above. Caught and fixed 27 Jul 2026 — the
              first draft of this section only covered tickets, which
              didn't match what the page as a whole promises. */}
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a first Monza trip, General Admission is the real value pick, not a compromise — Curva Grande and the
            parkland areas get you standing distance from cars at full throttle, no cover, bring a chair. If you want
            the race to feel like an occasion rather than a day out, Grandstand 26 (Pit Lane, Grid &amp; Podium) is
            worth the jump over GA — it&apos;s a genuinely different vantage, not just a pricier seat. We wouldn&apos;t
            spend the difference between GA and a mid grandstand on a slightly-better mid grandstand; the real jump
            in what you actually see is GA→any grandstand, not grandstand→grandstand.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ticket booking windows &amp; contacts</p>
          <div className="flex flex-col gap-3 mb-8">
            {curvaGrande?.practicalInfo?.bookingMethod && (
              <TierBookingCard title="General Admission" detail={curvaGrande.practicalInfo.bookingMethod} />
            )}
            {grandstand26?.practicalInfo?.howToBook && (
              <TierBookingCard title="Grandstand 26" detail={grandstand26.practicalInfo.howToBook} />
            )}
            {grandstand22?.practicalInfo?.howToBook && (
              <TierBookingCard title="Grandstand 22" detail={grandstand22.practicalInfo.howToBook} />
            )}
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d base you</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Monza&apos;s own hotel stock is small, fills fast, and prices up hard for race weekend — we wouldn&apos;t
            book there first. Most experienced visitors base in Milan instead: the direct train to Monza takes 9
            minutes, which makes the extra half hour of city living an easy trade for a much better range of hotels,
            restaurants, and an actual nightlife scene once the day session ends. Lake Como is genuinely scenic but a
            longer, more complicated commute — the right call only if you&apos;re extending into a proper holiday, not
            squeezing three tight circuit days into a weekend.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}

function TierBookingCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}

function CategoryRow({ label, low, high, unit }: { label: string; low: number; high: number; unit: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <span className="text-sm font-bold text-white">{label}</span>
      <span className="text-sm text-[#A3A3A3] font-mono">
        {formatMoneyRange(low, high)} {unit}
      </span>
    </div>
  );
}
