import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Publishes the 5 new/rewritten Hungarian GP grandstand experiences seeded
// 16 Oct 2026 as part of the grandstand-experience restructure following
// the Ticket Intelligence build (Hungaroring both-tiers, T1, Grid 1, Grid 2,
// Pit Exit 1) — were status: in_review, each independently passed the
// experience-researcher skill's §5b/§6 self-audit before seeding.
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const IDS = [
  "a56d476d-a7c1-4cff-a7f3-5d08ed94263e", // Hungaroring both-tiers
  "65dc2dae-ac4c-42ff-bc88-be48bd461b1e", // T1
  "7e59b266-3172-4ce5-91d5-ba0e9b464d94", // Grid 1
  "eb6df24a-3f3e-4d52-8ff3-3c9dd4b09f95", // Grid 2
  "46341493-525c-4a47-83aa-99afe22b07ca", // Pit Exit 1
];

const rows = await db
  .update(experiences)
  .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
  .where(inArray(experiences.id, IDS))
  .returning({ id: experiences.id, title: experiences.title, status: experiences.status });

rows.forEach((r) => console.log(`✓ ${r.status}: ${r.title}`));

await client.end();
