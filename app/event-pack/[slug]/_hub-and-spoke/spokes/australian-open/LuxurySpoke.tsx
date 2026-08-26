import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import Link from "next/link";

const SPOKE_ID = "luxury";

// Built per hub-and-spoke skill §2i — covers the whole trip (AO Reserve's
// real tiered structure beyond the top product, premium transit, off-venue
// luxury, one Hotels-crossreferenced fact) before leading into the top
// hospitality product itself. Real, sourced facts only — the Corporate
// Hospitality experience's real +61 1800 955 610 contact and named venues
// (Champions Rooftop, Club 1905, Kia Pavilion) anchor this spoke.
//
// Premium transit (26 Aug 2026): Chauffeur Link Melbourne runs a real,
// named Australian Open chauffeur service (fixed rates, Melbourne Park
// drop-off zones, John Cain Arena) — confirmed via
// chauffeurlinkmelbourne.com.au/australian-open. No specific "from" price
// is published on their site (quote-on-booking), so none is stated here —
// same honesty-gated approach as everywhere else in this spoke.
//
// Both AO Reserve tables (26 Aug 2026) are confirmed directly from each
// package's own popover on ausopentravel.com/ao-reserve/. Dining rooms
// (book-online tier): every package's Week 1 "from" price is AU$599pp, four
// of the five seat at Rod Laver Arena Lower Bowl, The Gallery seats at John
// Cain Arena instead; The Bistro, AO Glasshouse, and Champions Rooftop step
// up to a higher "from" price once availability shifts to later rounds
// (confirmed per-package, not assumed) — The Gallery's later-rounds price
// and Riverside Social's lack of a step-up were both confirmed directly by
// the founder. Inquiry-only tier: no Week 1/later-round split shown on
// site, single "from" price each, "enquire directly" is the real CTA on
// ausopentravel.com itself for all 5. All AO Reserve prices are real AUD
// figures from ausopentravel.com (an Australian site) — displayed as
// AU$, not converted to US$, since these are third-party prices we don't
// control, not our own pack pricing (per CLAUDE.md's currency sourcing
// rule: only our own USD pricing gets the US$ treatment). Fixed 27 Aug
// 2026 — every occurrence had originally been written with a bare,
// ambiguous "$" instead.
//
// 27 Aug 2026 — swapped the two: the corporate-hospitality experience card
// now sits free (a teaser image, before the paywall), and both real
// cost/value/seating tables moved into the gated section as the actual
// unlock payoff, per direct founder direction — real numbers make a far
// stronger reveal than a generic experience card. Wimbledon's LuxurySpoke
// still keeps its table free; this is a deliberate AO-specific divergence,
// not a pattern to copy elsewhere without asking first.
//
// Off-venue luxury (27 Aug 2026): replaced a vague, unsourced "Melbourne's
// food and bar scene... short tram ride" claim with a real named venue —
// Stella Restaurant and Bar, South Yarra (4.7 Google, verified via search,
// same citation pattern as Wimbledon's Dorchester pick). Cross-references
// Premium Transit above for how to actually get there — this is the Luxury
// spoke, so the answer is a chauffeur, not a tram; no need to hedge on
// transit specifics we can't independently verify when a real premium
// option is already named two sections up. The 4.7 rating links to a
// Google Maps search-query URL built from Stella's real address (427
// Chapel Street, South Yarra) rather than a guessed CID/place-ID link — no
// direct Maps CID surfaced via search, and a wrong CID would be worse than
// a query-string link that reliably resolves to the right listing.
//
// Pullman East Melbourne (27 Aug 2026): added the same star+rating+link
// pattern as Stella. Reused the real Google Maps CID already sourced for
// this same hotel in the Where to Stay experience's body_content
// (cid=14175253022176210902) rather than inventing a new one. Search
// couldn't independently surface the live Google star figure (only
// Tripadvisor/Booking.com/trip.com numbers turned up, which aren't the
// same platform) — the founder opened the real link directly and confirmed
// 4.3, so that's what's shown, sourced from the founder's own check rather
// than a scraped/guessed number.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const hospitality = linkedExperiences.find((e) => e.slug.includes("corporate-hospitality-premium-suites"));

  const packages = [
    {
      name: "Riverside Social",
      venue: "Rod Laver Arena Lower Bowl, Sections 8-12",
      price: "AU$599pp",
      laterPrice: null,
      detail:
        "A rooftop lounge on River Terrace with Melbourne skyline and river views — roving canapés and food stations, a 5-hour classic beverage package, and live entertainment.",
    },
    {
      name: "The Bistro by SK Steak & Oyster",
      venue: "Rod Laver Arena Lower Bowl, Sections 8-11",
      price: "AU$599pp",
      laterPrice: "AU$699pp",
      detail:
        "Brisbane restaurant SK Steak & Oyster's own dining room on Centrepiece Level 1 — a 3-course seated menu, 5-hour signature beverage package, and an al fresco bar overlooking Garden Square.",
    },
    {
      name: "AO Glasshouse by Dominique Crenn",
      venue: "Rod Laver Arena Lower Bowl, Section 8, 11 or 12",
      price: "AU$599pp",
      laterPrice: "AU$1,449pp (Quarterfinals onward — night sessions only, plus lunch for the Men's Semifinal)",
      detail:
        "A light-filled dining room on Olympic Boulevard built around a 3-course set menu and a 2-hour signature beverage package.",
    },
    {
      name: "Champions Rooftop by Peter Gilmore",
      venue: "Rod Laver Arena Lower Bowl, Sections 8, 9 & 11",
      price: "AU$599pp",
      laterPrice: "AU$2,499pp (Semifinals onward)",
      detail:
        "Chef Peter Gilmore's rooftop dining room on Rod Laver Arena Level 4 — canapés and a premium roving menu, al fresco seating, a 3-hour premium beverage package, a cocktail on arrival, and a visit from a tennis legend.",
    },
    {
      name: "The Gallery by Daniela Maiorano",
      venue: "John Cain Arena Level 2 — not a Rod Laver Arena seat",
      price: "AU$599pp",
      laterPrice: "AU$1,449pp",
      detail:
        "An Italian-focused lounge on the balcony bar overlooking the AO precinct, curated by chef Daniela Maiorano — canapés and elevated roving dining, plus a 5-hour classic beverage package.",
    },
  ];

  const inquiryPackages = [
    {
      name: "On Court presented by Piper-Heidsieck",
      venue: "Rod Laver Arena Underground — RLA On-Court seats",
      price: "AU$2,999pp",
      detail:
        "The most exclusive on-court seating AO Reserve sells — an omakase dining experience by chef Shimpei Raikuni of Brisbane's Sushi Room, a Piper-Heidsieck Champagne Lounge, a 6-hour premium beverage package, and private chauffeur service.",
    },
    {
      name: "Suites",
      venue: "Rod Laver Arena Level 4 — private, in-suite arena-facing seating",
      price: "AU$944pp",
      detail: "A private suite for 12 or 18 guests — premium grazing-style dining and a 6-hour signature beverage package, with a dedicated host from first serve to the final point.",
    },
    {
      name: "Bar Suite by Caretaker's Cottage",
      venue: "Rod Laver Arena Level 4 — private, in-box arena-facing seating",
      price: "AU$999pp",
      detail:
        "A private space for 14, with cocktails curated by Caretaker's Cottage — named Best Bar in Australasia 2024 and 2025, ranked #19 on The World's 50 Best Bars. Grazing-style dining, a 6-hour beverage package. Only one available per session.",
    },
    {
      name: "Club 1905 by Simon Rogan",
      venue: "Centrepiece Level 2 — Rod Laver Arena Lower Baseline, Sections 8-12",
      price: "AU$36,490pp",
      detail:
        "AO Reserve's top tier — the same Rod Laver Arena Lower Baseline seat and the same restaurant table for every one of the tournament's 27 sessions, first round to finals, with dining curated by three-Michelin-star chef Simon Rogan.",
    },
    {
      name: "Private Rooms — The Lounge",
      venue: "Rod Laver Arena Level 3 — Lower Bowl, Section 1",
      price: "AU$1,249pp",
      detail:
        "A private group hosting space for up to 60, with direct Rod Laver Arena access and a self-serve grazing menu by chef Stephen Nairn.",
    },
  ];

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Open"
      status="teaser"
      h1="Ten AO Reserve tiers, a chauffeur that knows the gates, and a hotel with a genuine arena view"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The hotel pick, premium transit, and off-venue names are free above. Unlocking adds real cost, value, and seating for all 10 AO Reserve packages, the direct AO Reserve contact line, and a fully sequenced luxury day."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Luxury at the Australian Open is a stack of decisions, not one purchase — AO Reserve is only one part of
        it, even though it has more genuinely distinct tiers than most Grand Slam hospitality programs. Here&apos;s
        what actually goes into a genuinely upscale Open, before the top tier itself.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">AO Reserve — the Australian Open&apos;s luxury experience</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
        AO Reserve runs ten distinct products, not one hospitality package — five named-chef dining rooms that book
        directly online, and five inquiry-only spaces that need a direct call rather than a standard checkout. The
        dining rooms are the accessible end of this spectrum; the inquiry-only spaces are where real availability
        tightens fastest once the draw firms up. See the{" "}
        <Link href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Ticket Guide
        </Link>{" "}
        for how this compares to a standard reserved seat.
      </p>

      {hospitality && (
        <div className="mb-8">
          <SpokeExperienceCard experience={hospitality} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Melbourne-based operators like Chauffeur Link run a dedicated Australian Open service — fixed,
          all-inclusive rates quoted at booking rather than surge pricing on match days, pickup from Melbourne
          Airport or your hotel, and drop-off at the designated Melbourne Park zones or directly on Olympic
          Boulevard by John Cain Arena. Drivers track flights and match overruns, so a delayed session or a late
          arrival doesn&apos;t leave you stranded. Worth arranging specifically for a hospitality day or a finals
          session, when you don&apos;t want tram or rideshare timing to be the thing that goes wrong.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Off-venue luxury — the arena hotels</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-6">
        <p className="text-sm font-bold text-white mb-1">Pullman East Melbourne</p>
        <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3] mb-2">
          <span className="text-[#AAFF00]">★</span>
          <a
            href="https://maps.google.com/?cid=14175253022176210902"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white hover:text-[#AAFF00] transition-colors"
          >
            4.3
          </a>
          <span>(Google)</span>
        </div>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Already the standout pick in the{" "}
          <Link href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Where to Stay guide
          </Link>{" "}
          — it looks directly across at the MCG and Melbourne Park precinct, and some rooms are bookable
          specifically for that view. This is the genuine luxury-hotel angle at this Slam: not a new name, but a
          real room-category fact worth knowing if a precinct view is part of what you&apos;re paying for.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-4">
        <p className="text-sm font-bold text-white mb-1">Stella Restaurant and Bar, South Yarra</p>
        <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3] mb-2">
          <span className="text-[#AAFF00]">★</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Stella+Restaurant+and+Bar+427+Chapel+Street+South+Yarra"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white hover:text-[#AAFF00] transition-colors"
          >
            4.7
          </a>
          <span>(Google)</span>
        </div>
        <p className="text-sm text-[#A3A3A3] leading-6">
          A genuine four-level destination on Chapel Street, not a generic hotel bar dressed up for the
          occasion — ground-floor pizzeria, first-floor dining with a fireplace, and an open-air rooftop terrace on
          top. Melbourne&apos;s food and bar scene, not a single circuit-side venue, is the real off-venue luxury
          story at this Slam — Stella is a real example of it, worth booking for a post-session night and reaching
          the way you&apos;d reach anything else on a hospitality day: a chauffeur booked through Premium Transit
          above, not a tram.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The 10 AO Reserve packages — real cost, value, and seating</p>
          <div className="flex flex-col gap-3 mb-2">
            {packages.map((pkg) => (
              <div key={pkg.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-sm font-bold text-white">{pkg.name}</p>
                  <p className="text-sm text-[#AAFF00] font-mono flex-shrink-0">from {pkg.price}</p>
                </div>
                <p className="text-xs text-[#6A6A6A] mb-1.5">{pkg.venue}</p>
                <p className="text-xs text-[#A3A3A3] leading-5 mb-1.5">{pkg.detail}</p>
                {pkg.laterPrice && (
                  <p className="text-xs text-[#A3A3A3]">
                    Later rounds: <span className="text-[#AAFF00]">from {pkg.laterPrice}</span>
                  </p>
                )}
              </div>
            ))}
            {inquiryPackages.map((pkg) => (
              <div key={pkg.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <p className="text-sm font-bold text-white">{pkg.name}</p>
                  <p className="text-sm text-[#AAFF00] font-mono flex-shrink-0">from {pkg.price}</p>
                </div>
                <p className="text-xs text-[#6A6A6A] mb-1.5">{pkg.venue}</p>
                <p className="text-xs text-[#A3A3A3] leading-5">{pkg.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#6A6A6A] mb-8">
            Prices shown are &quot;from,&quot; per person, incl. GST, in AUD, from ausopentravel.com. The 5 named-chef
            dining rooms (Riverside Social, The Bistro, AO Glasshouse, Champions Rooftop, The Gallery) all start at
            AU$599pp in Week 1, with some stepping up to a higher &quot;from&quot; price once availability shifts to
            later rounds — The Gallery seats at John Cain Arena, not Rod Laver Arena like the other four. The
            remaining 5 (On Court, Suites, Bar Suite, Club 1905, The Lounge) are inquiry-only, with a single
            &quot;from&quot; price and no Week 1/later-round split shown — enquire directly with AO Reserve for a
            current quote and availability against your dates.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">AO Reserve — the real contact</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a private suite or one of the inquiry-only spaces, call AO Reserve directly on{" "}
            <a href="tel:+611800955610" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              +61 1800 955 610
            </a>{" "}
            rather than relying only on the online enquiry form — premium sessions and finals-week suite
            availability narrow fast once the draw firms up, and a direct call gets you a real, current answer
            faster than a web form does. Ask specifically about suite size (12-person or 18-person) and whether
            Club 1905&apos;s chef takeover or the Kia Pavilion has any capacity left for your dates.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which tier is actually worth it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            A Show Court Reserved seat is the sharper buy at any point in the tournament if a great view is
            genuinely all you want — every AO Reserve tier runs at a real premium over a standard seat for the same
            match. Riverside Social is the honest entry point: same AU$599pp as every other dining room in Week 1,
            but it&apos;s the one built around the rooftop and river view rather than a chef&apos;s tasting menu, so
            you&apos;re not paying dining-room prices for food you won&apos;t remember as much as the seat. The
            Bistro is the pick if food is genuinely the point — a proper 3-course sit-down, not roving canapés, for
            barely more than the entry tier. Skip the step-up to Champions Rooftop or AO Glasshouse unless
            you&apos;re already committed to a Quarterfinal-onward session — that&apos;s when their price jumps and
            the &quot;visit from a tennis legend&quot; and precinct views earn their keep, not before. Of the
            inquiry-only tier, Suites and Private Rooms — The Lounge are the two worth calling about first: both
            start below several of the online dining rooms despite being fully private, which is the opposite of
            what the sticker price on Club 1905 suggests about this program. Club 1905 only makes sense as a
            season-long commitment (the same seat and table for all 27 sessions) — pricing it against a single
            session misreads what you&apos;re actually buying.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A luxury day, sequenced</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Base at Pullman East Melbourne and request a precinct-facing room specifically (see the{" "}
            <Link href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Stay guide
            </Link>
            ) — on a hospitality day you want the short walk over to Melbourne Park, not a tram connection to
            manage on top of everything else. Don&apos;t try to fit a full outside-court circuit in beforehand if
            you&apos;re booked into one of the dining rooms: arrive close to your beverage package&apos;s start
            time and let the extended, unhurried time in the room be the morning, rather than treating it as a
            stop between courts. The Rod Laver Arena dining rooms all sit inside the same 5-10 minute walking
            radius as the show courts (see the{" "}
            <Link href={`/event-pack/${eventSlug}/map`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Venue Map
            </Link>
            ), so there&apos;s no need to build in extra transit time between the room and your seat — the one
            exception is The Gallery, which seats at John Cain Arena, a genuine walk away from the other four. If
            your package includes a beverage package that runs past the match, that&apos;s deliberate: stay in the
            room rather than fighting the post-match crowd out through Garden Square, and let the walk back to
            Pullman happen once the rush has cleared. Finals weekend is the one stretch where this sequencing
            matters most and the one where availability across every tier disappears first — book the package
            before locking in which day you&apos;ll actually attend, not after.
          </p>
        </div>
      )}

    </SpokeShell>
  );
}
