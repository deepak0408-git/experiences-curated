import { config } from 'dotenv';
config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { experiences } from '../schema/database.ts';
import { eq } from 'drizzle-orm';
const client = postgres(process.env.DATABASE_URL, { ssl: 'require', prepare: false });
const db = drizzle(client);

const [r1] = await db.update(experiences).set({
  address: 'The All England Lawn Tennis Club, Church Road, Wimbledon, London SW19 5AE',
  pace: 'slow',
  physicalIntensity: 1,
  budgetTier: 'free',
  budgetCurrency: 'GBP',
  bestSeasons: ['jun', 'jul'],
  practicalInfo: {
    hours: 'Gates open 10:30am on match days. SWR trains from Waterloo run every few minutes during tournament hours.',
    costRange: 'Standard Tube/rail fare — single from central London ~£3–5 on Oyster/contactless. Driving: All England Club car park requires advance booking.',
    bookingMethod: 'No booking required for public transport. All England Club car park tickets purchased in advance via wimbledon.com if driving.',
    howToBook: 'SWR from Waterloo is the fastest route from central London (21 minutes direct) — no booking needed, just tap in with contactless or Oyster. If using Southfields station (District line), exit and follow Church Road south for a 15-minute walk to the southern gates. If driving, book the All England Club car park well in advance via wimbledon.com; Wimbledon Park cricket ground operates as day-of overflow parking but fills by mid-morning on high-attendance days.',
    website: 'https://www.wimbledon.com/en_GB/visit/getting_here.html',
    reservationsRequired: false,
  },
  gettingThere: 'Fastest route: SWR train from London Waterloo to Wimbledon (21 minutes direct, every few minutes during tournament hours), then 15-minute walk along Church Road. Alternative: District line to Southfields (two stops before Wimbledon) for a less crowded exit and 15-minute walk to the southern gates. From the City or Canary Wharf: Jubilee line to Waterloo (8 minutes), then SWR direct — total under 30 minutes.',
  insiderTips: [
    'Use Southfields tube station rather than Wimbledon on busy days — the exit is significantly less crowded than Wimbledon station and the 15-minute walk to the southern gates adds less time than waiting on a packed Wimbledon platform.',
    'Arrive 30 minutes before gates open to avoid the mid-morning entry crush; the worst congestion is when latecomers converge on the gates as the first matches start around 11am.',
  ],
  whatToAvoid: "Don't drive unless you have a pre-booked parking pass — road closures around the ground are extensive and roadside parking is restricted. And don't default to the District line from central London without checking your starting point; SWR from Waterloo is consistently faster for the majority of visitors.",
}).where(eq(experiences.id, '6437c3bd-fdd4-4cd4-a66e-eb37ac4c00a7')).returning({ id: experiences.id, title: experiences.title });

const [r2] = await db.update(experiences).set({
  address: '67 High Street, Wimbledon Village, London SW19 5EE',
  pace: 'slow',
  physicalIntensity: 1,
  budgetTier: 'splurge',
  budgetCurrency: 'GBP',
  bestSeasons: ['jun', 'jul'],
  practicalInfo: {
    hours: 'Tue 5pm–10pm; Wed–Fri 12pm–3pm & 5pm–10pm; Sat 11:30am–4pm & 5pm–10pm; Sun 11:30am–8pm; closed Mon',
    costRange: 'Wimbledon Season Set Menu £58pp; wine pairing from £38; full evening ~£95–100 per person',
    bookingMethod: 'Book online at theblacklamb-restaurant.com; groups of 7+ call 020 8947 8278.',
    howToBook: 'Book at least two weeks ahead for evening sittings during the tournament fortnight. Wednesday evenings have live jazz from 7pm — worth factoring in when choosing a night. Earlier sittings (before 6:45pm) are 90-minute tables; from 7pm onwards you get two hours. If the set menu is sold out for your date, call directly — the restaurant sometimes holds back tables.',
    website: 'https://www.theblacklamb-restaurant.com',
    reservationsRequired: true,
  },
  gettingThere: 'A 15-minute walk from the All England Club through Wimbledon Village along the High Street. From Wimbledon station, walk up the hill through the Village — the restaurant is at 67 High Street. Alternatively, a short taxi from the club gates.',
  insiderTips: [
    'Wednesday evenings have live jazz from 7pm — if you\'re choosing between two nights for dinner, Wednesday is the one with the best atmosphere.',
    'The Little Black Book wine section lists rare older Nutbourne vintages not available elsewhere — ask the sommelier what\'s in it before you order; it changes and isn\'t always on the printed menu.',
  ],
  whatToAvoid: "Don't arrive without a reservation during the tournament — the restaurant fills fast in June and July, and walk-ins during Wimbledon week are turned away. And don't ignore the earlier sitting times if the 7pm slots are gone; the 90-minute early sitting is enough time for the set menu without feeling rushed.",
}).where(eq(experiences.id, '25aea497-7186-4f81-9d21-83975f2649e2')).returning({ id: experiences.id, title: experiences.title });

const [r3] = await db.update(experiences).set({
  address: 'USTA Billie Jean King National Tennis Center, Flushing Meadows-Corona Park, Queens, NY 11368',
  pace: 'slow',
  physicalIntensity: 1,
  budgetTier: 'splurge',
  budgetCurrency: 'USD',
  bestSeasons: ['aug', 'sep'],
  practicalInfo: {
    hours: 'Day sessions start ~11am; night sessions 7pm. Gates open 90 minutes before each session.',
    costRange: 'Night session tickets from ~$150 (first week) to $500+ (semifinals/final); day sessions from ~$80',
    bookingMethod: 'Book via usopen.org as soon as tickets go on sale — night sessions sell out months in advance.',
    howToBook: "Night session tickets for the second week (quarterfinals onward) are the premium purchase — buy as early as possible, often when the initial on-sale date opens in the spring. If sold out, the US Open's official resale marketplace (via Ticketmaster) is the safest secondary source. Day sessions offer better value and are often available closer to the tournament. Grounds passes do not cover reserved Arthur Ashe seating but allow entry to the concourse level on applicable sessions.",
    website: 'https://www.usopen.org',
    reservationsRequired: true,
  },
  gettingThere: 'Take the 7 train to Mets-Willets Point station — the USTA complex is an 8-minute walk. Arthur Ashe Stadium is the dominant structure visible from the station exit; follow the signs.',
  insiderTips: [
    'Book night session tickets before anything else in your US Open planning — they sell out months in advance and the atmosphere during a close match at 10pm is the defining US Open experience.',
    'Find your section early and check the replay screens at each end of the court — the crowd reaction to a Hawk-Eye challenge, collective tension building as the trajectory appears on screen, is one of the specific pleasures of this venue.',
  ],
  whatToAvoid: "Don't buy Arthur Ashe day session tickets expecting the same atmosphere as nights — the stadium is often half-empty for early-round day sessions and the energy is flat compared to evenings. And don't purchase from unofficial resellers; use the US Open's official Ticketmaster resale platform only.",
}).where(eq(experiences.id, 'f779d744-9af2-44d2-83d4-fc6a94085d14')).returning({ id: experiences.id, title: experiences.title });

console.log('Updated:', r1.title);
console.log('Updated:', r2.title);
console.log('Updated:', r3.title);
await client.end();
