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
  const wAbuDhabi = linkedExperiences.find((e) => e.slug.includes("w-abu-dhabi-yas-island"));
  const atlantis = linkedExperiences.find((e) => e.slug.includes("atlantis-the-royal-dubai"));
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
      ctaCopy="What's real is free above — the hospitality tiers, the marina scene, the Skybridge Terrace's genuinely unique vantage, and the after-party circuit. The pack adds the actual booking mechanics: real yacht-charter contacts and timing, current Paddock Club sell-out risk for the season's single highest-demand round, and which of Yas Island's ultra-luxury stays actually delivers on race weekend specifically."
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
        The Yasalam after-race concerts are the official spectacle, but Abu Dhabi&apos;s race week runs a genuinely
        separate luxury nightlife scene too — White Abu Dhabi, W&apos;s WET Deck, and Garden on Yas all run
        dedicated race-week programming most fans don&apos;t know to plan for.
      </p>
      {afterParties && (
        <div className="mb-8">
          <SpokeExperienceCard experience={afterParties} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ultra-luxury stays</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        The Hotels guide covers the full range — the real, new luxury fact worth knowing here: W Abu Dhabi&apos;s
        genuine architectural link to the circuit (the hotel the cars drive through) is unmatched by any other
        property on the calendar, and Atlantis The Royal in Dubai (the real current ultra-luxury pick, since Burj
        Al Arab is closed for renovation until late 2027) is worth the 90-minute trade for guests treating the trip
        as a wider UAE holiday.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {wAbuDhabi && <SpokeExperienceCard experience={wAbuDhabi} isPro={isPro} hideProCtas />}
        {atlantis && <SpokeExperienceCard experience={atlantis} isPro={isPro} hideProCtas />}
      </div>

      {paddockClub && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: F1 Paddock Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Paddock Club is F1&apos;s own official hospitality product, run the same way at every round — pit-lane
            proximity, daily pit-lane walks, premium open bars, and a program of trackside entertainment. Abu
            Dhabi&apos;s edition carries extra weight as the season finale, and the confirmed real pricing here
            spans a very wide range depending on tier{paddockPrice && ` (${paddockPrice} across the confirmed tiers, from Hero Seats through House 44)`}.
          </p>

          <div className="mb-8">
            <SpokeExperienceCard experience={paddockClub} isPro={isPro} />
          </div>

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            A grandstand sells you one great view of the racing. Paddock Club sells you the whole day around it —
            and at Abu Dhabi specifically, that includes the Yasalam concerts on the same ticket, from a hospitality
            position rather than the general crowd.
          </p>
        </>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking the marina and Skybridge Terrace</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For yacht berths, book months ahead through a real charter brokerage (YachtCharterFleet, Y.CO, Burgess,
            Edmiston) — the south-west side of the harbour has the genuine track sightlines, and trackside berths
            are consistently described as the hardest inventory to secure for the whole event. For Skybridge
            Terrace, get a current quote from more than one authorized operator (F1 Experiences, ZK Sports, Premium
            Access) rather than treating the first number you see as the market rate — pricing has varied
            significantly by source for this specific venue.
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
    </SpokeShell>
  );
}
