import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const localFile = "Images/Las Vegas GP - Circuit Layout 2023.png";
const r2Key = "sporting-events/hero/las-vegas-grand-prix-circuit-layout.jpg";

const body = readFileSync(localFile);

await r2.send(
  new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: body,
    ContentType: "image/png",
  })
);

console.log("✓ Uploaded:", r2Key);
