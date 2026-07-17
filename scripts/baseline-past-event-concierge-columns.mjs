import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { purchases, sportingEvents } from "../schema/database.ts";
import { eq, lt, isNull, and } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const now = new Date();
const today = now.toISOString().split("T")[0];

// Only events whose endDate is already in the past get baselined — upcoming
// events (Open Championship still in progress, Belgian GP starting today,
// Hungarian GP, Italian GP, BMW PGA, US Open, Aus-SA) stay NULL so the new
// concierge-outreach crons can naturally pick up their purchasers when the
// real trigger date arrives.
const pastEvents = await db
  .select({ id: sportingEvents.id, name: sportingEvents.name })
  .from(sportingEvents)
  .where(lt(sportingEvents.endDate, today));

console.log("Baselining purchases for past events:", pastEvents.map(e => e.name).join(", "));

let totalPre = 0;
let totalPost = 0;

for (const event of pastEvents) {
  const preResult = await db
    .update(purchases)
    .set({ conciergeOutreachPreTripSentAt: now })
    .where(and(
      eq(purchases.sportingEventId, event.id),
      isNull(purchases.conciergeOutreachPreTripSentAt),
    ))
    .returning({ email: purchases.email });
  totalPre += preResult.length;

  const postResult = await db
    .update(purchases)
    .set({ conciergeOutreachPostTripSentAt: now })
    .where(and(
      eq(purchases.sportingEventId, event.id),
      isNull(purchases.conciergeOutreachPostTripSentAt),
    ))
    .returning({ email: purchases.email });
  totalPost += postResult.length;

  console.log(`  ${event.name}: ${preResult.length} pre-trip baselined, ${postResult.length} post-trip baselined`);
}

console.log(`\nDone — ${totalPre} pre-trip, ${totalPost} post-trip columns baselined to today's date (only where previously NULL).`);
await client.end();
