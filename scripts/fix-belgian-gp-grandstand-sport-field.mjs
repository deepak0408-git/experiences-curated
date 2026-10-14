import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

// 5 experiences seeded 12 Oct 2026 (4 grandstands + Paddock Club) shipped
// with sport left NULL — found during the 14 Oct 2026 pre-deployment audit.
// Silently undercounts Belgian GP in the Algolia `sport` facet for F1-wide
// search, same bug class as Italian GP (14 Jul 2026, see CLAUDE.md §7).
const slugs = [
  "bus-stop-chicane-grandstands-mv56cil7",
  "gold1-pit-grandstand-mv568ksv",
  "les-combes-grandstands-mv569h8m",
  "la-source-hairpin-grandstands-mv56acog",
  "paddock-club-belgian-gp-mv56bmxs",
];

const result = await sql`
  UPDATE experiences SET sport = ARRAY['formula_one']
  WHERE slug IN ${sql(slugs)}
  RETURNING slug, sport
`;

console.log("Updated rows:");
for (const r of result) console.log(" ", r.slug, "->", r.sport);
console.log(`\n${result.length} of ${slugs.length} rows updated.`);

await sql.end();
