import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { inArray } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Follow-up to scripts/refresh-singapore-gp-2027-experiences.mjs — stamps
// lastVerifiedDate on the 10 experiences actually re-verified in that pass
// (dates confirmed against FIA/F1.com's 2027 calendar; prices/line-up
// honestly checked against tickets.formula1.com and singaporegp.sg, found
// not yet released, and labelled as such rather than left stale).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const IDS = [
  "ffecb4a5-4404-44fd-a2df-857294886ade",
  "121e31fe-086d-4ba3-aeb4-2b295434278e",
  "6da9852c-2edd-45fd-9333-93c9dcf67bca",
  "6eab830b-bc7c-4afa-b370-713f3ddd0bdd",
  "c5507a89-4176-4f30-b7cf-055ff4d42abd",
  "5af21afb-eefd-4832-ac85-a178730c2dc0",
  "49ef8292-a64c-4585-8c50-67adab60fd09",
  "cba55756-94ad-458b-acb7-bedeb2b02b36",
  "b165f3b2-4506-4843-86c5-6e073fc13007",
  "f81b009e-1590-4700-a313-f49dda4aca3e",
];

const today = new Date().toISOString().split("T")[0];
const rows = await db.update(experiences).set({ lastVerifiedDate: today, updatedAt: new Date() }).where(inArray(experiences.id, IDS)).returning({ id: experiences.id, slug: experiences.slug, lastVerifiedDate: experiences.lastVerifiedDate });
rows.forEach(r => console.log("✓", r.slug, "->", r.lastVerifiedDate));
await client.end();
