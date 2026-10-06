import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import ZoomableImage from "../../_components/ZoomableImage";

const SPOKE_ID = "map";

// Real facts sourced during the classic pack's original experience
// research: Ashe (23,771 capacity, world's largest tennis stadium),
// Armstrong's 2018 roof rebuild. Armstrong and Flushing Meadows-Corona Park
// experience cards live in Tickets and Day Trips respectively (1-card-1-spoke
// rule) — this spoke mentions both in prose/fact rows only. Official grounds
// map added 6 Oct 2026 (nytimes.com, 1037x616), same ZoomableImage pattern
// as French Open's MapSpoke — no dedicated facilities-tour experience exists
// for this event yet, that's still an open item.
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

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Official grounds map</p>
      <div className="max-w-2xl">
        <ZoomableImage
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/us-open-venue-map.jpg"
          alt="Official USTA Billie Jean King National Tennis Center grounds map showing court layout, gates, and facilities"
          aspectClassName="aspect-[1037/616]"
        />
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">Credit: nytimes.com. Click the map to zoom in.</p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Watching outer-court tennis well</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Check the official app's daily order of play the evening before — first-round matches on the outer courts
          regularly feature ranked professionals in front of crowds small enough to hear the players between
          points.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Food and facilities on-site</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Concessions across the grounds</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            A full range of food stands and sit-down restaurants spread across the grounds, from quick bites near
            the outer courts to full-service dining by Arthur Ashe. See the full{" "}
            <a href={`/event-pack/${eventSlug}/where-to-eat`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Eat guide
            </a>
            .
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">The Honey Deuce</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            The tournament&apos;s signature Grey Goose cocktail, US$23, sold at bars throughout the grounds rather
            than one dedicated stand — the collectible souvenir cup is yours to keep.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Free water refills</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Water fountains and bottle-filling stations are spread across the grounds — bring an empty reusable
            bottle (24oz or smaller, no glass) rather than buying water once you&apos;re inside.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Merchandise</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            The official US Open Shop sits at Public Square, the grounds&apos; central plaza near Arthur Ashe —
            apparel, the annual poster, and Honey Deuce-branded cups and glassware.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Restrooms and ATMs</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Restrooms are distributed throughout the grounds near every court cluster, not just at the show
            stadiums. ATMs are available near the main gates — bring some cash as backup, since not every smaller
            concession stand takes card.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Bag storage</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Paid bag storage operates just outside both the East Gate and South Gate — useful if you&apos;re
            carrying anything bigger than the bag-size limit, or arriving straight from a flight or hotel checkout.
            Bags capped at 12&quot;x12&quot;x16&quot; are allowed inside; backpacks are barred regardless of size.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Accessibility</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The grounds are fully accessible, with ramps, elevators, and escalators throughout. Wheelchair-accessible
          seating is available at Arthur Ashe (lower and upper concourse), Louis Armstrong (lower concourse), the
          Grandstand (lower and upper concourse), Court 17, and every field court — each accommodating the ticket
          holder plus up to three companions, subject to availability. Accessible parking includes shuttle service to
          the stadiums, though not every shuttle is wheelchair-lift equipped — request one on arrival if needed. For
          specific accommodations, check usopen.org&apos;s accessibility page before you travel rather than on
          arrival.
        </p>
      </div>
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
