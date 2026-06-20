import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { experiences } from '../schema/database.ts';
import { eq } from 'drizzle-orm';
const client = postgres(process.env.DATABASE_URL, { ssl: 'require', prepare: false });
const db = drizzle(client);

// #5 — The Lord's Tavern
const [r1] = await db.update(experiences).set({
  whatToAvoid: "Don't arrive after noon on match days expecting a table — the Tavern fills fast once the ground opens and unreserved walk-ins after 12:30pm will be standing. And don't attempt to pay cash — the pub is cashless throughout. If you're eating between innings, order food early; the kitchen slows considerably when the bar is at capacity.",
  budgetCurrency: 'GBP',
  bestSeasons: ['jul'],
  practicalInfo: {
    hours: '11am (12pm on Sundays)',
    website: 'https://www.lords.org/lords/lord-s-experience/lord-s-tavern',
    costRange: 'Burger and pint ~£12; mains £12–18; drinks at standard pub prices',
    howToBook: "Book directly with The Lord's Tavern — they don't take reservations through third-party platforms. Call 020 7616 8689 or email tavern@mcc.org.uk as soon as you have your match tickets; Lord's ODIs sell out and the Tavern fills fast. The pub is open to all ticketed attendees, not just MCC members. If you want a proper seated dining experience rather than bar service, contact the Match Day Hospitality team separately: cmdh@mcc.org.uk or 020 7616 8698.",
    bookingMethod: "Call 020 7616 8689 or email tavern@mcc.org.uk — no third-party platforms",
    reservationsRequired: false,
  },
}).where(eq(experiences.id, 'e2b3c3a6-34f4-4c52-bf90-08a7d3b9b283')).returning({ id: experiences.id, title: experiences.title });

// #6 — Lunch at Soutine
const [r2] = await db.update(experiences).set({
  whatToAvoid: "Don't walk in without a reservation on ODI days — the restaurant fills up and they won't hold tables. A £15-per-person no-show fee applies, so cancel in advance if plans change. And don't confuse this with the Wolseley in Piccadilly — same group, very different room; Soutine is the neighbourhood version, more relaxed and less grand.",
  budgetCurrency: 'GBP',
  bestSeasons: ['jul'],
  practicalInfo: {
    hours: '11am–9:30pm',
    website: 'https://www.soutine.co.uk',
    costRange: 'Prix fixe lunch: 2 courses £19.75 / 3 courses £24.75; à la carte avg £50–60 per head',
    howToBook: 'Book online via OpenTable (opentable.com/r/soutine-london-2), call 020 3926 8448, or email reservations@soutine.co.uk. Book 3–4 weeks ahead for July ODI dates. A £15-per-person no-show fee applies — cancel in advance if plans change. Walk-ins are possible at the bar or outside terrace but unreliable on a sold-out match day.',
    bookingMethod: 'Book online via OpenTable, call 020 3926 8448, or email reservations@soutine.co.uk',
    reservationsRequired: false,
  },
}).where(eq(experiences.id, '2557db4a-79b6-427b-ba6e-bfd702794313')).returning({ id: experiences.id, title: experiences.title });

// #7 — A Morning in Queens Before the Tennis
const [r3] = await db.update(experiences).set({
  whatToAvoid: "Don't bring only a card to Golden Mall — most stalls are cash only, and the in-basement ATM charges a fee. Bring $50–80 per person in small bills before you go. And don't schedule the food tour for the afternoon if you want outer court access — grounds passes are valid from 11am, so a morning tour followed by the courts is the right sequence.",
}).where(eq(experiences.id, '64ec24f3-4e80-4326-bf3e-5a3afda00603')).returning({ id: experiences.id, title: experiences.title });

// #8 — Rooftop Dinner Then the Night Session
const [r4] = await db.update(experiences).set({
  whatToAvoid: "Don't leave the restaurant after 6:30pm if the first match matters to you — the 40-minute journey on the 7 from Hudson Yards means you'll miss the opening games. And don't buy night session tickets from unofficial resellers; the US Open's Ticketmaster resale platform is the only safe secondary source. The second match doesn't start until around 9:30pm, so if you're flexible on which match to catch, you have more time.",
}).where(eq(experiences.id, 'f23f1f1d-08dd-44f0-a548-aa04ce071aef')).returning({ id: experiences.id, title: experiences.title });

// #9 — Edgbaston Park Hotel
const [r5] = await db.update(experiences).set({
  whatToAvoid: "Don't expect to walk to Birmingham city centre from here — it's two miles and not a particularly interesting route; use taxis or the train for city trips. And don't book the standard room for a stay of three nights or more without considering the upgrade — premium rooms with extra space and robes make a real difference by day three.",
  budgetCurrency: 'GBP',
  bestSeasons: ['jul'],
  practicalInfo: {
    hours: 'Check-in from 3pm; checkout by noon. 1900 Restaurant open daily for breakfast, lunch and dinner.',
    website: 'https://www.edgbastonparkhotel.com',
    costRange: 'Rooms from ~£130/night; premium rooms from ~£160/night. Match-week rates higher — book direct for 10% discount.',
    howToBook: "Book direct at edgbastonparkhotel.com — the \"Better Direct\" programme gives guests 10% off flexible rates, a welcome drink, complimentary room upgrade, and same-day flexible cancellation. Call 0121 414 8888 and ask about match-week availability; they may have packages not listed online.",
    bookingMethod: 'Book direct at edgbastonparkhotel.com or call 0121 414 8888',
    reservationsRequired: false,
  },
}).where(eq(experiences.id, '0eb29599-f596-40a2-9b8c-0348fcb763f4')).returning({ id: experiences.id, title: experiences.title });

console.log('Updated:', r1.title);
console.log('Updated:', r2.title);
console.log('Updated:', r3.title);
console.log('Updated:', r4.title);
console.log('Updated:', r5.title);
await client.end();
