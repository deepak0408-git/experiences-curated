import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const trackside = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-trackside-hotels"));
  const offStrip = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-off-strip-hotels"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="teaser"
      h1="A hotel room can double as a grandstand seat — if you book the right one"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Both real neighborhood picks above are free — the pack adds which specific room category to request, and the exact booking window before track-view rooms sell out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        No other Grand Prix on the calendar lets your hotel room double as a viewing spot. The Strip circuit runs
        directly past a stretch of the biggest resorts on the Strip, and where you stay is one of the real, genuine
        decisions this trip involves — not just a place to sleep between sessions.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {trackside && <SpokeExperienceCard experience={trackside} isPro={isPro} />}
        {offStrip && <SpokeExperienceCard experience={offStrip} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Self-catered and value neighborhoods</p>
      <div className="flex flex-col gap-4 mb-8">
        <NeighborhoodCard
          name="East Harmon / Koval corridor"
          detail="Directly adjacent to the East Harmon and Koval Zone grandstand entrances — real, walkable proximity to the circuit's mid-tier and premium seating, without the Bellagio/Paris track-view premium. Several extended-stay and boutique properties sit within a 5-10 minute walk of the grandstand gates."
          transit="Walking distance to East Harmon Zone entrance — no transit needed."
        />
        <NeighborhoodCard
          name="Convention Center District (near Virgin Hotels)"
          detail="A genuinely useful base if you're not chasing a Strip-front room — this is F1's own official rideshare pickup zone for the East Harmon Zone, meaning the organizers themselves consider it a smart logistics choice, not a compromise."
          transit="Official F1 rideshare pickup point; short drive or rideshare to circuit entrances."
        />
        <NeighborhoodCard
          name="Fremont Street / Downtown"
          detail="The best value base on this list — Circa and similar downtown properties run well below Strip rates even during race weekend, with the added bonus of Stadium Swim's free race-day watch party. The trade-off is real distance from the circuit itself."
          transit="Roughly 10 minutes by car, an hour on foot; 24/7 Monorail during race week connects downtown to Strip stations."
        />
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which area we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            If a track-view room genuinely matters to your trip, Bellagio&apos;s Fountain View rooms or Paris Las
            Vegas&apos;s Versailles Balcony Rooms are worth the premium — nothing else on the Strip replicates
            watching the race from your own balcony. Confirm the specific room category in writing before paying
            the premium; not every room in the right tower has an actual track sightline. If value matters more
            than the view, Circa downtown delivers real savings and a genuinely different, free way to be part of
            race weekend via Stadium Swim.
          </p>
          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4 mb-6">
            <p className="text-sm font-bold text-white mb-1.5">Book track-view rooms months ahead, not weeks</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Track-view room categories at Bellagio, Aria, and Paris Las Vegas have a documented history of
              selling out well before race weekend, often months in advance. If this matters to your trip, book
              the room before locking in a ticket tier.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking windows &amp; contacts</p>
          <div className="flex flex-col gap-3">
            <HotelBookingCard name="Bellagio" url="https://bellagio.mgmresorts.com" note="Ask specifically for Fountain View King or Fountain View Two Queen — even within that named category, a track sightline isn't guaranteed on every booking, so get the exact room number or written confirmation before paying the premium. Note the Fountain Club hospitality package (front-row track + fountains views) is a separate, independently ticketed F1 product — it is not included with any room booking." />
            <HotelBookingCard name="Aria" url="https://aria.mgmresorts.com" note="Aria's track-facing rooms sit in the Turns 14-16 zone, a different stretch of the lap than Bellagio/Paris's fountain straight — confirm the specific room category directly with the hotel before paying any premium rate, since resort-wide booking doesn't guarantee the view." />
            <HotelBookingCard name="Paris Las Vegas" url="https://www.caesars.com/paris-las-vegas" note="Ask specifically for a Versailles Tower Balcony Room — this is the named category with the genuine Turns 13-14 sightline, not a standard Strip-view room. Club Paris hospitality (trackside terrace, rooftop lounge, food and drink included) is a separate ticketed product from the room itself." />
            <HotelBookingCard name="Circa Resort & Casino" url="https://www.circalasvegas.com" note="Downtown, not trackside — the trade-off is real distance for real savings, plus Stadium Swim's free race-day watch party." />
            <HotelBookingCard name="Virgin Hotels Las Vegas" url="https://virginhotelslv.com" note="Off-Strip value base with an easy Monorail-adjacent ride into race weekend. Book earlier than a non-race-weekend Vegas trip — race-week dates move fast." />
          </div>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Google Maps (live ratings, linked from each hotel&apos;s own experience page), each hotel&apos;s
        official direct-booking site.
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

function NeighborhoodCard({ name, detail, transit }: { name: string; detail: string; transit: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-sm font-bold text-white mb-1.5">{name}</p>
      <p className="text-sm text-[#A3A3A3] leading-6 mb-2">{detail}</p>
      <p className="text-xs text-[#6A6A6A]">{transit}</p>
    </div>
  );
}
