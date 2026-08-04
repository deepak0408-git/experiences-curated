import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "hotels";

export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const trackHotels = linkedExperiences.find((e) => e.slug.includes("singapore-gp-trackside-hotels"));
  const clarkeQuay = linkedExperiences.find((e) => e.slug.includes("singapore-gp-clarke-quay-stay"));
  const chinatown = linkedExperiences.find((e) => e.slug.includes("singapore-gp-chinatown-stay"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Singapore Grand Prix"
      status="teaser"
      h1="Trackside, riverside, or value — the real Singapore stay decision"
      question="Where should I stay for the Singapore GP?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every hotel and rating above is real and free. The pack adds our actual recommendation for your specific priorities — trackside, riverside, or value — plus the exact room category to request at each property and direct booking notes, since a couple of these genuinely sell out during race week."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-2">
        Marina Bay Street Circuit wraps around downtown Singapore, so unlike most Grand Prix venues, this genuinely
        is a three-way decision, not a default. All ratings below are Booking.com, same scale throughout, verified
        directly against each listing.
      </p>
      <p className="text-xs text-[#6A6A6A] mb-8">Updated on: 2 August 2026</p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Trackside — Marina Bay (5-15 min walk to the circuit)</p>
      <div className="flex flex-col gap-3 mb-2">
        <HotelRow name="The Ritz-Carlton, Millenia" tier="Luxury" rating="9.3/10" reviewCount="1,740 reviews" sourceUrl="https://www.booking.com/hotel/sg/the-ritz-carlton-millenia-singapore.html" note="Oversized windows in several room categories built specifically to frame the skyline and portions of the circuit — several rooms genuinely double as a private grandstand." />
        <HotelRow name="Pan Pacific Singapore" tier="Luxury" rating="9.0/10" reviewCount="4,823 reviews" sourceUrl="https://www.booking.com/hotel/sg/panpacificsingapore.html" note="Many rooms face the circuit and bay, at a genuinely more accessible rate than the other two. Connects directly to Marina Square." />
        <HotelRow name="Swissotel The Stamford" tier="Luxury" rating="8.9/10" reviewCount="4,331 reviews" sourceUrl="https://www.booking.com/hotel/sg/swissotelsingapore.html" note="Sits directly above City Hall MRT — the fastest route back on race night when street crowds slow every other option." />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3 mt-6">Clarke Quay — riverside nightlife, an MRT ride away</p>
      {clarkeQuay && (
        <div className="flex flex-col gap-3 mb-8">
          <HotelRow name="Holiday Inn Express Singapore Clarke Quay" tier="Mid-range" rating="8.5/10" reviewCount="6,220 reviews" sourceUrl="https://www.booking.com/hotel/sg/holiday-inn-express-singapore-clarke-quay.html" note="Close to the river and the nightlife. Considerably cheaper than Marina Bay's trackside tier without sacrificing a real, well-reviewed stay." />
          <HotelRow name="Park Regis by Prince Singapore" tier="Mid-range" rating="8.4/10" reviewCount="3,369 reviews" sourceUrl="https://www.booking.com/hotel/sg/park-regis-singapore.html" note="Directly across the street from Clarke Quay itself, walkable to Chinatown too. Rooms run newly renovated but thin-walled — worth knowing before booking." />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3 mt-6">Chinatown — the value base, 3 stops from the circuit</p>
      {chinatown && (
        <div className="flex flex-col gap-3 mb-8">
          <HotelRow name="Aurum Royal (formerly The Scarlet)" tier="Boutique" rating="7.9/10" reviewCount="1,777 reviews" sourceUrl="https://www.booking.com/hotel/sg/the-scarlet.html" note="A pre-war shophouse turned boutique hotel on Erskine Road, roughly half Marina Bay's rates. Opposite an MRT station and food court, 3-minute walk to Chinatown." />
          <HotelRow name="Heritage Collection on Chinatown" tier="ApartHotel" rating="9.1/10" reviewCount="1,312 reviews" sourceUrl="https://www.booking.com/hotel/sg/hometown-inn.html" note="Restored shophouse aparthotel on South Bridge Road, the highest-rated stay in either Chinatown or Clarke Quay. Some room categories are windowless — check before booking, and note it's a walk-up building with no elevator." />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which base we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a first Singapore GP, Chinatown is the right call for most people — real neighbourhood character, two
            MRT lines to the circuit, at roughly half Marina Bay&apos;s trackside rates. Marina Bay only earns its
            premium if a genuine circuit view from your room matters to you specifically, ask for a track-facing room
            category when booking, it&apos;s not automatic. Clarke Quay is the pick if the nightlife itself is part of
            the draw, a short MRT ride (not a walk) from the circuit with a completely different evening on offer.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking windows &amp; contacts</p>
          <div className="flex flex-col gap-3 mb-6">
            <HotelBookingCard name="The Ritz-Carlton, Millenia" url="https://www.booking.com/hotel/sg/the-ritz-carlton-millenia-singapore.html" note="Request a track-facing or bay-facing room category specifically — the panoramic view is tied to specific rooms, not hotel-wide." />
            <HotelBookingCard name="Pan Pacific Singapore" url="https://www.booking.com/hotel/sg/panpacificsingapore.html" note="Book early for race week — this is the relative value pick of the trackside three, and inventory sells out fast." />
            <HotelBookingCard name="Swissotel The Stamford" url="https://www.booking.com/hotel/sg/swissotelsingapore.html" note="Ask about 65th-floor lounge access on higher floors — food and wine are included in the room rate at that tier." />
            <HotelBookingCard name="Holiday Inn Express Clarke Quay" url="https://www.booking.com/hotel/sg/holiday-inn-express-singapore-clarke-quay.html" note="Book direct or via Booking.com — the district gets genuinely loud into the night, factor that in if an early practice session means you need real sleep." />
            <HotelBookingCard name="Park Regis by Prince Singapore" url="https://www.booking.com/hotel/sg/park-regis-singapore.html" note="Newly renovated but thin-walled — request a corner or higher-floor room if noise from the corridor is a concern." />
            <HotelBookingCard name="Aurum Royal (formerly The Scarlet)" url="https://www.booking.com/hotel/sg/the-scarlet.html" note="Rebranded from The Scarlet — older reviews elsewhere may still reference the old name. Check current room categories before booking." />
            <HotelBookingCard name="Heritage Collection on Chinatown" url="https://www.booking.com/hotel/sg/hometown-inn.html" note="No elevator — factor that in if luggage or mobility is a concern. Request a skylight or windowed room category specifically." />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Full guides</p>
          <div className="flex flex-wrap gap-4">
            {trackHotels && <Link href={`/experience/${trackHotels.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">Read the full trackside hotels guide →</Link>}
            {clarkeQuay && <Link href={`/experience/${clarkeQuay.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">Read the full Clarke Quay guide →</Link>}
            {chinatown && <Link href={`/experience/${chinatown.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">Read the full Chinatown guide →</Link>}
          </div>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Booking.com (all ratings, same scale, directly verified per listing). Verified 2 Aug 2026.
      </p>
    </SpokeShell>
  );
}

function HotelBookingCard({ name, url, note }: { name: string; url: string; note: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
        <p className="text-sm font-bold text-white">{name}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
          Book direct ↗
        </a>
      </div>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
    </div>
  );
}

function HotelRow({ name, tier, rating, reviewCount, sourceUrl, note }: { name: string; tier: string; rating: string; reviewCount: string; sourceUrl: string; note: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <p className="text-sm font-bold text-white">{name}</p>
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] underline">
          {tier} · {rating} ({reviewCount}) ↗
        </a>
      </div>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
    </div>
  );
}
