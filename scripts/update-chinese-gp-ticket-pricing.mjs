// Fix-forward update, 23 Sep 2026 — real 2026 on-sale ticket-tier pricing
// was seeded into planner_ticket_tier_cost this session (parallel cost-
// research session, edition_year corrected to 2027 + confirmed apr
// seasonalBand for hotels/flights the same session — see
// project_chinese_gp_2027_build_status memory). The 6 fan-experience rows
// below (Grandstands A/B/H/K, General Admission, Paddock Club) were seeded
// 23 Sep 2026 with practicalInfo.costRange stating "2027 pricing not yet
// published" — now stale. Updating each to state the real 2026 price as a
// clearly-flagged proxy, honest that it's not a confirmed 2027 number.
// Real prices, from planner_ticket_tier_cost (USD, per person, 3-day):
//   tier1 GA:                 $67
//   tier2 Grandstand E/H/K:   $224-238
//   tier3 Grandstand A/B:     $309-464
//   tier4 F1 Paddock Club:    $17,145
// bodyContent/whyItsSpecial/insiderTips/whatToAvoid are NOT touched here —
// only practicalInfo.costRange, which is the one field whose "not yet
// published" claim this cost data directly supersedes. A broader copy
// pass (weaving the real number into bodyContent narrative) is a separate,
// larger edit — this script only fixes the one field that would otherwise
// read as flatly wrong next to the real numbers now live on Cost/Tickets.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const UPDATES = [
  {
    slugPrefix: "chinese-gp-general-admission-",
    costRange: "US$67 per person for the 3-day GA ticket at the 2026 race — the real, most-recent on-sale price, shown here as a proxy pending Formula 1's 2027 pricing announcement, not a confirmed 2027 figure.",
  },
  {
    slugPrefix: "chinese-gp-grandstand-b-",
    costRange: "US$309-464 per person for the 3-day Grandstand A/B tier at the 2026 race (Grandstand B priced within this range, not broken out separately by F1) — shown as a proxy pending confirmed 2027 pricing.",
  },
  {
    slugPrefix: "chinese-gp-grandstand-h-",
    costRange: "US$224-238 per person for the 3-day Grandstand E/H/K tier at the 2026 race (Grandstand H priced within this range, not broken out separately by F1) — shown as a proxy pending confirmed 2027 pricing.",
  },
  {
    slugPrefix: "chinese-gp-grandstand-k-",
    costRange: "US$224-238 per person for the 3-day Grandstand E/H/K tier at the 2026 race (Grandstand K priced within this range, not broken out separately by F1) — shown as a proxy pending confirmed 2027 pricing.",
  },
  {
    slugPrefix: "chinese-gp-grandstand-a-",
    costRange: "US$309-464 per person for the 3-day Grandstand A/B tier at the 2026 race (Grandstand A, the larger of the two, typically prices toward the top of this range) — shown as a proxy pending confirmed 2027 pricing.",
  },
  {
    slugPrefix: "chinese-gp-paddock-club-",
    costRange: "US$17,145 per person for the 3-day F1 Paddock Club at the 2026 race — shown as a real proxy figure pending Formula 1's 2027 Paddock Club pricing, which hasn't been published yet. F1 Experiences' own Starter/Hero/Podium tiers remain genuinely unpriced for 2027, not proxied here, since they're a separate product from Paddock Club itself.",
  },
];

for (const { slugPrefix, costRange } of UPDATES) {
  const [row] = await db
    .select({ id: experiences.id, slug: experiences.slug, title: experiences.title, practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(sql`${experiences.slug} LIKE ${slugPrefix + "%"}`);

  if (!row) {
    console.error("✗ No experience found for slug prefix:", slugPrefix);
    continue;
  }

  const updatedPracticalInfo = { ...row.practicalInfo, costRange };

  await db
    .update(experiences)
    .set({ practicalInfo: updatedPracticalInfo, lastVerifiedDate: new Date().toISOString().slice(0, 10) })
    .where(eq(experiences.id, row.id));

  console.log("✓", row.title, "→ costRange updated");
}

await client.end();
