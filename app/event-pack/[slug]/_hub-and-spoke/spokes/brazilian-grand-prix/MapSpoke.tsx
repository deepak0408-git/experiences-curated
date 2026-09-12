import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";
const VENUE_MAP_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/brazilian-grand-prix-map.png";

// Real content sourced from the seeded Interlagos venue overview experience
// (interlagos-autodromo-jose-carlos-pace-venue-mtx6m894), 12 Sep 2026: 1940
// opening between two reservoirs, 1990 shortening from 7.8km to 4.309km,
// the S do Senna, two back-to-back DRS zones. Real circuit map image
// (Images/Brazilian GP - Venue Map.png, uploaded to R2 12 Sep 2026) shows
// every grandstand letter (A/B/D/G/H/M/N/R/S/V) plus Heineken Village and
// Orange Tree Club locations. "Where each zone actually sits" description
// added directly below the map (matching Mexico City GP's MapSpoke pattern)
// using only grandstand facts already verified elsewhere in this pack — A/G
// (TicketsSpoke tier1), M/R (TicketsSpoke tier2) — rather than inventing
// track positions for B/D/H/N/S/V, which aren't sourced anywhere in this
// pack; those are pointed to the Ticket Guide instead of guessed at. The
// Ticket Guide card itself was briefly duplicated into this spoke's
// SpokeExperienceCard grid (12 Sep 2026) — removed again since it's already
// the featured card in TicketsSpoke; every experience card should render in
// exactly one spoke. "On-site facilities" replaced 12 Sep 2026 — the prior
// version had "Altitude — a non-issue here" as a facility, which isn't one;
// altitude is already covered honestly in FirstTimerGuideSpoke. Rebuilt to
// match the real facilities pattern used in Bahrain GP's MapSpoke (food/
// payment, toilets/accessibility, phone signal, noise, age restrictions),
// sourced directly from formula1.com's official Interlagos visitor-info
// article and brasilf1.com's "At the Circuit" page. Prayer rooms
// deliberately not covered here — not verified for this venue, unlike
// Bahrain GP's sourced surau/prayer-room facts.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const venueGuide = linkedExperiences.find((e) => e.slug.includes("interlagos-autodromo-jose-carlos-pace-venue-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="São Paulo Grand Prix"
      status="public"
      h1="A bowl-shaped circuit between two reservoirs, shortened once in 1990"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Interlagos opened in May 1940, built into a strip of land between two reservoirs — Guarapiranga and
        Billings — that the city had dammed decades earlier for water and power. &quot;Interlagos&quot; just means
        &quot;between lakes.&quot; The original layout ran a genuinely enormous 7.8km, and F1 raced that full
        circuit through the 1970s before a 1990 rebuild cut it down to today&apos;s 4.309km to meet new FIA length
        limits. The circuit was renamed in 1985 for José Carlos Pace, Brazil&apos;s first F1 race winner, killed in
        a plane crash in 1977.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Circuit map</p>
      <div className="relative w-full aspect-[2080/1170] rounded-sm border border-[#2A2A2A] overflow-hidden mb-4 bg-white">
        <Image
          src={VENUE_MAP_URL}
          alt="Interlagos circuit layout with grandstand zones, Heineken Village, and Orange Tree Club marked"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Grandstands A and G line the main straight&apos;s banked entry — uncovered, bleacher-style, and by wide
          agreement the loudest, most social part of the circuit. Grandstand M sits right at Turn 1, the downhill
          first-lap fight into the circuit&apos;s best overtaking spot, with Grandstand R nearby covering Turn 3 and
          the DRS zone — both of these are covered, numbered, reserved seating. Heineken Village and the Orange Tree
          Club / F1 Paddock Experience — the circuit&apos;s two hospitality products — sit trackside near the same
          start-finish area, marked separately on the map from the numbered grandstands. The remaining lettered
          stands (B, D, H, N, S, V) circle the rest of the lap; see the{" "}
          <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Ticket Guide
          </a>{" "}
          for pricing and seating type on each.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The layout that shapes every grandstand</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The lap runs short, anticlockwise, and drops over 40 metres of elevation in one direction only — the
          bowl-shaped layout is why grandstands like A give you sightlines into the infield that most flat circuits
          can&apos;t offer. Two DRS zones sit back-to-back on the main straight and Reta Oposta with minimal recovery
          time between them, a real, track-specific reason overtaking chains happen here more often than almost
          anywhere else on the calendar. The S do Senna — named for the corner where Ayrton Senna made his opening
          move in the 1990s — sits early in the lap and still carries the weight of Brazil&apos;s biggest sporting
          hero.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">No general admission</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Entry is via a race-weekend grandstand or hospitality ticket only — Interlagos has no separate general
          admission product, unlike most other circuits on the calendar. See the{" "}
          <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Ticket Guide
          </a>{" "}
          for the full grandstand-by-grandstand breakdown.
        </p>
      </div>

      {venueGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={venueGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food & drink — cashless only</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Refreshment bars run throughout the grandstands, but every trackside purchase goes through Interlagos&apos;
            Cashless Consumer Card system — load credit onto the card before you need it rather than at the vendor
            when you&apos;re already hungry. You can&apos;t bring drinks in, but up to 3 food items per person are
            allowed (any fruit has to be cut and in a transparent container).
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Toilets & accessibility</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Toilets sit within each grandstand rather than in one central block, so it&apos;s a walk downstairs, not
            across the venue. Every grandstand, the Fan Zone, and the VIP areas have adapted, accessible restroom
            facilities for reduced-mobility visitors.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Phone signal on race day</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Mobile networks genuinely struggle under race-weekend crowds, Sunday worst of all — agree a physical
            meeting point with anyone you might get separated from rather than counting on being able to call or
            message them.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Noise — bring earplugs if you're close to the track</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The standard grandstands are loud but manageable; anywhere genuinely close to the cars is not, and
            earplugs are a real, practical add rather than overcaution — worth it for kids specifically.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Age restrictions</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Children under 5 aren&apos;t permitted entry to the circuit at all, and Heineken Village is 18+ only
            with ID checked at the gate — plan around both if you&apos;re bringing a family or considering that
            sector.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Getting between zones</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Follow the entry gate matched to your specific grandstand letter — official race-weekend signage
            directs ticket holders from the Autódromo train station to the correct gate. See the{" "}
            <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Getting There guide
            </a>{" "}
            for the full route.
          </p>
        </div>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually check before buying</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            If racing action and sightlines matter most, confirm your grandstand sits near Turn 1 or the main
            straight rather than assuming any covered stand gives you the same view — Grandstand M and Grandstand
            B are the two that actually put you on top of the circuit&apos;s real drama. If atmosphere matters
            more than sightline quality, Grandstand A&apos;s bowl-shaped position into the infield trades comfort
            for genuine crowd energy that some of the quieter covered stands don&apos;t have.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
