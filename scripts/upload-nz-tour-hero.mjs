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

const localPath = "Images/MCG Boxing Day.jpg";
const r2Key = "sporting-events/hero/new-zealand-in-australia-cricket-2026-27.jpg";
const slug = "new-zealand-in-australia-cricket-2026-27";

const file = readFileSync(localPath);
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log(`✓ Uploaded ${r2Key}`);

const result = await client`
  UPDATE sporting_events
  SET hero_image_url = ${heroImageUrl}
  WHERE slug = ${slug}
  RETURNING name, slug, hero_image_url
`;
console.log("✓ DB updated:", JSON.stringify(result, null, 2));

await client.end();
