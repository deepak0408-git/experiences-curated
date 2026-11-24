import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// rollover-event-into-next-year skill §3 — US GP content-staleness refresh
// after the 2026->2027 edition rollover (scripts/rollover-us-grand-prix-
// 2027.mjs). Race dates (22-24 Oct 2027) are FIA/F1.com confirmed and
// independently corroborated by f1experiences.com. Austin is confirmed NOT
// on F1's published 2027 Sprint-weekend list (Bahrain, Australia, Japan,
// Canada, Monaco, Great Britain, Italy, Brazil, Qatar, Abu Dhabi) — same
// standard weekend format it already had in 2026 (lost Sprint after 3
// seasons). F1 Experiences' 2027 Paddock Club/Champions Club/General
// Admission pages are all still waitlist/TBD as of this writing — no 2027
// prices, concert line-up, or hospitality availability published. Same
// "fix confirmed dates, flag pricing/line-up as pending" approach as
// Singapore GP's refresh.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PRICE_PENDING_NOTE = "2027 pricing/availability had not been released as of this writing — check f1experiences.com and tickets.formula1.com directly before booking.";

async function updateExperience(id, label, patch) {
  const [row] = await db.update(experiences).set({ ...patch, lastVerifiedDate: new Date().toISOString().split("T")[0], updatedAt: new Date() }).where(eq(experiences.id, id)).returning({ id: experiences.id, slug: experiences.slug });
  console.log(`✓ ${label}:`, row);
}

// 1. First-Timer's Guide
await updateExperience("669ff588-10d4-45d7-89c5-e9ab6299b535", "First-Timer's Guide", {
  practicalInfo: {
    hours: "Friday-Saturday practice/qualifying (22-23 October), Sunday race day (24 October) — full session times published closer to the event",
    website: "https://circuitoftheamericas.com/plan-your-visit/",
    reservationsRequired: false,
  },
  bodyContent: `If this is your first Formula 1 weekend anywhere, or your first time at COTA specifically, a few things are worth knowing before you land in Austin. First: the 2027 US Grand Prix is a standard weekend, not a Sprint weekend — Austin isn't on F1's published list of 2027 Sprint venues, continuing the standard format it returned to in 2026 after three straight Sprint seasons. Friday brings two practice sessions (FP1 and FP2), Saturday brings a third practice session (FP3) followed by qualifying — three knockout stages, Q1 through Q3, that set Sunday's starting grid — and Sunday is race day itself, roughly 305km of racing, the only session where points are actually on the line.

That structure matters for how you plan your weekend. Friday is genuinely the quietest, cheapest-feeling day — smaller crowds, more relaxed pacing, a good day to explore the fan zones and figure out the circuit layout before it gets busy. Saturday's qualifying session is more intense than a lot of first-timers expect; grid position genuinely shapes Sunday's race, so it's worth watching properly rather than treating it as a warm-up. Sunday is the big one — arrive early, expect the fullest crowds, and budget real time for both entry and exit given the traffic reality of a track built for 100,000+ people all trying to move at once.

A few practical things nobody tells you until you're there: COTA is a cashless venue, so bring a card (Visa, Discover, Mastercard all work) rather than assuming cash gets you anything. There are free water refill stations scattered around the circuit — bring a reusable bottle rather than buying water repeatedly. You will walk a genuinely long way over the course of a full day moving between grandstands, fan zones, and food areas, so comfortable shoes matter more here than at most sporting events. The official COTA app is worth downloading before you arrive — it's the best way to find food and beverage stalls without wandering blind, and it's also where your digital tickets live for most grandstand tiers.

The atmosphere itself is one of the things people who've been consistently point to: Austin's crowd brings genuine party energy across the whole grid, not just for the favorites, which is a different feeling from some of F1's more reserved European rounds.`,
});

