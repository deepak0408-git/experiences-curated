import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Real F1 Tickets 3-day (Fri-Sun) grandstand prices, sourced 5 Sep 2026 from
// tickets.formula1.com/en/f1-3320-united-states, converted EUR->USD at
// 1 EUR = 1.1622 USD (frankfurter.app, 4 Sep 2026) — same source and rate
// used for scripts/seed-us-gp-ticket-tiers.mjs. Sunday race-day-only prices
// noted as a side fact where relevant, not the headline figure.
const UPDATES = [
  {
    slug: "us-gp-general-admission-mtnb3iak",
    costRange: "US$555 for the 3-day (Friday-Sunday) pass — real, published tickets.formula1.com pricing. A cheaper Sunday race-day-only ticket also exists, from roughly US$310.",
  },
  {
    slug: "us-gp-turn-1-big-red-mtnau7yl",
    costRange: "US$1,420-US$1,545 for the 3-day pass — real, published tickets.formula1.com pricing, one of COTA's higher-priced grandstands.",
  },
  {
    slug: "us-gp-turn-15-stadium-mtnawame",
    costRange: "US$730-US$1,175 for the 3-day pass — real, published tickets.formula1.com pricing.",
  },
  {
    slug: "us-gp-main-grandstand-mtnarnxn",
    costRange: "US$1,420-US$1,545 for the 3-day pass — real, published tickets.formula1.com pricing, COTA's highest-priced general grandstand tier.",
  },
];

for (const u of UPDATES) {
  const [existing] = await db
    .select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.slug, u.slug));

  if (!existing) {
    console.log("✗ Not found:", u.slug);
    continue;
  }

  const newPracticalInfo = { ...existing.practicalInfo, costRange: u.costRange };

  await db
    .update(experiences)
    .set({ practicalInfo: newPracticalInfo })
    .where(eq(experiences.id, existing.id));

  console.log("✓ Updated costRange for", u.slug);
}

console.log("\n✓ Done — re-publish each row in /curator/review to clear the 1-hour cache.");
await client.end();
