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

const LOCAL_FILE = "Images/US Open 2026 - Map.jpg Credit nytimes.com";
const R2_KEY = "sporting-events/hero/us-open-venue-map.jpg";

const body = readFileSync(LOCAL_FILE);

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: R2_KEY,
  Body: body,
  ContentType: "image/jpeg",
}));

const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;
console.log("Uploaded:", publicUrl);
process.exit(0);
