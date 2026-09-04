import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const facilities = linkedExperiences.find((e) => e.slug.includes("yas-marina-circuit-facilities"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Abu Dhabi Grand Prix"
      status="public"
      h1="Real, genuine accessibility infrastructure — not a token ramp"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Yas Marina Circuit, designed by Hermann Tilke and opened in 2009, made history immediately as the
        world&apos;s first-ever F1 twilight race venue — a daylight start transitioning into a fully floodlit
        finish, powered by a lighting installation of roughly 4,700 fixtures and a 600-million-lumen plan built in
        under 300 days.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where each grandstand actually sits</p>
      <div className="relative w-full aspect-[2400/1325] rounded-sm border border-[#2A2A2A] overflow-hidden mb-4 bg-[#141414]">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/abu-dhabi-grand-prix-grandstand-map.jpg"
          alt="Yas Marina Circuit map showing Main, West, West Straight, North, North Straight, Marina, South grandstands, and the Abu Dhabi Hill general admission zone positioned around the track"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Main Grandstand runs along the start/finish straight, directly across from the pit lane and garages —
          it&apos;s the one stand with a real sightline to the podium as well as the start and first-corner action.
          North Grandstand wraps the outside of Turn 5, the circuit&apos;s hairpin, covering the full entry, apex,
          and exit. West Grandstand sits at Turns 6-7, right where the first DRS zone ends — the circuit&apos;s main
          braking and overtaking zone. Marina Grandstand runs along the outside of the back straight between Turns
          8 and 9, facing across the water to the infield section where the track curves around the marina itself
          (Turns 10 through 13). South Grandstand sits at Turn 9 — known as Marsa Corner — covering the braking
          zone into it. Together, the five stands ring almost the entire lap, so which one you pick really is a
          choice about what kind of racing you want in front of you, not just a price point.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Main Oasis</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The circuit&apos;s largest fan zone, next to the Main Grandstand — food, drink, and merchandise, and the
            natural landmark to orient around if you&apos;re new to the venue&apos;s layout.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">On-site Medical Center</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Yas Marina Circuit runs its own Medical Center, with National Ambulance as the exclusive emergency care
            provider at the venue — genuine on-site first-aid infrastructure, not an off-site fallback.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Shuttle network</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The Circuit Circular Shuttle connects every major grandstand entrance; the Yas Courtesy Shuttle covers
            the rest of the island — both free, wheelchair-friendly, and included with any ticket.
          </p>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Accessibility — real, specific provisions</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          The circuit offers step-free entry, wheelchair-friendly shuttles, accessible parking, and reserved
          seating throughout the venue, with particular reserved allocations in the Main and North grandstands.
          Dedicated tickets for visitors with reduced mobility are available on request — contact the circuit
          directly via WhatsApp (+971 800 927) or the call centre (800927 or +971 2 4979000) to arrange this ahead
          of your visit. Public transit to the circuit is genuinely accessible too — modern buses run priority
          seating and ramps, and taxis across Abu Dhabi are equipped for wheelchairs and mobility scooters.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          One honest limitation: guided track tours of the circuit itself (separate from race-weekend grandstand
          access) aren&apos;t suitable for visitors with mobility impairments or wheelchair users — this applies
          specifically to behind-the-scenes track tours, not to grandstand or general race-weekend attendance,
          which the provisions above genuinely cover.
        </p>
      </div>

      {facilities && (
        <div className="mb-8">
          <SpokeExperienceCard experience={facilities} isPro={isPro} />
        </div>
      )}
    </SpokeShell>
  );
}
