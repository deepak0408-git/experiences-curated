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

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const LOCAL_PATH = "Images/Monza Event hero image.jpg";
const R2_KEY = "sporting-events/hero/italian-gp-2026.jpg";
const SLUG = "italian-gp-2026";

const file = readFileSync(LOCAL_PATH);
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: R2_KEY,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log(`✓ Uploaded ${R2_KEY}`);

await client`
  UPDATE sporting_events
  SET hero_image_url = ${heroImageUrl}
  WHERE slug = ${SLUG}
`;
console.log(`✓ DB updated for ${SLUG} → ${heroImageUrl}`);

await client.end();
