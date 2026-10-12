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

// Event-level hero image (sporting_events.hero_image_url) for the Turkish
// Grand Prix 2027 hub page banner — was null before this. Public-domain
// Wikimedia Commons photo (File:First_corner_2005_Turkish_Grand_Prix.jpg,
// photographer "Postmortem", public domain, no attribution required) of
// Istanbul Park's first corner during the 2005 Turkish Grand Prix.
// Founder-supplied URL, 10 Oct 2026 — confirmed license/resolution before
// upload, no credit needed per public domain terms.
const EVENT_SLUG = "turkish-grand-prix";
const localFile = "Images/turkish-grand-prix-hero.jpg";
const imageKey = "sporting-events/hero/turkish-grand-prix.jpg";

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
