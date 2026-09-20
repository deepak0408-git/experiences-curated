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

const sql = postgres(process.env.DIRECT_URL);

const SLUG = "arrival-queue-guide-gates-bag-policy-mu9caq03";
const localFile = "Images/Aus GP/Australian GP - Entry Representative Image.jpg";
const imageKey = `experiences/hero/${SLUG}.jpg`;
const heroImageAlt = "Entry gates at Albert Park Grand Prix Circuit";
const heroImageCredit = "Representative image";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const [result] = await sql`
  UPDATE experiences
  SET hero_image_url = ${heroImageUrl}, hero_image_alt = ${heroImageAlt}, hero_image_credit = ${heroImageCredit}
  WHERE slug = ${SLUG}
  RETURNING slug, hero_image_url, hero_image_credit, status
`;

console.log(`✓ ${result.slug} (${result.status})`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  hero_image_url: ${result.hero_image_url}`);
console.log(`  hero_image_credit: ${result.hero_image_credit}`);

await sql.end();
