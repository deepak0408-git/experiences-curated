import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "map";

// Real circuit map (Images/Hungarian GP 2027 - Hungaroring Circuit Map.jpg,
// uploaded to R2 17 Oct 2026) shows every gate (1-8, 7/A), every grandstand
// (T1, Pit Exit 1, Hungaroring, Hungaroring Platinum, F1 Fan Lounge, Grid 1,
// Grid 2, Grand Prix 1/2, Apex 1/2, Fan, Chicane 1/2/4), the General
// Admission area, and the Premium Parking Area — matches ArrivalSpoke's
// gate-to-grandstand mapping exactly. Also reused by Ticket Intelligence's
// CIRCUIT_MAP_BY_EVENT (app/ticket-intelligence/[slug]/result/_components/
// FullResult.tsx) rather than a second upload, per that file's own rule.
const CIRCUIT_MAP_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/hungarian-grand-prix-circuit-map.jpg";

// History sourced from grandprix.com, gpdestinations.com, and Wikipedia
// (construction timeline, 1986 first race, the spring-forced S-bend
// detour, 2003 straight extension). Facilities sourced from
// hungaroring.hu's official 2026 FAQ (bag limits, cashless payment system)
// and a Hungarian outlet's 2026 reporting (gate hours, food pricing
// estimate). No dedicated "venue inside" experience exists for this event
// (unlike Italian GP's Monza — Inside the Venue), so this spoke renders
// without a SpokeExperienceCard, an honest gap rather than a forced
// assignment.
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
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Hungarian Grand Prix"
      status="public"
      h1="Built in eight months in 1985, behind the Iron Curtain, with a stream nobody expected"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Construction started 1 October 1985 and finished eight months later, faster than any F1 circuit built
        before it. The first race ran 24 March 1986, a non-championship event held in memory of János Drapál, a
        four-time motorcycle Grand Prix winner killed racing the year before. The first Formula 1 Hungarian Grand
        Prix followed that August, won by Nelson Piquet in front of almost 200,000 spectators from across the
        Eastern Bloc, East Germany, and Austria — the first F1 race ever held behind the Iron Curtain.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The underground spring that shaped the lap</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The circuit's original route ran straight where an underground spring turned out to be — builders
          diverted the layout through a series of slow S-bends instead, slowing the lap down from what was
          originally planned. That detour was culverted away in 1989, and the main straight was extended in 2003,
          taking the circuit from 3.975km to its current 4.381km. The 14-turn layout from that 2003 change is still
          the one F1 races today — the grandstand infrastructure around it was completely rebuilt for 2025, but the
          actual turns and their official 2025 names (Piquet, Hamilton, Mogyoród, the Driving Centre chicane,
          Schumacher, Senna, Szisz among them) sit on the same tarmac.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Circuit map</p>
      <div className="relative w-full aspect-[3500/2956] rounded-sm border border-[#2A2A2A] overflow-hidden mb-2 bg-white">
        <Image
          src={CIRCUIT_MAP_URL}
          alt="Hungaroring circuit layout with every gate, grandstand and General Admission area marked"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <p className="text-xs text-[#6A6A6A] mb-2">Map: gpticketshop.hu</p>
      <p className="text-sm text-[#A3A3A3] leading-6 mb-8">
        The main grandstands cluster along the pit straight and Turn 1 on the circuit&apos;s western side, reached
        through Gates 7, 7/A and 8 — Hungaroring and Hungaroring Platinum directly opposite the pits, T1 and Pit
        Exit 1 further up toward the Turn 1 braking zone, and Grid 1, Grid 2, Grand Prix 1 and Grand Prix 2 filling
        in along the same stretch. General Admission runs the opposite way, along the circuit&apos;s eastern and
        southern outer loop from Gate 2 through Gates 3, 4 and 5 — the natural-bowl hillside that gives GA ticket
        holders sightlines across several corners at once, rather than one fixed grandstand view.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Payment — cashless, via a loadable card</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The Hungaroring runs a fully cashless payment system — cash loads onto a Festipay card at the circuit,
            refundable fee-free at the end of the event. Bring a card or be ready to load cash onto one at the
            gate, not loose forint for vendors directly.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food — budget more than you'd expect</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Fan zones run a genuine mix of food and drink vendors, merchandise, and interactive F1 displays, plus a
            dedicated Free-From Food Corner for allergies and intolerances. Budget roughly 10,000-15,000 forint
            (around US$27-40) per person per day for food and drink — on-site prices here aren't cheap despite the
            circuit's reputation for affordable tickets.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Fan zones — two real hubs, not just vendor stalls</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The main Fan Zone sits behind Gates 3-5 near the General Admission hillside — stage entertainment,
            driver appearances, merchandise, and the food vendor cluster. The F1 Fan Lounge, a separate paid
            upgrade near Gate 7/7A, adds a covered deck with a trackside view, its own bar, and a quieter crowd
            than the free zone — worth it if the open-air Fan Zone's scale and noise isn't what you're after.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Toilets — plentiful but furthest from the GA hillside</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Fixed toilet blocks sit behind every grandstand and at each gate, with additional portable units spaced
            along the General Admission hillside itself. The GA areas are the one spot where a toilet run genuinely
            costs you track time — the hillside's spread-out viewing spots mean a longer walk back to a fixed block
            than from any seated grandstand, so scope your nearest portable unit before the session starts rather
            than during a lull.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Bags — 20 litres, no exceptions</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Any bag up to 20 litres is fine, including whatever camera gear you're carrying — glass items, cool
            boxes, and anything over the limit don't get through security at all, and there's no bag storage at the
            gates themselves.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Water — free refills, bring a bottle</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Free drinking water is available throughout the circuit. Bring a refillable bottle rather than relying
            on paid drinks all day, especially with a Hungarian July regularly pushing past 30°C.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Gate hours</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Gates open 7:30am all three days. Closing times run later Friday and Saturday (19:30) than Sunday
            (20:00) — worth knowing if you're planning a long day at the Fan Zone after a practice or qualifying
            session ends early.
          </p>
        </div>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually check before buying</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          If genuine racing action and overtaking matter most, Turn 1 (Piquet) is the one corner on this circuit
          with a real, repeated history of passes sticking — most of the rest of the lap settles into position
          early and stays that way. Load money onto a Festipay card before you're queuing for your first coffee of
          the day, and bring a refillable water bottle, both small decisions that save real time and money across
          three full days on site.
        </p>
      </div>
    </SpokeShell>
  );
}
