import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "fcf7dbbb-a170-40a2-b4c5-ac7dbf134fc4"; // The Chicane

const bodyContent = `Turns 6 and 7 are the slowest part of the Hungaroring lap, a tight left-right chicane guarded by tall sausage kerbs that punish anyone who gets greedy with the exit. Drivers call it the corner that can undo a whole lap. Carry too much speed in, or clip too much kerb on the way out, and the car steps out of line just enough to cost time through the next sector, sometimes damage the floor doing it.

This isn't a corner built for a dramatic overtake, the way Turn 1 is. It's a corner built for watching precision fail in real time. From the grandstand here you watch cars arrive at wildly different speeds depending on how well the driver read the exit of Turn 5, and you watch some of them get it wrong, a wide line, a locked wheel, a moment where the whole lap goes from clean to scrappy.

Three grandstands cover this section, numbered Chicane 1 through 3, and they're genuinely different seats, not just different price points. Chicane 1 is the cheapest and sits on the quieter side of the track, away from most of the other stands and fan facilities, a solid view for a lower price if you don't mind being a walk from anything else. Chicane 2 sits right next to it with a noticeably better angle on the same corner, the natural middle-ground choice. Chicane 3 is the highest and most elevated of the three, giving the widest view across the section, cars exiting Turn 5, threading the chicane, and setting up for what comes next, all in one sightline.

The Hungaroring earned its reputation as one of the hardest circuits to pass on partly because of sections like this one, tight, technical, unforgiving of mistakes but not offering many chances to capitalise on someone else's. If Turn 1 is where races get decided, the chicane is where they quietly get lost, lap by lap, corner by corner, well before the grandstand crowds at the final turn ever notice.`;

const insiderTips = [
  "If you want the widest view of the whole section, book Chicane 3, it sits highest and takes in the run from Turn 5 through the chicane in one sightline. If budget matters more than angle, Chicane 1 is the cheapest of the three, just further from the other fan facilities.",
  "Watch Turn 5 as cars set up for the chicane, not just the chicane itself, a bad line into Turn 5 is usually what causes the visible mistake at Turns 6-7.",
];

const practicalInfo = {
  hours: "Gates typically open around 8am on race day; grandstand seating available across Chicane 1, 2, and 3",
  website: "https://tickets.formula1.com/en/f1-3277-hungary",
  costRange: "Chicane 1 is the most affordable of the three; Chicane 2 and 3 command a premium for a better or more elevated angle, check tickets.formula1.com for current-year pricing",
  bookingMethod: "Check the current grandstand map at f1hungary.com/en/map-of-grandstands before booking. Chicane 1, 2, and 3 all cover this section, Chicane 3 sits highest with the widest view, Chicane 1 is cheapest but further from other fan facilities.",
  reservationsRequired: true,
};

const [result] = await db
  .update(experiences)
  .set({ bodyContent, insiderTips, practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated with grandstand guidance: ${result.title}`);

await client.end();
