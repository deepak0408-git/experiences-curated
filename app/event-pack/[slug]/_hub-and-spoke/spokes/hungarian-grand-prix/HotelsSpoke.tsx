import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isRealAffiliateLink } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// Real, seeded lodging experiences cover the Budapest-vs-near-circuit
// tradeoff: Four Seasons Gresham Palace (Pest, Danube-front landmark),
// Gödöllő near-circuit stay (10km from the Hungaroring, shorter commute),
// and Staying in Pest (neighbourhood-strategy piece naming Districts V/VI/VII
// with real hotel affiliate links — satisfies the §2f self-catered/
// neighbourhood coverage requirement directly, no separate Airbnb section
// needed). 16 Oct 2026.
//
// "Book these stays" section added 17 Oct 2026 — same HotelBookingCard
// pattern as Chinese GP's HotelsSpoke: bookingLinks only render on an
// experience's own detail page, not on the SpokeExperienceCard summary
// shown here, so real affiliate links are surfaced directly on this spoke
// too. Staying in Pest already carries 5 real Booking.com links (Carat
// Boutique, Florin Apart, Danubius Astoria, Marone Suites, Centrooms House)
// and Gödöllő carries 1 (Hotel Erzsébet Királyné) — both confirmed real,
// seeded 16 Oct 2026. Four Seasons Gresham Palace's real Booking.com
// affiliate link was founder-supplied and added 17 Oct 2026, closing that
// gap. Camping at the Circuit has no bookingLinks yet — real gap, not
// guessed at.
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const gresham = linkedExperiences.find((e) => e.slug.includes("four-seasons-gresham-palace-"));
  const godollo = linkedExperiences.find((e) => e.slug.includes("godollo-near-circuit-stay-"));
  const stayingInPest = linkedExperiences.find((e) => e.slug.includes("staying-in-pest-"));
  const camping = linkedExperiences.find((e) => e.slug.includes("camping-hungaroring-"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Hungarian Grand Prix"
      status="teaser"
      h1="Budapest for the range, Gödöllő for the shorter commute"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every real option above is free. The pack adds direct booking links for every real pick — 5 Pest hotels, the Four Seasons, and the Gödöllő near-circuit stay — plus our direct verdict on which Pest district actually suits your race weekend, our honest read on whether Gödöllő is worth the trade for a shorter commute, and the booking window before the covered grandstand crowd locks up Budapest's best-located hotel stock."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Where to stay for the Hungarian Grand Prix is a genuinely simple choice compared to most F1 weekends:
        Budapest, a real capital city 25 minutes from the circuit by metro and suburban rail, or Gödöllő, a small
        town 10km from the Hungaroring itself. Most visiting fans choose Budapest, and for good reason — a far
        wider hotel and dining range, and a city worth the evening commute back to.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Budapest — the city base most fans actually use</p>
      {stayingInPest && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={stayingInPest} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Four Seasons Gresham Palace — the Danube-front splurge</p>
      {gresham && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={gresham} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Gödöllő — 10km from the circuit, a shorter commute</p>
      {godollo && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={godollo} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Camping — the fourth option, right behind the final corner</p>
      {camping && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={camping} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Race weekend is one of Budapest&apos;s higher-demand hotel periods of the year — hotels near an M2 metro
          stop in particular come under real pressure well ahead of the date, since that single transit filter
          does more for your race-day mornings than almost any other accommodation decision.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which base we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Budapest is the right default for almost every visiting fan — a real city to come back to each
            evening, a genuinely wider hotel and dining range at every budget, and a 25-minute commute short enough
            that it barely counts as a tradeoff. Gödöllő is the honest exception, not a downgrade: if a shorter
            race-day commute matters more than city-centre nightlife, it&apos;s worth the quieter evenings that
            come with it. The full transit breakdown for the Budapest option lives in the{" "}
            <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Getting There guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which Pest district we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            District VI (Terézváros) is the pack&apos;s own pick within Pest — the balance point between District
            V&apos;s formal, quiet feel and District VII&apos;s louder Jewish Quarter nightlife, with real
            Andrássy Avenue character and still a straightforward walk or short ride to an M2 stop. If budget is
            the priority over atmosphere, search specifically within walking distance of any M2 station rather than
            picking by district name alone — the real driver of a good race-day morning is that one transit link,
            not which part of Pest you&apos;re technically staying in.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking windows &amp; timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Book your Budapest hotel or Gödöllő stay as soon as you book your F1 tickets — late July is genuinely
            high season in Budapest independent of the Grand Prix, and race weekend compounds that further,
            especially for anything near an M2 stop.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book these stays</p>
          <div className="flex flex-col gap-3">
            <HotelBookingCard
              name="District VI, Terézváros — 5 real Pest picks"
              note="Carat Boutique, Florin Apart, Danubius Astoria, Marone Suites & Centrooms House — the full range from budget to mid-tier, all within reach of an M2 stop."
              links={stayingInPest?.bookingLinks ?? []}
            />
            <HotelBookingCard
              name="Four Seasons Hotel Gresham Palace Budapest"
              note="The Danube-front splurge pick."
              links={gresham?.bookingLinks ?? []}
            />
            <HotelBookingCard
              name="Hotel Erzsébet Királyné — Gödöllő"
              note="10km from the Hungaroring, the shorter-commute option."
              links={godollo?.bookingLinks ?? []}
            />
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
  note?: string;
  links?: Array<{ platform: string; url: string }>;
}) {
  if (links.length === 0) return null;

  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{name}</p>
      {note && <p className="text-sm text-[#A3A3A3] leading-6 mb-3">{note}</p>}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {links.map((link, i) => (
          <a
            key={link.url ?? i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
          >
            {link.platform} →
          </a>
        ))}
      </div>
      {links.some((link) => isRealAffiliateLink(link.url)) && (
        <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate link — we may earn a small commission at no extra cost to you.</p>
      )}
    </div>
  );
}
