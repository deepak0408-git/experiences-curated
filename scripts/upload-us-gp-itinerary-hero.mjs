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

// Images/US GP - Aerial View Zach Catanzareti Photo CC2.0.jpg — replaces the
// Itinerary spoke's reused Super Stage Concerts image with a dedicated
// aerial COTA shot, per founder request 5 Sep 2026. R2 key kept as
// "-day-trips.jpg" from an initial (corrected) attempt to use this image on
// the Day Trips spoke instead — not worth a second upload under a new key.
const imageKey = "sporting-events/hero/united-states-grand-prix-day-trips.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/US GP - Aerial View Zach Catanzareti Photo CC2.0.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));

console.log("✓ Itinerary hero image uploaded:", heroImageUrl);
