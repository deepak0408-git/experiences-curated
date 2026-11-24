import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// rollover-event-into-next-year skill §3 — Mexico City GP content-staleness
// refresh after the 2026->2027 edition rollover. Race dates (29-31 Oct 2027)
// are FIA/F1.com confirmed. Mexico City is NOT on F1's published 2027
// Sprint-venue list (same confirmed list used for Singapore/US GP: Bahrain,
// Australia, Japan, Canada, Monaco, Great Britain, Italy, Brazil, Qatar, Abu
// Dhabi) — same classic weekend format as 2026, so session times/structure
// need no format change, only year-label updates. F1 Experiences' 2027
// Mexico City Paddock Club pages are at waitlist/TBD as of this writing, so
// prices are flagged pending, same pattern as Singapore/US GP. The city's
// 2027 Día de Muertos Grand Parade date has not been announced (typically
// confirmed by CDMX government in summer) — flagged honestly rather than
// guessed.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PRICE_PENDING_NOTE = "2027 pricing/availability had not been released as of this writing — check tickets.formula1.com, mexico.gp, and f1experiences.com directly before booking.";

async function updateExperience(id, label, patch) {
  const [row] = await db.update(experiences).set({ ...patch, lastVerifiedDate: new Date().toISOString().split("T")[0], updatedAt: new Date() }).where(eq(experiences.id, id)).returning({ id: experiences.id, slug: experiences.slug });
  console.log(`✓ ${label}:`, row);
}

// 1. Autódromo Hermanos Rodríguez — Inside the Venue (date-only fix)
await updateExperience("efe32961-8c8d-4a42-878d-c2385d12d822", "Venue overview", {
  practicalInfo: {
    hours: "Circuit grounds open ahead of each day's first on-track session during race weekend (29-31 Oct 2027) — exact 2027 session times not yet published; in 2026, Friday's Practice 1 ran 12:30-13:30, Saturday's Practice 3 ran 11:30-12:30, and Sunday's race started at 14:00.",
    website: "https://www.mexicogp.mx/mapa-del-circuito/",
    costRange: "Entry is via race-weekend ticket (see the Ticket Guide elsewhere in this pack) — no separate venue-only admission",
    bookingMethod: "Access the circuit via any valid race-weekend ticket — general admission, grandstand, or hospitality.",
  },
});

// 2. Foro Sol
await updateExperience("d5a0bdfc-7b0c-4734-9e0b-872e0afac1f7", "Foro Sol", {
  practicalInfo: {
    hours: "Gates open ahead of each day's first session — exact 2027 session times not yet published; in 2026, Friday's Practice 1 ran 12:30-13:30, Saturday's Practice 3 ran 11:30-12:30, and Sunday's race started at 14:00.",
    website: "https://tickets.formula1.com/en/f1-4861-mexico, https://www.mexicogp.mx/mapa-del-circuito",
    costRange: `2026 pricing was US$785–1,270 for the 3-day pass (Grandstands 14 and 15) — a reference point only. ${PRICE_PENDING_NOTE}`,
    bookingMethod: "Buy directly through tickets.formula1.com or the circuit's own site, mexico.gp — grandstand tickets for Foro Sol (14 and 15) are sold as named, numbered seats, and both stands have historically sold out well before race week.",
  },
});

