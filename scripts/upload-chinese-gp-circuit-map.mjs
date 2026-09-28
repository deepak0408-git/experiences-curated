import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Circuit-map asset only — uploads to R2 for use in Ticket Intelligence's
// CIRCUIT_MAP_BY_EVENT (app/ticket-intelligence/[slug]/result/_components/FullResult.tsx).
// No DB write: this map is not an experience hero image, it's a standalone
// venue-map asset the same way brazilian-grand-prix-map.png etc. are.
const LOCAL_PATH = "Images/Shanghai International Circuit Map Will Pittenger CC BY 3.0.jpg";
const R2_KEY = "sporting-events/hero/chinese-grand-prix-circuit-map.jpg";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

try {
  const file = readFileSync(LOCAL_PATH);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: R2_KEY,
    Body: file,
    ContentType: "image/jpeg",
  }));
  const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;
  console.log("Uploaded:", publicUrl);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
}
