import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "weather";

export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  void isPro;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="public"
      h1="A genuine Southern Hemisphere summer, four different ways"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This tour runs through the height of the Australian summer, but the four host cities genuinely differ in
        how that summer actually feels — Perth&apos;s heat is dry, Adelaide&apos;s is a milder dry Mediterranean
        climate, Sydney&apos;s is humid, and Melbourne is the one city on this tour where a single day can swing
        through real weather extremes.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <CityWeather city="Perth (1st Test, 9-13 Dec)" detail="Australia's hottest, driest Test venue on this tour. Average highs around 29-30°C, with real spikes into the mid-30s. Low humidity, mostly clear skies — the most predictable weather of the four legs." forecastUrl="https://www.accuweather.com/en/au/perth/26797/weather-forecast/26797" />
        <CityWeather city="Adelaide (2nd Test, 17-21 Dec)" detail="Dry Mediterranean climate, average around 25°C rising through December. Confirmed daytime cricket — no pink ball, no day/night format for this series." forecastUrl="https://www.accuweather.com/en/au/adelaide/25257/weather-forecast/25257" />
        <CityWeather city="Melbourne (3rd Test, 26-30 Dec)" detail="The most genuinely changeable weather of the tour — average highs around 23.7-25°C, but real heatwave spikes above 35°C do happen, and roughly 9 rain days a month is normal for this time of year. Melbourne's own 'four seasons in a day' reputation is not exaggerated." forecastUrl="https://www.accuweather.com/en/au/melbourne/26216/weather-forecast/26216" />
        <CityWeather city="Sydney (4th Test, 4-8 Jan)" detail="Warm and humid, average around 26°C. January carries real afternoon-storm risk — a sudden downpour on an otherwise clear day is a normal Sydney summer pattern, not a rare event." forecastUrl="https://www.accuweather.com/en/au/sydney/22889/weather-forecast/22889" />
      </div>
      <p className="text-xs text-[#6A6A6A] -mt-4 mb-8">
        The figures above are seasonal norms, not a forecast — check a live forecast for each city once you&apos;re
        within range of your travel dates.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to actually pack</p>
      <div className="flex flex-col gap-3 mb-8">
        <PackCategory title="Sun protection, non-negotiable" detail="Broad-spectrum sunscreen, a hat, and sunglasses for every single day of this trip — Australian summer UV is genuinely stronger than most international visitors expect, at any of the four cities." />
        <PackCategory title="Layers for Melbourne specifically" detail="Pack at least one warmer layer for the Melbourne leg even in summer — the city's real day-to-day temperature swings mean a 35°C afternoon can be followed by a genuinely cool evening." />
        <PackCategory title="Rain gear for Melbourne and Sydney" detail="A compact umbrella or light rain jacket is worth carrying at both legs — Melbourne for its unpredictability, Sydney for January's afternoon-storm pattern." />
        <PackCategory title="Ground rules on what you can bring" detail="Every venue restricts bag size and prohibits glass containers and outside alcohol — check each ground's specific rules before you pack for match day, since they differ slightly venue to venue." />
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: weatherspark.com, weather-and-climate.com, holiday-weather.com (city climate averages,
        cross-referenced across sources); accuweather.com (live per-city forecast links).
      </p>
    </SpokeShell>
  );
}

function CityWeather({ city, detail, forecastUrl }: { city: string; detail: string; forecastUrl: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{city}</p>
      <p className="text-sm text-[#A3A3A3] leading-6 mb-3">{detail}</p>
      <a
        href={forecastUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-bold text-[#AAFF00] hover:text-[#BBFF33] underline"
      >
        Check the live forecast →
      </a>
    </div>
  );
}

function PackCategory({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
