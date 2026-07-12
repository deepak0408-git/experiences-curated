import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "3d4dd55a-bd01-4d8c-8daa-6a5702ed35cf"; // Your Hungarian GP Ticket Guide

const practicalInfo = {
  hours: "Race weekend 24-26 Jul 2026. Gates typically open around 8am each day.",
  website: "https://tickets.formula1.com/en/f1-3277-hungary",
  costRange: "GA 3-day approx. €72; grandstand seats from approx. €200/weekend; Hungaroring Grandstand (covered) at a premium; F1 Fan Lounge approx. €2,035/3 days; Champions Club approx. €3,670/3 days; Paddock Club priced above both",
  bookingMethod: "Buy direct via tickets.formula1.com/en/f1-3277-hungary or f1hungary.com/en/tickets. Both are official channels carrying the full range from GA through grandstands. Hospitality tiers (Fan Lounge, Champions Club, Paddock Club) are sold via f1experiences.com. If you're weighing tiers, the honest strategy is: book GA or a mid-tier grandstand as soon as you've decided you're going, Hungary's low price point means people underestimate how fast the popular stands move. Don't feel pressured into a hospitality tier just because the base price feels cheap, the value gap between a good GA spot and full Paddock Club is larger here than at almost any other round.",
  reservationsRequired: true,
};

const [result] = await db
  .update(experiences)
  .set({ practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Removed howToBook, merged into bookingMethod: ${result.title}`);

await client.end();
