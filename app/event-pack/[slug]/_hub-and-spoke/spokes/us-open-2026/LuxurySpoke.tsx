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

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-8">
        <p className="text-sm font-bold text-white mb-1">The Honey Deuce — a genuine New York institution</p>
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

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            The Blue Room is the sharper choice if a seated meal is part of the point — a real multi-course dining
            service with Ashe's best seat attached. The Club is the better call if staying mobile between matches
            matters more than a sit-down meal — buffet and chef service rather than a table. Luxury Suites are the
            pick for a group that wants a private room over either dining format, with the player-appearance
            inclusion as a genuine bonus.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A luxury day, sequenced</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book airport car service in advance rather than hailing one on arrival — surge pricing around Flushing
            Meadows after a late night session is real. Don't assume Club-level access includes a seated meal the
            way the Blue Room does; the formats are genuinely different, so pick the tier that matches what you
            actually want from the day, not just the one with the highest price.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: usopen.org (Premier hospitality), hospitality.usopen.org, Good Morning America (Honey Deuce).
      </p>
    </SpokeShell>
  );
}
