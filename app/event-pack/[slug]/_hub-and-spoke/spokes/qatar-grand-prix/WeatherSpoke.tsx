import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "weather";

// Real, sourced seasonal figures for Doha in late November (multiple
// aggregators cross-checked, 13 Sep 2026): daytime highs 79-93°F/26-31°C,
// overnight lows 60-73°F/18-22°C, ~9 hours of sunshine, negligible rainfall
// (avg 3mm, usually no rain days). Qatar races entirely at night, which
// matters more here than almost anywhere else on the calendar — the
// daytime heat visitors worry about isn't the real story.
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
      eventName="Qatar Grand Prix"
      status="public"
      h1="Race weekend runs after dark — the desert heat most visitors worry about isn't actually the issue"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Late November in Doha is genuinely mild by Qatar&apos;s own standards — this isn&apos;t the punishing summer
        heat the country is known for. And because every session runs at night, the daytime numbers below matter
        less than what happens after the sun goes down.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <FactCard label="Daytime high" value="79-93°F (26-31°C)" />
        <FactCard label="Overnight low" value="60-73°F (18-22°C)" />
        <FactCard label="Sunshine" value="~9 hours a day" />
        <FactCard label="Rainfall" value="~3mm average — usually no rain days at all" />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack — by category</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <PackCard label="A real layer, not just a hoodie" detail="Overnight lows in the high teens Celsius are genuinely cool once the sun's been down for a few hours — on Lusail Hill or in an uncovered grandstand, a light jacket earns its space, especially into the small hours after a late finish." />
        <PackCard label="Sun protection for the daytime hours" detail="Daytime highs still reach the low 90s°F — sunscreen and a hat matter for arrival, the paddock, and any daytime sightseeing, even though the race itself runs after dark." />
        <PackCard label="Closed, comfortable shoes" detail="Long walks between the metro, the shuttle, and the grandstands add up over a 3-day ticket — this isn't a sandals venue." />
        <PackCard label="A modest option for outside the circuit" detail="Qatar's official tourism guidance describes attitudes toward dress as relaxed, but visitors are asked to avoid excessively revealing clothing in public — shoulders and knees covered is the generally recommended default at the Souq, the Corniche, or any hotel lobby." />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest weather takeaway</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Don&apos;t pack for the daytime heat and stop there — Qatar&apos;s desert reputation is real for the
          afternoon, but every session here runs after dark, and the temperature swing from a hot arrival to a cool
          late-night finish is the actual planning problem. A single warm-weather outfit gets you through the day
          and leaves you cold for the race itself.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check the real forecast closer to race week</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          The figures above are seasonal averages, not a forecast for this specific race weekend. Check the real
          10-day outlook once you&apos;re within range of the trip.
        </p>
        <a
          href="https://www.accuweather.com/en/qa/doha/271669/10-day-weather-forecast/271669"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather — Doha 10-day forecast →
        </a>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually pack</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Light layers you can add and remove through the evening — a t-shirt is genuinely fine for the early
          support races, but a packable jacket earns its space in your bag once the main event and post-race
          concert run into the cooler small hours. Sunscreen still matters for the daytime hours around the
          circuit and any museum or souq visits, just not for the race itself.
        </p>
      </div>
    </SpokeShell>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">{label}</p>
      <p className="text-sm text-white font-bold">{value}</p>
    </div>
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
