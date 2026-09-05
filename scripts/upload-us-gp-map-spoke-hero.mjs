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

// Images/US GP - Map Spoke Image.jpg — COTA's Observation Tower, used as the
// Map spoke's SpokeShell hero banner. The numbered grandstand map graphic
// itself stays inline in the spoke body (a separate <Image>, unaffected by
// this change) — this only replaces the top-of-page hero photo.
const imageKey = "sporting-events/hero/united-states-grand-prix-map-spoke-hero.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/US GP - Map Spoke Image.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));

console.log("✓ Map spoke hero image uploaded:", heroImageUrl);
