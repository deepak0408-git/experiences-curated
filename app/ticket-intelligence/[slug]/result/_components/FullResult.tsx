import Link from "next/link";
import Image from "next/image";
import type { ScoreResult, ScoredSeat, Seat } from "../../_lib/types";
import RetakeLink from "./RetakeLink";
import ZoomableImage from "../../../../event-pack/[slug]/_hub-and-spoke/_components/ZoomableImage";

// Real circuit map images, reused from each event's own MapSpoke.tsx
// (already uploaded to R2, already the map shown in the event pack) — never
// re-upload or duplicate an asset that exists. Keyed by event slug; a new
// pilot event needs its own entry here once Ticket Intelligence launches
// for it. Brazilian GP's map shows every grandstand letter plus Heineken
// Village and Orange Tree Club marked (see
// app/event-pack/[slug]/_hub-and-spoke/spokes/brazilian-grand-prix/MapSpoke.tsx).
//
// aspectClassName is copied from each event's own MapSpoke.tsx image box —
// using the map's real aspect ratio (rather than one shared box) plus
// ZoomableImage's object-cover fills the frame edge-to-edge with no
// letterboxing, and gives fans the same click-to-zoom lightbox already used
// on the event pack's own Map spoke. Fixed 27 Sep 2026 — this previously
// rendered every event's map inside one fixed aspect-[2080/1170] box with
// object-contain, which squeezed/letterboxed any map whose real ratio
// didn't match (most of them).
// credit is optional — only set where the event's own MapSpoke.tsx has a
// sourced credit line already; never fabricated here for an event whose
// MapSpoke carries no credit (Brazilian GP, US GP, Singapore GP currently
// have none in their own spoke, so none is shown here either).
const CIRCUIT_MAP_BY_EVENT: Record<
  string,
  {
    url: string;
    alt: string;
    aspectClassName: string;
    credit?: string;
    lightFrame?: boolean;
    // See ZoomableImage's own comment — opt-in for a map whose real
    // dimensions are tall/near-square enough that the default w-full h-auto
    // lightbox sizing overflows the viewport and forces a scroll.
    fitByHeight?: boolean;
  }
