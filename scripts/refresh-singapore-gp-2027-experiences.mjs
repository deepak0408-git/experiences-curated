import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// rollover-event-into-next-year skill §3 — Singapore GP content-staleness
// refresh after the 2026->2027 edition rollover (scripts/rollover-singapore-
// gp-2027.mjs). Race dates (8-10 Oct 2027) are FIA/F1.com confirmed
// (2027 calendar announced 16 Sep 2026) — safe to write in as fact.
// Ticket prices, grandstand sell-out status, Paddock Club quotes, the
// concert line-up, and the Fan Forum schedule are NOT yet published by
// Singapore GP / F1 as of this refresh (24 Nov 2026) — tickets.formula1.com
// and singaporegp.sg both show 2027 ticketing as "waitlist" pages with no
// prices. Per founder decision: fix confirmed dates now, replace stale 2026
// prices/sold-out claims/line-up specifics with honest "not yet released"
// language rather than guessing or carrying forward 2026 numbers as if
// current. Every edit below is additive/replacement on real DB content —
// no new experiences created, no join-table changes (out of scope for a
// content refresh).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PRICE_PENDING_NOTE = "2027 pricing had not been released as of this writing — tickets.formula1.com and singaporegp.sg show 2027 ticketing as a waitlist with no prices confirmed yet. Check both official sites directly before booking.";

async function updateExperience(id, label, patch) {
  const [row] = await db.update(experiences).set({ ...patch, updatedAt: new Date() }).where(eq(experiences.id, id)).returning({ id: experiences.id, slug: experiences.slug });
  console.log(`✓ ${label}:`, row);
}

// 1. Stamford Grandstand
await updateExperience("ffecb4a5-4404-44fd-a2df-857294886ade", "Stamford Grandstand", {
  practicalInfo: {
    hours: "Race weekend sessions Friday–Sunday, 8–10 Oct 2027, into the evening",
    website: "https://singaporegp.sg/en/tickets/general-tickets/grandstands/stamford-grandstand/, https://tickets.formula1.com/en/f1-3301-singapore",
    costRange: `2026 pricing was S$608 adult / S$438 junior for 3-day — a reference point only. ${PRICE_PENDING_NOTE}`,
    howToBook: "",
    bookingMethod: "Book via singaporegp.sg or tickets.formula1.com under Zone 4 grandstands — historically the first stand to sell out given its value.",
    reservationsRequired: true,
  },
});

// 2. F1 Paddock Club
await updateExperience("121e31fe-086d-4ba3-aeb4-2b295434278e", "F1 Paddock Club", {
  practicalInfo: {
    hours: "Access runs across all three race days, Friday–Sunday 8–10 Oct 2027, plus post-race fireworks Sunday evening",
    website: "https://singaporegp.sg/en/tickets/hospitality-packages/hospitality/formula-1-paddock-club/",
    costRange: `Pricing has never been publicly listed for this tier — contact Singapore GP hospitality directly for a 2027 quote. ${PRICE_PENDING_NOTE}`,
    howToBook: "Call Singapore GP hospitality on +65 6731 5900, or submit the official enquiry form at singaporegp.sg's Paddock Club page, well before the season, ideally as soon as the prior year's race ends. 3-day and Sunday Paddock Club passes have sold out within weeks in past years, so treat booking Paddock Club as an early decision, not something to leave for closer to race week.",
    bookingMethod: "Enquire via singaporegp.sg's official Paddock Club page or call the hospitality line directly — this tier is not sold via standard online checkout.",
    reservationsRequired: true,
  },
});

// 3. Turn 1 Grandstand
await updateExperience("6da9852c-2edd-45fd-9333-93c9dcf67bca", "Turn 1 Grandstand", {
  practicalInfo: {
    hours: "Race weekend sessions Friday–Sunday, 8–10 Oct 2027, into the evening",
    website: "https://singaporegp.sg/en/tickets/general-tickets/grandstands/turn-1-grandstand/, https://tickets.formula1.com/en/f1-3301-singapore",
    costRange: `2026 pricing was S$1,698 for 3-day — a reference point only. ${PRICE_PENDING_NOTE}`,
    howToBook: "Turn 1 is sold as one grandstand, but the sightline genuinely changes depending on which section you're seated in — a detail the booking flow doesn't surface unless you know to ask for it. Sections A3 through A6 keep the clearest view of the actual braking zone into Turns 1-3, the part of the corner where the real action happens; sections at either end of the stand (closer to A2 or A9) sit further round the bend and lose some of that direct sightline. When booking via singaporegp.sg or tickets.formula1.com, use the platform's section-selection option where it's offered and request A3-A6 specifically rather than accepting whatever the checkout defaults to. If the online flow doesn't let you choose a section for your ticket type, call or email the ticketing line directly and ask before paying — Turn 1 sells out among the faster-moving stands most seasons, so don't wait until the week of the race to sort section preference out.",
    bookingMethod: "Book via singaporegp.sg or tickets.formula1.com, Zone 1 grandstands. Request sections A3-A6 specifically where the platform allows section selection.",
    reservationsRequired: true,
  },
});

