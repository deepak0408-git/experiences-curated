import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "weather";

export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="public"
      h1="A night race changes everything about what to pack"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Late November in Las Vegas is a dry desert climate, not a hot one — but every single session at this race
        runs after dark, and that&apos;s what actually matters for what you pack. Every grandstand on the circuit is
        uncovered, so the cold, not the heat, is the real weather risk here.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The real numbers</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Average high 68°F (20°C), average low 43°F (6°C) — a genuinely wide daily swing typical of desert
          climate. Humidity averages a dry 35-36%, the opposite problem to a race like Singapore&apos;s. November
          sees only around 2.7 rainy days and 0.47in (12mm) of total rainfall for the whole month — rain is a real
          possibility, not a likely one. Live 10-day forecast:{" "}
          <a
            href="https://www.accuweather.com/en/us/las-vegas/89101/10-day-weather-forecast/329506"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#AAFF00] hover:text-[#BBFF33] underline"
          >
            AccuWeather — Las Vegas, NV ↗
          </a>
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Your grandstand&apos;s actual exposure</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Every grandstand at this circuit is uncovered — Main Grandstand, West Harmon, Turn 3, and every General
          Admission zone alike. The only genuine shelter on the circuit is Skybox, the indoor-lounge hospitality
          tier positioned above the Main Grandstand, and Paddock Club&apos;s covered balcony seating. For everyone
          else, exposure is about the cold once the sun sets, not sun or rain during the day — daytime highs are
          mild, and it&apos;s the mid-40s°F night wind that catches people out, not the forecast they checked that
          morning.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to actually pack</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <PackCard title="Layers" detail="A light top works before sunset; long pants, closed-toe shoes, and a real jacket are needed once qualifying or the race gets underway." />
        <PackCard title="Something waterproof" detail="November averages only around 2.7 rainy days — pack something lightweight even if you never need it." />
        <PackCard title="Lip balm and moisturizer" detail="Desert air is dry enough during the day to catch people off guard before evening cold even sets in." />
        <PackCard title="Hearing protection" detail="F1 cars are loud enough at close range that ear protection is genuinely worth packing, not overcaution, especially at a trackside grandstand." />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The cashless trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The entire event runs cashless — every food, drink, and merchandise purchase on-site is card or mobile
          payment only. Confirm your card works internationally (if traveling from abroad) before race weekend,
          not once you&apos;re already in line.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: weatherblaze.com and climatestotravel.com (November climate averages), oversteer48.com and
        lasvegas.gp official grandstand map (uncovered seating, Skybox/Paddock Club shelter), f1lasvegasgp.com
        official A-Z Guide (cashless payments).
      </p>
    </SpokeShell>
  );
}

function PackCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
