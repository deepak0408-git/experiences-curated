import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "6199e022-81d0-4354-8a0f-0ab40fed63a2"; // F1 Fan Lounge

const practicalInfo = {
  hours: "3-day access (Fri-Sun), lounge opens ahead of first practice each day",
  website: "https://f1experiences.com/2026-hungarian-grand-prix",
  costRange: "Approx. €2,035 for 3 days (2026 pricing), roughly half of Champions Club",
  bookingMethod: "Sold via f1experiences.com and official F1 hospitality resellers. Includes a reserved covered seat in the Hungaroring Grandstand plus indoor lounge access with buffet and open bar for all three days.",
  howToBook: "One detail worth knowing before you book: the open bar runs Saturday and Sunday only, not Friday, check this against your dates if you're planning around a full three-day drinks package. Contact F1 Experiences directly at info@f1experiences.com or +1 888 326 5430 to confirm current Fan Lounge availability before paying, mid-season European rounds like Hungary can sell through this tier a few months out even though it's positioned as the accessible step up from a grandstand seat, it's still a finite hospitality allocation, not an unlimited product.",
  reservationsRequired: true,
};

const [result] = await db
  .update(experiences)
  .set({ practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Added Concierge howToBook: ${result.title}`);

await client.end();
