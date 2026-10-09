import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [e] = await db.select({ body: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, "where-to-stay-us-open-mq4wj388"));
let b = e.body;

b = b.replace(
  "and you're in the middle of the food ecosystem that makes this tournament distinctive.",
  "and you're in the middle of the food ecosystem that makes this tournament distinctive. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15472696094157932156)"
);
b = b.replace(
  "and often better value than equivalent Manhattan rooms.",
  "and often better value than equivalent Manhattan rooms. [See live ratings: Boro Hotel](https://maps.google.com/?cid=3083835488917881241) · [Hilton Garden Inn LIC](https://maps.google.com/?cid=10080082563725713418)"
);
b = b.replace(
  "with no transfer, 38–42 minutes door to gate.",
  "with no transfer, 38–42 minutes door to gate. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5765478113925002521)"
);

console.log("changed:", b !== e.body, "| links:", (b.match(/See live rating/g) || []).length);
await db.update(experiences).set({ bodyContent: b, lastVerifiedDate: "2026-10-05" }).where(eq(experiences.slug, "where-to-stay-us-open-mq4wj388"));
await client.end();
