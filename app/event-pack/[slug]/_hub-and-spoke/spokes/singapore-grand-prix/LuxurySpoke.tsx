import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const paddockClub = linkedExperiences.find((e) => e.slug.includes("singapore-gp-paddock-club"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Singapore Grand Prix"
      status="teaser"
      h1="Hospitality tiers, Paddock Club, private transit, and where to go after"
      question="What does a genuinely luxury Singapore GP weekend look like?"
      heroImageUrl={heroImageUrl}
      heroImagePosition="center 75%"
      isUnlocked={isUnlocked}
      ctaCopy="Every tier, transfer option, and after-dark venue named above is real and free. The pack adds the specific booking timeline and contact detail worth knowing if you're seriously considering a luxury trip to the Singapore Grand Prix — this tier has sold out within weeks in past seasons."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Luxury at Singapore GP isn&apos;t one purchase, it&apos;s a stack of decisions across tickets, hospitality,
        hotels, and how you actually move around the circuit each night. A genuinely premium weekend combines a
        top-tier hospitality pass, a hotel that puts the skyline or circuit in the room itself, a plan for getting
        through race-night road closures without standing in them, and somewhere worth going once the chequered
        flag drops.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers beyond Paddock Club</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Singapore GP sells several hospitality tiers alongside Paddock Club — Sky Suite, TWENTY3, The Green Room,
        Lounge Plus, Driver&apos;s Right Lounge, Lounge @ Turn 3, Vista Suite, Sky View Pavilion, and Torque. Worth
        being direct about this: most of these sell out well before race week, and availability shifts fast, so
        treat any specific tier as provisional until you've called to confirm, not something you can browse and
        buy same-day. None publish pricing online — the only route in is the hospitality sales line
        (+65 6731 5900) or hospitality@singaporegp.sg.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Getting around without the queues</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Rolling road closures make Grab and taxis unreliable on race night regardless of budget — see the Getting
        There guide for what actually works for most fans. At the luxury end, private chauffeur services built
        specifically around race-week closures are a real, bookable alternative: as one example, a full Sunday
        race-day booking (roughly 10 hours, hotel pickup through post-race collection) has run around S$1,000 flat
        for a premium vehicle like a Toyota Alphard, with an F1-weekend surcharge on top of standard rates. Book
        by August if this matters to you — race week is one of the highest-demand periods of the year for these
        services, and a fixed pickup point agreed in advance matters more than usual given the closures.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where to go after the chequered flag</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">CÉ LA VI, Marina Bay Sands</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            57 floors up, with a genuine, confirmed sightline over the Esplanade Drive stretch of the circuit — not
            a rooftop bar that merely overlooks the bay. Runs an official F1 Race Weekend Party across the
            weekend. Reservations are essential on race nights specifically, not just recommended.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Amber Lounge Singapore</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The official F1-adjacent VIP afterparty, running Clifford Pier and The Fullerton Bay Hotel across race
            week. Tiered packages from reserved VIP seating up to a private Diamond Suite (price on request).
            Strict smart-elegant dress code — no sportswear, trainers, shorts, or casual denim.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Luxury hotels — the one detail worth adding to the main guide</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Hotels guide already covers the three real luxury-tier stays for this race — The Ritz-Carlton Millenia,
        Pan Pacific Singapore, and Swissôtel The Stamford. Worth adding here specifically: at the Ritz-Carlton, the
        confirmed circuit-view room categories are the Grand Marina, Deluxe Marina, and Club Marina rooms, plus all
        Marina Bay Facing Suites — floor 15 and above is where the sightlines genuinely start.
      </p>

      {paddockClub && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: F1 Paddock Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Paddock Club sits directly above the pit garages at Marina Bay, built around proximity to the cars,
            teams, and the grid before lights out, not just a premium seat.
          </p>

          <div className="mb-8">
            <SpokeExperienceCard experience={paddockClub} isPro={isPro} />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What&apos;s actually included</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <IncludeCard label="Daily Pit Lane Walk" detail="Close-up access to cars, garages, and crews — the single most sought-after inclusion" />
            <IncludeCard label="The Observatory" detail="A separate vantage point for the Pit Straight and the post-race fireworks" />
            <IncludeCard label="Celebrity-chef dining" detail="Concept restaurants, not standard hospitality catering" />
            <IncludeCard label="Spa & merchandise boutique" detail="Plus a tailored daily entertainment programme" />
            <IncludeCard label="Full Circuit Park access" detail="Every zone, including that day's Padang Stage concerts" />
            <IncludeCard label="Singapore Flyer ride" detail="Complimentary, first-come-first-served — same perk as several grandstand tiers" />
          </div>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Pricing isn&apos;t published — and this tier sells out early</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Most official channels route you to a phone call or enquiry form rather than instant online checkout,
              normal for hospitality at this level. What is documented: 3-day and Sunday Paddock Club passes have
              historically sold out within weeks of going on sale — this isn&apos;t a tier to leave for the month
              before the race.
            </p>
          </div>

          {paddockClub.practicalInfo?.website && (
            <p className="text-sm text-[#A3A3A3]">
              Official page:{" "}
              <a href={paddockClub.practicalInfo.website} target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
                {paddockClub.practicalInfo.website.replace(/^https?:\/\//, "")}
              </a>
            </p>
          )}
        </>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking the other hospitality tiers</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Because none of Sky Suite, TWENTY3, The Green Room, Lounge Plus, Driver&apos;s Right Lounge, Lounge @
            Turn 3, Vista Suite, Sky View Pavilion, or Torque publish pricing or a self-serve checkout, treat the
            hospitality sales line as a real sales conversation, not a support line: call +65 6731 5900 (or email
            hospitality@singaporegp.sg) and ask directly which tiers still have availability for your dates —
            don&apos;t assume the tier you saw mentioned online is still open, since several sell out months before
            race week and the list shifts week to week. Have your preferred zone and day (single-day vs 3-day) ready
            when you call, since availability is quoted per tier per day, not as one blanket answer.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking a chauffeur for race week</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            MySingaporeDriver is the operator most geared to this exact week — chauffeurs specifically trained for
            the rolling road closures and restricted zones around the circuit, with vehicle options from executive
            sedans up through 40-seat field buses. Call +65 9452 0999, email hello@mysingaporedriver.com, or use
            their online booking form; they explicitly recommend booking 1-3 months ahead for race week, since
            they treat this period as a &quot;blacked out&quot; high-demand window where short-notice requests are
            both pricier and less likely to get your preferred vehicle. Real range to expect: roughly S$1,000 for a
            single-vehicle booking up to S$20,000+ for multi-day, multi-vehicle coverage (e.g. a sponsor or
            corporate group). Airport transfers carry a 60-minute wait allowance on arrival, other transfers 15
            minutes — ask explicitly if you need more, and get your exact pickup point confirmed in writing before
            race day, since a driver without a precise, pre-cleared spot may not be able to reach you once closures
            are in effect.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking CÉ LA VI</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Email reservation-sg@celavi.com, or call or WhatsApp +65 6508 2188 directly — same number for both — for
            race nights specifically, do this well ahead rather than the same week, since these are their
            highest-demand nights of the year and a walk-in has a real chance of no table at all, not just a wait.
            For a group of 20 or more, that&apos;s handled as a private event, not a standard reservation — go
            through their private events team via sg.celavi.com rather than the general reservations line, since
            group capacity and minimum spend are negotiated separately from a normal table booking.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-8">Booking Amber Lounge</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            The real tier ladder, low to high: Club Pass (individual entry, from S$850), Shared Deluxe Table (per
            person, from S$1,250), Shared Silver Table (per person, from S$2,100), Deluxe Table (up to 6 guests,
            from S$7,500), Silver Table (up to 8, from S$16,800), Gold Table (up to 8, from S$24,800), Platinum
            Table (up to 10, from S$38,500), and Amber Suite (up to 10, from S$45,000 — the actual top tier, not a
            &quot;Diamond Suite&quot;). Cocktail Table has already sold out for 2026 as of this writing, which is
            the honest signal for how fast the lower tiers move — don&apos;t assume entry-level availability holds
            until race week. Book via reservations@amberlounge.com or their WhatsApp concierge, which they say
            responds within 2 hours; confirm your group size and preferred night when you reach out, since pricing
            and availability are quoted per night, not as one flat rate across the whole week.
          </p>

          {paddockClub?.whatToAvoid && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Worth avoiding</p>
              <p className="text-sm text-[#A3A3A3] leading-7">{paddockClub.whatToAvoid}</p>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: singaporegp.sg official hospitality page (tier names and live availability), mysingaporedriver.com
        (chauffeur contact, pricing range, booking policy), sg.celavi.com (CÉ LA VI contact and reservation detail),
        amberlounge.com (2026 tier names, pricing, contact), ritzcarlton.com (circuit-view room categories).
        Hospitality availability, table pricing, and afterparty details verified 4 Aug 2026 — all shift fast in the
        weeks before race week, reconfirm before booking.
      </p>
    </SpokeShell>
  );
}

function IncludeCard({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
