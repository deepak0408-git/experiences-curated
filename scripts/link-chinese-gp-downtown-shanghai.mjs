// Links 4 existing downtown Shanghai cultural experiences (originally seeded
// for Shanghai Masters 2026) to Chinese Grand Prix 2027, as the "downtown
// rest-day anchor" item (#21) in the confirmed 22-experience list — reused
// rather than duplicated, per project_chinese_gp_experiences.md's
// reuse-vs-adapt guidance. These are genuinely venue-agnostic central-
// Shanghai anchors (Bund, Yu Garden, French Concession, Lujiazui) — the real
// ~60min Metro Line 11 distance from Jiading is already covered honestly in
// the Where to Stay and Getting There experiences, so no separate rewrite is
// needed here; this is a legitimate rest-day-before/after-race framing, not
// a same-day circuit-adjacent claim.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";

const DOWNTOWN_SLUGS = [
  "the-bund-shanghai-dusk-mskq9eyp",
  "yu-garden-old-city-shanghai-mskqb4kn",
  "french-concession-tianzifang-shanghai-mskqctiq",
  "lujiazui-skyline-shanghai-mskqholc",
];

for (const slug of DOWNTOWN_SLUGS) {
  const [exp] = await db.select({ id: experiences.id, title: experiences.title, sport: experiences.sport }).from(experiences).where(eq(experiences.slug, slug));
  if (!exp) {
    console.error("NOT FOUND:", slug);
    continue;
  }

  await db.insert(sportingEventExperiences)
    .values({ experienceId: exp.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  const currentSport = exp.sport ?? [];
  if (!currentSport.includes("formula_one")) {
    const updatedSport = [...currentSport, "formula_one"];
    await db.update(experiences).set({ sport: updatedSport }).where(eq(experiences.id, exp.id));
    console.log("✓ Linked + sport updated:", exp.title, "→", JSON.stringify(updatedSport));
  } else {
    console.log("✓ Linked (sport already included formula_one):", exp.title);
  }
}

await client.end();
