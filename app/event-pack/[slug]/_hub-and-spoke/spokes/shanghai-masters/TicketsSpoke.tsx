import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Rebuilt 10 Aug 2026 after founder review found real problems the earlier
// pass missed: h1 was a verbatim duplicate of `question` (skill §1b names
// this exact bug); the Arena card added no ticketing-relevant value and
// was cut (its real home is Arrival/Map); "which ticket we'd pick" had no
// day-of-tournament guidance despite this being a real 14-day event with a
// meaningfully different access profile early vs. late in the draw (same
// structure established in the Itinerary rebuild, not carried over here
// until now); and the Federer card rendered with zero transition sentence.
// Ticket prices match the real, seeded planner_ticket_tier_cost rows.
export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const federer = linkedExperiences.find((e) => e.slug.includes("roger-friends-federer-exhibition"));
  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("shanghai-masters-ticket-guide"));
  const centerCourt = linkedExperiences.find((e) => e.slug.includes("qizhong-center-court"));

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="teaser"
      h1="Three tiers, a shared day/night ticket, and Court 17 included free"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The pack above gives you the real ticket structure and how to flex around the draw for free. Unlocking adds our curated seat-tier recommendation — including which stretch of the 14-day draw to book it for — and the Federer exhibition-day booking timing that actually matters."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Qizhong runs three showcourts — Center Court (13,779 seats), Grandstand 2 (5,000 seats), and Grandstand 3
        (3,000 seats) — plus dozens of outer practice and qualifying courts across the wider 80-hectare complex.
        Tickets are structured to let you flex around the draw rather than lock you into one court for the whole
        trip.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ticket types</p>
      <div className="flex flex-col gap-3 mb-8">
        {tier1 && (
          <TicketRow
            label={tier1.eventTierLabel ?? "Grounds Pass"}
            detail="Access to outer courts and practice areas — watch top-20 players warm up close, with none of the Center Court queueing."
            price={`US$${Math.round(Number(tier1.costLow))}`}
          />
        )}
        {tier2 && (
          <TicketRow
            label={tier2.eventTierLabel ?? "Grandstand"}
            detail="A numbered seat in a showcourt — price varies by round and seating tier."
            price={`US$${Math.round(Number(tier2.costLow))}-${Math.round(Number(tier2.costHigh))}`}
          />
        )}
        {tier3 && (
          <TicketRow
            label={tier3.eventTierLabel ?? "Center Court"}
            detail="A numbered seat on the tournament's marquee court — price climbs steeply as the draw narrows toward the quarterfinals and beyond."
            price={`US$${Math.round(Number(tier3.costLow))}-${Math.round(Number(tier3.costHigh))}`}
          />
        )}
      </div>
      <p className="text-xs text-[#6A6A6A] -mt-4 mb-8">
        Single-day prices, converted from the official CNY listing at the live rate on the day we checked — see the{" "}
        <a href={`/event-pack/${eventSlug}/cost`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Cost Guide
        </a>{" "}
        for the full breakdown, and the{" "}
        <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Luxury Guide
        </a>{" "}
        for ATP House Hospitality.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">One ticket, both sessions</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sessions run day and night — one daily ticket covers both, so a single day pass gets you a full day of
          tennis rather than a single match window.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Court 17 practice sessions are included, not extra</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Court 17, the purpose-built 1,200-seat practice stadium, is covered by any Grounds Pass or higher ticket
          tier — no separate booking needed. It&apos;s a real reason the Grounds Pass is worth considering even if
          you can afford Center Court: on a single afternoon it can put two or three top-20 players on the same
          practice court within a few hours of each other.
        </p>
      </div>

      {ticketGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={ticketGuide} isPro={isPro} />
        </div>
      )}

      {centerCourt && (
        <div className="mb-8">
          <SpokeExperienceCard experience={centerCourt} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Shanghai Masters trip, a grounds pass for most of the week plus one Center Court
            session for a marquee match is the sharpest combination — the grounds pass gets you the closest, cheapest
            access to top players during practice, and one Center Court booking gets you the real tournament
            atmosphere without paying for it every day. Center Court&apos;s own price swings hard across the
            tournament — early rounds sit at the lower end of that range, while quarterfinals and the Federer
            exhibition day onward climb sharply as the draw narrows, so which day you book it for matters as much as
            the tier itself.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which days to book it for</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            This is a real 14-day event, not a fixed schedule — book your Grounds Pass days early (roughly 5-10
            October), when the most matches run across the most courts and Court 17&apos;s practice sessions are
            busiest. A Center Court seat is genuinely cheapest in the first week, well before the Federer exhibition
            date — 16 October already prices at the quarterfinal rate, near the top of the range, so budget for
            that if seeing Federer is the plan. See the{" "}
            <a href={`/event-pack/${eventSlug}/itinerary`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Trip Schedule
            </a>{" "}
            for how this shapes a full week.
          </p>
          {federer && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The Federer exhibition — no separate ticket exists</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
                &quot;Roger &amp; Friends&quot; is folded into the tournament&apos;s own ticketing — there is no
                dedicated Federer-only product to buy. Your access depends entirely on holding a day-session ticket
                for 16 October specifically; whichever tier you buy for that date is what gets you in, the same as
                any other day. The catch is demand: exhibition-day sessions sell through faster than an average day
                in the draw, and since it&apos;s not a separate purchase, waiting risks losing the whole day&apos;s
                session, not just the exhibition slot. If seeing Federer is the priority of your trip, buy your
                16 October ticket first, before anything else.
              </p>
              <div className="mb-6">
                <SpokeExperienceCard experience={federer} isPro={isPro} />
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: tennistours.com, koobit.com, sportsmatik.com, ATP Tour official site. Google Places rating for
        Qizhong verified 9 Aug 2026 (4.5, 57 reviews).
      </p>
    </SpokeShell>
  );
}

function TicketRow({ label, detail, price }: { label: string; detail: string; price: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-sm text-[#AAFF00] font-mono">{price}</p>
      </div>
      <p className="text-xs text-[#A3A3A3] leading-5">{detail}</p>
    </div>
  );
}
