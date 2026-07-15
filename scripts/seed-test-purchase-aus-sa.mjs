import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { purchases } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806"; // australia-in-south-africa-cricket-2026
const EMAIL = "deepak0408@gmail.com";

try {
  const [result] = await db
    .insert(purchases)
    .values({
      email: EMAIL,
      sportingEventId: EVENT_ID,
      paddleOrderId: `test-dodo-${Date.now()}`,
      paddlePriceId: "pdt_0NjElGmJM8qvJ0KhsdPxD",
      priceTier: "early_bird",
      pricePaid: "5.00",
      currency: "USD",
      status: "active",
    })
    .returning({ id: purchases.id, email: purchases.email, sportingEventId: purchases.sportingEventId });

  console.log("✓ Test purchase row created — DELETE THIS AFTER TESTING");
  console.log("  id:              ", result.id);
  console.log("  email:           ", result.email);
  console.log("  sportingEventId: ", result.sportingEventId);
  console.log("\nTo delete later:");
  console.log(`  DELETE FROM purchases WHERE id = '${result.id}';`);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
