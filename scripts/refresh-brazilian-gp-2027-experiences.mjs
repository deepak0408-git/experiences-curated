import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// rollover-event-into-next-year skill §3 — Brazilian GP (São Paulo GP)
// content-staleness refresh after the 2026->2027 edition rollover. Race
// dates (5-7 Nov 2027) are FIA/F1.com confirmed, independently corroborated
// by F1's own ticketing/results pages. IMPORTANT FORMAT CHANGE (confirmed
// via two independent sources): 2026 was classic (no Sprint — Interlagos
// was dropped from the 2026 Sprint calendar); 2027 brings Sprint back per
// F1's confirmed 2027 calendar. Standard Sprint weekend structure
// confirmed: Friday FP1 + Sprint Qualifying, Saturday Sprint + Qualifying,
// Sunday Race. F1 Experiences/ticketing's 2027 pages are at waitlist/TBD
// as of this writing, same pattern as every other 2027 rollover so far.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PRICE_PENDING_NOTE = "2027 pricing/availability had not been released as of this writing — check tickets.formula1.com and f1experiences.com directly before booking.";

async function updateExperience(id, label, patch) {
  const [row] = await db.update(experiences).set({ ...patch, lastVerifiedDate: new Date().toISOString().split("T")[0], updatedAt: new Date() }).where(eq(experiences.id, id)).returning({ id: experiences.id, slug: experiences.slug });
  console.log(`✓ ${label}:`, row);
}

// 1. Interlagos — Inside the Venue (date-only fix, structural facts unchanged)
await updateExperience("fdb53b20-b879-4711-89b0-09758e904dca", "Venue overview", {
  practicalInfo: {
    hours: "Circuit grounds open ahead of each day's first on-track session during race weekend (5-7 Nov 2027)",
    website: "https://www.formula1.com/en/racing/2027/brazil",
    costRange: "Entry is via race-weekend grandstand or hospitality ticket — see the Ticket Guide elsewhere in this pack. Interlagos has no separate general admission product.",
    bookingMethod: "Access the circuit via any valid grandstand or hospitality ticket for the weekend.",
  },
});