// 2. Paddock Club
await updateExperience("6df8d119-1f16-4d5c-97af-3f0677c9fcbc", "Paddock Club", {
  practicalInfo: {
    hours: "Friday through Sunday of race weekend (22-24 October), hospitality access runs the full circuit-open hours each day",
    website: "https://ticketing.formula1.com/hospitality-tickets/en/austin/hospitality-f1-circuit-of-the-americas-waitlist",
    costRange: `Pricing not yet published for 2027 — tickets.formula1.com's Paddock Club page for Austin is currently a waitlist with no price listed. ${PRICE_PENDING_NOTE}`,
    howToBook: "The 300 Club and Champions Club both sold out for the 2026 US GP well ahead of race weekend — this is F1's flagship American round, and its Paddock Club allocations have historically moved faster here than at most other stops on the calendar. Call F1 Experiences directly at +1.888.326.5430 once 2027 sales open rather than waiting for the public web listing, since repeat clients are typically offered early access before general sale opens, and a tier that shows \"sold out\" online has usually been gone from the standard channel for some time already.",
    bookingMethod: "Book through F1 Experiences, the official Paddock Club operator (f1experiences.com), or an authorized reseller once 2027 sales open. US contact line: +1.888.326.5430.",
    reservationsRequired: true,
  },
  bodyContent: `The Paddock Club is F1's own hospitality product, run identically at every round on the calendar, and Austin's version sits in a covered venue directly above the team garages on the Main Straight — looking straight down into pit lane and across at the starting grid. The specific tier historically sold here is the 300 Club, one rung of the Paddock Club structure, which comes with the full Friday-through-Sunday hospitality package: all-inclusive curated local food menus, a premium open bar running spirits, champagne, beer, wine and soft drinks, large TVs with the live track feed, and access to the Paddock Club Lounge's activations, food stations, and its own F1 Store.

What actually separates this from a very good grandstand seat is the access layered on top of the food and view. Every day of the weekend has historically included the Aramco F1 Pit Lane Walk — a genuine chance to get close to a team's crew as they run pit-stop practice, not a roped-off distant look. One day of the package has also typically included a Guided Track Tour, riding the back of a flatbed truck around the full circuit with expert commentary, and a separate Photo Safari day taking you to exclusive circuit locations you can't reach as a general ticket holder. The track tour has a minimum height requirement of 110cm; the photo safari is 18-plus only, both worth knowing if you're planning this for a family group rather than just yourself.

Seating inside the venue is seat-back, allocated first-come, first-served rather than pre-assigned — arriving earlier in the day genuinely gets you a better spot, which is a small but real planning detail most hospitality products don't have. Multi-night hotel add-ons have historically been available directly through the operator too, bundling a 4-night stay with daily transfers at either Austin Marriott Downtown or JW Marriott Austin — confirm current availability once 2027 packages open.

This is F1's own product, run the same way at every Grand Prix — Austin's version carries the same weight as Monaco's or Silverstone's Paddock Club, just with COTA's specific view of the Main Straight and garages rather than a different circuit's layout.`,
});

// 3. General Admission
await updateExperience("65603d90-3d3d-4999-90dd-176869841d48", "General Admission", {
  practicalInfo: {
    hours: "Gates typically open 9:00-10:00am each day of the 22-24 October race weekend",
    website: "https://circuitoftheamericas.com/ticket/f1-general-admission/",
    costRange: `2026 pricing was US$555 for the 3-day (Friday-Sunday) pass, with a cheaper Sunday race-day-only ticket from roughly US$310 — reference points only. ${PRICE_PENDING_NOTE}`,
    bookingMethod: "Tickets sell through the official Circuit of the Americas ticket site and tickets.formula1.com once 2027 sales open. Wristbands are typically mailed 4-6 weeks before the event, not issued digitally — make sure your shipping address is current on your account, and if it hasn't arrived by race week, go to the on-site Box Office rather than waiting.",
    reservationsRequired: false,
  },
});

