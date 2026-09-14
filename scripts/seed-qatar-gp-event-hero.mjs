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

// Event-level hero image (sporting_events.hero_image_url) for the Qatar GP
// hub page banner — was null before this. Curator-supplied file, 13 Sep
// 2026 (same real file already used as the Main Grandstand experience's own
// hero, confirmed identical by md5 — a genuine night-race grandstand shot
// with the Lusail International Circuit signage visible, a fitting event-
// level hero). No credit, per the same rule as any curator-supplied image.
const EVENT_SLUG = "qatar-grand-prix";
const localFile = "Images/Qatar GP - Main Grandstand.png";
const imageKey = "sporting-events/hero/qatar-grand-prix.png";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/png",
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
