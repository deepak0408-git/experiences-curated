import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import Link from "next/link";

const SPOKE_ID = "luxury";

// Rebuilt 14 Aug 2026 — the previous version named only The Lawn, one of 6
// real official hospitality packages. All 6 confirmed directly by the
// founder from Keith Prowse's own site (keithprowse.co.uk/the-all-england-
// lawn-tennis-club, screenshots), "from" prices, ex VAT, per person:
// The Lawn £1,265, The Treehouse £1,315, Rosewater Pavilion £2,575,
// Rosewater Pavilion Private Dining £2,575, Centre Court Skyview Suites
// £2,755 (sold out), Le Gavroche £2,795. Menu/amenity detail for each comes
// from Keith Prowse's own package pages and (Le Gavroche) an official
// wimbledon.com news article — real, fetched content, not invented. Prices
// shown in USD via LocalCurrencyHint's underlying conversion pattern —
// rounded to whole dollars per the founder's standing "no decimals" rule
// (see hub-and-spoke skill §2a-2b), converted at £1 = $1.3491 (checked
// 14 Aug 2026, same rate used to seed planner_ticket_tier_cost's tier4).
//
// Premium Transit + Off-Venue Luxury sections added 16 Aug 2026, matching
// hub-and-spoke skill §2i (Luxury spoke must cover the whole trip, not just
// the top hospitality product) and directly benchmarked against Shanghai
// Masters' LuxurySpoke, which already had this structure. Premium Transit:
// real fixed-price Heathrow-SW19 chauffeur transfers. Off-Venue Luxury:
// The Dorchester's real annual Wimbledon Afternoon Tea (Google rating
// verified via Places API, 4.6/4,575 reviews) — chosen over closer SW19
// options (Light on the Common: casual, not fine dining; Hotel du Vin's
// Orangery: same hotel already featured as the pack's premium-stay pick,
// would be duplicative) since it's a genuinely distinctive, event-specific
// tradition, not just "a nice restaurant nearby."
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const theLawn = linkedExperiences.find((e) => e.slug.includes("wimbledon-the-lawn-hospitality"));
  const cannizaro = linkedExperiences.find((e) => e.slug.includes("wimbledon-cannizaro-house"));

  const packages = [
    {
      name: "The Lawn",
      price: "$1,707",
      status: "available",
      detail:
        "The original Keith Prowse hospitality space — an English-style garden with live music, a giant outdoor screen, a whisky and cigar bar, and guaranteed courtside seats on Centre Court or No.1 Court on your chosen date.",
    },
    {
      name: "The Treehouse",
      price: "$1,774",
      status: "available",
      detail:
        "A dedicated concierge, live DJs, and a private balcony overlooking the garden and lake — plus a genuinely distinctive touch: an olde-style sweet shoppe, a pamper space, and a slide down into The Lawn Garden.",
    },
    {
      name: "Rosewater Pavilion",
      price: "$3,474",
      status: "available",
      detail:
        "A four-course à la carte menu celebrating British ingredients, afternoon tea, strawberries and cream, and a complimentary bar running all day. Private tables for 2 to 12 guests, an outdoor terrace, live music, and private fast-track access through Gate 10.",
    },
    {
      name: "Rosewater Pavilion Private Dining",
      price: "$3,474",
      status: "available",
      detail:
        "The same Rosewater Pavilion package, booked as a private table specifically — same price, same inclusions, for parties who want the dedicated-table version rather than the shared pavilion floor.",
    },
    {
      name: "Centre Court Skyview Suites",
      price: "$3,717",
      status: "sold out",
      detail:
        "The most exclusive tier on offer — a private suite for 10 or 20 guests, a champagne reception, a four-course à la carte menu, a personal hostess, and a chauffeur car service within the M25. Sold out for this edition.",
    },
    {
      name: "Le Gavroche at The Lawn",
      price: "$3,771",
      status: "available",
      detail:
        "Chef Michel Roux's five-course 'Menu Exceptionnel', the Le Gavroche Cheese Trolley, and an Assiette du Chef dessert selection, with wine pairings Roux selected himself. Private tables for 2, 4, or 6, directly opposite Gate 5, with a private terrace and dedicated concierge — Le Gavroche's first return since the original restaurant closed in January 2024 after 57 years.",
    },
  ];

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="teaser"
      h1="Six real hospitality packages, from The Lawn to Le Gavroche"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="All 6 official hospitality packages and their real prices are free above — the exact numbers, no vague 'from' pricing games. What free research can't tell you is which package is genuinely worth the jump over the next tier down, and how to sequence a hospitality day so you're not eating your Centre Court seat's atmosphere in a queue for the bar. Unlocking adds that verdict — the kind of call that's worth more than the price difference between packages."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Luxury at Wimbledon is a stack of decisions, not one purchase — where you stay and how you eat around the
        grounds matter as much as which hospitality package you book. Wimbledon runs 6 official hospitality
        packages through Keith Prowse, its official hospitality partner, ranging from The Lawn&apos;s garden
        atmosphere to Le Gavroche&apos;s Michelin-pedigree tasting menu.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Multiple licensed operators run fixed-price chauffeur transfers from Heathrow to SW19 — a saloon runs from
          roughly £55 with meet-and-greet and flight tracking included, with executive cars and larger MPVs
          available for groups. Fixed at booking, no show-court-day surge pricing. Worth arranging specifically for
          a hospitality day or a finals-weekend arrival, when you don&apos;t want train timing to be the thing that
          could go wrong.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Off-venue luxury</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-6">
        <p className="text-sm font-bold text-white mb-1">Wimbledon Afternoon Tea, The Dorchester</p>
        <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3] mb-2">
          <span className="text-[#AAFF00]">★</span>
          <a
            href="https://maps.google.com/?cid=5837959047537587687"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white hover:text-[#AAFF00] transition-colors"
          >
            4.6
          </a>
          <span>(4,575 Google reviews)</span>
        </div>
        <p className="text-sm text-[#A3A3A3] leading-6">
          A genuine annual tradition, not a generic hotel tea dressed up for the occasion — The Dorchester&apos;s
          pastry team builds a real Wimbledon-themed menu served at The Promenade on Park Lane, running from the
          Fortnight&apos;s opening day. A real central-London alternative to a village pub on a rest day, or a
          proper occasion before an evening session if you&apos;re based centrally. Book via
          restaurants.TDL@dorchestercollection.com or +44 (0)20 7629 8888 — pricing varies by champagne pairing, so
          confirm the current rate when you book.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The 6 official hospitality packages</p>
      <div className="flex flex-col gap-3 mb-8">
        {packages.map((pkg) => (
          <div key={pkg.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <p className="text-sm font-bold text-white">{pkg.name}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                {pkg.status === "sold out" && (
                  <span className="text-[9px] font-black tracking-widest uppercase text-white/60 border border-white/20 rounded-sm px-1.5 py-0.5">
                    Sold out
                  </span>
                )}
                <p className="text-sm text-[#AAFF00] font-mono">from {pkg.price}</p>
              </div>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-5">{pkg.detail}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6A6A6A] -mt-4 mb-8">
        Prices shown are &quot;from,&quot; ex VAT, per person, converted from the real GBP prices on Keith Prowse&apos;s
        own site.
      </p>

      {theLawn && (
        <div className="mb-8">
          <SpokeExperienceCard experience={theLawn} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early — packages sell out, sometimes months ahead</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Centre Court Skyview Suites is already sold out for this edition — a real example of how far ahead these
          packages move. Finals weekend and semi-final days are the first to go across every package; book as soon
          as the Championships dates are confirmed, not once you&apos;ve decided which days to attend.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A premium stay</p>
      {cannizaro && (
        <div className="mb-8">
          <SpokeExperienceCard experience={cannizaro} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which package we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            The Lawn is the sharpest entry point — the lowest price of the 6, and it already includes the garden,
            live music, and whisky bar that most of the other packages build on top of. Le Gavroche is the pick if
            the meal itself is the point of the day, not just a backdrop to the tennis — Michel Roux&apos;s tasting
            menu is a genuine culinary event, not standard hospitality catering dressed up. Rosewater Pavilion sits
            in between: real fine dining and a private table, without Le Gavroche&apos;s specific chef pedigree or
            price. Skip Skyview Suites&apos; price bracket unless a large private group (10 or 20) is the actual
            plan — for 1 or 2 guests, Le Gavroche or Rosewater Pavilion&apos;s smaller private tables deliver the
            same exclusivity for less.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A luxury day, sequenced</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Base yourself at Hotel du Vin Cannizaro House inside Cannizaro Park — a genuine country-house feel a
            short walk from the grounds, which matters more on a hospitality day when you want a proper unwind
            afterward rather than a Tube journey back into central London. Dress up for whichever package you book
            the same way you would for a Centre Court seat (see the{" "}
            <Link href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </Link>
            ) — the whole day, from breakfast at the hotel through to hospitality, carries a more formal register
            than a grounds-pass day. The Dorchester&apos;s Wimbledon Afternoon Tea is the sharper call for a rest
            day rather than a grounds day — book it for the day before or after your hospitality package, not the
            same afternoon, since neither is a rushed experience and stacking them undercuts both. It also works
            well as the send-off after finals weekend, back in central London before you fly out.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: keithprowse.co.uk (package prices and inclusions), wimbledon.com official news article on the Le
        Gavroche launch, ukairporttransferservices.co.uk (Heathrow transfer pricing), dorchestercollection.com and
        londonist.com (Wimbledon Afternoon Tea).
      </p>
    </SpokeShell>
  );
}
