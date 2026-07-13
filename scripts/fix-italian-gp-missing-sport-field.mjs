import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const ids = [
  "037780a7-2d9b-4ee9-84ac-b4bc094614f2", // Getting to the Circuit — Train, Walk & Parking
  "3b290e97-4c0d-4440-8579-34856b0b8168", // Curva Grande — General Admission at the High-Speed Sweep
  "581b601a-b614-4d53-9c24-8472b2dfd9bb", // Eating in Monza — Risotto, Luganega & the Brianza Table
  "741de32c-5d71-4873-842b-288504c0f15d", // The Fan Zone — Ascari to Parabolica
  "99540487-ee1b-47a2-a527-67d0857a2502", // Grandstand 22 — The Parabolica Corner
  "c224cf19-3793-46d4-97d5-ec7b01fa1515", // Hotel de la Ville — Monza's F1 Pilots' Hotel
  "d69d0936-8008-42f0-b200-2b2114e79a77", // Grandstand 26 — Pit Lane, Grid & Podium Views
  "d93634df-2f83-4654-84e3-0c6acdfe7f79", // Monza Town & the Royal Villa
];

const result = await db
  .update(experiences)
  .set({ sport: ["formula_one"] })
  .where(inArray(experiences.id, ids))
  .returning({ id: experiences.id, title: experiences.title, sport: experiences.sport });

for (const r of result) console.log("✓", r.title, "|", JSON.stringify(r.sport));
console.log(`\n${result.length} experiences fixed.`);

await client.end();
