import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "weather";

// No dedicated Weather & What to Pack experience exists among Belgian GP's
// 20 seeded experiences — an honest gap rather than inventing a source
// experience, matching Italian GP's sibling spoke pattern. July climate
// figures and the Ardennes micro-climate detail are sourced directly from
// the event row's own preTripBriefLines (18-26°C, fast-changing weather,
// one part of the circuit can be dry while another is wet), 12 Oct 2026 —
// general public-record seasonal data, not specific enough to need a
// per-experience citation.
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
      eventName="Belgian Grand Prix"
      status="public"
      h1="18–26°C and genuinely unpredictable — one corner can be dry while another is wet"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        July in the Ardennes typically runs 18–26°C at peak, but the weather here changes faster and more locally
        than almost anywhere else on the F1 calendar. Spa&apos;s own micro-climate means it&apos;s genuinely
        possible for one part of the 7km circuit to be dry while another, a few kilometres away, is in a
        downpour — sunny at midday near the start/finish straight, cold showers over Eau Rouge by late afternoon
        is a common pattern, not a rare one.
      </p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Check the real forecast before you pack</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Race weekend is close enough now that a specific forecast is more useful than any seasonal average —
          check the morning of each session, not the night before.
        </p>
        <a
          href="https://www.accuweather.com/en/be/spa/29281/weather-forecast/29281"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather — Spa 10-day forecast →
        </a>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack — by category</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <PackCard label="A waterproof that fits in a bag" detail="Non-negotiable regardless of the forecast — a poncho over a grandstand seat is the standard move here, since the micro-climate means a clear morning tells you almost nothing about the afternoon." />
        <PackCard label="A fold-up chair, if you're on Bronze GA" detail="Most of the circuit has no cover outside the paid grandstands — a chair matters more here than at a purpose-built stadium circuit, given how much ground Bronze GA actually covers." />
        <PackCard label="Ear defenders" detail="Standard for any F1 weekend trackside, worth packing regardless of which section you're in." />
        <PackCard label="Sunscreen" detail="The same unpredictable weather that brings sudden showers also brings genuinely strong sun between them — pack for both, not just one." />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest weather takeaway</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          A dry, sunny morning at Spa doesn&apos;t guarantee a dry afternoon anywhere on the lap, let alone at
          every corner — keep a packable rain layer with you at all times, not just in your bag back at the hotel,
          and check the forecast fresh each session morning rather than relying on what you packed for the whole
          weekend.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually bring</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          A genuinely packable waterproof you keep on you all day, not back at the hotel or in a bag you&apos;ve
          left at your seat — Spa&apos;s micro-climate means the shower that catches you at Eau Rouge might never
          reach the paddock end of the circuit. Layer for a 18–26°C range rather than dressing for whichever
          temperature the morning starts at.
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