> = {
  "brazilian-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/brazilian-grand-prix-map.png",
    alt: "Interlagos circuit layout with grandstand zones, Heineken Village, and Orange Tree Club marked",
    aspectClassName: "aspect-[2080/1170]",
  },
  "united-states-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/united-states-grand-prix-venue-map.png",
    alt: "Circuit of the Americas layout with grandstand zones, General Admission areas, and hospitality locations marked",
    aspectClassName: "aspect-[2000/1307]",
  },
  "singapore-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/singapore-grand-prix-circuit-layout.jpg",
    alt: "Marina Bay Street Circuit's 2023-onward track layout with Turn 1, Stamford, and Padang grandstands and the Zone 4 Walkabout marked",
    aspectClassName: "aspect-[1920/1080]",
  },
  "mexico-city-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/mexico-city-grand-prix-venue-map.png",
    alt: "Autódromo Hermanos Rodríguez circuit layout with grandstand zones marked",
    aspectClassName: "aspect-[3840/2548]",
    credit: "Wikimedia Commons, WL2392, CC BY 4.0.",
    // Source image is black line art on a near-transparent background —
    // nearly invisible against the default dark ZoomableImage frame.
    // Founder-flagged 28 Sep 2026.
    lightFrame: true,
  },
  "las-vegas-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/las-vegas-grand-prix-circuit-layout.jpg",
    alt: "Las Vegas Strip Circuit 2023 track layout showing all 17 turns and the East Harmon, West Harmon, Koval, Flamingo, and T-Mobile zones",
    aspectClassName: "aspect-[1920/1080]",
    credit: "Hazim Fikri A., CC BY-SA 4.0, via Wikimedia Commons.",
  },
  // Slug renamed from "miami-grand-prix-2027" to the evergreen
  // "miami-grand-prix" (seasonYear: 2027) 28 Sep 2026 — the dated slug was
  // a mistake, per sportingEvents.seasonYear's own schema comment (new
  // events should use the evergreen pattern, year tracked separately, not
  // baked into the slug). Caught by the founder before any other code
  // referenced the old slug.
  "miami-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/miami-grand-prix-2027-map.jpg",
    alt: "Miami International Autodrome layout showing all 19 turns around Hard Rock Stadium",
    // Source image re-cropped 28 Sep 2026 to its real content bounds
    // (3740x1487) — the original 3840x1638 file had baked-in white margin
    // that didn't match the original aspectClassName, causing
    // ZoomableImage's object-cover to crop into the circuit itself.
    aspectClassName: "aspect-[3740/1487]",
    credit: "Dh16dh, CC BY 4.0.",
    // Black line art on a near-white/transparent background — same
    // near-invisible-against-dark-frame issue as Mexico City's map above.
    lightFrame: true,
  },
  "qatar-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/qatar-grand-prix-circuit-map.png",
    alt: "Lusail International Circuit layout with every grandstand and hospitality unit marked",
    aspectClassName: "aspect-[2050/1260]",
    credit: "lcsc.qa.",
  },
  "abu-dhabi-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/abu-dhabi-grand-prix-grandstand-map.jpg",
    alt: "Yas Marina Circuit map showing Main, West, West Straight, North, North Straight, Marina, South grandstands, and the Abu Dhabi Hill general admission zone positioned around the track",
    aspectClassName: "aspect-[2400/1325]",
  },
  "australian-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/australian-grand-prix-circuit-map.jpg",
    alt: "Albert Park Grand Prix Circuit layout",
    aspectClassName: "aspect-[2999/2121]",
    credit: "ausstadiums.com.",
  },
  "italian-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/italian-grand-prix-circuit-map.png",
    alt: "Autodromo Nazionale di Monza circuit layout",
    aspectClassName: "aspect-[3840/2156]",
    credit: "Anthony Alessio Tralongo, CC BY 4.0.",
  },
  "japanese-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/japanese-grand-prix-circuit-map.jpg",
    alt: "Suzuka Circuit grounds and facilities map",
    aspectClassName: "aspect-[878/551]",
    credit: "suzukacircuit.jp.",
  },
  "chinese-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/chinese-grand-prix-circuit-map.jpg",
    alt: "Shanghai International Circuit layout, tracing the 'shang' (上) character shape with Turns 13-14's long straight and hairpin marked",
    aspectClassName: "aspect-[3840/2433]",
    credit: "Will Pittenger, CC BY 3.0.",
  },
  "canadian-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/canadian-grand-prix-circuit-map.jpg",
    alt: "Circuit Gilles Villeneuve layout on Île Notre-Dame, showing the Senna Curve, the Hairpin, Casino Straight, and the Wall of Champions",
    aspectClassName: "aspect-[3840/2880]",
    credit: "Will Pittenger, CC BY 3.0.",
  },
  "monaco-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/monaco-grand-prix-circuit-map.jpg",
    alt: "Official 2027 Circuit de Monaco map showing grandstands A, B, K/K1-K6, L, N, O, P, T/T1-T3, V, X-PMR, Z, and Secteur Rocher around the street circuit",
    // Corrected 30 Sep 2026 — real dimensions are 2560x2173 (ratio 1.178),
    // not 2560x2400 as originally set (a stale read from before the map
    // file was re-uploaded).
    aspectClassName: "aspect-[2560/2173]",
    credit: "acm.mc (Automobile Club de Monaco).",
    // Near-square map overflows the lightbox viewport height and forces a
    // scroll under the default w-full sizing — see ZoomableImage's own
    // comment. Founder-flagged 30 Sep 2026, fixed scoped to this event only.
    fitByHeight: true,
  },
  "british-grand-prix": {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/british-grand-prix-circuit-map.png",
    alt: "Silverstone Circuit layout showing Abbey, Farm, Arena, Copse, Maggotts, Becketts, Chapel, Hangar Straight, Stowe, Vale, Club, Woodcote, Luffield, and Brooklands",
    aspectClassName: "aspect-[3840/2461]",
    credit: "Anthony Alessio Tralongo, CC BY 4.0.",
    // White-background line art — nearly invisible against the default dark
    // ZoomableImage frame, same issue as Mexico City/Miami's maps above.
    // Founder-flagged 30 Sep 2026.
    lightFrame: true,
  },
};

