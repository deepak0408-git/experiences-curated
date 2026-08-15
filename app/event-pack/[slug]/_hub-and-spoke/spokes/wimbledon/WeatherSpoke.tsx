import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "weather";

// "What to pack" expanded 15 Aug 2026 per founder review — was a single
// generic sentence. Real AELTC conditions-of-entry facts (bag size, camera
// lens limit, alcohol allowance) researched and verified via
// help.wimbledon.com, not guessed.
export default async function WeatherSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const whenItRains = linkedExperiences.find((e) => e.slug.includes("wimbledon-when-it-rains"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="public"
      h1="Variable, rain likely — but the roofs mean play rarely actually stops"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        London weather in late June/early July swings widely — layer for a 15°C morning and a 28°C afternoon on the
        same day. Rain is a genuine possibility across the Fortnight, but it rarely cancels a full day&apos;s play.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Typical conditions</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Temperature range" value="15-28°C (59-82°F), day to day and hour to hour" />
        <FactRow label="Rain" value="Variable, genuinely likely on any given day" />
        <FactRow label="Roofs" value="Centre Court and No. 1 Court close automatically; outer courts pause" />
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">When it rains</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Most delays run 30-60 minutes, rarely a full cancellation — Centre Court and No. 1 Court both have
          retractable roofs that close automatically. Head to Henman Hill with an umbrella to watch show courts on
          the big screen while you wait. Rain delays are actually a good time to try the 3pm resale queue (see the{" "}
          <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Ticket Guide
          </a>
          ) — fewer people are thinking about it.
        </p>
      </div>

      {whenItRains && (
        <div className="mb-8">
          <SpokeExperienceCard experience={whenItRains} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to pack</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Clothing</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Layers you can shed — a t-shirt-and-jumper combo under a packable waterproof covers the full 15–28°C
            swing in one bag. A wide-brimmed hat or cap; direct sun on the outer courts and The Hill has no shade for
            hours at a time. Genuinely comfortable, broken-in walking shoes — the grounds are hilly gravel paths, not
            flat pavement, and a full day covers several miles on your feet even without queueing.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Wet weather</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A compact umbrella and a proper waterproof jacket, not just a showerproof one — rain delays mean standing
            around outdoors, not sheltering indoors. A dry bag or ziplock for your phone if you&apos;re queueing
            overnight; ground moisture gets into everything by morning.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">On the grounds — what&apos;s allowed</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            One bag per person, max 40cm × 30cm × 30cm — hard-sided cases, cool-boxes, and picnic hampers aren&apos;t
            allowed regardless of size, so a soft rucksack is the practical choice. A small picnic is genuinely fine
            if it fits your bag allowance. Alcohol is allowed within real limits — one bottle of wine/Champagne
            (750ml) or two cans of beer/premixed aperitif per person, no spirits or fortified wine, and corked
            bottles must be opened before you take them into a seating area. Cameras with a standard lens are fine;
            anything over 300mm, plus tripods, monopods, and selfie sticks, are not.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-2">Queue-specific, if you&apos;re camping overnight</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A proper tent (small camping tents are allowed and common in the Queue), a sleeping bag rated for a
            genuinely cool English summer night, cash for early-morning coffee and pastries sold along the queue
            line, and a portable phone charger — you&apos;ll be checking your queue position and killing hours
            overnight.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          The figures above are seasonal norms, not a forecast — check a live forecast once you&apos;re within range
          of your travel dates.
        </p>
        <a
          href="https://www.accuweather.com/en/gb/wimbledon/sw19-4/weather-forecast/323341"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          AccuWeather forecast for SW19 →
        </a>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: AccuWeather (seasonal norms), help.wimbledon.com (bag size, camera, and alcohol policy).
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
