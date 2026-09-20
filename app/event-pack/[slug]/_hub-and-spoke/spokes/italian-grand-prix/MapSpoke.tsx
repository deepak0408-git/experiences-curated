import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import ZoomableImage from "../../_components/ZoomableImage";

const SPOKE_ID = "map";
const CIRCUIT_MAP_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/italian-grand-prix-circuit-map.png";

// Real content sourced from the seeded Monza — Inside the Venue
// (monza-inside-the-venue-mu7cm8il) and The History of Monza — Walking the
// Old Banking (history-of-monza-walking-old-banking-mrc4ka26) experiences,
// 19 Sep 2026: built in 110 days in 1922, the abandoned high-speed oval
// banking still standing in the trees, corner names (Variante Ascari,
// Curva Alboreto/Parabolica) memorialising drivers killed racing here.
// Circuit map (Images/Italian GP - Monza_Map-2021.png) uploaded to R2 20
// Sep 2026, per founder-supplied image and credit — Anthony Alessio
// Tralongo, CC BY 4.0. Rendered via ZoomableImage (matching Qatar/Vegas
// GP's MapSpoke pattern) directly below the Monza Inside the Venue
// experience card, since the map's own legend text is dense enough to
// need a click-to-zoom lightbox at in-page width.
//
// "On-site facilities" section added 20 Sep 2026 (this spoke previously
// lacked one, unlike Brazilian/Qatar GP's MapSpoke) — bag policy (15L,
// 500ml water cap, no alcohol), camera/tripod allowance, and re-entry
// policy sourced from the already-seeded Arrival & Queue Guide experience
// (seed-italian-gp-arrival-queue.mjs), itself sourced from f1italy.com's
// official "Rules for Visitors" page and oversteer48.com's gate guide.
// "Getting between zones" folded into this section (previously its own
// standalone block) to match Brazilian GP's layout, where it's the last
// facilities tile rather than a separate section. Toilets/accessibility,
// phone signal, and age-restriction facts are deliberately NOT included
// here — no Monza-specific sourcing found for any of the three, unlike
// Brazilian GP's MapSpoke which had all three verified; do not invent
// generic versions of these to fill the gap.
//
// Food tile added 20 Sep 2026, researched directly (not delegated) via
// f1italy.com/en/at-the-circuit-8, the circuit's own official visitor page:
// confirms catering outlets/food trucks operate circuit-wide and no
// alcohol/glass containers are allowed in. That page does NOT specify
// cash-vs-card acceptance at vendors, despite third-party aggregator sites
// claiming Monza takes both cash and card (unlike newer cashless-only F1
// venues) — that claim is NOT included here since the primary source
// doesn't corroborate it. Fan Zone food market detail (street food to
// gourmet, included with any race ticket) and the "don't eat near the
// gates" quality warning are both already-sourced facts pulled from this
// pack's own seeded experiences (seed-italian-gp-fan-zone.mjs,
// seed-italian-gp-eating-in-monza.mjs), not new research.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const venueGuide = linkedExperiences.find((e) => e.slug.includes("monza-inside-the-venue-"));
  const historyGuide = linkedExperiences.find((e) => e.slug.includes("history-of-monza-walking-old-banking-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Italian Grand Prix"
      status="public"
      h1="Built in 110 days in 1922 — still F1's fastest circuit, on its original ground"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Monza broke ground in spring 1922 and opened on 3 September that same year, a week before hosting its
        first Italian Grand Prix — the third purpose-built race circuit ever constructed, after Brooklands and
        Indianapolis, and the only one of the three still running a modern F1 calendar round on close to its
        original site. What F1 races today is a 5.793km configuration, 53 laps, with cars at full throttle for
        roughly 80% of every lap — the lowest-downforce, highest-speed layout left on the calendar.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The abandoned oval banking</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The original layout combined a 5.5km road circuit with a 4.5km high-banked oval, run separately or
          combined into a full 10km lap. That banking is still there, decaying quietly in the trees off the
          modern circuit — abandoned since the 1960s, too dangerous by any current standard, but walkable if you
          know where to look. It&apos;s the clearest physical evidence of what this place used to demand of
          drivers and cars.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Corners that memorialise, not just describe</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Variante Ascari, roughly two-thirds around the lap, is named for Alberto Ascari, the two-time World
          Champion killed testing at this exact circuit in 1955. The Parabolica, the long final corner feeding the
          start/finish straight, is officially Curva Alboreto now, renamed for Michele Alboreto, another Italian
          driver killed racing. The two Lesmo curves take their name from a nearby village. Monza doesn&apos;t
          memorialise casually.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where the real racing happens</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Variante del Rettifilo — where cars go from roughly 350km/h to 70km/h in one of the hardest braking
          zones in F1 — is the best pure viewing spot on the circuit for overtaking. Two DRS zones (between the
          second Lesmo and the Ascari chicane, and from the Parabolica back to the Rettifilo) consistently produce
          real racing here, because Monza&apos;s long straights give a trailing car enough time in the slipstream
          to actually complete a move.
        </p>
      </div>

      {venueGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={venueGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The circuit map</p>
      <ZoomableImage
        src={CIRCUIT_MAP_URL}
        alt="Autodromo Nazionale di Monza circuit layout"
        aspectClassName="aspect-[3840/2156]"
      />
      <p className="text-xs text-[#6A6A6A] mb-8">Credit: Anthony Alessio Tralongo, CC BY 4.0.</p>

      {historyGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={historyGuide} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food — trackside catering exists, but the Fan Zone is the better bet</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Catering outlets and food trucks operate throughout the circuit on all three race weekend days (no
            alcohol or glass containers permitted in). Trackside food near the gates tends to be overpriced and
            underwhelming — the Fan Zone&apos;s food market is the stronger option, running from casual street
            food to a more gourmet end (proper risotto next to a burger van is a genuine Monza combination) —
            entry to the Fan Zone itself is included with any race ticket.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Bags — 15 litres, no exceptions</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Any colour bag is fine up to 15 litres, but suitcases and oversized luggage don&apos;t get through
            security at all, and there&apos;s no bag storage at the gates themselves. Water is capped at 500ml per
            bottle; alcohol isn&apos;t allowed in.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Cameras — genuinely welcome here</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Monza allows personal cameras and lenses, tripods included with security approval — unusually
            permissive for a modern F1 venue, most of which have gone the other way. If serious photography is
            part of the trip, this is one of the better circuits left for it.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Re-entry — allowed, but budget time for it</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Unlike some circuits that lock you in for the day, Monza lets you leave and come back on the same
            ticket. The tradeoff is queuing again on the way in, and that line runs long in the gaps between
            sessions when everyone else has the same idea.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Getting between zones</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Monza runs six lettered spectator gates (A-G), each serving a different section of the circuit —
            confirm your gate against your grandstand or GA section before race day. See the{" "}
            <a href={`/event-pack/${eventSlug}/arrival`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Arrival & Queue Guide
            </a>{" "}
            for the full gate breakdown, and the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>{" "}
            for pricing and seating type on each grandstand.
          </p>
        </div>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually check before buying</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          If racing action and overtaking matter most, look at a grandstand or GA section near the Variante del
          Rettifilo or the Lesmo-Ascari sequence rather than assuming any seat on the long straights gives you the
          same view of real passing. Juan Pablo Montoya set F1&apos;s fastest lap speed in history here in 2004
          practice (260.6km/h average), and Rubens Barrichello&apos;s 2004 race lap record has stood since — a
          reminder of how little margin this layout leaves for a mistake at the limit.
        </p>
      </div>
    </SpokeShell>
  );
}
