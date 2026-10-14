import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

// The Kemmel Straight — General Admission: fix stale 2026 F1 Experiences URL
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info,
    '{howToBook}',
    to_jsonb(
      replace(
        practical_info->>'howToBook',
        'f1experiences.com/2026-belgian-grand-prix/ardennes-club-gold-2',
        'f1experiences.com/2027-belgian-grand-prix/ardennes-club-gold-2'
      )
    )
  )
  WHERE id = 'ef526456-69f3-4a80-b96a-5c8f4200072b'
`;

const check = await sql`
  SELECT id, title, practical_info->>'howToBook' AS how_to_book
  FROM experiences
  WHERE id = 'ef526456-69f3-4a80-b96a-5c8f4200072b'
`;
for (const r of check) {
  console.log("=== " + r.title + " ===");
  console.log(r.how_to_book);
}

await sql.end();