// 3. Mexico City GP Ticket Guide
await updateExperience("91619345-0b7e-4237-b201-416a5a689aee", "Ticket Guide", {
  practicalInfo: {
    hours: "Ticket sales open via the official promoter — announced several months ahead of race week; check mexico.gp or tickets.formula1.com for the confirmed 2027 release date",
    website: "https://tickets.formula1.com/en/f1-4861-mexico, https://www.mexicogp.mx/boletos-generales",
    costRange: `2026 pricing was: General admission ~US$231 (3-day) · Grandstand 15/14/5A US$785–1,270 (3-day) · Grandstand 10/11/Main US$1,640–2,166 (3-day) · Paddock Club from US$8,502, House 44 from US$16,338 (3-day) — reference points only. ${PRICE_PENDING_NOTE}`,
    bookingMethod: "Buy directly at tickets.formula1.com or mexico.gp the moment 2027 sales open — this race has historically sold out within days. Resale platforms (StubHub, Viagogo) carry inventory afterward at a markup, general admission typically closest to face value.",
  },
  bodyContent: `Mexico City sells out faster than almost any race on the F1 calendar. In 2026, when tickets went on general sale through the official promoter, they were gone within days. If you're planning this trip, the ticket decision isn't really "which tier" — it's "buy the moment tickets open, then work out the tier."

There are four real tiers to understand. General admission (branded Grada 2A) is the cheapest way in — a 3-day pass runs around $231 USD in 2026 pricing, with no assigned seat, standing or lawn access only, and no guarantee of a clear sightline once the popular spots fill up on race morning. Numbered grandstand seats are the mid-tier, and pricing varies enormously by zone: the lower-tier stands (Grandstands 15, 14, and 5A) ran from roughly $785 to $1,270 for a 3-day pass in 2026, while the premium stands — Grandstand 10, Grandstand 11, and Main Grandstand — ran from roughly $1,640 to $2,166. Above that sit two hospitality products: the Champions Club, F1 Experiences' hospitality tier opposite the pits, and the official F1 Paddock Club and House 44 at F1 Paddock Club™, the top tier, from $8,502 for 3 days with paddock access, pit lane walks, and a suite view over the circuit — House 44 itself ran from $16,338 for the same 3 days in 2026. 2027 pricing had not been released as of this writing — check tickets.formula1.com and f1experiences.com directly.

All tickets here are sold as 3-day passes covering practice, qualifying, and the race — Mexico City doesn't typically offer single-day tickets the way some circuits do, so budget for the full weekend rather than trying to pick just race day.

Because this race consistently sells out fast after release, the practical strategy is straightforward: know the release date in advance (announced via the official promoter and Formula 1's own channels, several months ahead), have a payment method ready, and be online the moment sales open. If you miss the official window, resale platforms carry inventory afterward, but at a real markup — general admission resale has historically run close to the official price but grandstand and box seats can run several times the original figure, and there's no guarantee the listing is genuine until it's in your hands.

One factor worth planning around: race weekend (29-31 October 2027) falls in the same late-October/early-November window as Mexico City's Día de Muertos parade weekend most years, one of the biggest tourism draws in the city's calendar independent of F1. The parade's exact 2027 date hadn't been announced as of this writing (typically confirmed by the city government in summer) — but hotel and flight demand stacks on top of race-weekend demand either way, so book accommodation as early as you buy tickets, not after.`,
});

// 4. Día de Muertos
await updateExperience("28d326df-f515-41aa-bc9c-1fb2fceb7d77", "Día de Muertos", {
  practicalInfo: {
    hours: "Grand Parade: traditionally the Saturday nearest Nov 2 — the city government hadn't announced the confirmed 2027 date as of this writing; historically runs roughly 12pm-4pm",
    website: "https://www.mexicocity.cdmx.gob.mx/e/dia-de-muertos-en-la-ciudad-de-mexico/",
    costRange: "Free — the parade and public altar viewing require no ticket or entry fee",
    bookingMethod: "No booking needed — this is a free, public city-wide celebration. Check the official CDMX government tourism site in the months before race week for the confirmed 2027 route and schedule.",
  },
  bodyContent: `Race weekend regularly lands close to Día de Muertos, and in many years this isn't a minor scheduling coincidence — it can mean arriving for one of the biggest, most emotionally significant weekends on Mexico City's entire annual calendar, independent of the Grand Prix. Understanding what's actually happening around you changes the whole trip. Check the exact 2027 parade date once the city government confirms it (typically announced in summer) against the 29-31 October race weekend to see how closely they overlap this edition.

The city's Grand Parade traditionally runs on the Saturday nearest November 2nd. The exact route and time get published closer to the date by the city government, but the parade has followed a consistent path in recent years: starting at Puerta de los Leones in Chapultepec, moving along Paseo de la Reforma, then Avenida Juárez, then 5 de Mayo, finishing at the Zócalo — roughly 6km of processional route, running from around midday to mid-afternoon. It's free, open to anyone, and the best viewing spots (Glorieta de la Palma, the Angel of Independence roundabout, and the stretch between the Angel and Alameda Central) fill up early — arriving by mid-morning is the realistic way to claim a good spot rather than watching over a crowd of heads.

Monumental altars, or ofrendas, appear across the city during this period — a huge installation typically goes up in the Zócalo itself, alongside smaller neighborhood altars throughout Roma, Condesa, and other areas. These aren't decorations in the way a Halloween display is; each altar is built to welcome the spirits of specific departed loved ones home for the night, with marigolds, candles, photographs, and the deceased's favorite foods laid out as an actual offering, not a symbolic gesture.

The etiquette here matters more than it does at most festivals, because this is a genuine act of mourning and remembrance layered underneath the public celebration. Don't touch anything on a private altar without permission, and never treat a cemetery vigil as a photo opportunity — families spend the night at gravesides sharing stories and honoring their dead, and that's a deeply personal moment to observe respectfully from a distance, not to approach for close-up photos. If you do want a photo of someone in elaborate Catrina-style face paint in a public setting, ask first — a simple "¿Puedo tomar una foto?" is almost always welcomed. Wearing Catrina makeup yourself as a visitor is generally seen as a respectful way to participate, provided it's done with real understanding of what the festival means rather than as a costume. What isn't welcome: treating this as "Mexican Halloween," which misses the entire point, or showing up in a costume built for a different holiday's aesthetic rather than this one's actual meaning.`,
});

