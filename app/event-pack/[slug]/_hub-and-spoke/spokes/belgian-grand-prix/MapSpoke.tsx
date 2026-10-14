import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import ZoomableImage from "../../_components/ZoomableImage";

const SPOKE_ID = "map";
const CIRCUIT_MAP_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/belgian-grand-prix-circuit-map.webp";

// Real content sourced from the seeded Spa-Francorchamps — Track
// Experiences & Driving Days experience, 12 Oct 2026. Circuit map already
// uploaded to R2 (scripts/upload-belgian-gp-circuit-map.mjs, per founder-
// supplied credit: Will Pittenger, CC BY-SA 3.0, via Wikimedia Commons —
// already live and referenced by Ticket Intelligence's FullResult.tsx).
// On-site facilities content kept to facts already established elsewhere
// in this pack (bag policy sourced from the event's preTripBriefLines) —
// no invented generic claims for anything not independently sourced.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const trackExperiences = linkedExperiences.find((e) => e.slug.includes("spa-francorchamps-track-experiences-"));
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
      eventName="Belgian Grand Prix"
      status="public"
      h1="7.004km through the Ardennes forest — the circuit most drivers call their favourite"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Circuit de Spa-Francorchamps is the longest circuit on the F1 calendar at 7.004km, a lap that climbs and
        drops through genuine Ardennes forest rather than a flat, purpose-built layout — corners named after the
        villages and landmarks they pass through, and a route most drivers on the current grid cite as their
        favourite on the whole calendar.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Eau Rouge/Raidillon — the corner that defines the circuit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A compression into a blind, uphill left-right sequence that every driver on the grid rates among the
          toughest corners in motorsport — the gradient and the crest are both more dramatic in person than any
          broadcast angle conveys. It&apos;s the single most-requested grandstand view at the circuit for good
          reason.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">La Source — the slowest corner on the lap</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A tight hairpin that opens every lap, sitting beside the starting grid — the one place on the circuit
          slow enough to actually follow a full overtaking move from braking zone through apex to exit, rather
          than registering it only as a blur or a screen replay.
        </p>
      </div>

      {trackExperiences && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={trackExperiences} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The circuit map</p>
      <ZoomableImage
        src={CIRCUIT_MAP_URL}
        alt="Circuit de Spa-Francorchamps layout, numbered 1-20, showing La Source, Eau Rouge/Raidillon, Kemmel Straight, Les Combes, Pouhon, Campus, Stavelot, Blanchimont, and the Bus Stop chicane"
        aspectClassName="aspect-[3840/2375]"
        lightFrame
      />
      <p className="text-xs text-[#6A6A6A] mb-8">Credit: Will Pittenger, CC BY-SA 3.0, via Wikimedia Commons.</p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">What to bring</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A waterproof jacket that fits in a bag, regardless of the forecast — Spa&apos;s micro-climate means
            the weather can differ meaningfully from one part of the circuit to another. A fold-up chair if
            you&apos;re on General Admission, since most of the circuit has no cover outside the paid grandstands.
            Ear defenders and sunscreen round out the list.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Getting between zones</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            At 7 kilometres, Spa is too large to casually roam the whole circuit in a single day — most
            experienced visitors roam on Friday to find preferred spots, then commit to a fixed position for
            qualifying and the race. See the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>{" "}
            for the full grandstand-by-grandstand comparison.
          </p>
        </div>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually check before buying</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          If racing action and real overtaking matter most, La Source and the Bus Stop Chicane are the two spots
          on the lap where you can genuinely follow a full passing move rather than catching only a flash of
          speed — worth weighing against the more famous, faster corners like Eau Rouge when deciding where to
          commit your grandstand budget.
        </p>
      </div>
    </SpokeShell>
  );
}