// "Where to actually buy your ticket" — per-event reseller frame, reused
// verbatim from each event's own TicketsSpoke.tsx (per the mandatory F1
// verified-reseller frame, feedback_f1_tickets_reseller_verification
// memory). Bug found live 27 Sep 2026: this block was hardcoded to
// Brazilian GP's copy/links with no per-event branching, so US GP's result
// page showed "Official São Paulo GP tickets" / "P1 Travel — São Paulo GP".
// Add a new entry here whenever Ticket Intelligence launches for a new
// event — copy straight from that event's TicketsSpoke.tsx "Where to
// actually buy your ticket" block, never write new reseller copy here.
const RESELLER_LINKS_BY_EVENT: Record<
  string,
  { officialLabel: string; officialUrl: string; p1Label: string; p1Url: string; soldOutNote: string }
> = {
  "brazilian-grand-prix": {
    officialLabel: "Official São Paulo GP tickets →",
    officialUrl: "https://tickets.formula1.com/en/f1-3325-brazil",
    p1Label: "P1 Travel — São Paulo GP →",
    p1Url: "https://www.p1travel.com/en/series/formula-1-2026?organizers=grand-prix-brasil",
    soldOutNote: "several stands, including Turn 1's Grandstand M, have sold out months ahead of the 2026 race",
  },
  "united-states-grand-prix": {
    officialLabel: "Official US GP tickets →",
    officialUrl: "https://tickets.formula1.com/en/f1-3320-united-states",
    p1Label: "P1 Travel — US GP →",
    p1Url: "https://www.p1travel.com/en-GB/series/formula-1-2026?organizers=grand-prix-usa",
    soldOutNote: "demand runs high on the most popular grandstands well ahead of race weekend",
  },
  "singapore-grand-prix": {
    officialLabel: "Official Singapore GP tickets →",
    officialUrl: "https://tickets.formula1.com/en/f1-3301-singapore",
    p1Label: "P1 Travel — Singapore GP →",
    p1Url: "https://www.p1travel.com/en-GB/series/formula-1-2026?organizers=grand-prix-singapore",
    soldOutNote: "most 3-day grandstands and Sunday-inclusive tickets have historically sold out well before race week",
  },
  "mexico-city-grand-prix": {
    officialLabel: "Official Mexico City GP tickets →",
    officialUrl: "https://tickets.formula1.com/en/f1-4861-mexico",
    p1Label: "P1 Travel — Mexico City GP →",
    p1Url: "https://www.p1travel.com/en/organizer/grand-prix-mexico",
    soldOutNote: "this race has genuinely sold out within a single day in recent seasons",
  },
  "las-vegas-grand-prix": {
    officialLabel: "Official Las Vegas GP tickets →",
    officialUrl: "https://www.f1lasvegasgp.com/tickets/",
    p1Label: "P1 Travel — Las Vegas GP →",
    p1Url: "https://www.p1travel.com/en-GB/series/formula-1-2026?organizers=grand-prix-las-vegas",
    soldOutNote: "Main Grandstand has historically been the first stand to sell out given its start/finish and pit-lane view",
  },
  // No TicketsSpoke.tsx exists yet for this event (no hub-and-spoke content
  // built as of 28 Sep 2026) — officialUrl/soldOutNote below are placeholder
  // copy, NOT copied from a curator-reviewed spoke per this map's own rule.
  // Replace both once a real Tickets spoke is built for Miami GP 2027.
  // Slug renamed from "miami-grand-prix-2027" to evergreen
  // "miami-grand-prix" 28 Sep 2026 — see CIRCUIT_MAP_BY_EVENT's matching
  // comment above.
  "miami-grand-prix": {
    officialLabel: "Official Miami GP tickets →",
    officialUrl: "https://f1miamigp.com/tickets",
    p1Label: "P1 Travel — Miami GP →",
    p1Url: "https://www.p1travel.com/en-GB/motorsports/formula-1/miami-gp-2027-fri-sat-sun",
    soldOutNote: "tickets went on sale September 2026 — check current availability before booking",
  },
  "qatar-grand-prix": {
    officialLabel: "Official Qatar GP tickets →",
    officialUrl: "https://tickets.formula1.com/en/f1-56257-qatar",
    p1Label: "P1 Travel — Qatar GP →",
    p1Url: "https://www.p1travel.com/en/series/formula-1-2026?organizers=grand-prix-qatar",
    soldOutNote: "General Admission (Lusail Hill) and the entire Paddock Club allocation both sold out on the official platform ahead of the 2026 race",
  },
  "australian-grand-prix": {
    officialLabel: "Official Australian GP tickets →",
    officialUrl: "https://www.grandprix.com.au/en/tickets",
    p1Label: "P1 Travel — Formula 1 →",
    p1Url: "https://www.p1travel.com/en-GB/motorsports/formula-1",
    soldOutNote: "the 2026 race drew a record 483,934 spectators, and Piastri Grandstand in particular has a real chance of selling out earliest given the home-crowd connection",
  },
  "abu-dhabi-grand-prix": {
    officialLabel: "Official Abu Dhabi GP tickets →",
    officialUrl: "https://tickets.formula1.com/en/f1-3312-abu-dhabi",
    p1Label: "P1 Travel — Abu Dhabi GP →",
    p1Url: "https://www.p1travel.com/en-GB/series/formula-1-2026?organizers=grand-prix-abu-dhabi",
    soldOutNote: "this is the calendar's highest-demand weekend as the season finale, and the F1 Experiences Lounge at Yas Premium Suites is already sold out",
  },
  "italian-grand-prix": {
    officialLabel: "Official Monza tickets →",
    officialUrl: "https://www.monzanet.it/en/tickets/",
    p1Label: "P1 Travel — Italian GP →",
    p1Url: "https://www.p1travel.com/en/series/formula-1-2027?organizers=grand-prix-italy",
    soldOutNote: "this is Ferrari's home race, and several stands have historically sold out well ahead of race weekend given the Tifosi turnout — Grandstand 1 and Grandstand 5 both have a track record of selling through early",
  },
  "japanese-grand-prix": {
    officialLabel: "Official Japanese GP tickets →",
    officialUrl: "https://ticketing.formula1.com/japan/",
    p1Label: "P1 Travel — Japanese GP →",
    p1Url: "https://www.p1travel.com/en/organizer/grand-prix-japan",
    soldOutNote: "this is Suzuka's first-ever Sprint weekend, and a genuinely new race format tends to draw stronger-than-usual early demand — premium grandstands and hospitality have historically sold out well before race week once sales open",
  },
  // Chinese GP has no verified third-party reseller in TicketsSpoke.tsx as
  // of 27 Sep 2026 — every 2027 ticket type there is still a pre-sale
  // waitlist on the two official channels only. P1 Travel URL supplied
  // directly by the founder (27 Sep 2026) and verified live via WebFetch
  // before wiring in: real listings exist (one bookable F1 Experiences
  // package + two pre-registration-only packages), so this is a genuine
  // reseller entry, not a placeholder — added here specifically to prevent
  // the silent Brazilian GP fallback this map has without an entry (the
  // exact bug class caught live on US GP).
  "chinese-grand-prix": {
    officialLabel: "Official Chinese GP ticket waitlist →",
    officialUrl: "https://ticketing.formula1.com/china/",
    p1Label: "P1 Travel — Chinese GP →",
    p1Url: "https://www.p1travel.com/en-GB/series/formula-1-2027?organizers=grand-prix-china",
    soldOutNote: "most 2027 ticket types are still pre-sale waitlist only as of this writing — register on the official channel for priority access ahead of general on-sale",
  },
  // No TicketsSpoke.tsx exists yet for this event (no hub-and-spoke content
  // built as of 28 Sep 2026, packStatus: planned) — same situation as
  // Miami GP above. officialUrl is the real ticketing.formula1.com/canada
  // URL (verified waitlist-only, confirmed 28 Sep 2026 — "full details on
  // available packages will be announced soon"). P1 Travel URL confirmed
  // by the founder directly (resolves to the real Canadian GP 2027, 21 May
  // 2027, Montréal, Circuit Gilles Villeneuve — verified via fetch, 28 Sep
  // 2026). Replace soldOutNote once a real Tickets spoke is built.
  "canadian-grand-prix": {
    officialLabel: "Official Canadian GP ticket waitlist →",
    officialUrl: "https://ticketing.formula1.com/canada",
    p1Label: "P1 Travel — Canadian GP →",
    p1Url: "https://www.p1travel.com/en-GB/motorsports/formula-1/canada-gp-2027-fri-sat-sun",
    soldOutNote: "2027 ticket sales haven't opened yet — register on the official waitlist for priority access ahead of general on-sale",
  },
  // No TicketsSpoke.tsx exists yet for this event (no hub-and-spoke content
  // built as of 30 Sep 2026) — same honest-placeholder situation as
  // Canadian GP above. Official channel confirmed genuinely unpublished for
  // 2027 (ticketing.formula1.com/monaco/, gpticketshop.com/en/f1/monaco-f1-
  // grand-prix/tickets.html, and a freshly-generated 30 Sep 2026
  // gpticketshop.com PDF price list all show no live prices — waitlist/
  // "coming soon" only). P1 Travel URL verified by fetch 30 Sep 2026 —
  // resolves to real Monaco GP 2027, 3-6 June 2027, Monaco, Monaco.
  // Replace soldOutNote and officialLabel/Url once a real Tickets spoke is
  // built for this event.
  "monaco-grand-prix": {
    officialLabel: "Official Monaco GP tickets →",
    officialUrl: "https://ticketing.formula1.com/monaco/",
    p1Label: "P1 Travel — Monaco GP →",
    p1Url: "https://www.p1travel.com/en-GB/series/formula-1-2027?organizers=grand-prix-monaco",
    soldOutNote: "2027 ticket sales haven't opened yet — check the official site for priority access ahead of general on-sale, and be ready early given this is F1's most in-demand race",
  },
  // No TicketsSpoke.tsx exists yet for this event (no hub-and-spoke content
  // built as of 30 Sep 2026) — same honest-placeholder pattern as Canadian
  // GP/Monaco above, EXCEPT tickets are genuinely on sale with real,
  // directly-sourced 3-day prices (unlike those two waitlist-only events —
  // see seed-british-grand-prix-circuit-seating.mjs). officialUrl matches
  // sportingEvents.ticketingUrl for this event. P1 Travel URL supplied
  // directly by the founder, 30 Sep 2026. Replace soldOutNote/officialLabel
  // once a real Tickets spoke is built.
  "british-grand-prix": {
    officialLabel: "Official British GP tickets →",
    officialUrl: "https://www.silverstone.co.uk/events/formula-1-british-grand-prix/tickets",
    p1Label: "P1 Travel — British GP →",
    p1Url: "https://www.p1travel.com/en-GB/motorsports/formula-1/british-gp-2027-fri-sat-sun",
    soldOutNote: "this is F1's highest-attendance weekend on the calendar, and the George Russell Grandstand has already sold out for 2027",
  },
};

