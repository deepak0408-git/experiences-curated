import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import ZoomableImage from "../../_components/ZoomableImage";

const SPOKE_ID = "map";
const CIRCUIT_MAP_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/australian-grand-prix-circuit-map.jpg";

// Real content sourced from the seeded Albert Park Circuit — Inside the
// Track experience (albert-park-circuit-inside-the-track-mu9c6dq0), 20 Sep
// 2026: the 5.278km lakeside layout, the 2021 reprofile and Leclerc's
// current lap record, Senna's 1993 final win, Webber's 2002 debut, the
// Turns 1-3 first-lap-chaos tradition. Circuit map (Images/Australian GP -
// Albert_Park_Circuit_Map ausstadiums.com) uploaded to R2 21 Sep 2026, per
// founder-supplied image and credit — ausstadiums.com (replaces an earlier
// AEPA Racing, CC BY 4.0 version swapped out the same day). Rendered via
// ZoomableImage (matching Italian/Qatar/Vegas GP's MapSpoke
// pattern) directly above "Where the racing actually happens", since the
// map's own corner/gate labelling is dense enough to need a click-to-zoom
// lightbox at in-page width.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const venueGuide = linkedExperiences.find((e) => e.slug.includes("albert-park-circuit-inside-the-track-mu9c6dq0"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Grand Prix"
      status="public"
      h1="A 5.278km lakeside circuit that reverts to a running path 361 days a year"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Albert Park Grand Prix Circuit wraps 5.278km around Albert Park Lake, three kilometres south of Melbourne&apos;s
        CBD — for 361 days a year it&apos;s public roads and parkland, and for one week each April it becomes an FIA
        Grade 1 circuit with 14 corners and four DRS zones. Because the tarmac is normal road surface rather than a
        dedicated track laid down once and left, grip actually builds session by session as rubber goes down —
        which is why Friday&apos;s Practice 1 can look scrappy and the same corners suddenly get taken flat by
        Saturday&apos;s Sprint Qualifying.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A circuit with real history</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The circuit first hosted a Grand Prix in 1953, was mothballed for decades, and reopened in 1996 as
          Formula 1&apos;s new Australian home after Adelaide lost the race — it&apos;s hosted 29 Grands Prix since.
          The 2021 reprofile straightened and widened several corners for faster, closer racing; the current lap
          record, 1:19.813, was set by Charles Leclerc in 2024, nearly five seconds quicker than Michael
          Schumacher&apos;s old 2004 mark on the pre-2021 layout. Schumacher remains the most successful individual
          driver here with four wins; Ferrari leads all constructors with ten. Ayrton Senna won his final Grand Prix
          here in 1993, six months before his death — a result still replayed every year the race returns. Mark
          Webber made his F1 debut here in 2002, the first chapter of a career that would eventually earn him his
          own grandstand at this circuit.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Circuit map</p>
      <ZoomableImage
        src={CIRCUIT_MAP_URL}
        alt="Albert Park Grand Prix Circuit layout"
        aspectClassName="aspect-[2999/2121]"
      />
      <p className="text-xs text-[#6A6A6A] mb-8">Credit: ausstadiums.com.</p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where the racing actually happens</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Because the track is genuinely fast by street-circuit standards — long straights, few genuine hairpins —
          overtaking clusters at specific points: the Turn 1-3 complex off the main straight, and the DRS-enabled
          Turn 11 exit. First-lap chaos is something of an Albert Park tradition — Martin Brundle&apos;s
          spectacular 1996 opening-lap crash and Ralf Schumacher&apos;s airborne 2002 shunt both happened at Turns
          1-3, the same complex the Brabham and Jones grandstands now overlook. Knowing that shapes where you
          choose to watch from as much as any grandstand&apos;s proximity to the pits does — see the{" "}
          <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Ticket Guide
          </a>{" "}
          for the full grandstand-by-grandstand breakdown.
        </p>
      </div>

      {venueGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={venueGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">No on-site parking</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Road closures around the circuit make driving pointless even if you wanted to — the free tram/train
            system is the only sensible way in. See the{" "}
            <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Getting There guide
            </a>{" "}
            for the full route.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">No wifi, no ATMs</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            There&apos;s no public wifi inside the venue — download the official Grand Prix app before you leave
            your hotel. There are no ATMs inside either, so sort a card or cash before you arrive.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food & drink</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            You can bring your own food and non-alcoholic drinks in — not alcohol or glass containers, and hard
            eskies are out while soft coolers and polystyrene eskies are fine. Buying inside runs at genuine event
            pricing: most proper meals sit A$15-20, a beer around A$12.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Getting between zones</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Albert Park&apos;s seven gates are spread around a 5km perimeter — know which gate serves your
            grandstand or entry point before you arrive, since walking from the wrong side of the lake to correct
            a mistake can cost 20-30 minutes. See the{" "}
            <a href={`/event-pack/${eventSlug}/arrival`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Arrival & Queue Guide
            </a>{" "}
            for the full gate breakdown.
          </p>
        </div>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually check before buying</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          If racing action matters most, confirm your grandstand sits near the Turn 1-3 complex or the Turn 11 DRS
          zone rather than assuming any main-straight stand gives you the same view — Brabham and Vettel are the
          two that actually put you on top of the circuit&apos;s real overtaking drama. If watching pit stops and
          the podium matters more, Fangio and Piastri&apos;s main-straight position is the better trade.
        </p>
      </div>
    </SpokeShell>
  );
}
