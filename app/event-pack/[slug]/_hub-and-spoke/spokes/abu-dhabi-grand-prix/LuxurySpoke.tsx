import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const paddockClub = linkedExperiences.find((e) => e.slug.includes("f1-paddock-club-yas-marina"));
  const skybridge = linkedExperiences.find((e) => e.slug.includes("skybridge-terrace-w-abu-dhabi"));
  const yachtCharter = linkedExperiences.find((e) => e.slug.includes("yas-marina-yacht-charter"));
  const afterParties = linkedExperiences.find((e) => e.slug.includes("yasalam-after-parties"));

  const tier4 = tickets.find((t) => t.tier === "tier4");
  const paddockPrice = tier4 ? formatMoneyRange(Math.round(Number(tier4.costLow)), Math.round(Number(tier4.costHigh))) : null;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Abu Dhabi Grand Prix"
      status="teaser"
      h1="A whole trip of luxury decisions, not one hospitality product"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="What's real is free above — the marina scene, private transit pricing, the Skybridge Terrace's genuinely unique vantage, and the after-party circuit. The pack adds F1's own Paddock Club product in full, plus the actual booking mechanics: real yacht-charter contacts and pricing, which authorized operators to actually quote for Skybridge Terrace, a real transit contact for the restricted-access zone, and the booking-window detail that matters most for Paddock Club and White Abu Dhabi's biggest nights, both of which sell out fastest for a season finale."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A luxury Abu Dhabi GP weekend is a stack of decisions, not one purchase — and the season-finale framing
        raises the stakes on all of them. Beyond the obvious top hospitality tier, a genuinely luxury weekend here
        spans a suspended VIP venue built into the track&apos;s own architecture, a real superyacht marina scene,
        premium hotel stays split between Yas Island and Dubai, and an after-dark circuit that&apos;s become as much
        part of Abu Dhabi&apos;s identity as the race itself.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality beyond the top tier</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Skybridge Terrace is genuinely unique among Grand Prix hospitality venues anywhere on the calendar — the
        only VIP space built directly over the track itself, inside the W Abu Dhabi&apos;s grid-shell bridge
        between Turns 13-14. It&apos;s a categorically different product from a trackside hospitality suite, not
        just a pricier one.
      </p>
      {skybridge && (
        <div className="mb-8">
          <SpokeExperienceCard experience={skybridge} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The marina scene — real, and genuinely part of the finale</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Yas Marina is one of the very few Grand Prix venues where the circuit is built directly around a working
        superyacht marina, and the season-finale weekend has made this scene as much a part of Abu Dhabi&apos;s
        identity as the race itself — Amber Lounge and other yacht-hospitality operators specifically frame it as
        the season&apos;s closing party.
      </p>
      {yachtCharter && (
        <div className="mb-8">
          <SpokeExperienceCard experience={yachtCharter} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Off-circuit — the after-parties</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The Yasalam concerts (Zara Larsson and Lewis Capaldi on Thursday, Imagine Dragons on Saturday, The
        Chainsmokers and The Script closing out Sunday) are the official, ticketed spectacle — staged at Etihad
        Park, the Middle East&apos;s largest open-air entertainment venue, a short walk from the North Grandstand.
        They&apos;re bundled into every ticket tier, GA included, and the headline reason most fans plan their
        evenings around race week at all; a Golden Circle upgrade also exists as a real, separate paid add-on for
        closest-to-stage positioning and fast-track entry, if the seat matters as much as the headline act itself.
        But Abu Dhabi&apos;s race week runs a genuinely separate, parallel nightlife scene beyond those official
        stages, and for many fans on hospitality or yacht packages specifically, this is where the actual
        after-dark experience happens: White Abu Dhabi, W&apos;s WET Deck, and Garden on Yas all run dedicated
        race-week programming most fans don&apos;t know to plan for.
      </p>
      {afterParties && (
        <div className="mb-8">
          <SpokeExperienceCard experience={afterParties} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Private transit — the E11 in style</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Yas Island operates as a genuinely restricted-access zone during race weekend — only pre-approved vehicles
        and chauffeurs get beyond the key checkpoints, which makes a private transfer a real practical upgrade over
        a standard taxi, not just a comfort choice. It matters even more if you&apos;re commuting from Downtown Abu
        Dhabi or making the 90-minute run from Dubai, where the honest arrival-timing math around race-day traffic
        is a real planning question in its own right.
      </p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Real published hourly rates from an Abu Dhabi-based operator: Toyota Prado from AED 100, Mercedes-Benz
          S-Class or Cadillac Escalade from AED 350, Mercedes-Benz V-Class from AED 250, GMC Yukon from AED 700, up
          to a Rolls-Royce Ghost from AED 1,699 — a genuine spread from a comfortable airport run to a proper
          statement arrival. All quotes include a professional driver and VIP routing for the restricted-access
          zone.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ultra-luxury stays</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The real, new luxury fact worth knowing here: W Abu Dhabi&apos;s genuine architectural link to the circuit
        (the hotel the cars drive through) is unmatched by any other property on the calendar, and Atlantis The
        Royal in Dubai (the real current ultra-luxury pick, since Burj Al Arab is closed for renovation until late
        2027) is worth the 90-minute trade for guests treating the trip as a wider UAE holiday. Both get the full
        breakdown — room types, booking windows, what a race-week rate actually looks like — in the{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Hotels guide
        </a>
        .
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          {paddockClub && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: F1 Paddock Club</p>
              <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
                Paddock Club is F1&apos;s own official hospitality product, run the same way at every round —
                pit-lane proximity, daily pit-lane walks, premium open bars, and a program of trackside
                entertainment. Abu Dhabi&apos;s edition carries extra weight as the season finale, and the
                confirmed real pricing here spans a very wide range depending on tier{paddockPrice && ` (${paddockPrice} for the 3-day package, across the confirmed tiers from Hero Seats through House 44)`}.
              </p>

              <div className="mb-8">
                <SpokeExperienceCard experience={paddockClub} isPro={isPro} />
              </div>

              <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
                A grandstand sells you one great view of the racing. Paddock Club sells you the whole day around
                it — and at Abu Dhabi specifically, that includes the Yasalam concerts on the same ticket, from a
                hospitality position rather than the general crowd.
              </p>
            </>
          )}

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking the marina and Skybridge Terrace</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            There&apos;s no single official booking channel for a yacht berth — this is a private charter market.
            Ahoy Club and Burgess both run dedicated Abu Dhabi GP programs with trackside Yas Marina berths, working
            on an enquiry basis rather than fixed listings; berths start from roughly $3,500 and scale with vessel
            size, with a full charter package for the weekend able to reach six figures. Book months ahead through a
            real charter brokerage — trackside berths are consistently described as the hardest inventory to secure
            for the whole event, and check-in terms are set per individual charter agreement, not a standard
            booking flow. For Skybridge Terrace, real published pricing runs roughly AED 1,700 for a single-day
            package up to AED 11,000+ for the full 3-day package — get a current quote from more than one
            authorized operator (F1 Experiences, ZK Sports, Premium Access) rather than treating the first number
            you see as the market rate, since pricing has varied significantly by source for this specific venue.
            It&apos;s not sold through the standard circuit ticket portal.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking private transit</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Book at least a few days ahead for race weekend specifically — Yas Island&apos;s restricted-access
            zone means a chauffeur needs a pre-approved permit to get you past the checkpoints closest to the
            circuit, and that arrangement takes real lead time compared to a normal city booking. Mala Limousines
            (phone +971 502 819 865, WhatsApp +971 585 750 167) is a genuine Abu Dhabi-based operator running
            dedicated F1 service with VIP routing; confirm your exact pickup point, vehicle, and whether the quoted
            rate already accounts for race-weekend demand before you book, since hourly rates can run above the
            published baseline during the event itself.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Paddock Club and after-party access</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For Paddock Club specifically, book through F1 Experiences or an authorized reseller — for a season
            finale, the best suite locations (nearer the podium end of the pit lane) sell out fastest, and repeat/
            priority-client allocations often open before the general on-sale. If this is a return booking, contact
            your account representative directly rather than waiting for public sale. For White Abu Dhabi&apos;s
            biggest race-week nights, table or VIP bookings are essential — don&apos;t assume walk-in entry on the
            Saturday of race weekend specifically.
          </p>

          {paddockClub?.practicalInfo?.bookingMethod && (
            <>
              <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book only through official channels</p>
              <p className="text-sm text-[#A3A3A3] leading-7">{paddockClub.practicalInfo.bookingMethod}</p>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: f1experiences.com, premiumaccess.team (Skybridge Terrace pricing/booking), ahoyclub.com,
        burgessyachts.com (yacht charter pricing/booking), limousines.ae (private transit pricing/booking).
      </p>
    </SpokeShell>
  );
}