const SEAT_TYPE_LABEL: Record<string, string> = {
  grandstand: "Grandstand",
  festival_lawn: "Festival / lawn zone",
  hospitality: "Hospitality suite",
};

const TIER_LABEL: Record<string, string> = {
  tier1: "Budget-friendly",
  tier2: "Mid-range",
  tier3: "Premium",
  tier4: "Top-tier hospitality",
};

// 1-5 star relative-cost indicator, replacing a displayed $ figure
// (executive decision, 25 Sep 2026 — see incident below). Base mapping is
// tier RANK (tier1-4 → 1-4 stars, 1:1 — same ordinal axis the scoring
// rubric already uses for Q7 budget philosophy, never the seat's actual
// costLow/costHigh), with ONE explicit override: Paddock Club → 5 stars,
// since its real price (one unverified reseller figure: $14,550/person) is
// a genuine outlier even among tier4's other hospitality seats, not just
// "one tier higher." Founder call, 25 Sep 2026.
//
// Why stars at all: circuit_seating_profile links Orange Tree Club,
// Paddock Club, Pit Stop Club, and Grand Prix Club to a SHARED tier4 price
// band ($1,955-2,361) for ordinal scoring purposes only — their real
// individual prices are either unverified (Orange Tree/Paddock Club — sold
// out, no live figure found) or genuinely higher than that shared band
// (Grand Prix Club is really $3,743). Displaying that shared number as if
// it were each seat's own price is factually wrong for 3 of those 4 seats
// — caught live 25 Sep 2026 when Grand Prix Club showed Orange Tree Club's
// price range. Stars communicate the same "cheap → expensive" signal
// without asserting a specific dollar figure we can't verify.
// NOTE — this map is keyed by seat NAME only, globally across every event,
// not per-event. Mexico City GP (added 27 Sep 2026) also has its own seat
// literally named "Paddock Club" — it will inherit Brazilian GP's 5-star
// override below even though Mexico's real price outlier is House 44, not
// Paddock Club. Known, flagged gap (founder decision 27 Sep 2026: fix the
// underlying (eventSlug, seatName) keying later, not as part of this
// build) — House 44 is added correctly below since its name doesn't
// collide with anything.
const TIER_STARS: Record<string, number> = { tier1: 1, tier2: 2, tier3: 3, tier4: 4 };
// Italian GP (Monza) additions, 27 Sep 2026 — founder-directed star bump,
// one level above each seat's tier default, for two groups:
// 1. Grandstand 1 (Centrale) and Grandstand 5 (Piscina) sit outside every
//    planner_ticket_tier_cost band (real prices US$2,103 / official-site-only)
//    but are ordinally linked to tier2 (nearest real grandstand band, 2
//    stars by default) for scoring — overridden to 3 stars here since
//    they're genuinely priced above ordinary tier2 grandstands.
// 2. All 6 of Monza's tier3 hospitality lounges (Champions Club, Race Club,
//    Dolce Vita/Garden/Ultimate Lounge, Green House) bumped from tier3's
//    default 3 stars to 4, and all 4 tier4 hospitality products (Paddock
//    Club, House 44, Schumacher Lounge, Ferrari GP Club) bumped from
//    tier4's default 4 stars to 5 — founder direction, 27 Sep 2026.
//    Paddock Club also separately inherits the PRESTIGE_SEAT_NAMES
//    tiebreaker in scoreSeats.ts (name matches that global set exactly);
//    House 44 here is named just "House 44" (not "House 44 at F1 Paddock
//    Club"), deliberately NOT added to that tiebreaker per founder decision
//    since its price isn't confirmed higher than Paddock Club's — it still
//    gets the same 5-star display via this map.
const STAR_OVERRIDE_BY_SEAT_NAME: Record<string, number> = {
  "Paddock Club": 5,
  "House 44 at F1 Paddock Club": 5,
  "Grandstand 1 — Centrale": 3,
  "Grandstand 5 — Piscina": 3,
  "Champions Club": 4,
  "Race Club": 4,
  "Dolce Vita Lounge": 4,
  "Garden Lounge": 4,
  "Ultimate Lounge": 4,
  "Green House": 4,
  "House 44": 5,
  "Schumacher Lounge": 5,
  "Ferrari GP Club": 5,
  // Chinese GP, 27 Sep 2026 — F1 Paddock Club priced at US$17,145/person
  // (seed script's own sourced 2026-proxy figure), by far the most
  // expensive seat at this circuit and a genuine outlier over the other 3
  // tier4 hospitality products (Gordon Ramsay at the F1 Paddock, T16 Club,
  // Grandstand Club — all unpriced/unconfirmed). Note this seat's real name
  // here is "F1 Paddock Club", not "Paddock Club" — doesn't collide with
  // the global PRESTIGE_SEAT_NAMES/other events' star-override key above.
  "F1 Paddock Club": 5,
};

