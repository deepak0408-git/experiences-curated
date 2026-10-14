import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

// Pouhon Corner — Silver 3 Grandstand: fix stale 2026 F1 Experiences URL
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info,
    '{howToBook}',
    to_jsonb(
      replace(
        practical_info->>'howToBook',
        'f1experiences.com/2026-belgian-grand-prix',
        'f1experiences.com/2027-belgian-grand-prix'
      )
    )
  )
  WHERE id = '346b2125-2f4b-4b82-95ef-7b73c1c2515c'
`;

// Eau Rouge / Raidillon — Gold 3 Grandstand: rewrite the 2026-sold-out clause for the 2027 edition
await sql`
  UPDATE experiences
  SET practical_info = jsonb_set(
    practical_info,
    '{howToBook}',
    to_jsonb(
      replace(
        practical_info->>'howToBook',
        'and the Champions Club Eau Rouge (indoor hospitality suite with canapes, open bar, paddock tour, and F1 insider appearances — note this sold out for 2026; register interest early for 2027).',
        'and the Champions Club Eau Rouge (indoor hospitality suite with canapes, open bar, paddock tour, and F1 insider appearances — this sells out early most years, so register interest as soon as the 2027 allocation opens).'
      )
    )
  )
  WHERE id = '3ff418ed-a8d6-46d6-b070-44ad594b4f89'
`;

const check = await sql`
  SELECT id, title, practical_info->>'howToBook' AS how_to_book
  FROM experiences
  WHERE id IN ('346b2125-2f4b-4b82-95ef-7b73c1c2515c', '3ff418ed-a8d6-46d6-b070-44ad594b4f89')
`;
for (const r of check) {
  console.log("=== " + r.title + " ===");
  console.log(r.how_to_book);
  console.log();
}

await sql.end();
