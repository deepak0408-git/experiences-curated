import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

// Real content sourced from the seeded Weather & What to Pack experience
// (brazilian-gp-weather-packing-mtx7ms1q), 12 Sep 2026: November sits in São
// Paulo's wet season — avg highs ~27°C, lows ~16°C, ~165mm rain across ~14
// rainy days (48% daily chance), genuine intense afternoon thunderstorms.
// Umbrellas are explicitly banned at the circuit gate — rain jackets are the
// only real in-venue option.
export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const packingGuide = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-weather-packing-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Brazilian Grand Prix"
      status="public"
      h1="27°C highs, a 48% daily chance of rain, and an umbrella ban at the gate"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        November sits inside São Paulo&apos;s wet season — average highs around 27°C (81°F), lows around 16°C
        (62°F), and roughly 165mm of rainfall spread across an average of 14 rainy days in the month, a 48% chance
        of rain on any given day. This isn&apos;t a light-shower climate — the wet season brings genuine, intense
        afternoon thunderstorms that can turn a clear morning into a real downpour by mid-afternoon with little
        warning. More than one Brazilian GP has been decided in the rain — the 2003 and 2012 races are still
        argued about today.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check the real forecast before you pack</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Race weekend is close enough now that a specific forecast is more useful than any seasonal average.
        </p>
        <a
          href="https://www.accuweather.com/en/br/sao-paulo/01000/10-day-weather-forecast/497767_pc"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather — São Paulo 10-day forecast →
        </a>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack — by category</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <PackCard label="Rain jacket, not an umbrella" detail="Umbrellas are explicitly banned from the circuit grounds — if you're in an uncovered grandstand and rain hits, a packable jacket is your only in-venue option." />
        <PackCard label="Sun protection" detail="Sunscreen and a hat for the daytime highs, especially in an uncovered grandstand like A or G — mornings can turn from overcast to full sun within an hour." />
        <PackCard label="A light layer for evenings" detail="Lows around 16°C mean evenings and early mornings are noticeably cooler than the daytime heat suggests." />
        <PackCard label="Quick-dry clothing" detail="Given the genuine, frequent chance of an afternoon downpour, clothing that dries quickly is more useful here than technical waterproofing alone." />
      </div>

      {packingGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={packingGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest weather takeaway</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Don&apos;t assume a hot, sunny morning means you&apos;re safe from rain that afternoon — São Paulo&apos;s
          wet-season thunderstorms build quickly and can turn a clear day wet within an hour or two. Treat rain
          gear as a daily essential regardless of how the morning looks, not a contingency you pack "just in case."
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually bring</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            A genuinely packable rain jacket that folds down small — you'll want the bag space for other things,
            and given the umbrella ban, this is the one item on this list that isn't optional if you're in an
            uncovered grandstand. Check the actual short-range forecast the day before each session rather than
            packing purely off the seasonal averages above; São Paulo's afternoon storms are frequent enough that
            a same-day check genuinely changes what you'd bring.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}

function PackCard({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
