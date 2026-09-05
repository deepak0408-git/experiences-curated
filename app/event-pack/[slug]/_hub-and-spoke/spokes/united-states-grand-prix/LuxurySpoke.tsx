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

  const paddockClub = linkedExperiences.find((e) => e.slug.includes("us-gp-paddock-club"));
  const championsClub = linkedExperiences.find((e) => e.slug.includes("us-gp-champions-club"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="United States Grand Prix"
      status="teaser"
      h1="A whole trip of luxury decisions, not one hospitality product"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="Both real hospitality tiers, the premium transit pricing, and the off-circuit luxury pick are already free above. The pack adds F1's own Paddock Club and Champions Club products in full, plus the actual booking mechanics — the real contact number to call ahead of public sale for each, since both tiers sold out well ahead of the 2026 event."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A luxury Austin GP weekend is a stack of decisions, not one purchase. Beyond the two named hospitality
        tiers, a genuinely luxury weekend here spans a real premium chauffeur market built specifically around
        race-weekend traffic, a downtown rooftop scene with genuine skyline views, and a hotel pick that goes
        beyond just booking the priciest room in town.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A real hospitality ladder, not one price point</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        F1 Experiences sells a genuine range at COTA, not a single hospitality product. Entry-level grandstand-view
        packages — Tower/Turn 12 Mid and F1 Experiences Live at Turn 4 Upper, Turn 12 Mid, or Turn 15 Mid — run
        roughly US$1,569 to US$2,521 for the 3-day weekend. The step up, F1 Experiences Lounge 3-Days (Trackside
        E/W), runs US$6,169. Above all of that sit two named hospitality tiers: the 300 Club Paddock Club, sitting
        directly above the team garages, and Champions Club, trackside with its own signature Grid Walk and a photo
        with the World Championship trophy. Both named tiers sold out for 2026 well ahead of race weekend — a real
        signal of how fast Austin&apos;s flagship American round moves compared to most other stops on the calendar.
        At the very top, F1 Experiences also sells a genuinely bespoke product — a Gordon Ramsay-hosted chef&apos;s
        table experience at the F1 Paddock, priced at US$24,356 for one, a category apart from every other tier here.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit — a real, race-specific market</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        COTA&apos;s traffic reality (see the Getting There guide) makes a private chauffeur a genuine practical
        upgrade during race weekend, not just a comfort choice. Real published F1-weekend rates from an
        Austin-based operator: ATX Private Car Service runs $295/hour, all-in, though most F1-weekend bookings
        require an 8-hour daily minimum across a 3-day minimum booking — a real, if steep, way to remove the
        McAngus-lot rideshare problem entirely for the whole weekend.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Off-circuit — the rooftop scene</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Zanzibar, seven stories up at the Austin Marriott Downtown (already covered in the Hotels guide), gives a
        genuine downtown skyline view without needing to book a room there — a real, confirmed venue rather than
        generic nightlife filler, and a natural evening stop for anyone staying downtown or on South Congress
        during the weekend.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">One new luxury-hotel fact</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Hotel Magdalena&apos;s South Congress location — already the boutique pick in the Hotels guide — is worth
        knowing for one more reason here: its pool and lounge area is a genuine gathering spot for the SoCo crowd
        during race weekend, not just a hotel amenity. The full hotel breakdown, including all three picks and
        booking timing, lives in the{" "}
        <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Hotels guide
        </a>
        .
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision: Paddock Club vs. Champions Club</p>
          {paddockClub && (
            <div className="mb-6">
              <SpokeExperienceCard experience={paddockClub} isPro={isPro} />
            </div>
          )}
          {championsClub && (
            <div className="mb-6">
              <SpokeExperienceCard experience={championsClub} isPro={isPro} />
            </div>
          )}

          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Paddock Club sells pit-lane proximity and a daily pit-stop walk — genuine mechanical access. Champions
            Club sells a signature moment instead: a Grid Walk and a professional photo with the World Championship
            trophy, from a trackside seat rather than above the garages. Neither is a discount version of the
            other — they&apos;re built around different reasons to spend the money.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking a future edition</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Both tiers sold out for 2026 well ahead of race weekend. Call F1 Experiences directly at
            +1.888.326.5430 for a future edition rather than waiting on the public web listing — repeat clients are
            typically offered early access before general sale opens, and a tier that shows &quot;sold out&quot;
            online has usually been unavailable through the standard channel for some time already.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: f1experiences.com, atxprivatecarservice.com, therooftopguide.com.
      </p>
    </SpokeShell>
  );
}
