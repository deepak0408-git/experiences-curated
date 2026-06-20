import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { experiences } from '../schema/database.ts';
import { eq } from 'drizzle-orm';
const client = postgres(process.env.DATABASE_URL, { ssl: 'require', prepare: false });
const db = drizzle(client);

const [r1] = await db.update(experiences).set({
  address: 'Edgbaston Cricket Ground, Edgbaston Road, Birmingham B5 7QU',
  pace: 'slow',
  physicalIntensity: 1,
  budgetTier: 'budget',
  budgetCurrency: 'GBP',
  bestSeasons: ['jul'],
  practicalInfo: {
    hours: 'Gates open 2 hours before play (9am for 11am start on 14 July 2026)',
    costRange: 'General admission tickets from ~£30; Eric Hollies Stand tickets typically £50–80 for ODIs',
    bookingMethod: 'Book via edgbaston.com or ecb.co.uk — Eric Hollies Stand sells out well ahead of India fixtures.',
    howToBook: "Eric Hollies Stand (Block 22 specifically) is the priority booking — it sells out faster than any other area for India fixtures. If it's gone, the Raglan Stand opposite gives a full view of the Eric Hollies atmosphere. Hospitality packages available via Edgbaston's official site for those wanting guaranteed seating, premium food, and a view from the pavilion end. Bharat Army section allocations are announced on bharatarmy.com closer to the match; Gold members get priority notification.",
    website: 'https://edgbaston.com/tickets',
    reservationsRequired: true,
  },
  gettingThere: 'From Birmingham New Street: bus routes 45 or 47 to Pershore Road (5 minutes, 2-minute walk to gates), match-day shuttle buses direct from New Street, or a 40-minute walk down Edgbaston Road. Taxi from New Street takes approximately 10 minutes. Do not drive — parking near the ground on match days is extremely limited.',
  insiderTips: [
    'Book Block 22 of the Eric Hollies Stand specifically — that is where the Bharat Army drums and flags are concentrated, and the difference in atmosphere between Block 22 and the rest of the ground on an India match day is significant.',
    'Arrive well before gates open: the pre-match scene on Pershore Road — food stalls, jerseys, fans who have travelled from across the country — is part of the day, and it builds for an hour before play starts.',
  ],
  whatToAvoid: "Don't turn up without a ticket expecting to buy at the gate — India fixtures at Edgbaston sell out, and touts on Pershore Road charge significant premiums. And don't underestimate the walk from the city centre; the 40-minute route down Edgbaston Road is fine if you leave early, but cutting it close means arriving as play starts rather than being part of the build-up.",
}).where(eq(experiences.id, '976a5707-3600-4fb0-8949-b916e7930472')).returning({ id: experiences.id, title: experiences.title });

const [r2] = await db.update(experiences).set({
  address: 'USTA Billie Jean King National Tennis Center, Flushing Meadows-Corona Park, Queens, NY 11368',
  pace: 'slow',
  physicalIntensity: 1,
  budgetTier: 'budget',
  budgetCurrency: 'USD',
  bestSeasons: ['aug', 'sep'],
  practicalInfo: {
    hours: 'Gates open approximately 11am for day sessions; US Open runs late August into early September',
    costRange: 'Grounds passes ~$40–60 (first week); reserved session tickets from ~$80 (day) to $500+ (night, late rounds)',
    bookingMethod: 'Tickets via usopen.org or the US Open app — do not use secondary market platforms without checking the official site first.',
    howToBook: 'Buy grounds passes for the first week as soon as they go on sale in spring — prices are lower and flexibility is higher. Night session reserved tickets for the second week (quarterfinals onward) sell out fastest; buy those first if that is your priority. The US Open app carries the official secondary marketplace if face-value tickets are unavailable.',
    website: 'https://www.usopen.org/en_US/tickets/index.html',
    reservationsRequired: false,
  },
  gettingThere: 'Take the 7 train to Mets-Willets Point station — an 8-minute walk from the station exit brings you to the USTA gates. From Times Square, the journey takes 38–42 minutes. From Grand Central, slightly less. Tap in with a contactless card or phone (OMNY) — $3.00 fare, no MetroCard needed.',
  insiderTips: [
    'Download the US Open app before you arrive — it has real-time court assignments, match scores, and delay notifications; checking it from the 7 train tells you which outer court to head to first.',
    'Bring a refillable water bottle — free water filling stations are distributed throughout the grounds, and in August heat staying hydrated is a practical matter, not a preference.',
  ],
  whatToAvoid: "Don't bring a large backpack or hard-sided bag — the USTA bag policy limits bags to 12\" × 16\" × 8\" soft-sided only, and security lines slow considerably when people arrive with oversized bags. Check the policy before you pack.",
}).where(eq(experiences.id, 'ad53475e-d932-44af-803f-608cc6d51263')).returning({ id: experiences.id, title: experiences.title });

console.log('Updated:', r1.title);
console.log('Updated:', r2.title);
await client.end();
