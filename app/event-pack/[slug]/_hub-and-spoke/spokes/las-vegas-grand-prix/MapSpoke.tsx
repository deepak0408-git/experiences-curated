import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

// Positioned as % of the 1920x1080 source image, next to each turn cluster
// (verified against the actual image, not guessed from a generic layout).
// Sourced turn/street correspondence: oversteer48.com and formula1.com
// turn-by-turn coverage — see spoke sources footer.
const TRACK_LABELS = [
  { text: "East Harmon Zone (Turns 1-4)", x: 69, y: 4 },
  { text: "Koval Lane (Turns 4-5)", x: 56, y: 38 },
  { text: "Westchester Ln (Turn 6)", x: 47, y: 12 },
  { text: "Sphere chicane (Turns 7-9)", x: 26, y: 3 },
  { text: "Sands Ave (Turns 9-12)", x: 15, y: 40 },
  { text: "The Strip (Turns 12-14)", x: 25, y: 86 },
  { text: "East Harmon Ave (Turns 14-17)", x: 79, y: 93 },
];

export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const fountainsSphere = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-fountains-sphere"));
  const casinos = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-strip-casinos"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="public"
      h1="A 3.85-mile circuit built through the city, not around it"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        The Las Vegas Strip Circuit is a 3.85-mile, 17-turn street circuit starting and finishing at Grand Prix
        Plaza — a 39-acre, 300,000-square-foot pit and paddock complex on the corner of Harmon Avenue and Koval
        Lane. The circuit splits into named zones: East Harmon (start/finish, Main Grandstand), West Harmon (final
        corner, top-speed straight), Koval (Turn 3, DRS zone), Flamingo (Koval Straight GA), and T-Mobile Zone
        beneath the Sphere.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The landmarks the circuit runs past</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {fountainsSphere && <SpokeExperienceCard experience={fountainsSphere} isPro={isPro} />}
        {casinos && <SpokeExperienceCard experience={casinos} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Facilities across the circuit</p>
      <div className="flex flex-col gap-3 mb-8">
        <FacilityRow label="Grand Prix Plaza" detail="The permanent pit/paddock complex at the circuit's start/finish, 4400 Koval Ln. Outside race week it runs as a seasonal public attraction (F1 DRIVE karting, F1 X theater, F1 HUB retail and lounge, no ticket needed for the HUB) — public operations pause each year ahead of race-week construction, so check current hours before visiting off-season." />
        <FacilityRow label="Zone connectivity" detail="East Harmon, West Harmon, and Koval Zones connect on foot, giving grandstand ticket holders wider access to fan activations and the Heineken Silver Stage. General Admission zones (Flamingo, T-Mobile) are locked to their own single zone." />
        <FacilityRow label="Water refill stations" detail="15 free refill stations are placed across every F1-controlled fan zone — bring a reusable bottle, or buy one on-site (plastic/silicone containers up to 24oz can also be brought in empty)." />
        <FacilityRow label="First aid" detail="Multiple first-aid stations sit throughout the venue rather than at one central point — check the event map or official app for the nearest one to your zone." />
        <FacilityRow label="Food and beverage" detail="Available for purchase in every zone — GA zones sell casual on-site vendor food, while hospitality tiers include full catering. The event runs entirely cashless." />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Turn by turn</p>
      <div className="relative w-full aspect-[1920/1080] rounded-sm border border-[#2A2A2A] overflow-hidden mb-2 bg-white">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/las-vegas-grand-prix-circuit-layout.jpg"
          alt="Las Vegas Strip Circuit 2023 track layout showing all 17 turns and the East Harmon, West Harmon, Koval, Flamingo, and T-Mobile zones"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
        {TRACK_LABELS.map((l) => (
          <div
            key={l.text}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${l.x}%`, top: `${l.y}%` }}
          >
            <span className="whitespace-nowrap text-[9px] sm:text-[11px] font-bold text-black">
              {l.text}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">
        The 2023 track layout, unchanged since the circuit opened. Use it for orientation, not precise navigation.
        Credit: Hazim Fikri A., CC BY-SA 4.0, via Wikimedia Commons.
      </p>

      <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How to use the zones to your advantage</p>
        <div className="flex flex-col gap-3">
          <FacilityRow
            label="Reserved grandstand tickets (East Harmon, West Harmon, Koval)"
            detail="These three zones connect on foot, so a Main Grandstand, West Harmon, or Turn 3 ticket gives you wider access to fan activations and the Heineken Silver Stage across the weekend — don't treat your grandstand as the only place worth being between sessions."
          />
          <FacilityRow
            label="Flamingo Zone GA — locked to one zone"
            detail="Confirm this is genuinely your zone before arrival — a Flamingo ticket doesn't let you wander into T-Mobile Zone or any grandstand zone, and there's no way to upgrade or switch once you're inside. The trade-off: standing-room access to the Koval Straight/Turn 5G braking zone, the cheapest real racing view on the circuit."
          />
          <FacilityRow
            label="T-Mobile Zone at Sphere — its own self-contained draw"
            detail="Also single-zone-locked, but the Sphere backdrop and its own nightly concert stage make it less of a compromise than a typical GA zone — worth choosing on its own merits, not just as the cheaper option."
          />
        </div>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: f1lasvegasgp.com official A-Z Guide (water refill, first aid), gpdestinations.com and
        oversteer48.com (zone layout, turn-by-turn street/landmark detail), formula1.com (circuit facts and figures,
        DRS zones), en.wikipedia.org (circuit specifications).
      </p>
    </SpokeShell>
  );
}

function FacilityRow({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