// 4. Champions Club
await updateExperience("e66bdcd2-728e-480c-ad2c-1e138b862720", "Champions Club", {
  practicalInfo: {
    hours: "Friday through Sunday of race weekend (22-24 October); Grid Walk and trophy photo assigned to either Friday or Saturday",
    website: "https://f1experiences.com/2027-united-states-grand-prix/champions-club",
    costRange: `Pricing not yet published for 2027. ${PRICE_PENDING_NOTE}`,
    howToBook: "This tier sold out for 2026 alongside the 300 Club Paddock Club — Austin's flagship US round has historically moved through hospitality inventory faster than most other rounds on the calendar. Call F1 Experiences directly at +1.888.326.5430 once 2027 sales open rather than waiting on the public web listing, since repeat clients are typically offered early access before general sale opens, and a tier that shows \"sold out\" online has usually been gone from the standard channel for some time already. If you specifically want the Grid Walk and trophy photo experience over the Paddock Club's pit-lane access, say so when you call — it's the deciding factor between the two tiers and worth stating up front rather than defaulting to whichever tier has availability first.",
    bookingMethod: "Book through F1 Experiences (f1experiences.com) or an authorized reseller once 2027 sales open. US contact line: +1.888.326.5430.",
    reservationsRequired: true,
  },
  bodyContent: `Champions Club sits one tier below the Paddock Club in F1 Experiences' hospitality structure, and Austin's version makes that distinction clear rather than blurring it. Where the Paddock Club puts you above the garages, Champions Club seating is trackside — Main Grandstand Trackside East/West sections — with a climate-controlled venue and partially-covered outdoor terrace behind it, looking out over the Main Straight and into the team garages and pit lane. It's a genuinely different physical vantage point from the Paddock Club, not just a cheaper version of the same seat.

The food and drink has historically run Friday through Sunday: light bites plus a specially curated lunch menu, and a premium open bar covering spirits, beer, wine, and soft drinks — a step down from the Paddock Club's full all-inclusive local menu, but a real hospitality spread rather than a stripped-back one. The activities are where Champions Club earns its own identity rather than reading as a discount Paddock Club. Every guest typically gets a Grid Walk, taking you down the actual starting grid before race day, followed by a professional photo alongside the Formula 1 World Championship trophy — assigned to either Friday or Saturday of the weekend. There's also usually a guided F1 Paddock Tour on one day, and scheduled F1 Insider Appearances on Saturday and Sunday, with past guests specifically noting F1 driver appearances as part of this tier's programming.

Like the Paddock Club, hotel bundling has historically been available directly through the operator — a 4-night stay, Thursday through Monday, with daily round-trip transfers to COTA baked into the package rather than arranged separately. Confirm current package structure once 2027 sales open.

Champions Club and the 300 Club Paddock Club tier both sold out for the 2026 US GP well ahead of the event, which says something real about how fast Austin's flagship-round hospitality has moved compared to other stops on the calendar — historically not a product realistically available as a last-minute upgrade.`,
});