function CostStars({ seatName, tier }: { seatName: string; tier: Seat["tier"] }) {
  if (!tier) return null;
  const filled = STAR_OVERRIDE_BY_SEAT_NAME[seatName] ?? TIER_STARS[tier] ?? 0;
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-black tracking-widest uppercase text-[#6A6A6A]">Relative cost</span>
      <span aria-label={`${filled} out of 5`} className="text-sm tracking-wider">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < filled ? "text-[#AAFF00]" : "text-[#2A2A2A]"}>
            ★
          </span>
        ))}
      </span>
    </div>
  );
}

// Seating description line, matching the real Tickets spoke's phrasing
// style ("Covered, numbered reserved seating" / "Uncovered, bleacher-style")
// — derived from covered + reservedSeating + seatType rather than a
// separate free-text field, since these three columns already capture it.
function seatingLine(seat: Seat): string {
  const parts: string[] = [];
  if (seat.seatType === "festival_lawn") {
    parts.push("Standing / lawn zone");
  } else if (seat.seatType === "hospitality") {
    parts.push(seat.covered === true ? "Covered" : "Suite");
    parts.push("table/lounge seating");
  } else {
    parts.push(seat.covered === true ? "Covered" : seat.covered === false ? "Uncovered" : "Cover unconfirmed");
    if (seat.reservedSeating === true) parts.push("numbered reserved seating");
    else if (seat.reservedSeating === false) parts.push("unreserved, first-come-first-served");
  }
  return parts.join(", ");
}

