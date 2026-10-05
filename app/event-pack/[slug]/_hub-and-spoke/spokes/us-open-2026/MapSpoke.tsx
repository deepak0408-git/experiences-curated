import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "map";

// Real facts sourced during the classic pack's original experience
// research: Ashe (23,771 capacity, world's largest tennis stadium),
// Armstrong's 2018 roof rebuild. Armstrong and Flushing Meadows-Corona Park
// experience cards live in Tickets and Day Trips respectively (1-card-1-spoke
// rule) — this spoke mentions both in prose/fact rows only. No dedicated
// venue-map image or facilities-tour experience exists for this event yet —
// open item, same honest-gap pattern as the Hotels spoke.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="US Open"
      status="public"
      h1="The world's largest tennis stadium, plus the park that surrounds it"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The USTA Billie Jean King National Tennis Center packs two show stadiums, a Grandstand, and more than a
        dozen outer courts into a compact site inside Flushing Meadows-Corona Park. What's less obvious from a
        broadcast feed is how each stadium has its own distinct character — this is the grounds-level guide to
        what's actually where.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Site facts</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Address" value="USTA Billie Jean King National Tennis Center, Flushing Meadows-Corona Park, Queens, NY 11368" />
        <FactRow label="Arthur Ashe Stadium" value="23,771 seats, the largest tennis stadium in the world, retractable roof since 2016" />
        <FactRow label="Louis Armstrong Stadium" value="14,000 seats, rebuilt 2018 with a naturally-ventilated retractable roof" />
        <FactRow label="The Grandstand" value="8,125 seats, the smallest of the three reserved-seat stadiums, genuinely close to the action" />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Watching outer-court tennis well</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Check the official app's daily order of play the evening before — first-round matches on the outer courts
          regularly feature ranked professionals in front of crowds small enough to hear the players between
          points.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Food and facilities on-site</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-8">
        <p className="text-sm font-bold text-white mb-1">Concessions across the grounds</p>
        <p className="text-xs text-[#A3A3A3] leading-5">
          A full range of food stands and sit-down restaurants across the grounds. See the full{" "}
          <a href={`/event-pack/${eventSlug}/where-to-eat`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Where to Eat guide
          </a>
          .
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: usopen.org.
      </p>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
