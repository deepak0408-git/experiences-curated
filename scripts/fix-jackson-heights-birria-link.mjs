import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [e] = await db.select({ body: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, "jackson-heights-food-mile-mq4wj388"));
const target = "The queue moves; it's worth joining.";
const replacement = target + " [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9134211391229749367)";
const newBody = e.body.replace(target, replacement);
console.log("found target:", e.body.includes(target));
console.log("changed:", newBody !== e.body, "| links:", (newBody.match(/See live rating/g) || []).length);

await db.update(experiences).set({ bodyContent: newBody, lastVerifiedDate: "2026-10-05" }).where(eq(experiences.slug, "jackson-heights-food-mile-mq4wj388"));
await client.end();
