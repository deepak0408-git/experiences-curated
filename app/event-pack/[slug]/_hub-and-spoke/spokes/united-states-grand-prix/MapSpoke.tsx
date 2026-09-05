import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "map";

// Map image uploaded 5 Sep 2026 from Images/US GP - Austin Map.png — the
// official COTA grandstand map with numbered turns (1-19) and grandstand
// zone labels (Main Grandstand, Turn 1, Turn 4, Turn 9, Turn 12, Turn 13,
// Turn 15, Turn 19, Turn 19B, General Admission) both correctly marked.
// Real 2000x1307 aspect ratio (not a generic 4:3) so the frame matches the
// image exactly, same pattern as Abu Dhabi's aspect-[2400/1325].
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
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
      eventName="United States Grand Prix"
      status="public"
      h1="A 3.4-mile circuit, four ticketed viewing areas"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Circuit of the Americas opened in 2012 as the first purpose-built F1 circuit in the United States in a
        generation — a 3.4-mile, 20-turn layout with the steepest elevation change of any circuit on the calendar,
        the 133-foot climb into Turn 1.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where the grandstands actually sit</p>
      <div className="relative w-full aspect-[2000/1307] rounded-sm border border-[#2A2A2A] overflow-hidden mb-4 bg-white">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/united-states-grand-prix-venue-map.png"
          alt="Circuit of the Americas track layout with numbered turns and grandstand locations"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Main Grandstand runs along the start-finish straight opposite the pit garages — the one seat that covers
          the grid, the pit stops, and the podium ceremony in a single sightline, though only three corners of the
          lap are actually visible from it. Turn 1 &quot;Big Red&quot; sits at the base of the circuit&apos;s
          signature 133-ft climb into a blind hairpin — the most dramatic single corner on the property, and
          consistently one of the first grandstands to sell out. Turn 15&apos;s stadium section puts five corners
          (12 through 15, plus part of the back straight) in one sightline from a single grandstand, genuinely
          unusual for a modern circuit. General Admission isn&apos;t fixed to one spot at all — GA zones ring
          multiple sections of the circuit, including around Turn 1 and Turn 6, so ticket holders can move between
          vantage points across the day rather than committing to a single view.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Grand Plaza</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The main entrance and fan-zone hub, with the COTA Culinary Experience&apos;s food villages, merchandise,
            and permanent restrooms — the natural landmark to orient around if you&apos;re new to the venue.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">On-site Medical Center and first aid</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Permanent first-aid stations sit in the Grand Plaza, the Main Grandstand, and the Paddock Medical
            Center. In an emergency, notify the nearest staff member or text COTA directly at 69050 with your
            location and situation — genuine on-site infrastructure, not an off-site fallback.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Cashless, everywhere</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            COTA is a fully cashless venue — card or mobile payment only at every food, drink, and merchandise
            stand. The official app is the fastest way to locate specific food stalls and restrooms once
            you&apos;re inside, since the circuit&apos;s footprint is large enough that wandering wastes real time.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Accessibility — real, specific provisions</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          COTA offers accessible parking (request ADA parking at the time of purchase, with a state-issued placard
          or plate), ADA-compliant ramps and elevators throughout the facility, an accessible shuttle to and from
          entrances, and mobility-scooter rentals. For race weekend specifically, accessible seating is available
          in the Main Grandstand, Turn 12, and Turn 15 — Turn 15 in particular has both stair and ramp access,
          standard-sized seats with backs, and dedicated wheeled-device spaces on its ADA platform. Permanent
          accessible restrooms sit in the Main Grandstand, Grand Plaza, and Turn 1, with additional ADA-accessible
          port-a-potties placed throughout the grounds during the event itself.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The venue&apos;s ADA Task Force has also added sensory rooms in the Grand Plaza — a genuine, specific
          accommodation beyond the standard mobility provisions. For accessibility questions or to arrange
          accommodations ahead of your visit, contact COTA directly rather than assuming a walk-up solution will
          exist on race day.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: circuitoftheamericas.com (venue policies, ADA accessibility).
      </p>
    </SpokeShell>
  );
}