// 4. First-timer orientation
await updateExperience("6eab830b-bc7c-4afa-b370-713f3ddd0bdd", "First-timer orientation", {
  practicalInfo: {
    hours: "Gates typically open 60-90+ minutes before each day's first session, Friday–Sunday 8–10 Oct 2027",
    website: "https://www.formula1.com/en/latest/article/singapore-grand-prix-helpful-tips-and-information-when-visiting-the-marina.61d1w4TykVZRomD0ox72Vk",
    costRange: "Included with any valid ticket — no separate entry fee",
    bookingMethod: "No separate booking needed — orientation applies to any ticket type. Check your specific ticket for recommended gate and zone access.",
    reservationsRequired: false,
  },
});

// 5. Grandstand or Walkabout — the real ticket decision
await updateExperience("c5507a89-4176-4f30-b7cf-055ff4d42abd", "Ticket guide", {
  practicalInfo: {
    hours: "Race weekend sessions run Friday–Sunday, 8–10 Oct 2027, into the evening under floodlights",
    website: "https://tickets.formula1.com/en/f1-3301-singapore, https://singaporegp.sg/en/tickets/general-tickets/grandstands/",
    costRange: `2026 pricing ranged S$608–S$2,498 (3-day grandstands) and S$198–S$728 (Walkabout) — a reference point only. ${PRICE_PENDING_NOTE}`,
    howToBook: "",
    bookingMethod: "Buy directly via tickets.formula1.com or singaporegp.sg — both show live per-grandstand pricing and availability once 2027 sales open. 3-day grandstands and Sunday-inclusive tickets have historically sold out well ahead of race week, so check early once sales open if a specific stand matters.",
    reservationsRequired: true,
  },
  bodyContent: `Sixteen grandstands ring the Marina Bay Street Circuit, each with a real, different answer to "what will I actually see." Add two Walkabout tiers and you've got eighteen ways to watch the same race. 2026 prices ranged from S$608 to S$2,498 for three days — a useful reference point, though 2027 pricing hadn't been released as of this writing.

The first decision isn't which stand, it's seat or feet. A grandstand ticket is a fixed, numbered seat for all three days, facing one part of the track. Walkabout gets you standing room and freedom to roam between viewing platforms inside your zone, no seat guaranteed. Zone 4 Walkabout is historically the cheapest ticket at the race, and it still gets you into the Padang Stage concerts. Premier Walkabout costs more but opens all four zones instead of one.

The sixteen grandstands split into a few real groups. Super Pit and Pit Grandstand/Turn 2 sit right where the race starts, where most overtaking happens on lap one — Turn 2 gives unrivalled views of all 20 cars jostling into the first three corners off the line, and Turn 1 sits close enough to see sparks and real overtaking attempts through Turns 1-3.

The waterfront cluster, Bay, Bayfront, Skyline, Promenade, and Marina Bay, covers the circuit's last, most dramatic stretch. Bay Grandstand is one of the biggest on the entire F1 calendar, 27,000 seats, with cars diving through the tight, wall-lined Turns 18–19 directly beneath you before the final straight. Marina Bay Grandstand watches the same two corners from a different angle, Flyer glowing behind the track. Bayfront and Promenade sit around Turns 16–18, catching braking out of a high-speed straight and the run past the Flyer. Skyline, between Turns 17–18 right before pit entry, is where drivers are most likely to make a mistake under pressure.

The mid-tier stands are where it gets more honest. Stamford, historically the cheapest grandstand, sits at the end of the longest straight on the calendar, watching hard braking into Turn 7 — genuine racing for a fraction of the top tier's price. Padang is the opposite trade: its view of the short straight between Turns 9–10 is genuinely weak, cars pass for a few seconds with no real corner action visible, and reviewers are blunt that it "doesn't make the cut" on racing alone. What you're actually paying for is proximity to the main concert stage and the festival atmosphere that never dies between sessions — buy Padang for the night out, not the racing. Republic looks onto Turn 5's kink into the first DRS zone and throws in a free Singapore Flyer ride. Connaught watches Turn 14, a tight DRS-zone corner with genuine wheel-to-wheel racing. Empress sits between Turns 11–12, peak braking across the Anderson Bridge.

If racing is what you're there for, Stamford, Turn 1, or Connaught give it to you without Super Pit's price tag. If the concerts matter as much as the race, Padang or a Walkabout tier is the honest pick, just don't expect much from the track itself.

3-day grandstands and Sunday-inclusive tickets have historically sold out well ahead of race week in past editions — check tickets.formula1.com or singaporegp.sg as soon as 2027 sales open if a specific stand matters, rather than waiting.`,
});

