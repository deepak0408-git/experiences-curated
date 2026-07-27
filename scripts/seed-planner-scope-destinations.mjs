import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

// New destinations for the 6 unbuilt V1 planner-scope events (Singapore GP,
// Alfred Dunhill Links, ATP Finals, Las Vegas GP, New Zealand in Australia,
// England in South Africa). Identity data only — no sportingEvents rows yet,
// those come in a separate, explicitly-approved step per user instruction
// 20 Jul 2026. Melbourne, Johannesburg, Cape Town already exist and are
// reused, not re-created here.

const DESTINATIONS = [
  { name: "Singapore", slug: "singapore", countryCode: "SG", region: "Singapore", currency: "SGD" },
  { name: "St Andrews", slug: "st-andrews", countryCode: "GB", region: "Fife, Scotland", currency: "GBP" },
  { name: "Turin", slug: "turin", countryCode: "IT", region: "Piedmont, Italy", currency: "EUR" },
  { name: "Las Vegas", slug: "las-vegas", countryCode: "US", region: "Nevada, USA", currency: "USD" },
  { name: "Perth", slug: "perth", countryCode: "AU", region: "Western Australia", currency: "AUD" },
  { name: "Adelaide", slug: "adelaide", countryCode: "AU", region: "South Australia", currency: "AUD" },
  { name: "Sydney", slug: "sydney", countryCode: "AU", region: "New South Wales", currency: "AUD" },
  { name: "Centurion", slug: "centurion", countryCode: "ZA", region: "Gauteng, South Africa", currency: "ZAR" },
];

for (const d of DESTINATIONS) {
  const result = await sql`
    INSERT INTO destinations (name, slug, country_code, region, currency)
    VALUES (${d.name}, ${d.slug}, ${d.countryCode}, ${d.region}, ${d.currency})
    ON CONFLICT (slug) DO NOTHING
    RETURNING id, name
  `;
  if (result.length > 0) {
    console.log(`✓ created: ${d.name}`);
  } else {
    console.log(`- skipped (already exists): ${d.name}`);
  }
}

const rows = await sql`
  SELECT name, slug, country_code, region, currency FROM destinations
  WHERE slug IN (${sql(DESTINATIONS.map((d) => d.slug))})
  ORDER BY name
`;
console.log("\nConfirmed state:");
console.table(rows);

await sql.end();
