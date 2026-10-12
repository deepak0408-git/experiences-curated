import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";

// planner_hotel_tier_cost and planner_flight_cost are both empty for the
// Belgian Ardennes destination as of 12 Oct 2026 (confirmed via direct DB
// query) — this spoke ships as an honest placeholder on the hotel/flight
// side rather than fabricating numbers, per the migrate-from-classic-to-
// hub-spoke skill §3's Cost-spoke rule. Real planner_ticket_tier_cost rows
// DO exist (edition_year 2027, same real USD figures carried forward from
// 2026 pending Belgian GP's own 2027 pricing) and are shown directly.
// Operations Checklist follow-up needed: seed planner_hotel_tier_cost and
// planner_flight_cost for the Belgian Ardennes destination via the
// planner-data-researcher skill.
export default async function CostSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets, destinationBand, costDataVerifiedAt } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");
  const tier4 = tickets.find((t) => t.tier === "tier4");

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Belgian Grand Prix"
      status="teaser"
      h1="What a real Belgian GP weekend costs, by ticket tier"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's real and sourced is free above. The pack adds our direct verdict on which grandstand and which Ardennes town we'd actually pick for a first Spa weekend, plus the booking-window detail that matters most this year — Gold 3 has a track record of selling out months ahead."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Spa-Francorchamps offers a genuine range of ticket tiers — a Bronze General Admission pass from around
        US$215 that roams most of the 7km circuit, up to Paddock Club hospitality at the top end. We haven&apos;t
        yet built a real, sourced hotel and flight cost breakdown for the Ardennes — rather than estimate or
        invent numbers here, we&apos;re saying so plainly. The real, verified ticket-tier pricing below is live
        now.
      </p>

      <div className="mb-8 rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Hotel and flight cost data not live yet</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          We haven&apos;t finished sourcing verified hotel and flight cost data for Spa and the wider Ardennes yet.
          This section will show a full trip-cost breakdown, combining accommodation, local travel, food, and
          tickets, once that research is complete.
        </p>
      </div>

      {tier1 || tier2 || tier3 || tier4 ? (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ticket tiers — real, sourced pricing</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { t: tier1, title: "Bronze — General Admission", note: "Roams most of the 7km circuit" },
              { t: tier2, title: "Silver Grandstand", note: "Fixed, reserved, covered seat" },
              { t: tier3, title: "Gold Grandstand", note: "Fixed, reserved, covered seat" },
              { t: tier4, title: "Hospitality — Paddock Club", note: "Open bar, paddock access" },
            ]
              .filter((x) => x.t)
              .map((x) => (
                <div key={x.title} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                  <p className="text-xs font-black tracking-widest uppercase text-white mb-1">{x.title}</p>
                  <p className="text-lg font-black text-[#AAFF00]">
                    {Math.round(Number(x.t!.costLow)) === Math.round(Number(x.t!.costHigh))
                      ? `US$${Math.round(Number(x.t!.costLow)).toLocaleString("en-US")}`
                      : formatMoneyRange(Math.round(Number(x.t!.costLow)), Math.round(Number(x.t!.costHigh)))}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• {x.note}</li>
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• 3-day weekend</li>
                  </ul>
                </div>
              ))}
          </div>
          <p className="text-xs text-[#6A6A6A] mb-8">
            Belgian GP&apos;s own 2027 pricing isn&apos;t published yet — figures above carry forward the real,
            confirmed 2026 USD pricing.
            {costDataVerifiedAt && (
              <> Verified {costDataVerifiedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} — not real-time.</>
            )}
          </p>
        </>
      ) : null}

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

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What about flights and hotels?</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Spa-Francorchamps is reached via Brussels (BRU) as the main international gateway, with Liège Airport
          (LGG) as a closer but more limited alternative. A real cost range for both flights and Ardennes
          accommodation is on our research list — check back, or use the Planner for the latest available data on
          your actual route.
        </p>
        <a
          href={`/price-radar/${eventSlug}`}
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check full trip costs from your city →
        </a>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which grandstand we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Spa weekend, Gold 3 at Raidillon is the strongest all-round pick — the most
            famous corner sequence on the calendar, covered, and historically the first grandstand to sell out
            for good reason. On a Silver budget, Pouhon&apos;s technical driver differences are the sharper
            choice. On Bronze, roam Friday and commit to your preferred spot for qualifying and the race. The
            full grandstand-by-grandstand comparison lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Buy official, book early — Gold 3 sells out fast</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Buy via spagrandprix.com, the circuit&apos;s own official ticketing site, first. Gold 3 in
              particular has historically sold through earliest given its Eau Rouge/Raidillon view. Paddock Club
              is a separate hospitality product entirely — see the Luxury Guide for the real booking mechanics.
            </p>
            <a
              href="https://www.spagrandprix.com/en/billetterie"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              spagrandprix.com — official tickets →
            </a>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Spa town is the right default for most first-time visitors — a genuinely wider range of restaurants
            and hotel stock than Stavelot&apos;s small town. Stavelot is the honest exception, trading that range
            for a shorter commute to the gates. See the{" "}
            <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Stay guide
            </a>{" "}
            for the full breakdown of both.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
