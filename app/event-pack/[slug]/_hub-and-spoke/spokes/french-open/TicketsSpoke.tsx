import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

// Real seeded planner_ticket_tier_cost rows (4 tiers, seeded 26 Aug 2026)
// drive the price table. Ballot/resale mechanics researched during
// experience seeding (rolandgarros.com official ticketing articles,
// cross-checked against goaltickets.com). Court Chatrier/Lenglen/
// Simonne-Mathieu experience cards live here; official hospitality has its
// own dedicated home in the Luxury spoke, cross-linked.
export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const chatrierLenglen = linkedExperiences.find((e) => e.slug.includes("court-philippe-chatrier-suzanne-lenglen"));
  const groundsPass = linkedExperiences.find((e) => e.slug.includes("roland-garros-grounds-pass-tickets"));
  const nightSessions = linkedExperiences.find((e) => e.slug.includes("roland-garros-night-sessions"));

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");
  const tier4 = tickets.find((t) => t.tier === "tier4");

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="teaser"
      h1="Four court tiers, a real ballot calendar, and one pass that opens the whole grounds"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real ticket tiers and ballot calendar are free above. Unlocking adds our curated tier recommendation for a first Roland-Garros trip, plus which week to target if a specific match matters more than price."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Roland-Garros sells four genuinely different products. A Grounds Pass gets you into every outside court plus
        Court Simonne-Mathieu — but not Chatrier or Lenglen. A Chatrier or Lenglen ticket is its own separate,
        show-court purchase. Official hospitality sits above both, bundling premium seating with catering.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ticket types</p>
      <div className="flex flex-col gap-3 mb-8">
        {tier1 && (
          <TicketRow
            label={tier1.eventTierLabel ?? "Ground Pass / Outside Courts"}
            detail="Access to every outside court, Simonne-Mathieu's upper level, practice courts, and the fan zones — no reserved seat, general admission. The cheapest ticket at the tournament, and often the best for close-up access to top players."
            price={`US$${Math.round(Number(tier1.costLow))}`}
          />
        )}
        {tier2 && (
          <TicketRow
            label={tier2.eventTierLabel ?? "Court Simonne-Mathieu"}
            detail="A reserved seat at the greenhouse-wrapped Simonne-Mathieu court, built into the Jardin des Serres d'Auteuil."
            price={`US$${Math.round(Number(tier2.costLow))}`}
          />
        )}
        {tier3 && (
          <TicketRow
            label={tier3.eventTierLabel ?? "Court Philippe-Chatrier / Court Suzanne-Lenglen"}
            detail="A reserved seat at one of the two main show courts — price climbs by category and by which day of the tournament."
            price={`US$${Math.round(Number(tier3.costLow))}-${Math.round(Number(tier3.costHigh))}`}
          />
        )}
        {tier4 && (
          <TicketRow
            label={tier4.eventTierLabel ?? "Hospitality (Le Pavillon, La Mezzanine, L'Orangerie)"}
            detail="Official Sodexo Live!-run hospitality — see the Luxury Guide for the full tier breakdown."
            price={`US$${Math.round(Number(tier4.costLow))}-${Math.round(Number(tier4.costHigh))}`}
          />
        )}
      </div>
      <p className="text-xs text-[#6A6A6A] -mt-4 mb-8">
        Single-day prices from the most recently published Roland-Garros pricing (2026 season as reference; 2027
        pricing not yet published). See the{" "}
        <a href={`/event-pack/${eventSlug}/cost`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Cost Guide
        </a>{" "}
        for the full trip breakdown, and the{" "}
        <a href={`/event-pack/${eventSlug}/luxury`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Luxury Guide
        </a>{" "}
        for hospitality.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">How to actually buy a ticket</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Roland-Garros runs on a ballot, not a first-come sale. Registration for the general public draw typically
          opens in early-to-mid December and closes mid-month; if you&apos;re selected, you&apos;re emailed a
          purchase window in the second half of February — though selection only guarantees a shot at buying, not a
          specific ticket. A second, first-come-first-served sales phase opens in late March, covering Opening Week
          and outside-court tickets for the second week. Tickets are digital-only via the official Roland-Garros
          app — there&apos;s no print-at-home option. Buy only through tickets.rolandgarros.com,
          travel.rolandgarros.com, hospitality.rolandgarros.com, or the tournament&apos;s named official agencies —
          the FFT publishes its own warnings about fraudulent resale sites, and its own official resale marketplace
          (returned tickets sold back at face value) is the only sanctioned resale channel.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {chatrierLenglen && <SpokeExperienceCard experience={chatrierLenglen} isPro={isPro} />}
        {groundsPass && <SpokeExperienceCard experience={groundsPass} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Roland-Garros, a Grounds Pass for most of your trip plus one Chatrier or Lenglen day
            for a single marquee session is the sharpest combination. The Grounds Pass gets you a full day across
            every outside court and Simonne-Mathieu — often with top seeds warming up close enough to hear the ball
            off the strings — and one show-court day buys the real Grand Slam atmosphere without paying for it
            every day. Target the first week if price matters more than who&apos;s playing; accept the second-week
            premium only if a specific quarterfinal or later match is the actual point of the trip.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Day session or night session?</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Night sessions on Chatrier commit the entire evening to a single, deliberately chosen match — no
            rotation through multiple matches the way a day session runs. Early in the tournament, before the draw
            has thinned, a day session is usually the better value precisely because it doesn&apos;t narrow you to
            one match that could end in straight sets inside two hours. Once the draw narrows from the quarterfinals
            on, that&apos;s the point to consider a night session specifically — the tournament schedules its single
            best remaining matchup there.
          </p>
          {nightSessions && (
            <div className="mt-6">
              <SpokeExperienceCard experience={nightSessions} isPro={isPro} />
            </div>
          )}
        </div>
      )}
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
