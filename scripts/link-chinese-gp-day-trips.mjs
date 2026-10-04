// Links the 3 existing Shanghai day-trip experiences (originally seeded for
// Shanghai Masters 2026) to Chinese Grand Prix 2027, per founder-confirmed
// reuse decision, 23 Sep 2026 — these are venue-agnostic (reached via
// Shanghai's rail hubs regardless of which circuit/arena a visitor is based
// near). Per experience-researcher §2b reuse workflow:
//   1. sportingEventExperiences join-table row (this script)
//   2. `sport` array append (formula_one, alongside existing tennis)
//   3. EXPERIENCE_TO_SPOKE_BY_EVENT entry under chinese-grand-prix key
//      (deferred to spoke-build phase — day-trips spoke — tracked in memory)
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, inArray, sql } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese Grand Prix 2027

const DAY_TRIP_IDS = [
  "b56ac685-efd3-443a-a2af-9d2dd103a48f", // Hangzhou and West Lake
  "0a9381b6-8358-41f5-98fa-8ed67e4adc95", // Zhujiajiao Water Town
  "aab3e6fb-5eec-4872-80a0-3c78d88230e0", // Suzhou's Classical Gardens
];

for (const id of DAY_TRIP_IDS) {
  const [exp] = await db.select({ id: experiences.id, title: experiences.title, sport: experiences.sport }).from(experiences).where(eq(experiences.id, id));
  if (!exp) {
    console.error("NOT FOUND:", id);
    continue;
  }

  // 1. Join-table link
  await db.insert(sportingEventExperiences)
    .values({ experienceId: id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  // 2. Append formula_one to sport array if not already present
  const currentSport = exp.sport ?? [];
  if (!currentSport.includes("formula_one")) {
    const updatedSport = [...currentSport, "formula_one"];
    await db.update(experiences).set({ sport: updatedSport }).where(eq(experiences.id, id));
    console.log("✓ Linked + sport updated:", exp.title, "→", JSON.stringify(updatedSport));
  } else {
    console.log("✓ Linked (sport already included formula_one):", exp.title);
  }
}

await client.end();
