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

  const whereToStay = linkedExperiences.find((e) => e.slug.includes("us-gp-where-to-stay"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="United States Grand Prix"
      status="teaser"
      h1="South Congress, Downtown, or a self-catered stay — three real bases"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="Every hotel and rating above is real and free. The pack adds our single recommendation for your specific priorities, plus the booking-timing detail that matters most for a genuine F1-weekend demand spike across all of Austin."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Austin doesn&apos;t have one obvious neighborhood to base an F1 trip from the way some host cities do —
        Downtown, South Congress, and the areas around Lady Bird Lake all put you within a genuinely short
        rideshare or shuttle connection to COTA, so the real decision is what kind of stay you want, not just
        proximity.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Three real picks, three budgets</p>
      {whereToStay && (
        <div className="mb-8">
          <SpokeExperienceCard experience={whereToStay} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3 mt-6">Prefer an Airbnb or serviced apartment instead?</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Hotels aren&apos;t the only option — Austin has a real short-let market, and for a multi-night trip a
          self-catered apartment can genuinely beat a hotel room on space and price. If you&apos;re searching
          Airbnb or a serviced-apartment platform rather than booking a hotel directly, these are the areas worth
          filtering for:
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-white mb-1">South Congress / Travis Heights</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Walkable to SoCo&apos;s shops, murals, and restaurants, with a real stock of converted bungalows and
              small apartment buildings — a genuinely different feel from a downtown high-rise, at a comparable or
              lower rate.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">East Austin</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The neighborhood Franklin Barbecue and Micklethwait Craft Meats both sit in — a real, still-affordable
              residential district with a large short-let stock, a short rideshare from both downtown and COTA.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">South Austin, near Zilker</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Closer to Barton Springs Pool and Zilker Park than either downtown or South Congress proper — a
              genuinely quieter, more residential base for anyone prioritizing the outdoor side of an Austin trip
              over nightlife proximity.
            </p>
          </div>
        </div>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which base we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Austin GP, South Congress is the right call if you want the city&apos;s own
            character on your doorstep — Hotel Magdalena puts you inside the SoCo scene itself, walkable to
            Allens Boots and Jo&apos;s Coffee. If you&apos;d rather split time between the circuit and downtown
            nightlife, Austin Marriott Downtown is the safer, more reliable choice — strong, consistent guest
            feedback and genuine proximity to Sixth Street and Rainey Street. If value and space matter more than
            polish, Embassy Suites&apos; two-room suites and included breakfast are a real, honest trade — go in
            expecting a solid stay, not a design hotel.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking windows &amp; timing</p>
          <div className="flex flex-col gap-3 mb-6">
            <HotelBookingCard name="Hotel Magdalena" note="Book directly via bunkhousehotels.com and ask specifically about room location relative to the pool and street-facing sides if noise is a concern — that's the recurring theme in guest feedback, not a universal issue." />
            <HotelBookingCard name="Austin Marriott Downtown" note="Book via marriott.com or a major platform. F1 weekend brings a genuine citywide demand spike on top of the hotel's own strong baseline occupancy — book as early as your travel dates are fixed." />
            <HotelBookingCard name="Embassy Suites by Hilton Austin Downtown South Congress" note="Book via hilton.com. Confirm the current race-weekend rate directly — this property's typical rate runs meaningfully below the other two on a normal weekend, but F1 demand compresses that gap." />
          </div>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: bunkhousehotels.com, marriott.com, hilton.com.
      </p>
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
