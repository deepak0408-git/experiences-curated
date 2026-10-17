import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "weather";

// Climate figures (late July, Hungary) are general public-record seasonal
// data — consistent with the real existing classic-pack content for this
// event. No dedicated packing experience exists among the 20 seeded
// Hungarian GP experiences — this spoke renders with no linked
// SpokeExperienceCard, an honest gap rather than inventing a source
// experience, matching the pattern on sibling events without one (e.g.
// Italian GP's WeatherSpoke). AccuWeather location code (187423) confirmed
// real via this event's existing live classic-pack Quick Reference link.
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
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Hungarian Grand Prix"
      status="public"
      h1="Late July heat, with storms that can arrive without much warning"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Late July in the valley around Mogyoród runs hot — daytime highs regularly push past 30°C, with little
        shade across most of the circuit outside the covered main grandstand. This is genuine summer heat, not a
        mild spring warmth, and the region sees real afternoon thunderstorms that can roll in fast on an otherwise
        clear morning, so don&apos;t assume a sunny start rules out rain by race time.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check the real forecast before you pack</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Race weekend is close enough now that a specific forecast is more useful than any seasonal average.
        </p>
        <a
          href="https://www.accuweather.com/en/hu/budapest/187423/10-day-weather-forecast/187423"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather — Budapest 10-day forecast →
        </a>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack — by category</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <PackCard label="Sun protection" detail="Most of the natural bowl has limited shade — sunscreen and a hat matter more here than at a lot of circuits, especially on a General Admission hillside spot." />
        <PackCard label="A light, packable rain layer" detail="Umbrellas are only allowed if small and foldable, and can't be used once you're inside a grandstand — a rain jacket keeps both hands free and covers the real afternoon-storm risk." />
        <PackCard label="Comfortable shoes for the hillside" detail="General Admission at the Hungaroring means genuinely walking the natural bowl terrain to find a spot — not a flat, paved walk between viewing points." />
        <PackCard label="A refillable water bottle" detail="Free drinking water is available throughout the circuit, worth using given how much time you'll spend outdoors across three full days in late-July heat." />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest weather takeaway</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          A clear, hot July morning in Mogyoród doesn&apos;t guarantee the whole day stays that way — check the
          short-range forecast the morning of each session rather than trusting a seasonal average alone, and keep
          a rain layer in your bag regardless of how the sky looks when gates open at 7:30am.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually bring</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          A genuinely packable rain layer rather than relying on the umbrella rule, since juggling even a small
          umbrella in a packed grandstand or General Admission crowd is its own kind of hassle. Sunscreen and a hat
          matter just as much as the rain plan on a clear day, particularly on the hillside, where shade is scarce
          and the sun is a full-day commitment, not an occasional inconvenience.
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
