import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql as rawSql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Strip "sold out at research time" / point-in-time availability language
// from practicalInfo.costRange on the 5 new Belgian GP experiences seeded
// 12 Oct 2026 — founder correction, same day: costRange should state the
// price only, not a transient snapshot of what was sold out when Claude
// researched it. The weekend price itself is a real, durable fact (even if
// occasionally unavailable); "was sold out at research time" is not.
const UPDATES = [
  {
    id: "a2fe932f-4d96-495a-9e2b-af99da8955a3", // Gold 1: Pit Grandstand
    costRange: "3-day Gold 1 ticket from €506 (Friday-Saturday) to €895 (full weekend).",
  },
  {
    id: "415ad447-2dcf-434a-8706-947d1e9ba096", // Les Combes
    costRange: "3-day weekend adult: Combes 1 €415, Combes 2 €520 (newly covered), Combes 3 €495 (covered), Combes 4 €395.",
  },
  {
    id: "cde406a7-9ac9-47bd-8662-3c0586390c11", // La Source Hairpin
    costRange: "3-day weekend adult from €578 (Gold 7 ter) to €895 (Gold 7/Gold 8 full weekend); Gold 9 €740, Gold 9 bis €667, Gold 7 bis €607.",
  },
  {
    id: "ae6b94d2-84e5-455a-b143-f4dfc26e5562", // Paddock Club
    costRange: "3-day weekend, US$5,500 per person.",
  },
  {
    id: "fcc5ff87-f014-4814-92d1-b5dbcf10ff4b", // Bus Stop Chicane
    costRange: "3-day weekend adult: Gold 6 bis €545 (uncovered), Gold 11 Premium €950 (covered).",
  },
];

for (const u of UPDATES) {
  const [row] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.id, u.id));
  const updated = { ...row.practicalInfo, costRange: u.costRange };
  await db.update(experiences).set({ practicalInfo: updated }).where(eq(experiences.id, u.id));
  console.log(`✓ ${u.id} costRange updated`);
}

await client.end();
