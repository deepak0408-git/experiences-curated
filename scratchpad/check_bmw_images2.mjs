import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEventExperiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select({ id: sportingEvents.id }).from(sportingEvents).where(eq(sportingEvents.slug, "bmw-pga-championship-2026"));
console.log("event", event);

const links = await db.select({ experienceId: sportingEventExperiences.experienceId }).from(sportingEventExperiences).where(eq(sportingEventExperiences.sportingEventId, event.id));
const ids = links.map(l => l.experienceId);
const rows = await db.select({ title: experiences.title, slug: experiences.slug, heroImageUrl: experiences.heroImageUrl }).from(experiences);
const filtered = rows.filter(r => ids.includes(r.id) || true).filter(r => true);
const matched = rows.filter(r => ids.some(id => id === r.id));
