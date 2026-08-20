import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const perthStadium = linkedExperiences.find((e) => e.slug.includes("perth-stadium-series-opener"));
  const adelaideOval = linkedExperiences.find((e) => e.slug.includes("adelaide-oval-most-beautiful-ground"));
  const mcg = linkedExperiences.find((e) => e.slug.includes("mcg-boxing-day-test"));
  const scg = linkedExperiences.find((e) => e.slug.includes("scg-fourth-test-sydney-summer"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="New Zealand in Australia"
      status="public"
      h1="Four grounds, four real layouts — what each venue actually offers beyond the pitch"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Each of the four Test venues on this tour has its own real character, beyond simply being a cricket ground.
        Perth Stadium is the newest and most purpose-built; Adelaide Oval pairs cricket history with the city&apos;s
        own heritage skyline; the MCG is the largest and most institutional of the four; the SCG carries more than
        140 years of the sport&apos;s own history inside its own walls.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {perthStadium && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Perth Stadium</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              Opened 2018, the newest venue on this tour by a wide margin — built with its own train station
              integrated directly into the venue, genuinely walkable food and bar precincts inside the concourse,
              and a design that keeps every seat closer to the action than most modern stadiums manage.
            </p>
            <SpokeExperienceCard experience={perthStadium} isPro={isPro} />
          </div>
        )}

        {adelaideOval && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Adelaide Oval</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              The one ground on this tour where the setting is as much a part of the experience as the cricket — St
              Peter&apos;s Cathedral rises directly behind the northern end, and the heritage scoreboard remains in
              active use alongside modern digital screens.
            </p>
            <SpokeExperienceCard experience={adelaideOval} isPro={isPro} />
          </div>
        )}

        {mcg && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The MCG</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              The largest venue on the tour by capacity, and the institutional home of Australian cricket — the
              National Sports Museum sits inside the ground itself, worth building time around if you&apos;re
              there outside match hours.
            </p>
            <SpokeExperienceCard experience={mcg} isPro={isPro} />
          </div>
        )}

        {scg && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The SCG</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              The most historic ground on the tour, hosting Test cricket since 1882 — the heritage Members&apos;
              Pavilion (1886) still stands, and the ground&apos;s own real character sits closer to a traditional
              English cricket ground than any of the other three, more modern venues.
            </p>
            <SpokeExperienceCard experience={scg} isPro={isPro} />
          </div>
        )}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Facilities &amp; accessibility</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Perth Stadium</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            450 wheelchair positions and 327 Enhanced Amenity seats — well above the minimum required. Priority
            access to the left of each gate, lifts at sections 103, 110, 126, 136, and 147, and 2 Changing Places
            facilities (behind sections 111 and 537). ACROD parking is genuinely limited — register online, opens
            3 weeks before each game and closes 9am the Monday before.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Adelaide Oval</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            275 wheelchair places plus 119 Easy Access seats, grouped across all levels. All three main gates
            (South, East, North) are step-free, with ramps near every stairway and lifts near every escalator. One
            accessible ticket window per entrance, with a hearing loop. Book via 1300 665 915 or Adelaide Oval's
            own access request form.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">The MCG</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Accessible seating on Levels 1, 2, and 4 of the Olympic Stand, and Levels 1 and 2 of the Shane Warne
            (formerly Great Southern) Stand — check the MCG's own Accessibility Map before booking, since coverage
            differs stand to stand. A free mobility shuttle runs during events, and there's a Changing Places
            facility on-site. Pre-book via Ticketek's Accessible Seating Hotline, 1300 665 915.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">The SCG</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Wheelchair and companion seating in grandstand bays ORLY 1, ORLY 5, and ORLY 9, plus concourse bays 29
            and 30 in the Brewongle Stand. Enter via accessible Gate E, where a staff member directs you through to
            the O'Reilly lift. Book via Ticketek's Accessible Ticket Booking line, 1300 655 915.
          </p>
        </div>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: each venue's official site (Perth Stadium, Adelaide Oval, MCG, SCG); cricket.com.au venue history
        pages; optusstadium.com.au Access and Inclusion Fact Sheet; adelaideoval.com.au Access Information;
        mcg.org.au Accessibility and Inclusion; sydneycricketground.com.au Accessibility.
      </p>
    </SpokeShell>
  );
}
