import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { purchases, sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [event] = await db.select({ id: sportingEvents.id }).from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026")).limit(1);

if (!event) { console.error("Event not found"); process.exit(1); }

await db.insert(purchases).values({
  email: process.argv[2],
  sportingEventId: event.id,
  paddleOrderId: "test_order_" + Date.now(),
  paddleCustomerId: "test_customer",
  paddlePriceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_EARLY_BIRD,
  priceTier: "early_bird",
  pricePaid: "15.00",
  currency: "GBP",
  status: "active",
}).onConflictDoNothing();

console.log("Test purchase inserted for", process.argv[2]);
await client.end();