// 5. Super Stage Concerts
await updateExperience("f649dd4c-06da-4550-9be1-0ac3ef985128", "Super Stage Concerts", {
  practicalInfo: {
    hours: "Evenings across the 22-24 October race weekend — exact 2027 line-up and stage times not yet announced",
    website: "https://circuitoftheamericas.com/ticket/the-haven/",
    costRange: "Included with every race-weekend ticket tier; paid upgrades available for track-floor standing, reserved seating, or premium hospitality packages like The Haven",
    bookingMethod: "No separate purchase needed if you already hold a race ticket for that day — festival-lawn concert access is included automatically. Upgrade to track-floor or reserved seating at checkout when buying your race ticket, or through tickets.formula1.com/circuitoftheamericas.com directly if adding on afterward.",
    reservationsRequired: false,
  },
  bodyContent: `Austin's F1 weekend doesn't stop when the checkered flag drops each day — it turns into a genuine concert weekend on top of the racing, staged at the Germania Insurance Super Stage inside COTA. The 2027 artist line-up hadn't been announced as of this writing — COTA has typically confirmed headline acts a few months before race week, so check circuitoftheamericas.com closer to October 2027 for the real bill. In 2026, Maroon 5 headlined Friday night, Post Malone took Saturday, and Alesso closed the weekend with a post-race set on Sunday — useful as a sense of scale and calibre, not a preview of 2027's actual acts. This isn't a side attraction squeezed in after track sessions end — it's built into the ticket structure as a real second reason to be on-site each evening, not just during the day's on-track action.

Access works more simply than it might sound: every race ticket, whatever tier you bought, includes entry to the Festival Lawn for that day's headline concert. You don't need a separate concert ticket if you already hold a race ticket for that day — it's baked in. What you can add is proximity. Paid upgrades let you move from the general festival lawn onto the actual racetrack in front of the stage for standing room, or into reserved seating further back, and premium hospitality options like The Haven — a climate-controlled space at Turn 7 — bundle grandstand seating with concert access and hospitality in one package.

Worth being clear-eyed about: this is a headline-artist concert layered on top of an already long day of racing, not a standalone festival you plan your whole evening around. If you've spent the day in the sun watching practice or qualifying, factor that fatigue into whether you want to also stand through a full concert set afterward, or whether the festival lawn — further back, more room to sit — suits you better than fighting for a track-side upgrade spot.`,
});

// 6. South Congress (First Thursday date recalculation)
await updateExperience("dd4b317f-51b7-4519-bd96-9213b2b57566", "South Congress", {
  practicalInfo: {
    hours: "Most shops run standard daytime-into-evening hours; First Thursday (monthly, next occurring 7 October 2027 — before race weekend) runs shops until 10pm with extra vendors and live music",
    website: "https://visitsoco.com",
    costRange: "Free to walk; individual shop/restaurant prices vary",
    bookingMethod: "No booking needed — SoCo is a public street, free to walk and browse. Individual shops and restaurants keep their own hours.",
    reservationsRequired: false,
  },
  bodyContent: `South Congress Avenue — SoCo to everyone who actually lives here — wasn't always the postcard version of Austin it's become. Through the 1970s and 80s this stretch was rougher, home to pawn shops and cheap motels more than boutiques. The turn started in the late 1990s when artists priced out of downtown moved south, and three decades on it's arguably Austin's most photographed street, walkable enough that you genuinely don't need a car once you're on it.

Two stops here function as the strip's unofficial landmarks. Allens Boots, open since 1977, is instantly recognizable by the oversized red boot mounted above its entrance and a gold neon marquee — a genuine Austin institution for actual cowboy boots, not a tourist prop, though it photographs like one. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10758570619703789610&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). A few doors down, Jo's Coffee carries the "I love you so much" mural on its outer wall, one of the most photographed single spots in the entire city and the reason a lot of visitors' Instagram feed from Austin looks the way it does. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=462561016830669691&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA).

Beyond the two headline stops, SoCo runs a genuine mix of vintage shops, art galleries, and quirky boutiques — Monkey See Monkey Do for offbeat gifts, Uncommon Objects for eclectic antiques, and more murals tucked into side alleys than most visitors have time to find in one visit. It's a street built for wandering rather than a checklist, which is unusual for a strip this well-known.

Worth knowing precisely: SoCo runs a "First Thursday" event each month, where shops stay open until 10pm (later in some cases), the street fills with pop-up vendors and food trucks, and live music plays at every corner — a real, genuine block-party atmosphere. October 2027's First Thursday falls on 7 October, more than two weeks before the 22-24 October race weekend, so don't plan your F1 trip around catching it — it won't overlap. SoCo is a great daytime or evening stop regardless, just without that specific monthly event layered in.`,
});

console.log("\nDone — 6 experiences refreshed for the 2027 edition. (Zilker/Barton Springs' '2026' reference is a real city fee-schedule date, not race-related, and was left untouched after review.)");
await client.end();
