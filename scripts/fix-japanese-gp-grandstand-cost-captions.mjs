// Fix: Practical Info → Cost on Japanese GP 2027 grandstand experiences that
// only cross-referenced the Ticket Guide instead of stating an actual
// 2026-confirmed price reference, per founder instruction 23 Sep 2026.
//
// Q2 Grandstand and Grandstand G previously said only "see the Ticket Guide
// experience for the full 2026-confirmed price reference and 2027 pricing
// status" with no number of their own. Corrected to state the sourced
// 2026 grandstand range (¥22,000-¥105,000+, per Ticket Guide sources:
// total-motorsport.com, paddockintel.com) and where each stand's tier sits
// within it, explicitly caveating that 2027 pricing is not yet released.
// V1/V2 and General Admission experiences already did this correctly and are
// untouched.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const UPDATES = [
  {
    slug: "japanese-gp-suzuka-q2-grandstand",
    costRange:
      "Premium bucket-seat tier (grouped with A2, V1, V2) — 2026 confirmed grandstand pricing at Suzuka ran ¥22,000–¥105,000+ overall, with premium stands like Q2 sitting toward the upper end of that range; 2027 pricing not yet released as of Sep 2026. See the Ticket Guide experience for the full range and current on-sale status.",
  },
  {
    slug: "japanese-gp-suzuka-grandstand-g",
    costRange:
      "Mid-tier bench-seating grandstand (reserved section) or budget tier (G-1, first-come-first-served) — 2026 confirmed grandstand pricing at Suzuka ran ¥22,000–¥105,000+ overall, with Grandstand G sitting in the mid/lower part of that range rather than the premium bucket-seat tier; 2027 pricing not yet released as of Sep 2026. See the Ticket Guide experience for the full range and current on-sale status.",
  },
];

try {
  for (const { slug, costRange } of UPDATES) {
    const [row] = await db.select({ practicalInfo: experiences.practicalInfo }).from(experiences).where(eq(experiences.slug, slug));
    if (!row) {
      console.error("Not found:", slug);
      continue;
    }
    const updatedPracticalInfo = { ...row.practicalInfo, costRange };
    const [result] = await db
      .update(experiences)
      .set({ practicalInfo: updatedPracticalInfo })
      .where(eq(experiences.slug, slug))
      .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });
    console.log("Updated:", result.title, "|", result.id, "|", result.slug, "|", result.status);
  }
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
