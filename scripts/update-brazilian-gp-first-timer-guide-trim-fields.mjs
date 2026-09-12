import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "c47fb5d1-4117-4fe9-a792-c241772ce125"; // First-Timer's Guide to São Paulo

const practicalInfo = {
  costRange: "Rideshare: roughly R$15-30 for most trips between central neighborhoods. Bilhete Único: loaded with credit as needed, standard city transit fares apply.",
  bookingMethod: "Download Uber and 99 before arrival; buy a Bilhete Único card at any metro station.",
};

const [row] = await db
  .update(experiences)
  .set({ practicalInfo, gettingThere: null })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, gettingThere: experiences.gettingThere, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title);
console.log("gettingThere:", row.gettingThere);
console.log(JSON.stringify(row.practicalInfo, null, 2));
await client.end();
