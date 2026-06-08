import { db } from "../lib/db";
import { purchases, sportingEvents } from "../schema/database";
import { eq } from "drizzle-orm";

async function main() {
  const rows = await db
    .select({
      email: purchases.email,
      slug: sportingEvents.slug,
      createdAt: purchases.createdAt,
      paddleCustomerId: purchases.paddleCustomerId,
    })
    .from(purchases)
    .innerJoin(sportingEvents, eq(purchases.sportingEventId, sportingEvents.id))
    .orderBy(purchases.createdAt);

  console.log(JSON.stringify(rows, null, 2));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
