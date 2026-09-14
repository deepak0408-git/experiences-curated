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

// Cost spoke hero image for Qatar GP 2026 hub-and-spoke pack — curator-supplied
// 14 Sep 2026, credit Gregory Hawken Kramer, CC BY-SA 4.0.
const localFile = "Images/Qatar GP - West Bay Skyline credit Gregory Hawken Kramer CC BY-SA 4.0.jpg";
const imageKey = "sporting-events/hero/qatar-grand-prix-cost-spoke.jpg";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

console.log(`✓ Uploaded to R2`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  URL: ${heroImageUrl}`);
