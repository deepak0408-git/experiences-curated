import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

const rows = await sql`
  SELECT e.id, e.title, e.slug, e.body_content, e.why_its_special, e.practical_info
  FROM experiences e
  JOIN sporting_event_experiences see ON see.experience_id = e.id
  WHERE see.sporting_event_id = 'b1816396-6d71-4693-a53f-05bccb2d8a8e'
     OR e.sporting_event_id = 'b1816396-6d71-4693-a53f-05bccb2d8a8e'
`;

const seen = new Set();
for (const r of rows) {
  if (seen.has(r.id)) continue;
  seen.add(r.id);

  const hits = [];
  const check = (label, text) => {
    if (!text) return;
    const matches = [...text.matchAll(/.{0,60}2026.{0,60}/g)].map((m) => m[0]);
    if (matches.length) hits.push({ label, matches });
  };

  check("body_content", r.body_content);
  check("why_its_special", r.why_its_special);
  if (r.practical_info) {
    for (const [k, v] of Object.entries(r.practical_info)) {
      if (typeof v === "string") check(`practical_info.${k}`, v);
    }
  }

  if (hits.length) {
    console.log("=== " + r.title + " (" + r.id + ") slug=" + r.slug + " ===");
    for (const h of hits) {
      console.log("  [" + h.label + "]");
      for (const m of h.matches) console.log("    ..." + m.replace(/\n/g, " ") + "...");
    }
    console.log();
  }
}

console.log("Total experiences checked:", seen.size);
await sql.end();