// 2. Ticket Guide — the big one, format change + pricing
await updateExperience("00394ada-2563-4c31-addd-d738d9846cce", "Ticket Guide", {
  practicalInfo: {
    hours: "Ticket sales run through official channels year-round until sold out; gates for ticketed weekend access open ahead of each day's first session, 5-7 Nov 2027",
    website: "https://tickets.formula1.com/en/f1-3325-brazil",
    costRange: `2026 pricing by tier was: Grandstand A/G US$177–283, Grandstand M/R US$385–640, Heineken Village US$444–810, Orange Tree Club/F1 Paddock Experience US$1,955–2,361 — all for the 3-day weekend, reference points only. ${PRICE_PENDING_NOTE}`,
    howToBook: "Buy directly at tickets.formula1.com/en/f1-3325-brazil once 2027 sales open — it's the only channel guaranteed to show real-time official inventory. Grandstand M (Turn 1) has historically been among the first to sell out given how well-known that corner is. Note that only Grandstands B and M are reserved seating — every other stand is unreserved within its section, so arriving right at gate-open on race day (not just before lights-out) genuinely changes your seat quality in those stands.",
    bookingMethod: "Buy directly via Formula1.com's official ticketing page for Brazil, which links to the authorized partner, once 2027 sales open. Avoid unofficial resale listings that don't confirm authorization.",
  },
  bodyContent: `Interlagos doesn't sell general admission. Every ticket is grandstand-specific — you buy a letter, and that letter is where you sit for all three days. This is different from circuits like Silverstone or Spa, where a GA wristband lets you wander the grounds and pick a spot; here, your seat is fixed the moment you buy, so the decision matters more than it does elsewhere.

The cheapest tier is uncovered bleacher seating — Grandstand G on the back straight is the entry-level option, and Grandstand A on the main straight's banked entry is a step up in view quality for a similar price bracket, trading shade and a backrest for one of the loudest, most social atmospheres at the track. From there, the covered mid-tier stands (R, H, D) trade the party atmosphere for comfort and a roof, each looking at a different sector of the lap — R near Turn 3 and the back-straight DRS zone, H toward Turn 2 and pit exit, D with food and drink included in the ticket. Grandstand M, also covered with reserved numbered seating, sits at Turn 1 and has historically been one of the first stands to sell out given how well-known that corner is. Grandstand B, on the main straight with reserved covered seating, sits at the top of the standard grandstand range, historically around double Grandstand M's price.

Above the grandstands sit three hospitality tiers. Orange Tree Club and a Heineken-branded fan village occupy the mid-hospitality space — better food and a more social, less strictly-seated environment than a grandstand ticket, without full VIP access. Champions Club sits above that: premium views, elevated catering, and pit-lane-walk access bundled in. F1 Paddock Club is the top tier — positioned directly above the team garages on the main straight, with daily pit lane walks, an open bar, and appearances from F1 personalities as part of the package.

One format change worth knowing for 2027: Interlagos returns to the Sprint calendar after running a classic weekend in 2026 (confirmed via F1's 2027 calendar announcement). Expect Friday to run Practice 1 and Sprint Qualifying, Saturday the Sprint race and full Qualifying, and Sunday the Grand Prix itself — different from 2026's standard three-practice-session structure. Exact session times for 2027 haven't been published as of this writing.

The single most important buying fact for this race historically: tickets have gone on sale well ahead of race week in past editions, with multiple grandstands — including M and one of the two main-straight covered stands — selling out before race week itself. This isn't typically a circuit where "buy closer to the date and see what's left" is a safe strategy. If a specific stand matters to you, the on-sale window itself is usually the moment to act, not a target date months later — check tickets.formula1.com for the 2027 on-sale date.`,
});

// 3. Grandstand A
await updateExperience("44e89bc9-b0b1-4f8f-acb9-2f834744f735", "Grandstand A", {
  practicalInfo: {
    hours: "Gates open ahead of each day's first on-track session, 5-7 Nov 2027",
    website: "https://tickets.formula1.com/en/f1-3325-brazil",
    costRange: `2026 pricing was US$177–283 for the 3-day weekend (Grandstand A/G tier) — a reference point only. ${PRICE_PENDING_NOTE}`,
    bookingMethod: "Buy directly via Formula1.com's official ticketing partner for Brazil, or an authorized reseller, once 2027 sales open — see the Ticket Guide elsewhere in this pack for the full buying strategy.",
  },
});

// 4. Grandstand M
await updateExperience("7aa40a62-7576-4944-8017-665fad028542", "Grandstand M", {
  practicalInfo: {
    hours: "Gates open ahead of each day's first on-track session, 5-7 Nov 2027",
    website: "https://tickets.formula1.com/en/f1-3325-brazil",
    costRange: `2026 pricing was US$385–640 for the 3-day weekend (Grandstand M/R tier) — a reference point only. ${PRICE_PENDING_NOTE} M has historically sold out early.`,
    bookingMethod: "Buy directly via Formula1.com's official ticketing partner for Brazil, once 2027 sales open, or join the official waitlist/notification list if sold out — see the Ticket Guide elsewhere in this pack for the full buying strategy.",
  },
});

