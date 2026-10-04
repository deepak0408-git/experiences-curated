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

// Event hero for the Chinese GP 2027 hub. Shanghai F1 circuit, credit Emily Walker, CC BY 2.0.
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const localFile = "Images/Chinese GP - Shanghai_F1_Circui_01 Emily Walker CC by 2.0.jpg";
const imageKey = "sporting-events/hero/chinese-grand-prix.jpg";

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: readFileSync(localFile),
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const [result] = await sql`
  UPDATE sporting_events SET hero_image_url = ${heroImageUrl} WHERE id = ${EVENT_ID}
  RETURNING slug, hero_image_url
`;

console.log(`✓ ${result.slug}`);
console.log(`  hero_image_url: ${result.hero_image_url}`);

await sql.end();
