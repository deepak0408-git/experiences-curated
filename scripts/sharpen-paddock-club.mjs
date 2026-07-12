import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "752d5d06-1e81-403b-8e57-4f77dd8b57e3"; // Paddock Club

const bodyContent = `The Paddock Club sits directly above the team garages on the main straight, looking down onto both the start-finish line and the grid. It's F1's own official hospitality product, run by the sport rather than a third-party operator, and the day is structured around access rather than just a good seat and a nice lunch.

The Pit Lane Walk is the centrepiece. You get 30-60 minutes roaming the actual pit lane, close enough to the garages to watch mechanics prep the cars, catch teams practising pit stops, and, often enough that it's not a rare event, walk past a driver or team principal doing the same thing you are. It runs once or twice a day between sessions, and it's the one thing no grandstand or general admission ticket can replicate at any price. Beyond the walk, Paddock Club packages typically include a Championship Trophy photo opportunity, an F1 Pit Stop Challenge where guests can try a simulated tyre change against the clock, F1 simulator rigs, and a Parade Truck Tour, activities built to fill the hours between sessions rather than leave guests waiting around a hospitality suite.

Food runs the full day rather than a single lunch service: morning tea and pastries on arrival, a gourmet lunch built around local Hungarian ingredients, and an open bar running Champagne, wine, and spirits from morning through the chequered flag. Parking is one pass per four guests, worth knowing if you're coordinating a group. Weather is a genuine factor too, Hungaroring race weekend regularly hits 30°C-plus in late July, and the air-conditioned suite is as much a relief from the heat as it is a viewing position.`;

const whyItsSpecial = `Most premium hospitality at a Grand Prix is a good view plus good catering, interchangeable in spirit from one circuit to the next. Paddock Club's actual differentiator is proximity to the mechanics of the sport itself, not just the racing. Watching a pit stop from the stand versus walking the same pit lane the mechanics are working in, close enough to genuinely bump into a driver between sessions, is a different kind of day out entirely. The Pit Lane Walk is the part no other ticket tier can replicate, and the Pit Stop Challenge and simulator rigs turn the hours between sessions into something more than waiting for the next round of racing.`;

const insiderTips = [
  "Book the Aramco Pit Lane Walk time slot as early in your first day as you can, it's a fixed daily window, runs once or twice between sessions, and once it's over for the day, it's over.",
  "Ask specifically whether your package includes a named team suite or the shared F1 Experiences suite, the atmosphere and access differ and it changes what to expect from the day.",
  "If you're travelling as a group, remember parking passes are issued one per four guests, coordinate who's driving before race morning rather than assuming everyone gets their own pass.",
];

const whatToAvoid = `Don't assume Paddock Club automatically includes a specific team's suite, generic F1 Experiences packages and named-team suites (McLaren, Ferrari, etc.) are sold and priced separately, confirm exactly which you're booking before paying. And don't skip the Pit Stop Challenge or simulator activities thinking they're filler, they're genuinely part of what separates a Paddock Club day from just watching the race from a nice seat.`;

const practicalInfo = {
  hours: "3-day access (Fri-Sun), gates and hospitality suite open ahead of first practice each day",
  website: "https://f1experiences.com/2026-hungarian-grand-prix",
  costRange: "Premium tier, above Champions Club (approx. €3,670/3 days for 2026) — check f1experiences.com or edgeglobalevents.com for current Paddock Club pricing",
  howToBook: "If you're planning on Paddock Club for Hungaroring, book through f1experiences.com directly rather than a reseller markup, it's the official channel and carries F1's own guarantee. Paddock Club packages for mid-season European rounds like Hungary typically go on sale the preceding autumn and the best team-branded suites (McLaren, Ferrari, Red Bull) sell out first, often 4-5 months before race weekend, well ahead of the general public ticket window. If you want a specific team's suite rather than the shared F1 Experiences suite, that's the detail to lock in early, generic Paddock Club access stays available longer than named-team hospitality. Build the Aramco Pit Lane Walk into your day one plan and check the day's Pit Stop Challenge and simulator slot times on arrival, both run on a schedule and are easy to miss if you're not tracking it.",
  bookingMethod: "Official F1 hospitality, sold via f1experiences.com and authorised resellers such as edgeglobalevents.com and grandprixevents.com. Includes the daily Aramco Pit Lane Walk, Championship Trophy photo opportunity, F1 Pit Stop Challenge, F1 simulators, and Parade Truck Tour. One parking pass issued per four guests.",
  reservationsRequired: true,
};

const [result] = await db
  .update(experiences)
  .set({ bodyContent, whyItsSpecial, insiderTips, whatToAvoid, practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Sharpened: ${result.title}`);

await client.end();
