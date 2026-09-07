import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

await db.update(experiences)
  .set({
    address:
      "Le Pré Catelan: Route de Suresnes, Bois de Boulogne, 75016 Paris; La Grande Cascade: Allée de Longchamp, Bois de Boulogne, 75016 Paris; Blanc: 52 Rue de Longchamp, 75116 Paris",
  })
  .where(eq(experiences.slug, "french-open-luxury-dining-bois-de-boulogne"));

console.log("✓ french-open-luxury-dining-bois-de-boulogne — top-level address field now lists all 3 restaurant addresses");

await client.end();
