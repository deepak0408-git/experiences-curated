import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "ee6ca54b-203b-43e6-8b85-bd3c61f760c5"; // Stand25 Bisztró

const bodyContent = `Stand25 started life as a market stall, kiosk No.25 at the Downtown Market on the Pest side, before moving to a proper bricks-and-mortar space at Attila út 10 in autumn 2019, on the Buda side near the tunnel by Clark Ádám tér. It's worth knowing that history because it explains the food: this is freestyle Hungarian cooking with a Mediterranean edge, built by people who earned a following one stall customer at a time before they had a dining room.

There's no à la carte. Dinner is a fixed 2 or 3-course menu, three or four dish choices per course, some with a small supplement. Mains run roughly 8,000-11,000 HUF, with dinner landing around 20,000+ HUF per person all in, a genuine step up from a casual bisztró but well short of Budapest's true fine-dining prices. The kitchen picked up a Michelin Bib Gourmand within a year of the move, recognition for good food at a fair price rather than a full star, and it's an accurate description of what's on the plate.

Note the location carefully: despite the name's echo of the old Pest market stall, Stand25 today is in District I, on the Buda side, not in the Pest districts where most of this trip's other dining and nightlife sits. It's a deliberate crossing of the river, not a stop on the way to somewhere else.`;

const practicalInfo = {
  hours: "Check stand25.hu for current service days and times, fixed-menu dinner service",
  website: "https://stand25.hu/?lang=en",
  costRange: "Mains 8,000-11,000 HUF; dinner approx. 20,000+ HUF per person",
  bookingMethod: "Reserve via stand25.hu or by phone ahead of your visit, especially on weekend evenings, the fixed-menu format and Michelin Bib Gourmand recognition mean tables go quickly.",
  reservationsRequired: true,
};

const [result] = await db
  .update(experiences)
  .set({ bodyContent, practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ ${result.title} — currency unified to HUF`);

await client.end();