// 6. Padang Grandstand
await updateExperience("5af21afb-eefd-4832-ac85-a178730c2dc0", "Padang Grandstand", {
  practicalInfo: {
    hours: "Race weekend sessions Friday–Sunday, 8–10 Oct 2027, into the evening",
    website: "https://singaporegp.sg/en/tickets/general-tickets/grandstands/padang-grandstand/, https://tickets.formula1.com/en/f1-3301-singapore",
    costRange: `2026 pricing was S$738 for 3-day — a reference point only. ${PRICE_PENDING_NOTE}`,
    howToBook: "",
    bookingMethod: "Book via singaporegp.sg or tickets.formula1.com under Zone 4 grandstands. 3-day and Sunday tickets have historically sold out well ahead of race week.",
    reservationsRequired: true,
  },
  bodyContent: `Padang Grandstand sits in Zone 4, split into A and B sections flanking the Padang Stage, watching drivers approach Turn 10, the Singapore Sling, at up to 275km/h. On paper that sounds like a real racing seat. In practice, independent reviewers are blunt about it: the grandstands aren't steeply pitched, the straight between Turns 9 and 10 gives only a few seconds of passing cars, and neither section offers a genuinely decent view of either corner. It's fair to walk in knowing what you're buying.

What you're actually buying is proximity. Padang A and B sit immediately next to the main stage where the weekend's headline acts play, so you get the concert experience without moving after the chequered flag. The 2027 artist line-up hadn't been announced as of this writing — check singaporegp.sg closer to race week for the confirmed bill. Between sessions, the festival atmosphere here doesn't dip the way it can in a purely trackside stand.

Seating is individual bucket seats with backs, up to 43 rows and 24 seats per section, uncovered. Bring something for rain, this circuit gets tropical downpours without much warning. Zone 4 also puts you near Portside Hawkers and Dockside Hawkers, both curated food stalls mixing Singaporean staples with international options, so you're not stuck with generic stadium concessions between the racing and the music.

If you came for the racing above all else, Padang isn't the stand. If a genuine race weekend with real concerts attached matters as much as the laps, it's an honest, well-placed pick, just go in knowing the on-track view is secondary to everything happening around it.`,
});

// 7. Padang Stage concerts
await updateExperience("49ef8292-a64c-4585-8c50-67adab60fd09", "Padang Stage concerts", {
  practicalInfo: {
    hours: "Performances run after each day's on-track sessions conclude, into the night, Friday–Sunday 8–10 Oct 2027",
    website: "https://singaporegp.sg/en/entertainment/",
    costRange: "Included in the price of any valid Zone 4 (Padang Stage) or Zone 1 (Wharf/Barge Stage) ticket — no separate concert ticket exists",
    howToBook: "",
    bookingMethod: "Access comes bundled with your circuit ticket zone — check singaporegp.sg's stage/zone map before buying if a specific artist is the priority, once the 2027 line-up is announced.",
    reservationsRequired: false,
  },
  bodyContent: `Singapore is the one race on the calendar built as much around the concerts as the racing. In recent editions, ten stages have run across the Marina Bay circuit park over the weekend, with the Padang Stage as the headline venue, hosting the biggest acts straight after each day's on-track sessions wrap.

The 2027 line-up had not been announced as of this writing — Singapore GP typically confirms headline acts a few months before race week, so check singaporegp.sg's entertainment page closer to October 2027 for the real bill. In 2026, the Padang Stage hosted JJ Lin and CORTIS on Friday, Zara Larsson and The Killers on Saturday, and Lana Del Rey's Singapore debut alongside James Arthur on Sunday, with a wider ten-stage bill including Split Enz, Goo Goo Dolls, Janet Jackson, Mark Ronson, DJ Snake, Major Lazer Soundsystem, and Rev Run — useful as a sense of scale and calibre, not a preview of 2027's actual acts.

Access depends on your ticket zone, not a separate concert pass. A Zone 4 ticket, whether a grandstand like Padang or Stamford, or a Zone 4 Walkabout, gets you into Padang Stage performances. If the Wharf Stage or Barge Stage lineups matter to you instead, you need a Zone 1 ticket, Padang alone won't get you there. This is worth checking before buying: assuming any ticket gets you to any stage is the most common mistake first-timers make with this race.

Because the stages run after the day's sessions finish, a full race day here genuinely runs from afternoon practice or qualifying through to a late-night headline set, and the floodlit night race format means the whole thing happens under lights rather than winding down at sunset like most Grands Prix.`,
});

