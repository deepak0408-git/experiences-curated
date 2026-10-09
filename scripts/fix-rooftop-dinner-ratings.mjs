import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [e] = await db.select({ body: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, "us-open-rooftop-night-session-mq4wj7fr"));
let b = e.body;

b = b.replace(
  "The roof has unobstructed views south toward the Statue of Liberty and east toward the bridges.",
  "The roof has unobstructed views south toward the Statue of Liberty and east toward the bridges. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13800587555646796196)"
);
b = b.replace(
  "more suited to a drink before you head out than a full dinner.",
  "more suited to a drink before you head out than a full dinner. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10849186684491682474)"
);
b = b.replace(
  "takes reservations for 5pm seatings that clear by 6:30pm comfortably.",
  "takes reservations for 5pm seatings that clear by 6:30pm comfortably. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=7298340055988969067)"
);

console.log("changed:", b !== e.body, "| links:", (b.match(/See live rating/g) || []).length);
await db.update(experiences).set({ bodyContent: b, lastVerifiedDate: "2026-10-05" }).where(eq(experiences.slug, "us-open-rooftop-night-session-mq4wj7fr"));
await client.end();
