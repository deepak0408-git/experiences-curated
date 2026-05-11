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

const key = "experiences/hero/australian-open-1.jpg";
const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

// 1 — upload to R2
const file = readFileSync("Images/AustralianOpen1.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: key,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Uploaded to R2:", publicUrl);

// 2 — update the experience in the database
const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
const result = await sql`
  UPDATE experiences
  SET
    hero_image_url   = ${publicUrl},
    hero_image_alt   = 'Outside courts at Melbourne Park during the Australian Open, early morning',
    hero_image_credit = NULL
  WHERE slug LIKE 'australian-open-dawn-outside-courts%'
  RETURNING id, title, hero_image_url
`;

if (result.length) {
  console.log("✓ Experience updated:");
  console.log("  Title:", result[0].title);
  console.log("  Hero: ", result[0].hero_image_url);
} else {
  console.log("⚠ No matching experience found");
}

await sql.end();