// 5. The Fan Zone & Race Week Culture
await updateExperience("26f329b5-7724-44b2-9ecd-7e2ec9fc27c2", "Fan Zone", {
  practicalInfo: {
    hours: "Fan zones typically open alongside circuit gates each day of the race weekend and run through the day's sessions — exact 2027 session times not yet published.",
    website: "https://www.mexicogp.mx/mapa-del-circuito",
    costRange: "Free with any race ticket (grandstand, general admission, or hospitality) — no separate fan zone ticket required",
    bookingMethod: "No booking needed — fan zone access is included with any valid race-weekend ticket. Check mexico.gp or the official F1 app closer to race week for the confirmed 2027 schedule of driver appearances and activations.",
  },
  bodyContent: `Every grandstand ticket and general admission pass at Mexico City includes access to the Fan Zone, and it's worth building real time into your schedule for it rather than treating it as something to pass through on the way to your seat. Each zone around the circuit runs its own version, so what you find depends partly on which gate you're entering through — but the constants across the site are driver and team principal appearances at scheduled times (posted on-site signage tells you where and when), F1 simulators, a Pit Stop Challenge where fans can attempt a mock tire change against the clock, and team merchandise booths for every constructor on the grid.

Mexico City's fan zone leans harder into local culture than most other stops on the calendar, and this is one of the real differentiators of the whole weekend. Expect mariachi bands and folk dancers performing through the day, and in years when race weekend falls close to Día de Muertos (see the dedicated experience elsewhere in this pack), displays and imagery tied to the holiday show up throughout the fan areas — skull face paint, marigold styling, altar-inspired art installations. It reads less like a corporate activation and more like the city's own biggest celebration bleeding into the race weekend, when the calendar lines up that way.

Food inside the fan zone spans the full range Mexico City is known for — quick street-food-style stalls alongside more considered options, plus bars serving throughout the day. This race genuinely doesn't run a trackside concert series the way Miami or Las Vegas do. What does happen reliably in past editions: driver appearances on a stage in the Green Zone behind the main grandstands (Grada 1 and 2) on Friday and Saturday, and a DJ set on the podium in the Foro Sol area after Sunday's race — that specific DJ set has required a Foro Sol-zone ticket to access, not just any fan zone entry. Exact performer names aren't typically announced until a few days before race weekend, so check the official schedule as it approaches rather than expecting a lineup this far out.`,
});

