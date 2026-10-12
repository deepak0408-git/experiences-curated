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

// Event-level hero image (sporting_events.hero_image_url) for the Saudi
// Arabian Grand Prix 2027 (Jeddah) hub page banner — was null before this.
// Founder-supplied local file, 10 Oct 2026. Source/license not independently
// verified by Claude (file was placed directly in Images/ by the founder,
// not fetched from a URL) — flag for follow-up if attribution is later
// needed; see feedback_sporting_events_hero_image_no_credit_column.md for
// the broader no-credit-column gap on this table.
const EVENT_SLUG = "saudi-arabian-grand-prix";
const localFile = "Images/saudi-arabia-grand-prix-hero.jpg";
const imageKey = "sporting-events/hero/saudi-arabian-grand-prix.jpg";

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

await sql.end();
