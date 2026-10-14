import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Real content sourced from the seeded Fan Zone at Raidillon experience,
// 12 Oct 2026. Gate times and bag-policy facts drawn from the event row's
// own preTripBriefLines where available; remaining facts kept general
// rather than invented where no Spa-specific source exists for them.
// Camping at the Circuit moved to the Hotels spoke 13 Oct 2026 — it's a
// lodging decision, not an arrival-day logistics one, and belongs alongside
// the other base-of-stay options.
// Rewritten 13 Oct 2026 — added a real gate-to-grandstand mapping (sourced
// from spagrandprix.com's own entrance-gate pages: La Source, Ster, Les
// Combes A/B/C, Blanchimont, Kemmel C/D/E) matched against this pack's own
// 7 seeded grandstand tiers, a full prohibited-items list (sourced from
// spagrandprix.com's on-site FAQ), and a distinct General Admission section
// — none of which existed before and all of which this spoke was missing.
const GATE_MAP = [
  { gate: "La Source", serves: "Gold 1 (Pit Grandstand), Gold 7/8/9 (La Source Hairpin), Silver 1-2", parking: "Yellow zone, 15-min walk" },
  { gate: "Ster", serves: "Gold 2-4 (including Eau Rouge/Raidillon Gold 3), Gold 5, Silver 1-2 — sits right by the Fan Zone and closest to Eau Rouge", parking: "Yellow zone, 15-min walk" },
  { gate: "Les Combes A / B / C", serves: "Les Combes Grandstands 1-4, the Kemmel Straight GA bank, Pouhon Silver 3 (via the Combes C tunnel)", parking: "Green zone — direct access, also the Camping Green Zone entrance" },
  { gate: "Blanchimont", serves: "Grandstands toward the back of the lap, Silver 3/6 — least used by first-time visitors, worth knowing if your stand is on this side", parking: "Red zone — direct access" },
  { gate: "Kemmel C / D / E", serves: "Smaller gates along the Kemmel Straight, mainly useful if you're staying in on-site camping or accommodation right there", parking: "Walk-in only" },
];

const PROHIBITED_ITEMS = [
  "Glass bottles or containers of any kind (sealed plastic bottles are fine; empty reusable bottles too)",
  "Alcohol brought from outside",
  "Tents, and bicycles, scooters or motorcycles",
  "Drones, flares (smoke or distress), and confetti",
  "Knives, pocket knives, or any bladed or dangerous object",
  "Large flags with poles, or any flag big enough to block the view behind you",
  "Ladders, barbecues, or any fire-making equipment",
  "Glue, coloured powder, and padlocks",
];
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const fanZone = linkedExperiences.find((e) => e.slug.includes("fan-zone-raidillon-"));
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
      h1="Five gates serve different grandstands — know yours, what you can bring, and how GA arrival really works"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Spa is a 7km circuit with five separate pedestrian entrance gates, not one main gate like a compact venue —
        which gate you walk in from depends entirely on which grandstand or GA area you&apos;re headed to.
        Knowing your gate before you set off saves a long, wrong-direction walk on a crowded race morning.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Which gate for your ticket</p>
      <div className="hidden md:block overflow-x-auto mb-8">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="w-1/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Gate</th>
              <th className="w-3/5 text-left py-2 pr-4 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Serves</th>
              <th className="w-1/5 text-left py-2 text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Parking zone</th>
            </tr>
          </thead>
          <tbody>
            {GATE_MAP.map((g) => (
              <tr key={g.gate} className="border-b border-[#2A2A2A] last:border-0">
                <td className="py-3 pr-4 text-white font-bold align-top">{g.gate}</td>
                <td className="py-3 pr-4 text-[#A3A3A3] align-top">{g.serves}</td>
                <td className="py-3 text-[#A3A3A3] align-top">{g.parking}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col gap-3 mb-8">
        {GATE_MAP.map((g) => (
          <div key={g.gate} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-2">{g.gate}</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-1">
              <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Serves: </span>
              {g.serves}
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Parking: </span>
              {g.parking}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Gate times</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Circuit gates open from around 06:00 on each race day — early enough that building your morning around
          this time, rather than a more leisurely breakfast-first schedule, genuinely matters if a specific
          fence-side position is the goal. Check the official Formula 1 app for confirmed daily timings, since
          these can shift session to session.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What you can&apos;t bring</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <ul className="text-sm text-[#A3A3A3] leading-6 space-y-2 list-disc pl-5">
          {PROHIBITED_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-sm text-[#A3A3A3] leading-6 mt-4">
          Food and drink for personal consumption, cameras, portable radios, and foldable chairs in Bronze areas
          are all fine — smoking is permitted outside the grandstands only. Confirm the current list at
          spagrandprix.com before you pack, since specifics shift year to year.
        </p>
      </div>

      {fanZone && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={fanZone} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">If you&apos;re on General Admission</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          GA is a different arrival-day game to a grandstand seat — you&apos;re claiming ground, not walking to an
          assigned number. Popular positions like the Kemmel Straight bank fill by around 09:30 on race Sunday,
          genuinely early for a race that doesn&apos;t start until mid-afternoon. Enter through Les Combes A, B, or
          C for the Kemmel Straight bank, or Ster for the ground near the Fan Zone and Eau Rouge — both get you
          into GA territory fastest.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Bring a fold-up chair (permitted in Bronze areas only), carry everything you need for the day since
          there&apos;s no seat to return to, and expect to be on your feet or on uneven ground for hours — this is
          the real trade-off GA makes against a covered grandstand seat.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Confirm your gate from the table above before race morning, not after you arrive — Spa&apos;s gates are
          far enough apart that walking to the wrong one costs real time. If you&apos;re on General Admission,
          build your schedule around the 09:30 fence-side cutoff, and check the official app the evening before
          for any gate-time or schedule changes. Staying on-site at the circuit&apos;s own campsite skips the worst
          of the arrival crush entirely — a genuine advantage on race morning specifically. Full zone-by-zone
          camping detail is in the{" "}
          <a href={`/event-pack/${eventSlug}/hotels`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Hotels guide
          </a>
          .
        </p>
      </div>
    </SpokeShell>
  );
}
