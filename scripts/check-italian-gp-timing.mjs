import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select({
  name: sportingEvents.name,
  activatedAt: sportingEvents.activatedAt,
  newsletterAnnouncedAt: sportingEvents.newsletterAnnouncedAt,
}).from(sportingEvents).where(eq(sportingEvents.slug, "italian-gp-2026"));

const activatedAt = new Date(event.activatedAt);
const twoDaysLater = new Date(activatedAt.getTime() + 2 * 24 * 60 * 60 * 1000);
const now = new Date();

console.log("Activated at:", activatedAt.toISOString());
console.log("2-day threshold met at:", twoDaysLater.toISOString());
console.log("Now:", now.toISOString());
console.log("Threshold already passed?", now >= twoDaysLater);
console.log("newsletterAnnouncedAt:", event.newsletterAnnouncedAt);

await client.end();
