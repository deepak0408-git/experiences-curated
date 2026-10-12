import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import postgres from "postgres";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const sql = postgres(process.env.DIRECT_URL);

// Event-level hero image (sporting_events.hero_image_url) for Bahrain Grand
// Prix 2026 — REPLACES an existing live hero image (this event is
// packStatus: live, isHidden: false, unlike Turkish/Azerbaijan/Austrian GP
// 2027, which were blank placeholders). Wikimedia Commons photo
// (File:First_lap_2008_Bahrain.jpg), first lap of the 2008 Bahrain Grand
// Prix, credit: Emily Faulk, licensed CC BY 2.0 (attribution required).
// Founder-supplied URL, 10 Oct 2026, confirmed to proceed despite the event
// row being titled "Bahrain Grand Prix 2026 (Malaysia)" — see
// project_bahrain_gp_night_race_uncertainty memory for the
// Sakhir-vs-Sepang circuit naming background; founder explicitly chose to
// proceed with this Sakhir-circuit image anyway. NOTE: sporting_events has
// no hero_image_credit column (unlike experiences, which does) — same gap
// as Azerbaijan/Austrian GP 2027 hero images seeded the same day;
// attribution is not displayed anywhere in the app for event-level hero
// images.
const EVENT_SLUG = "bahrain-grand-prix";
const localFile = "Images/bahrain-grand-prix-hero.jpg";
const imageKey = "sporting-events/hero/bahrain-grand-prix.jpg";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const [result] = await sql`
  UPDATE sporting_events SET hero_image_url = ${heroImageUrl} WHERE slug = ${EVENT_SLUG}
  RETURNING slug, hero_image_url
`;

console.log(`✓ ${result.slug}`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  hero_image_url: ${result.hero_image_url}`);
console.log(`  NOTE: CC BY 2.0 image — credit "Emily Faulk" not stored (no credit column on sporting_events).`);

await sql.end();
