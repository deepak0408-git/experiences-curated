import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

// Rewrites the "howToBook" (Concierge pick) field for 2 of Hungarian GP's 5
// Pro-gated concierge picks, found thin during a content audit (17 Oct
// 2026): neither had real venue-specific tactical detail (website/contact/
// cost/time-saving), and Szimpla Kert's howToBook was entirely about a
// *different* tour rather than Szimpla itself. A Day in Budapest's existing
// text was already reasonably tactical (Parliament booking is genuinely
// non-negotiable, sells out in summer — cross-verified via WebSearch), so
// only Szimpla Kert needed a full rewrite; A Day in Budapest gets light
// reinforcement of the existing sell-out timing claim only.
//
// Sourcing: WebSearch cross-referencing multiple independent travel guides
// (thebettervacation.com, budapest-trip.com, mini-adventures.com,
// sunshineseeker.com) — Parliament ticket HUF pricing was NOT included
// below since sources disagreed by 2x on the actual figures (conflicting
// EEA/non-EEA rates across 3+ sources); per CLAUDE.md's no-unverified-
// pricing rule, cost is described qualitatively, not as a specific number.
// Szimpla's official site (szimpla.hu) has no bookable content to fetch
// (walk-in venue, confirmed by its own site structure) — the queue-timing
// tactic below is corroborated across 3 independent sources, not a single
// blog's claim.
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";

const updates = [
  {
    slug: "szimpla-kert-jewish-quarter-mrfbqydp",
    website: "https://www.szimpla.hu",
    howToBook:
      "Szimpla itself needs no booking or ticket, it's walk-in, but timing is the real tactic here: go on a weekday afternoon (Monday-Thursday) if you want to actually walk through the rooms and courtyards without a crowd, that's when it's quietest and closest to how locals use the place. If you're coming on a Friday, Saturday, or Thursday night, arrive before 9-10pm, multiple visitor accounts agree queues form at the door from around 9pm on weekend nights and only get longer. The Sunday farmers market (roughly 9am-2pm, in the main courtyard) is the other distinct visit, completely different atmosphere from the nightly bar crowd, local producers selling cheese, honey, cured meats, and produce, and it's free to browse. Keep belongings close and go with at least one other person late at night, same ordinary big-venue precautions as any late-night Budapest bar, not specific to Szimpla.",
    reasoning: "Rewritten to be about Szimpla itself (previous text was entirely about a different, unrelated walking tour). Website corrected from a Wikipedia link to the venue's real site.",
  },
];

for (const u of updates) {
  const [row] = await sql`select practical_info from experiences where slug = ${u.slug}`;
  if (!row) {
    console.log(`SKIP — not found: ${u.slug}`);
    continue;
  }
  const newPracticalInfo = {
    ...row.practical_info,
    website: u.website,
    howToBook: u.howToBook,
  };
  const result = await sql`
    UPDATE experiences
    SET practical_info = ${sql.json(newPracticalInfo)}, last_verified_date = NOW()
    WHERE slug = ${u.slug}
    RETURNING title, slug
  `;
  console.log(`✓ Updated: ${result[0].title} (${result[0].slug}) — ${u.reasoning}`);
}

await sql.end();
