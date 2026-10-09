import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const packing = linkedExperiences.find((e) => e.slug.includes("india-weather-packing"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Border-Gavaskar Trophy"
      status="public"
      h1="Cold Nagpur mornings, humid Chennai afternoons, dry Ahmedabad heat: three climates in one trip"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        This tour runs through the Indian winter and into the early hot season, and the three host cities differ
        far more than the season name suggests. The biggest mistake is packing once for &quot;India in winter&quot;.
        Nagpur&apos;s problem is a big swing within a single day, Chennai&apos;s is humidity, and Ahmedabad&apos;s is
        sun.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <CityWeather
          city="Nagpur (1st Test, 21–25 Jan)"
          detail="Daytime highs around 29°C, but mornings drop to around 11°C, cold enough that a Test's opening session feels like a different season from its last. A jacket or fleece for the first hour or two of play, packed away by mid-morning."
          forecastUrl="https://www.accuweather.com/en/in/nagpur/204844/10-day-weather-forecast/204844"
        />
        <CityWeather
          city="Chennai (2nd Test, 29 Jan–2 Feb)"
          detail="Milder and steadier: about 30°C by day and 21°C overnight, with real humidity off the Bay of Bengal. Breathable fabric matters more than layers. The sea breeze cools the evening sessions, and it's humidity, not cold, that wears you down."
          forecastUrl="https://www.accuweather.com/en/in/chennai/206671/10-day-weather-forecast/206671"
        />
        <div className="sm:col-span-2">
          <CityWeather
            city="Ahmedabad (5th Test, 27 Feb–3 Mar)"
            detail="The hottest and driest of the three, climbing fast toward Gujarat's pre-monsoon heat. Average highs by early March run around 33-36°C with humidity at some of its lowest levels of the year, so direct sun exposure and dehydration are the real risk, not mugginess. Narendra Modi Stadium's exposed stands need genuine sun protection, not just a hat."
            forecastUrl="https://www.accuweather.com/en/in/ahmedabad/202438/10-day-weather-forecast/202438"
          />
        </div>
      </div>
      <p className="text-xs text-[#6A6A6A] -mt-4 mb-8">
        The figures above are seasonal norms, not a forecast. Check a live forecast for each city once you&apos;re
        within range of your travel dates.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to actually pack</p>
      <div className="flex flex-col gap-3 mb-8">
        <PackCategory title="One real warm layer, for Nagpur only" detail="Even if the rest of your trip is warm-weather clothing, pack a proper jacket or fleece for Nagpur's early mornings. It's the only genuine cold-weather requirement across all three cities." />
        <PackCategory title="Breathable, light-coloured clothing" detail="For daytime at all three grounds. Chennai's humidity makes fabric choice matter more than the number of layers." />
        <PackCategory title="Sunscreen and a hat, everywhere" detail="Especially in Ahmedabad, where the dry heat and exposed stands make sun the main risk of a five-day Test." />
        <PackCategory title="A refillable water bottle" detail="Most Indian grounds restrict sealed bottled drinks but let an empty refillable bottle through security. Steady hydration matters most in Ahmedabad." />
        <PackCategory title="Modest clothing for temples and the ashram" detail="Cover shoulders and knees for religious sites and expect to remove your shoes, which matters at Kapaleeshwarar Temple in Chennai and Sabarmati Ashram in Ahmedabad." />
      </div>

      {packing && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={packing} isPro={isPro} />
        </div>
      )}
    </SpokeShell>
  );
}

function CityWeather({ city, detail, forecastUrl }: { city: string; detail: string; forecastUrl: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 h-full">
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
