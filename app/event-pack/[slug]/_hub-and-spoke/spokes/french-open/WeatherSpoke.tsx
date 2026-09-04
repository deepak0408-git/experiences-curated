import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

// Real seasonal averages (parisjetaime.com, weatherspark.com) and real
// entry-policy facts (rolandgarros.com's own forbidden-objects page,
// NBC News reporting on the 2024 in-stands alcohol ban) — not guessed.
export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const nightSessions = linkedExperiences.find((e) => e.slug.includes("roland-garros-night-sessions"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="public"
      h1="Mild and showery — but the roofs mean play rarely actually stops"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Late May and early June in Paris run mild rather than hot, with rain that tends to arrive in brief showers
        rather than day-long downpours. It's a genuinely comfortable tournament to attend weather-wise, with one
        real complication: the retractable roofs mean rain doesn't guarantee a break in play the way it once did.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Typical conditions</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Temperature range" value="10-21°C (50-70°F), day to night" />
        <FactRow label="Rain" value="Showery, roughly 10 rainy days across May, usually brief rather than sustained" />
        <FactRow label="Roofs" value="Chatrier and Lenglen close automatically in about 15 minutes; outer courts pause" />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">When it rains</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          On Chatrier or Lenglen, a shower usually means a short pause while the roof closes, not a cancelled
          session — the tournament can keep playing under the enclosed roof once it's shut. On the outer courts,
          there's no roof, so a real shower does pause play there until it passes. Bring a compact umbrella
          regardless — Roland-Garros permits umbrellas up to 50cm folded length, larger ones must be checked at
          left luggage.
        </p>
      </div>

      {nightSessions && (
        <div className="mb-8">
          <SpokeExperienceCard experience={nightSessions} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Clothing</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Layers — a t-shirt and a light jacket cover the 10-21°C swing most days. A cap or sun hat for outer-court
            days with no shade. Comfortable, broken-in walking shoes — the grounds cover real distance between
            courts, and you'll be on your feet most of the day.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Wet weather</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A compact umbrella (50cm folded length maximum) and a proper light waterproof — showers pass quickly but
            you may be standing outside an enclosed show court while the roof closes. A ziplock or dry pouch for
            your phone is worth having.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 sm:col-span-2">
          <p className="text-sm font-bold text-white mb-2">On the grounds — what's allowed</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Bags must be 15 litres or smaller — larger bags, backpacks, and suitcases go to left luggage at the
            entrance. Alcohol is not permitted inside the stadium (banned since 2024 following rowdy fan behaviour),
            along with glass containers, sharp cutlery, selfie sticks, and water bottles over 1.5 litres. Bringing
            your own food and non-alcoholic drinks is explicitly allowed and genuinely recommended — a real way to
            manage cost across a long day (see the{" "}
            <a href={`/event-pack/${eventSlug}/where-to-eat`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Eat guide
            </a>
            ).
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          The figures above are seasonal norms, not a forecast — check a live forecast once you're within range of
          your travel dates.
        </p>
        <a
          href="https://www.accuweather.com/en/fr/paris/623/10-day-weather-forecast/623"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather forecast for Paris →
        </a>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: AccuWeather (seasonal norms), rolandgarros.com (bag policy, forbidden objects).
      </p>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <span className="text-sm font-bold text-white">{label}</span>
      <span className="text-sm text-[#A3A3A3] font-mono">{value}</span>
    </div>
  );
}