function weatherLine(seat: Seat): string {
  if (seat.covered === true) return "Covered";
  if (seat.covered === false) return "No cover";
  return "Unconfirmed";
}

// Per-experience crop override for the SeatCard banner image, keyed by the
// linked experience's slug — same object-[center_Y%] pattern already used
// on experience/[slug]/page.tsx and destination/[slug]/page.tsx. Needed
// because the banner's fixed 16:9 box crops each hero image differently
// than the experience page's own hero does, and a source photo's real
// subject (e.g. a grandstand structure) isn't always centred in frame.
// Default is plain "object-center" when an experience has no entry here.
const SEAT_IMAGE_OBJECT_POSITION_BY_EXPERIENCE_SLUG: Record<string, string> = {
  "grandstand-22-parabolica-corner-mqzgq262": "object-[center_80%]",
  "las-vegas-gp-main-grandstand-mte72szf": "object-[center_65%]",
  "west-grandstand-yas-marina-mtff6r3xhgb8": "object-[center_100%]",
  "qatar-gp-north-grandstand-mtymo0an": "object-[center_70%]",
  "piastri-grandstand-albert-park-mu9bykxi": "object-[center_20%]",
  "us-gp-general-admission-mtnb3iak": "object-[center_85%]",
  "chinese-gp-general-admission-mud1mn7y": "object-[center_85%]",
  "singapore-gp-zone4-walkabout-msai03x3": "object-[center_80%]",
};

