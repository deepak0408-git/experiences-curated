import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

// Usage: node flip-belgian-gp-format.mjs hub_and_spoke | classic
// Real, tested rollback path per migrate-from-classic-to-hub-spoke skill §2
// — takes either value deliberately so a bad migration can be reverted in
// one command. Flipped ahead of the full §7 post-migration gate on
// explicit founder instruction, 12 Oct 2026 (gate items — Google ratings
// review, grep sweep, Blog/Planner/Calendar check — still open, tracked
// separately).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_GP_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const target = process.argv[2];
if (target !== "hub_and_spoke" && target !== "classic") {
  throw new Error('Usage: node flip-belgian-gp-format.mjs hub_and_spoke|classic');
}

const [before] = await db.select({ packFormat: sportingEvents.packFormat }).from(sportingEvents).where(eq(sportingEvents.id, BELGIAN_GP_ID));
console.log("Before:", before.packFormat);

const [after] = await db.update(sportingEvents).set({ packFormat: target, updatedAt: new Date() }).where(eq(sportingEvents.id, BELGIAN_GP_ID)).returning({ packFormat: sportingEvents.packFormat, isHidden: sportingEvents.isHidden });
console.log("After:", after);

await client.end();