// 5. Paddock Club & Champions Club
await updateExperience("ecf7a601-4d97-4de4-8f67-db068142fbb6", "Paddock Club & Champions Club", {
  practicalInfo: {
    hours: "Access follows the full 3-day race weekend schedule, 5-7 Nov 2027; Grid Walk/Trophy photo scheduled for one specific day, confirmed closer to the event",
    website: "https://tickets.formula1.com/en/f1-3325-brazil",
    costRange: `2026 pricing for Orange Tree Club / F1 Paddock Experience was US$1,955–2,361 for the 3-day weekend — a reference point only. ${PRICE_PENDING_NOTE}`,
    howToBook: "Call the North America line (+1.888.326.5430) or your regional F1 Experiences number once 2027 sales open — Paddock Club has historically sold out well ahead of race week at this circuit. If Paddock Club is unavailable, ask about Champions Club as the realistic fallback — it's a separate, usually less oversubscribed tier sold through the same F1 Experiences channel.",
    bookingMethod: "Book via F1 Experiences (the official Paddock Club/Champions Club operator) or an authorized reseller, once 2027 sales open.",
  },
  bodyContent: `F1 Paddock Club sits directly above the team garages on the main straight, and the position is the whole point — you're looking straight down at pit lane and the start-finish line, not watching it on a screen from somewhere else at the circuit. The package runs all-inclusive: curated local menus, an open bar with spirits, champagne, wine and beer, a guided one-day paddock tour, a daily pit lane walk to watch teams practice stops up close, and a scheduled appearance from an F1 insider — a driver, a team executive, or a media figure, timing announced closer to the weekend. This tier has historically sold out well ahead of race week at this circuit, which tells you something about how this specific round's Paddock Club is regarded relative to less in-demand rounds on the calendar.

Champions Club sits one tier below and covers a real gap between grandstand and full Paddock Club rather than feeling like a diluted version of it. Gourmet canapés and a proper lunch service, an open bar, and two things worth naming specifically: an exclusive Grid Walk paired with a Championship Trophy photo op on Friday or Saturday — you're standing among the actual cars on the grid, and photographed next to the real World Championship trophies, not a replica — plus a one-time guided tour of the Paddock itself led by an expert host. It's the tier built for someone who wants real access and a genuine "were you actually there" moment without paying Paddock Club's premium.

Both tiers include reserved seating with sightlines onto the main straight and grid, so neither is purely a lounge experience disconnected from the racing — you can watch sessions from your seat and step into the hospitality space between them. Brazil's Paddock Club and Champions Club both run as 3-day packages only; there's no single-day hospitality product at Interlagos.`,
});

