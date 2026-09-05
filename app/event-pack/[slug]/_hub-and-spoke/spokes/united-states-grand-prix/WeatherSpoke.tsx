import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const weatherGuide = linkedExperiences.find((e) => e.slug.includes("us-gp-weather-what-to-pack"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="United States Grand Prix"
      status="public"
      h1="2023 hit a record 98°F — this is not a mild autumn weekend"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Late October in Austin sits at an awkward point in the calendar — genuinely autumn by most of the
        country&apos;s standards, but Texas doesn&apos;t fully get the memo. Average highs run from the mid-80s°F
        early in the month down to around 77°F by late October, with lows dipping to the high 50s-low 60s°F
        overnight. The actual race weekends have run hotter than that average: 2023 broke a daily heat record with
        a forecast high of 98°F, and 2024&apos;s weekend still ran low-to-mid-80s throughout.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check the real forecast before you pack</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Race weekend is close enough now that a specific forecast is more useful than any seasonal average.
        </p>
        <a
          href="https://www.accuweather.com/en/us/austin/78701/10-day-weather-forecast/351193"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather — Austin 10-day forecast →
        </a>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Rain is the other real variable</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Austin can see anywhere from about 1.4 to 5.9 inches of rain across the whole month in a typical year,
          and 2023&apos;s forecast specifically flagged a 30-50% chance of rain and thunderstorms around race
          weekend, even though the race itself ended up sunny both years running. Mornings often start clear,
          afternoons can turn cloudy or bring a scattered shower — a forecast checked the night before isn&apos;t
          always a guarantee for race day itself.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to actually pack</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Real sun protection</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Every trackside and general-admission area at COTA is fully exposed all day — Club Level at the Main
              Grandstand is the only fully covered tier at the entire circuit. Hat, sunscreen, and sunglasses are
              not optional for a full day here.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A compact rain poncho</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Pack one even if the forecast looks clear when you check it — Texas weather can shift from a sunny
              morning to an afternoon shower quickly enough that a forecast checked the night before isn&apos;t
              reliable for race day itself.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Something light for after dark</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Evenings cool down meaningfully once the sun&apos;s gone — worth packing alongside the daytime heat
              gear, especially if you&apos;re staying for the Super Stage concerts.
            </p>
          </div>
        </div>
      </div>

      {weatherGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={weatherGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Austin American-Statesman, Weatherspark, KVUE.
      </p>
    </SpokeShell>
  );
}
