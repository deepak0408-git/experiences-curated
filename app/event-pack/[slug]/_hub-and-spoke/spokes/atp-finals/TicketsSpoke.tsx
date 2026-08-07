import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "tickets";

export default async function TicketsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const ticketGuide = linkedExperiences.find((e) => e.slug.includes("atp-finals-ticket-guide"));
  const luxuryHospitality = linkedExperiences.find((e) => e.slug.includes("atp-finals-luxury-hospitality"));

  const TIER_ORDER = ["tier1", "tier2", "tier3", "tier4"];
  const sortedTickets = TIER_ORDER.map((t) => tickets.find((row) => row.tier === t)).filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Nitto ATP Finals"
      status="teaser"
      h1="Four tiers, real prices, one round-robin guarantee"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="The real prices and tier names are all free above. The Event Pack adds our actual verdict — which tier we'd pick for a first ATP Finals trip, which specific day of the round-robin group stage offers the best value, and the booking-timing detail that matters most given how the draw affects which players you'll actually see."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The ATP Finals sells four real ticket tiers, from a Tribuna Galleria seat up to Premium Hospitality. Unlike
        some relocated or newly-hosted events, this pricing is genuinely published and current — these are real,
        confirmed figures, not historical estimates.
      </p>

      {sortedTickets.length > 0 && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The four tiers</p>
          <div className="flex flex-col gap-3 mb-8">
            {sortedTickets.map((t) => (
              <div key={t.tier} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white">{t.eventTierLabel}</p>
                </div>
                <p className="text-sm text-[#AAFF00] font-mono whitespace-nowrap">{formatMoneyRange(Number(t.costLow), Number(t.costHigh))}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Why prices vary by day</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The figures above reflect a specific group-stage weekday session — pricing genuinely varies by which day
          and session you buy, since group-stage days early in the week carry different demand than semifinal or
          final weekend. Check the official ticket site for the exact day you want.
        </p>
      </div>

      {ticketGuide && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The full ticket guide</p>
          <SpokeExperienceCard experience={ticketGuide} isPro={isPro} />
          <a
            href="https://tickets.nittoatpfinals.com/en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
          >
            Buy tickets on the official Nitto ATP Finals site →
          </a>
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Tribuna Platea 2 (tier2) is the sweet spot for a first ATP Finals trip — a meaningfully better sightline
            than Tribuna Galleria for a real but not extreme price jump, and every group-stage session guarantees
            top-8 players regardless of tier, so you&apos;re not paying for match quality, you&apos;re paying for
            proximity and comfort. If budget is the priority, Tribuna Galleria (tier1) still gets you a genuine
            top-8 match — round-robin means there&apos;s no cheap-seat compromise on who&apos;s playing, unlike a
            knockout event where a budget ticket can mean an early exit&apos;s empty court.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which day to buy</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Group-stage days (15-20 Nov) are the better value than semifinal or final weekend for the same tier —
            you get a guaranteed top-8 singles and doubles match on every one of those six days, at pricing that
            hasn&apos;t yet priced in finals-weekend demand. If you can hold off on choosing your exact day until
            the draw is announced, do — see the ticket guide card above for why the draw timing matters more than
            which specific weekday you pick.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Considering Premium Hospitality?</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Tier4 (Premium Hospitality — Break/Smash/Ace) is a genuinely different product from the seating tiers
            above it, not just a better view — courtside access, signature dining, real behind-the-scenes elements.
            The full breakdown of what each hospitality package actually includes lives in the{" "}
            {luxuryHospitality?.slug ? (
              <Link href={`/experience/${luxuryHospitality.slug}`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
                Luxury Guide
              </Link>
            ) : (
              "Luxury Guide"
            )}
            .
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