// 6. F1 Paddock Club & Champions Club
await updateExperience("41cf34c3-c937-4e8b-8ab9-029224f3f6d1", "Paddock Club", {
  practicalInfo: {
    hours: "Both tiers run across all 3 days of race weekend (29-31 Oct 2027), doors open ahead of each day's first session — exact 2027 session times not yet published.",
    website: "https://f1experiences.com/2027-mexico-city-grand-prix/paddock-club, https://ticketing.formula1.com/hospitality-tickets/en/mexico/hospitality-f1-ciudad-de-mexico-waitlist",
    costRange: `2026 pricing was: F1 Paddock Club from US$8,502 for 3 days · House 44 at F1 Paddock Club™ from US$16,338 for 3 days — reference points only. ${PRICE_PENDING_NOTE} Champions Club is a separate F1 Experiences product sold via f1experiences.com.`,
    howToBook: "If you want the Paddock Club specifically, call F1 Experiences directly at +1 718-682-7493 once 2027 sales open rather than relying only on the online booking flow — Mexico City's hospitality inventory has historically sold out before race week, and a phone call gets you a real person who can tell you current availability by suite section, something the website's standard checkout won't show you. Ask specifically about Champions Club as a fallback in the same call if Paddock Club is already tight — it's a lower price point with real overlap in what you get (Grid Walk, paddock tour) and is worth comparing live with an agent rather than assuming Paddock Club is your only option once you're already on the phone.",
    bookingMethod: "Book through F1 Experiences, the sport's officially licensed hospitality partner, via f1experiences.com or Formula1.com's own hospitality pages, once 2027 sales open.",
  },
  bodyContent: `The F1 Paddock Club sits directly above the team garages on the main straight, a covered, climate-controlled suite with an outdoor balcony looking straight down onto the starting grid and pit lane. This is the top hospitality tier at every race on the calendar, and Mexico City's version includes everything the format is known for: a premium open bar running spirits, champagne, wine, and beer all weekend, food stations rather than a single set menu, a one-time guided tour of the actual paddock led by F1 hosts, and pit lane walks where you get close enough to watch a real pit stop being practiced. There's usually an appearance from a recognizable F1 name over the weekend as well, though who that is varies race to race and isn't confirmed far in advance.

One rung below Paddock Club sits the Champions Club, F1 Experiences' second hospitality tier, positioned on the main straight a short walk from the Main Grandstand — you get views of the grid, the finish line, and into the team garages and pit lane, without paying for the paddock-level position itself. Food here runs canapés, light snacks, and a curated lunch rather than full food stations, still with an open bar of sparkling wine, beer, wine, and soft drinks. Champions Club guests also get a Grid Walk with a photo opportunity next to the Championship Trophy, plus a guided paddock tour — a genuinely different, lower-cost way into some of the same access points Paddock Club offers.

Both tiers are sold as 3-day packages covering the full weekend, not single-day options, and both are run through F1 Experiences, the officially licensed hospitality operator for the sport — not a third-party reseller. That matters here specifically because Mexico City's overall ticket demand is unusually high (see the Ticket Guide elsewhere in this pack): general admission and grandstand seats have historically sold out fast, and hospitality inventory, while more expensive, is also genuinely finite and has sold out in past seasons before race week.

If you're deciding between the two tiers, the real trade is proximity versus price: Paddock Club puts you physically above the garages with full food service and the most complete paddock access; Champions Club gets you most of the same grid-walk and paddock-tour experiences at a meaningfully lower price point, just without the elevated suite position.`,
});

// 7. Where to Sit — Grandstand Comparison
await updateExperience("d0b3c33a-66d1-4e30-acda-d0d4981182a5", "Where to Sit", {
  practicalInfo: {
    hours: "Gates open ahead of each day's first session — exact 2027 session times not yet published.",
    website: "https://www.mexicogp.mx/mapa-del-circuito, https://tickets.formula1.com/en/f1-4861-mexico",
    costRange: `2026 pricing was: Grandstand 15/14/5A US$785–1,270 (3-day) · Grandstand 10/11/Main Grandstand US$1,640–2,166 (3-day) — reference points only, varies by zone and demand. ${PRICE_PENDING_NOTE}`,
    bookingMethod: "All grandstands are sold as numbered, allocated seats through tickets.formula1.com or mexico.gp — general admission is sold separately as standing/lawn access with no assigned seat.",
  },
});

console.log("\nDone — 7 experiences refreshed for the 2027 edition.");
await client.end();
