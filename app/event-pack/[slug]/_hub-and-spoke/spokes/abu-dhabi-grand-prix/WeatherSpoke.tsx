import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const packingGuide = linkedExperiences.find((e) => e.slug.includes("twilight-race-packing-guide"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Abu Dhabi Grand Prix"
      status="public"
      h1="Warm and sunny by day, real cooling after dark — pack for both"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Abu Dhabi&apos;s December race weekend runs consistently warm and dry — average temperatures around 26°C
        on Friday and Saturday, easing slightly to 25°C on race day, with mostly sunny skies and minimal chance of
        rain. That sounds simple, but the twilight race format changes the real packing calculation: qualifying
        starts at 18:00 and the race at 17:00 local time, so you&apos;re seated through the last, still-hot part of
        the afternoon before the sky shifts through sunset — roughly 17:40 in early December — into a fully
        floodlit finish.
      </p>

      <a
        href="https://www.accuweather.com/en/ae/yas-marina-circuit/112526_poi/10-day-weather-forecast/112526_poi"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mb-8 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
      >
        AccuWeather — Yas Marina Circuit 10-day forecast →
      </a>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack — by category</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <PackCard label="Daytime layers" detail="Short sleeves or a light long-sleeve shirt for the hottest part of the afternoon (Friday/Saturday sessions run in full daylight)." />
        <PackCard label="Evening layer" detail="A light jacket or sweater — the post-sunset temperature drop is real, even in December in the Gulf, and it's felt more in an open or partially-covered grandstand." />
        <PackCard label="Sun protection" detail="Sunscreen and a hat — non-negotiable for the daytime sessions, regardless of how the day ends." />
        <PackCard label="Footwear" detail="Comfortable, breathable shoes — Yas Island is genuinely large, and walking between shuttle stops, fan zones, and your seat adds up over a multi-day visit." />
      </div>

      {packingGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={packingGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest weather takeaway</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          &quot;Twilight race&quot; doesn&apos;t mean cool — it means two genuinely different conditions in the
          same day, in the same seat, without going home to change. Layer rather than commit to one outfit, and
          don&apos;t skip sun protection just because the race itself ends at night.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually bring</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            A packable, genuinely lightweight jacket beats a heavier layer here — the evening drop is moderate
            (roughly 25-26°C throughout, easing only slightly after dark), not a sharp cold-weather shift, so
            over-packing for cold is its own real mistake. A portable phone charger is worth including too — between
            the ticket app, photos, and staying connected through the after-race concert, battery life is a genuine,
            common problem across a full race day.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: AccuWeather (Yas Marina Circuit December climate averages), Formula1.com (confirmed session times).
      </p>
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
