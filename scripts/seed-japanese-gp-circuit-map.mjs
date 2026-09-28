import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Circuit map for the Japanese GP Map spoke's "Circuit Map" section — the
// official Suzuka Circuit grounds/facilities map (Japanese-language, branded
// "SUZUKA CIRCUIT"), sourced from suzukacircuit.jp, 22 Sep 2026. Rendered via
// ZoomableImage (same pattern as Italian GP/Qatar GP/Australian GP/French
// Open MapSpokes) so the dense Japanese-language legend is actually legible
// on click. Real dimensions: 878x551 (aspect ~1.594:1).
const localFile = "Images/Japanese GP - Suzuka Circuit Map.jpg";
const imageKey = "sporting-events/hero/japanese-grand-prix-circuit-map.jpg";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
const mapUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

console.log(`✓ Uploaded`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  URL: ${mapUrl}`);