// 8. F1 Village
await updateExperience("cba55756-94ad-458b-acb7-bedeb2b02b36", "F1 Village", {
  practicalInfo: {
    hours: "Both F1 Villages run throughout the circuit's open hours across the weekend; Fan Forum timing is confirmed closer to race week each year",
    website: "https://singaporegp.sg/en/entertainment/",
    costRange: "Free with any valid race-weekend ticket",
    bookingMethod: "No booking needed, both F1 Villages are open to anyone with a valid ticket for that zone. The Amex Fan Experience (Zone 4) requires on-site QR registration, first-come first-served.",
    reservationsRequired: false,
  },
  bodyContent: `Two separate F1 Villages run across the weekend, one in Zone 1 near the pit straight, one in Zone 4 on the Padang side, and they're genuinely worth knowing apart since your ticket zone determines which one you can actually reach. Both run merchandise stalls, bars, and food and beverage outlets, but the real draw is the activity stations: race simulators, reaction games, and past editions have included a remote-control car challenge and themed display builds.

Zone 1's Wharf Stage has hosted the F1 Drivers' Fan Forum in recent years, a live Q&A with different teams appearing each day — genuinely one of the only chances all weekend to see drivers up close outside the car. The exact 2027 schedule hadn't been published as of this writing; check singaporegp.sg's entertainment page closer to race week. A valid Zone 1 ticket is required to attend.

Zone 4's F1 Village has housed the Amex Fan Experience in recent editions, free for every race attendee regardless of ticket tier once you scan the on-site QR code and register, first-come first-served, subject to capacity. It's part arcade, part studio: past editions have included head-to-head trivia challenges with live emcees, a booth to film your own slow-motion driver intro, and a livery-design corner.

Neither village needs advance booking, and both are included with any valid race-weekend ticket — this is genuinely free entertainment layered on top of what you've already paid for, not an upsell.`,
});

// 9. Zone 4 Walkabout
await updateExperience("b165f3b2-4506-4843-86c5-6e073fc13007", "Zone 4 Walkabout", {
  practicalInfo: {
    hours: "Race weekend sessions Friday–Sunday, 8–10 Oct 2027, into the evening",
    website: "https://singaporegp.sg/en/tickets/general-tickets/walkabouts/zone-4-walkabout/, https://tickets.formula1.com/en/f1-3301-singapore",
    costRange: `2026 pricing was S$198 Friday, S$298 Saturday, S$368 Sunday, or S$548 for 3-day — a reference point only. ${PRICE_PENDING_NOTE}`,
    howToBook: "",
    bookingMethod: "Book via singaporegp.sg or tickets.formula1.com under general admission walkabout tickets. 3-day and Sunday passes have historically sold out first.",
    reservationsRequired: false,
  },
});

// 10. Where to stay trackside (date-only fix — no price/lineup contamination, just the Oct 2026 reference in hours)
await updateExperience("f81b009e-1590-4700-a313-f49dda4aca3e", "Trackside hotels", {
  practicalInfo: {
    hours: "Standard hotel check-in/check-out; race-week rates and minimum-night stays typically apply Oct 2027",
    website: "https://www.ritzcarlton.com/en/hotels/sinrz-the-ritz-carlton-millenia-singapore/overview/, https://www.panpacific.com/en/hotels-and-resorts/pp-marina.html, https://www.swissotel.com/hotels/singapore-stamford/",
    costRange: "Luxury tier, race-week rates significantly above standard — Pan Pacific positioned as the relative value option of the three",
    howToBook: "",
    bookingMethod: "Book directly via each hotel's own site or Booking.com well ahead of October — race-week inventory at all three sells out and prices rise sharply closer to the date.",
    reservationsRequired: true,
  },
});

console.log("\nDone — 10 experiences refreshed for the 2027 edition.");
await client.end();
