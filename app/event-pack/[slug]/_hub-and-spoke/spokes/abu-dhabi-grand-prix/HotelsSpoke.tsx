import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const wAbuDhabi = linkedExperiences.find((e) => e.slug.includes("w-abu-dhabi-yas-island"));
  const crownePlaza = linkedExperiences.find((e) => e.slug.includes("crowne-plaza-yas-island"));
  const beachRotana = linkedExperiences.find((e) => e.slug.includes("beach-rotana-corniche-abu-dhabi"));
  const atlantis = linkedExperiences.find((e) => e.slug.includes("atlantis-the-royal-dubai"));
  const parkRegis = linkedExperiences.find((e) => e.slug.includes("park-regis-business-bay-dubai"));
  const ibisDeira = linkedExperiences.find((e) => e.slug.includes("ibis-deira-creekside-dubai"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Abu Dhabi Grand Prix"
      status="teaser"
      h1="Yas Island, the Corniche, or Dubai — a real three-way decision"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every hotel and rating above is real and free. The pack adds our single recommendation for your specific priorities, plus the booking-timing detail that matters most for the season-finale weekend — the calendar's highest-demand round."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Where to stay for Abu Dhabi&apos;s season finale is a genuine three-way call, not a default. Yas Island
        itself puts you within realistic walking distance of the circuit gates, at real luxury-to-mid-range price
        points. Central Abu Dhabi&apos;s Corniche gives you the actual city — restaurants, the waterfront, Abu
        Dhabi Mall — at the cost of a real daily commute. And Dubai, roughly 90 minutes away via the E11, opens up
        genuinely better value at every tier, especially budget, if the trip is really about a wider UAE holiday.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Yas Island — real walking distance to the gates</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {wAbuDhabi && <SpokeExperienceCard experience={wAbuDhabi} isPro={isPro} hideProCtas />}
        {crownePlaza && <SpokeExperienceCard experience={crownePlaza} isPro={isPro} hideProCtas />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Central Abu Dhabi — the city, at the cost of a commute</p>
      {beachRotana && (
        <div className="mb-8">
          <SpokeExperienceCard experience={beachRotana} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Basing out of Dubai instead</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {atlantis && <SpokeExperienceCard experience={atlantis} isPro={isPro} hideProCtas />}
        {parkRegis && <SpokeExperienceCard experience={parkRegis} isPro={isPro} hideProCtas />}
      </div>
      {ibisDeira && (
        <div className="mb-8">
          <SpokeExperienceCard experience={ibisDeira} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3 mt-6">Prefer an Airbnb or serviced apartment instead?</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Hotels aren&apos;t the only option — Abu Dhabi and Dubai both have a real short-let market, and for a
          multi-night trip a self-catered apartment can genuinely beat a hotel room on space and price. If you&apos;re
          searching Airbnb or a serviced-apartment platform rather than booking a hotel directly, these are the
          areas worth filtering for:
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-white mb-1">Al Reem Island, Abu Dhabi</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              A genuinely residential high-rise district a short drive from both downtown Abu Dhabi and Yas Island —
              a real mid-point base with a large serviced-apartment stock, at rates meaningfully below Yas Island&apos;s
              own hotels.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Business Bay / Downtown Dubai</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The same area as Park Regis above — the largest Airbnb stock in Dubai, walkable to Burj Khalifa and
              Dubai Mall, roughly 90 minutes from Yas Marina via the E11.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Al Barsha / Al Quoz, Dubai</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              A genuinely cheaper, more residential alternative to Downtown/Marina, still on the Dubai Metro Red
              Line — the trade is character and proximity to Downtown&apos;s own attractions for a real price cut.
            </p>
          </div>
        </div>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which base we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Abu Dhabi GP, Yas Island itself is the right call if your trip is fully race-focused
            — the walk-to-gates convenience across a 4-day weekend, plus the Thursday pit-lane walk perk if you
            stay at the W, is worth the premium over almost any other option. Crowne Plaza is the honest mid-range
            answer, not the W — real Yas Island proximity without ultra-luxury pricing, plus bundled theme-park
            access that pays off on a non-race day. If the trip is really about the wider UAE, base in Dubai
            instead: the value gap at every tier is real, and 90 minutes each way is a genuine but manageable
            commitment across a 4-day weekend, not a dealbreaker.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking windows &amp; timing</p>
          <div className="flex flex-col gap-3 mb-6">
            <HotelBookingCard name="W Abu Dhabi" note="Book directly via marriott.com specifically to confirm the circuit-facing tower — the two towers face genuinely different things, and race-week rates run well above standard nightly rates given demand. Book as early as the calendar allows." />
            <HotelBookingCard name="Crowne Plaza Yas Island" note="Book via ihg.com or a major booking platform, and confirm circuit-facing vs. golf/Gulf-facing room type explicitly — not every room category includes the track view." />
            <HotelBookingCard name="Beach Rotana" note="Book via rotana.com. Pad your race-day commute time honestly — the ~20-25 min drive to Yas Island extends meaningfully during race-day congestion around the circuit's approach roads." />
            <HotelBookingCard name="Atlantis The Royal" note="Book via atlantis.com and confirm current race-weekend rates well ahead — December is one of Dubai's own peak tourism months on top of GP demand, and this specific property (not the older Atlantis The Palm next door) is the one with the Sky Pool." />
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function HotelBookingCard({ name, note }: { name: string; note: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{name}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
    </div>
  );
}
