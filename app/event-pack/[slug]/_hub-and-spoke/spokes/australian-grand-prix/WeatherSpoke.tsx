import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

// Real content sourced from the seeded Melbourne in April — Weather & What
// to Pack experience (melbourne-april-weather-what-to-pack-mu9c9btl), 20
// Sep 2026: 20°C daytime highs, 12°C overnight lows, only 3-4 rainy days
// across the month, but genuine "four seasons in one day" variability.
// Umbrellas are explicitly banned at Albert Park's gates (confirmed via the
// Arrival & Queue Guide experience) — same rain-jacket-not-umbrella logic
// as every other F1 event's Weather spoke.
export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const packingGuide = linkedExperiences.find((e) => e.slug.includes("melbourne-april-weather-what-to-pack-mu9c9btl"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Grand Prix"
      status="public"
      h1="A mild 20°C average, but genuine four-seasons-in-one-day swings"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Australian Grand Prix runs the first weekend of April, right at the start of Melbourne&apos;s autumn —
        genuinely one of the more comfortable stretches on the local calendar. Daytime highs typically sit around
        20°C, overnight lows around 12°C, with only three to four rainy days across the entire month and roughly
        51-63mm of rain total. Compared to January&apos;s Australian Open (regularly into the mid-30s°C) or a
        Melbourne winter, this is a genuinely mild race weekend on paper.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check the real forecast before you pack</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Race weekend is close enough now that a specific forecast is more useful than any seasonal average.
        </p>
        <a
          href="https://www.accuweather.com/en/au/melbourne/26216/10-day-weather-forecast/26216"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather — Melbourne 10-day forecast →
        </a>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack — by category</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <PackCard label="Layers, not one jacket" detail="Melbourne's 'four seasons in one day' reputation is earned honestly — a day can start at 12°C under fog and finish at 22°C in full sun, with a squall somewhere in the middle. A base layer, a packable rain layer, and something warm for the evening covers all of it." />
        <PackCard label="A packable rain layer, not an umbrella" detail="Umbrellas are explicitly banned at Albert Park's gates — they block other spectators' views. If rain hits in an uncovered grandstand or on the Park Pass, a rain jacket is your only real in-venue option." />
        <PackCard label="Sun protection" detail="Melbourne's UV index in early April stays significant during midday hours — a full day trackside with no shade can burn skin even when the air temperature feels mild." />
        <PackCard label="Something warm for the evenings" detail="Overnight lows can drop into single digits well before the last shuttle leaves — the walk home after a night session is colder than the daytime forecast suggests." />
      </div>

      {packingGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={packingGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest weather takeaway</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          &quot;Mild on average&quot; and &quot;predictable on any given day&quot; are different claims. A visitor
          who packs for the average forecast and ignores the real chance of a fog-to-sun-to-shower day within a
          single session is the one caught out — not because Melbourne&apos;s weather is bad, but because it&apos;s
          genuinely more variable than a mild autumn city looks on paper.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually bring</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          A genuinely packable rain jacket that folds down small — given the umbrella ban, this is the one item on
          this list that isn&apos;t optional if you&apos;re in an uncovered grandstand or on the Park Pass. Covered
          seating (Fangio and Piastri&apos;s upper AA-NN rows, for instance) removes some of this planning burden;
          most of the venue doesn&apos;t have that option, so check the real short-range forecast the day before
          each session rather than packing purely off the seasonal averages above.
        </p>
      </div>
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
