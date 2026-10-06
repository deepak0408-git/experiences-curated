import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Real official USTA Premier hospitality tiers (Blue Room, The Club,
// Luxury Suites) and the Honey Deuce cultural institution, researched
// fresh for this migration — the classic pack had no dedicated luxury
// content. Arthur Ashe Stadium's card lives in the Tickets spoke
// (1-card-1-spoke rule); no separate luxury-dining/luxury-hotel experience
// exists for this event, an honest gap flagged during research.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const luxuryExp = linkedExperiences.find((e) => e.slug.includes("us-open-luxury-hospitality"));

  const packages = [
    {
      name: "The Blue Room",
      price: "Inquire only",
      detail:
        "Club-level space inside Ashe — all-inclusive premium bar, seated multi-course dining. The closest thing to a private restaurant with the best seat in the house attached.",
    },
    {
      name: "The Club",
      price: "Inquire only",
      detail:
        "At the threshold between Ashe and the outer grounds — dedicated chef service, buffet format for staying mobile between matches.",
    },
    {
      name: "Luxury Suites",
      price: "Inquire only",
      detail:
        "22-35 seats per suite across two dedicated suite levels, with a player-appearance inclusion specific to the tier.",
    },
  ];

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="US Open"
      status="teaser"
      h1="Official hospitality, premium transit, and the Honey Deuce"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real hospitality tiers and premium transit are free above. Unlocking adds our verdict on which tier fits which kind of day, and how to sequence a hospitality day without missing the tennis it's meant to showcase."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Luxury at the US Open runs through the USTA itself rather than a patchwork of third-party operators — the
        tournament's own &quot;Premier&quot; hospitality program is the sole official channel, run directly out of
        Arthur Ashe Stadium, with three genuinely different tiers. None publish rates online — every package routes
        through an inquire-only booking flow.
      </p>

      {luxuryExp && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={luxuryExp} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Multiple licensed operators run fixed-price chauffeur transfers between JFK or LaGuardia and your hotel or
          the grounds — typically $115-190 one-way depending on airport and vehicle class, with flight tracking and
          a real wait-time allowance. Worth arranging for a hospitality day or a late-night-session return, when
          surge pricing on a rideshare is a real risk.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A genuine New York institution</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-8">
        <p className="text-sm font-bold text-white mb-1">The Honey Deuce</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Grey Goose vodka, lemonade, and Chambord, finished with frozen honeydew melon balls styled like miniature
          tennis balls — over 3 million sold since 2007. Several Manhattan cocktail bars run their own seasonal riff
          during tournament fortnight for anyone who wants a piece of the US Open without a ticket.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The 3 official hospitality tiers — real inclusions</p>
          <div className="flex flex-col gap-3 mb-8">
            {packages.map((pkg) => (
              <div key={pkg.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-sm font-bold text-white">{pkg.name}</p>
                  <p className="text-sm text-[#AAFF00] font-mono flex-shrink-0">{pkg.price}</p>
                </div>
                <p className="text-xs text-[#A3A3A3] leading-5">{pkg.detail}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Designer-themed suites — a different kind of luxury</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            Separate from the three official tiers above, a handful of brand-partnered suites on Arthur Ashe&apos;s
            third floor are genuinely worth knowing about — these aren&apos;t purchased directly but accessed through
            partner invitations, sponsor allocations, or occasionally resale, so treat this as what to look for
            rather than a straightforward booking path.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-1">Grey Goose Suite</p>
              <p className="text-xs text-[#A3A3A3] leading-5">
                Designed with Paris studio Servaire as the spiritual home of the Honey Deuce — over 700,000 sold in
                a single recent edition.
              </p>
            </div>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-1">Emirates Suite</p>
              <p className="text-xs text-[#A3A3A3] leading-5">
                A 1,579 sq ft space modeled on the airline&apos;s A380 premium cabins — the bar is a direct replica
                of the one onboard.
              </p>
            </div>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-1">Moët &amp; Chandon Suite</p>
              <p className="text-xs text-[#A3A3A3] leading-5">
                The &quot;Club de Tennis&quot; concept — court-height chairs, racket-dressed walls, and a built-in
                photocall.
              </p>
            </div>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-1">Ralph Lauren Suite</p>
              <p className="text-xs text-[#A3A3A3] leading-5">
                Built around The Polo Bar, the brand&apos;s real Manhattan restaurant — signature cocktails served
                in crossed-racket crystal glassware.
              </p>
            </div>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            The Blue Room is the sharper choice if a seated meal is part of the point — a real multi-course dining
            service with Ashe's best seat attached. The Club is the better call if staying mobile between matches
            matters more than a sit-down meal — buffet and chef service rather than a table. Luxury Suites are the
            pick for a group that wants a private room over either dining format, with the player-appearance
            inclusion as a genuine bonus.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A luxury day, sequenced</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Book airport car service in advance rather than hailing one on arrival — surge pricing around Flushing
            Meadows after a late night session is real. Don't assume Club-level access includes a seated meal the
            way the Blue Room does; the formats are genuinely different, so pick the tier that matches what you
            actually want from the day, not just the one with the highest price.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">After the tennis — New York's real nightlife scene</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            The US Open genuinely takes over Manhattan nightlife for its two weeks, not just the grounds — players
            and their circle are out at the same rooms as everyone else in town that fortnight. Finals weekend has
            its own official afterparty, sponsor-run and genuinely attended by top players, though the venue and
            headliner change year to year rather than repeating at one fixed address — expect it announced only in
            the days immediately before.
          </p>
          <div className="flex flex-col gap-3">
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-1">Concerts on the grounds</p>
              <p className="text-xs text-[#A3A3A3] leading-5">
                The US Open runs a genuine concert program as part of the tournament itself, not just off-site
                nightlife. Fan Week opens with a free headline concert in Louis Armstrong Stadium — The Lumineers
                played the 2026 edition — plus free daily live music on Fountain Plaza, a silent disco, and a
                DJ-headlined block party, all included with Fan Week admission. Finals weekend has its own concert
                tied to the official afterparty — Zedd closed out 2026 — also in Armstrong Stadium. The actual
                lineup changes every year, so treat these as the real, recurring kind of programming to expect
                rather than a confirmed 2027 booking.
              </p>
            </div>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-1">Private members&apos; clubs</p>
              <p className="text-xs text-[#A3A3A3] leading-5">
                Zero Bond, Casa Cipriani, and Chez Margaux&apos;s late-night Gaux Gaux are the real rooms where a
                tournament crowd lands after a night session — all membership- or invitation-gated, not
                walk-in. A hotel concierge at a genuine luxury property can sometimes place a request on short
                notice; don&apos;t count on it without one.
              </p>
            </div>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-1">Hotel-hosted events</p>
              <p className="text-xs text-[#A3A3A3] leading-5">
                The St. Regis, the Ritz-Carlton, and The Plaza have all hosted real, open-door US Open-fortnight
                events in recent years — the surest, least-gated way to be in the same room as the tournament&apos;s
                nightlife without needing a club membership. Check each hotel&apos;s own events page in the weeks
                before you travel.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#6A6A6A] mt-4">
            Dressing the part: courtside style leans into &quot;tenniscore&quot; — tennis whites, pleated skirts, and
            polos worn as a lifestyle look rather than actual activewear — alongside elevated black dresses for
            evening events. Worth knowing before a hotel event or an after-party, where the dress code is unwritten
            but real.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