function SeatCard({
  scored,
  headline,
  fallbackExperienceSlug,
}: {
  scored: ScoredSeat;
  headline: string;
  fallbackExperienceSlug: string | null;
}) {
  const { seat, reasons } = scored;
  // Prefer this seat's own dedicated write-up; fall back to the event's
  // general Ticket Guide/Where to Sit experience when the seat has none of
  // its own. No link at all when neither exists (e.g. US GP as of 27 Sep
  // 2026, which has no ticket-guide experience yet) — never a broken or
  // misleading fallback link.
  const experienceSlug = seat.linkedExperienceSlug ?? fallbackExperienceSlug;
  // Banner image only for a seat's own dedicated write-up (never the
  // generic fallbackExperienceSlug) and never for hospitality — hospitality
  // still gets its full card + link, just no image. Added 7 Oct 2026.
  const showImage = Boolean(seat.linkedExperienceSlug) && seat.seatType !== "hospitality" && Boolean(seat.linkedExperienceImageUrl);
  const imageObjectPosition = (seat.linkedExperienceSlug && SEAT_IMAGE_OBJECT_POSITION_BY_EXPERIENCE_SLUG[seat.linkedExperienceSlug]) || "object-center";
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden mb-6">
      {showImage && (
        <div className="relative w-full aspect-[16/9] bg-[#1A1A1A]">
          <Image
            src={seat.linkedExperienceImageUrl as string}
            alt={seat.seatName}
            fill
            className={`object-cover ${imageObjectPosition}`}
            sizes="(max-width: 1024px) 100vw, 640px"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#141414] to-transparent" />
        </div>
      )}
      <div className="p-6">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">{headline}</p>
        <p className="text-2xl font-black text-white mb-1">{seat.seatName}</p>
        {seat.tier && <p className="text-sm text-[#A3A3A3] mb-4">{TIER_LABEL[seat.tier]} option at this circuit.</p>}

        {/* Same structure as the Tickets spoke's "Side by side" comparison —
            What it shows / Seating / Weather cover — so the paid reveal
            reads at the same depth as the pack's own ticket comparison. */}
        <div className="rounded-sm border border-[#2A2A2A] bg-[#1A1A1A] divide-y divide-[#2A2A2A] mb-4">
          <div className="p-4">
            <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">What it shows</p>
            <p className="text-sm text-[#A3A3A3] leading-6">{seat.zoneLabel}</p>
          </div>
          <div className="p-4">
            <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">Seating</p>
            <p className="text-sm text-[#A3A3A3] leading-6">{seatingLine(seat)}</p>
          </div>
          <div className="p-4">
            <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">Weather cover</p>
            <p className="text-sm text-[#A3A3A3] leading-6">{weatherLine(seat)}</p>
          </div>
          <div className="p-4">
            <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">Seat type</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              {SEAT_TYPE_LABEL[seat.seatType] ?? seat.seatType}
              {seat.minAge !== null && ` — ${seat.minAge}+ only`}
            </p>
          </div>
        </div>

        <CostStars seatName={seat.seatName} tier={seat.tier} />

        {reasons.length > 0 && (
          <div className="pt-4 border-t border-[#2A2A2A]">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6A6A6A] mb-2">Why this fits you</p>
            <ul className="space-y-1">
              {reasons.map((r, i) => (
                <li key={i} className="text-sm text-[#A3A3A3] flex gap-2">
                  <span className="text-[#AAFF00]">—</span>
                  <span className="capitalize">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {experienceSlug && (
          <Link
            href={`/experience/${experienceSlug}`}
            className="inline-flex items-center gap-1 mt-4 pt-4 border-t border-[#2A2A2A] text-xs font-semibold text-[#AAFF00] hover:text-[#BBFF33] transition-colors"
          >
            {seat.linkedExperienceSlug ? "Read the full write-up" : "See our ticket guide for this circuit"} →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function FullResult({
  eventName,
  eventSlug,
  result,
  fallbackExperienceSlug,
}: {
  eventName: string;
  eventSlug: string;
  result: ScoreResult;
  fallbackExperienceSlug: string | null;
}) {
  const { top, runnerUp, thirdPlace } = result;
  const circuitMap = CIRCUIT_MAP_BY_EVENT[eventSlug];

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
        Here&apos;s the ticket to buy for {eventName}
      </h1>
      {/* RetakeLink generates a fresh ?retake=<timestamp> value on every
          click (see its own comment) — the explicit escape hatch past the
          quiz page's "already purchased → skip straight to result"
          redirect. Re-answering here never asks to pay again, since the
          purchase already exists. */}
      <RetakeLink eventSlug={eventSlug} />

      <SeatCard scored={top} headline="Best match" fallbackExperienceSlug={fallbackExperienceSlug} />
      {runnerUp && (
        <SeatCard scored={runnerUp} headline="Runner-up" fallbackExperienceSlug={fallbackExperienceSlug} />
      )}
      {thirdPlace && (
        <SeatCard scored={thirdPlace} headline="3rd option" fallbackExperienceSlug={fallbackExperienceSlug} />
      )}

      <p className="text-xs text-[#6A6A6A] mb-10">
        Images rendered based on availability and provide an indicative view of the expected experience. Please
        refer to the circuit map for position.
      </p>

      {circuitMap && (
        <div className="mb-10">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Circuit map</p>
          <ZoomableImage
            src={circuitMap.url}
            alt={circuitMap.alt}
            aspectClassName={circuitMap.aspectClassName}
            lightFrame={circuitMap.lightFrame}
            fitByHeight={circuitMap.fitByHeight}
          />
          {circuitMap.credit && <p className="text-xs text-[#6A6A6A] mt-2">Credit: {circuitMap.credit}</p>}
        </div>
      )}

      {/* "Where to actually buy your ticket" — per-event reseller frame,
          see RESELLER_LINKS_BY_EVENT above. This is the immediate next step
          after the match, not a link out to the pack. Falls back to the
          Brazilian GP text if a slug isn't yet in the map, rather than
          rendering nothing — better than silently omitting a mandatory
          section (feedback_f1_tickets_reseller_verification memory), but a
          new event MUST get its own entry before launch, not rely on this
          fallback. */}
      {(() => {
        const reseller = RESELLER_LINKS_BY_EVENT[eventSlug] ?? RESELLER_LINKS_BY_EVENT["brazilian-grand-prix"];
        return (
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mt-10">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">
              Where to actually buy your ticket
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              Buy directly from the official source first, and be ready early — {reseller.soldOutNote}. Every F1
              ticket ultimately traces back to the promoter, and buying direct means no markup and no risk of a
              fraudulent listing.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              If official tickets are sold out, or you want a package with hospitality, hotel, or shuttle bundled
              in, P1 Travel is a genuine authorized F1 ticket partner — named directly on multiple circuits&apos;
              own official reseller lists, rated 4.7 from over 10,000 reviews on Trustpilot, and in business since
              2007.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={reseller.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
              >
                {reseller.officialLabel}
              </a>
              <a
                href={reseller.p1Url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
              >
                {reseller.p1Label}
              </a>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
