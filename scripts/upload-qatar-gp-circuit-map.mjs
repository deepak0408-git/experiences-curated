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

// Official Lusail International Circuit map, Qatar GP 2026 Map spoke —
// curator-supplied 14 Sep 2026, sourced from the official F1 ticketshop.
// Shows every grandstand (T16, T2, T3, Main, North) and hospitality unit
// (Paddock Club, Premiere Hospitality, Champions Club, Lusail Hill Lounge)
// plus Lusail Hill GA/Fan Zone, matching Brazilian GP's MapSpoke pattern.
const localFile = "Images/Qatar GP - LIC_Map_Ticketshop_F1_2026.png";
const imageKey = "sporting-events/hero/qatar-grand-prix-circuit-map.png";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/png",
}));
const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

console.log(`✓ Uploaded to R2`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  URL: ${url}`);
