import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "3f467556-9b97-4f79-9dcc-e86977a5e22d"; // Jardins, Itaim Bibi & Vila Nova Conceição

const practicalInfo = {
  costRange: "Self-catering apartments generally run US$80-200+/night depending on building and season; race weekend carries a premium across all three areas",
  bookingMethod: "Search Airbnb or Vrbo filtered to Jardins, Itaim Bibi, or Vila Nova Conceição specifically — cross-check the listing's exact address against Line 9 (Esmeralda) station proximity if a direct route to Interlagos matters to you.",
};

const [row] = await db
  .update(experiences)
  .set({ practicalInfo })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title, "→", JSON.stringify(row.practicalInfo));
await client.end();
