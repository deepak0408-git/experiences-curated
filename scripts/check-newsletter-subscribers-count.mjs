import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { gt } from "drizzle-orm";
import { newsletterSubscribers, proSubscriptions } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const allSubs = await db.select({ email: newsletterSubscribers.email, createdAt: newsletterSubscribers.createdAt }).from(newsletterSubscribers);
console.log("Total newsletter subscribers:", allSubs.length);
console.log(allSubs.map(s => s.email));

const activePro = await db.select({ email: proSubscriptions.email }).from(proSubscriptions).where(gt(proSubscriptions.currentPeriodEnd, new Date()));
console.log("\nActive Pro emails (excluded from send):", activePro.length);
console.log(activePro.map(p => p.email));

await client.end();
