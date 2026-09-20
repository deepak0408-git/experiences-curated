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

// Hero image for "Getting to Albert Park — Tram, Train & the Exit"
// (slug getting-to-albert-park-tram-train-mu9c7ocr), Australian GP 2027.
// User-supplied file, 20 Sep 2026. Credit: DAVID ILIFF, CC BY 3.0.
const SLUG = "getting-to-albert-park-tram-train-mu9c7ocr";
const localFile = "Images/Australian GP - Tram DAVID ILIFF CC BY 3.0.jpg";
const imageKey = `experiences/hero/${SLUG}.jpg`;
const heroImageAlt = "Tram at Albert Park during the Australian Grand Prix";
const heroImageCredit = "DAVID ILIFF, CC BY 3.0";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const [result] = await sql`
  UPDATE experiences
  SET hero_image_url = ${heroImageUrl}, hero_image_alt = ${heroImageAlt}, hero_image_credit = ${heroImageCredit}
  WHERE slug = ${SLUG}
  RETURNING slug, hero_image_url, hero_image_credit, status
`;

console.log(`✓ ${result.slug} (${result.status})`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  hero_image_url: ${result.hero_image_url}`);
console.log(`  hero_image_credit: ${result.hero_image_credit}`);

await sql.end();
