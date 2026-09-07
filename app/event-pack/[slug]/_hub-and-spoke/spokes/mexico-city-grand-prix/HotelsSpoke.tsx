import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isRealAffiliateLink } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const romaNorte = linkedExperiences.find((e) => e.slug.includes("mexico-city-where-to-stay-roma-norte-"));
  const condesa = linkedExperiences.find((e) => e.slug.includes("mexico-city-where-to-stay-condesa-"));
  const polanco = linkedExperiences.find((e) => e.slug.includes("mexico-city-where-to-stay-polanco-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Mexico City Grand Prix"
      status="teaser"
      h1="Roma Norte, Condesa, or Polanco — three real, different trips"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="You've got the real hotels and booking links above — what you don't have yet is which one to actually book. Roma Norte, Condesa, or Polanco is a genuinely different trip, and this year's Día de Muertos collision means the wrong guess could mean no room at all by the time you decide. The pack gives you our direct pick for your priorities here, plus this same level of tactical detail across all 12 guides — tickets, food, transit, the whole trip planned out — not just this one decision."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Where to stay for Mexico City is a genuine three-way call between neighborhoods, not a default choice. Roma
        Norte is the walkable, food-forward pick — the neighborhood most first-timers end up recommending to the
        next first-timer. Condesa sits right next door with the same safety profile but a quieter, greener pace
        built around two large parks. Polanco is the polished, secure option — the city&apos;s answer to Beverly
        Hills, at the cost of being furthest from the circuit of the three.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Roma Norte — walkable and food-forward</p>
      {romaNorte && (
        <div className="mb-8">
          <SpokeExperienceCard experience={romaNorte} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Condesa — quieter, park-adjacent</p>
      {condesa && (
        <div className="mb-8">
          <SpokeExperienceCard experience={condesa} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Polanco — polished, secure, furthest from the circuit</p>
      {polanco && (
        <div className="mb-8">
          <SpokeExperienceCard experience={polanco} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early — this year specifically</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          2026 race weekend (30 October–1 November) lands directly on top of Mexico City&apos;s Día de Muertos Grand
          Parade weekend — one of the biggest tourism draws in the city&apos;s calendar, entirely independent of the
          race. Hotel demand across all three neighborhoods will run higher than a typical Mexico City GP weekend.
          Book earlier than you normally would for this trip.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which neighborhood we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Mexico City GP, Roma Norte is the right default — it puts you closest to the
            neighborhood energy that makes this city worth visiting beyond the race, and it&apos;s a straightforward
            taxi or rideshare to the circuit on race days. If you want the same real culture with a calmer pace at
            the end of each night, Condesa is the better call — the two large parks genuinely change how a loud race
            weekend feels once you&apos;re back at the hotel. Polanco is the right choice specifically if a polished,
            secure, internationally-familiar base matters more to you than neighborhood immersion — just factor in
            the extra travel time to the circuit on every single race day, since it&apos;s a real, not marginal,
            difference from the other two.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking windows & timing</p>
          <div className="flex flex-col gap-3">
            <HotelBookingCard
              name="Roma Norte & Condesa hotels"
              note="Given the Día de Muertos overlap, aim to book at least 2-3 months ahead rather than the shorter window that might work for a typical Mexico City trip — both neighborhoods will see genuinely elevated demand this specific year."
              links={[...(romaNorte?.bookingLinks ?? []), ...(condesa?.bookingLinks ?? [])]}
            />
            <HotelBookingCard
              name="Polanco hotels"
              note="Book via the links below, or (for the JW Marriott specifically) Marriott's own loyalty program for potential point redemptions. The same early-booking logic applies — December-level demand hitting in late October this year."
              links={polanco?.bookingLinks ?? []}
            />
            <HotelBookingCard name="Airbnb / serviced apartments" note="Mexico City has a real, large short-let market in all three neighborhoods. For a multi-night trip, a self-catered apartment can genuinely beat a hotel room on space and price — search Roma Norte or Condesa specifically if walkability matters, since Polanco's stock skews more toward corporate/business travelers." />
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function HotelBookingCard({
  name,
  note,
  links = [],
}: {
  name: string;
  note: string;
  links?: Array<{ platform: string; label?: string; url: string }>;
}) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{name}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
      {links.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {links.map((link, i) => (
              <a
                key={link.url ?? i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
              >
                {link.label ?? link.platform} →
              </a>
            ))}
          </div>
          {links.some((link) => isRealAffiliateLink(link.url)) && (
            <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate link — we may earn a small commission at no extra cost to you.</p>
          )}
        </div>
      )}
    </div>
  );
}
