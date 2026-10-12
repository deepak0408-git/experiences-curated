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

// Event-level hero image (sporting_events.hero_image_url) for the
// Portuguese Grand Prix 2027 hub page banner — was null before this.
// Wikimedia Commons aerial photo of Autódromo Internacional do Algarve
// (Portimão circuit), credit: Vitor Oliveira, licensed CC BY-SA 2.0
// (attribution + share-alike required). Founder-supplied URL, 10 Oct 2026.
// NOTE: sporting_events has no hero_image_credit column (unlike
// experiences, which does) — same gap as the Azerbaijan/Austrian/Bahrain GP
// hero images seeded the same day; attribution is not displayed anywhere in
// the app for event-level hero images.
const EVENT_SLUG = "portuguese-grand-prix";
const localFile = "Images/portuguese-grand-prix-hero.jpg";
const imageKey = "sporting-events/hero/portuguese-grand-prix.jpg";

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
console.log(`  NOTE: CC BY-SA 2.0 image — credit "Vitor Oliveira" not stored (no credit column on sporting_events).`);

await sql.end();
