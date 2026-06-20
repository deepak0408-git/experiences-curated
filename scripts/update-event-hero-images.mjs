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

async function uploadAndUpdate({ localPath, r2Key, slug, alt, credit }) {
  const file = readFileSync(localPath);
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;

  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: file,
    ContentType: "image/jpeg",
  }));
  console.log(`✓ Uploaded ${r2Key}`);

  await client`
    UPDATE sporting_events
    SET hero_image_url = ${heroImageUrl}
    WHERE slug = ${slug}
  `;
  console.log(`✓ DB updated for ${slug} → ${heroImageUrl}`);
}

await uploadAndUpdate({
  localPath: "Images/wimbledon-centre-court-2023-final1.jpg",
  r2Key: "sporting-events/hero/wimbledon-2026-v2.jpg",
  slug: "wimbledon-2026",
  alt: "Wimbledon Centre Court 2023 final",
  credit: "User-supplied",
});

await uploadAndUpdate({
  localPath: "Images/MCG Boxing Day.jpg",
  r2Key: "sporting-events/hero/india-in-england-2026-v2.jpg",
  slug: "india-in-england-2026",
  alt: "MCG Boxing Day cricket",
  credit: "User-supplied",
});

console.log("\n✓ Done.");
await client.end();