// 6. Heineken Village — the real rewrite, session structure + on-sale date
await updateExperience("fd7ac889-43d3-4649-8c11-6b1fc0bae640", "Heineken Village", {
  practicalInfo: {
    hours: "Gates open ahead of Friday's first session; runs across all three days of the race weekend (exact 2027 daily gate times published closer to race week)",
    website: "https://grandepremiosp.f1saopaulo.com.br/heinekenvillage, https://eventim.com.br/f1saopaulo",
    costRange: `2026 pricing was: Lawn (Gramado) R$2,480 full price / R$1,240 half-price, 3-day pass, food and drink sold separately; Star (Estrela) R$4,960 flat, 3-day pass, no half-price option, includes open bar and finger food — reference points only. 2027 pricing not yet released.`,
    howToBook: "Buy the moment the 2027 season's tickets go live at eventim.com.br/f1saopaulo — in past editions, sales opened in late November following the prior edition's race weekend, and the organizers explicitly warned the sector sells out quickly. Treat any 'on sale soon' notice on f1saopaulo.com.br as your actual buying window, not a soft suggestion. The Lawn (Gramado) sector has historically had a half-price rate for eligible buyers that the Star (Estrela) sector doesn't offer — if budget matters more than the open bar, Lawn's half-price tier is the real money-saving lever here, not a lesser version of the same deal. This is a single 3-day pass only, no single-day option, and 18+ with ID checked at the gate.",
    bookingMethod: "Three-day pass only, no single-day ticket — buy via eventim.com.br/f1saopaulo once 2027 tickets go on sale. Both sectors have historically sold out ahead of the race weekend. 18+ only, ID checked at the gate.",
  },
  bodyContent: `Heineken Village sits inside Interlagos itself, in the infield between Bico de Pato, Mergulho, Junção and Subida do Café — the sequence of corners on the circuit's back section. It opened to the public in 2022 and has run every year since as a standalone ticketed zone, separate from the grandstands. You get inside the track boundary here, not just close to it: 30 metres from the cars at points, with sightlines a seated grandstand ticket doesn't offer.

There are two sectors, and they're genuinely different products, not just a price split. The Lawn (Gramado) is open grass with big screens for the parts of the track you can't see directly — food and drink are sold separately, cashless payment only. The Star (Estrela) is a built platform with an open bar (Heineken draft, soft drinks, water) and a finger-food service running through the day, including breakfast. It's also the only part of Heineken Village with ramp access, so it's the sector to book if step-free entry matters.

Both sectors run as a single three-day pass covering the full Friday-to-Sunday programme. One format change worth knowing for 2027: Interlagos returns to the Sprint calendar after running a classic weekend in 2026 (confirmed via F1's 2027 calendar announcement). Expect Friday to run Practice 1 and Sprint Qualifying, Saturday the Sprint race and full Qualifying, and Sunday the Grand Prix itself — different from 2026's Friday-practice/Saturday-qualifying/Sunday-race structure. There's no day-specific ticket regardless of format. Entry is through the dedicated Heineken Village gate off Avenida Interlagos, next to Gate T, and admission is restricted to 18 and over — Heineken runs this as an adult, drinking-culture space, not a family fan zone, and ID is checked at the gate.

Whichever sector you buy, plan for a full day of open-air exposure. There's some covered structure in the Star sector, but neither sector is a sheltered venue — Interlagos in November swings between hard sun and sudden rain, and the organisers themselves warn attendees to come prepared for both.

Past editions have leaned hard into entertainment on top of the racing: DJ sets running through the weekend, and recent years have added attractions like a zipline crossing the lawn and driver-reflex-style attractions built around F1 minutiae. The exact line-up of extras changes year to year — Heineken treats it as a rotating festival build, not a fixed installation — but the format (music, games, a crowd that's there as much for the atmosphere as the racing) has held since it opened.

Tickets have typically gone on sale through eventim.com.br/f1saopaulo in late November following the prior edition's race weekend. This is also, per the official race organiser, historically one of the sectors most likely to sell out ahead of the weekend itself.`,
});

// 7. Hotel Emiliano (date-only fix)
await updateExperience("c737f67b-c034-46bb-a418-9cd595a932cf", "Hotel Emiliano", {
  practicalInfo: {
    hours: "Check-in from 3:00 PM, check-out by 12:00 PM; early check-in/late check-out available for an additional fee, subject to availability.",
    website: "https://emiliano.com.br/en/",
    costRange: "Rates typically start around US$290-360+ per night depending on room category and season; expect race-weekend premium pricing",
    howToBook: "Call the hotel's direct reservations line — +55 (11) 3728-2002 — rather than booking through a third-party site; as an SLH (Small Luxury Hotels of the World) property, booking direct or via SLH's own channel is what typically qualifies you for SLH member perks (room upgrade subject to availability, early check-in/late check-out) that an OTA booking won't. If the direct line is busy or you don't get through, the hotel's general number is +55 (11) 3069-4369, and their contact form is at emiliano.com.br/en/fale-conosco/. Race-weekend rates run well above the US$290–360 baseline, so book earlier rather than closer to the 2027 race.",
    bookingMethod: "Book directly via SLH (Small Luxury Hotels of the World, the Emiliano's affiliated network) or through major booking platforms.",
  },
});

// 8. Arrival & Queue Guide (date-only fix)
await updateExperience("4d17efb3-ca57-4a1a-a25f-cb79ac8fa03c", "Arrival & Queue Guide", {
  practicalInfo: {
    hours: "Gates open 08:00 on Friday, Saturday, and Sunday of race weekend (5-7 Nov 2027), subject to change",
  },
});

console.log("\nDone — 8 experiences refreshed for the 2027 edition.");
await client.end();
