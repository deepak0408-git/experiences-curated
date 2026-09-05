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

// Images/US GP - Austin Map.png — COTA circuit map with numbered turns
// (1-19) and official grandstand zone labels (Main Grandstand, Turn 1,
// Turn 4, Turn 9, Turn 12, Turn 13, Turn 15, Turn 19, Turn 19B, General
// Admission) both marked correctly. Replaces the earlier f1-austin.jpg
// (grandstand labels only, no turn numbers) per founder request.
const imageKey = "sporting-events/hero/united-states-grand-prix-venue-map.png";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/US GP - Austin Map.png");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/png",
}));

console.log("✓ Map image uploaded:", heroImageUrl);
