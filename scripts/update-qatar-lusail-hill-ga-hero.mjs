import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences } from "../schema/database.ts";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Hero image for "General Admission — Lusail Hill" (experience 22/22, Qatar
// GP 2026), curator-supplied 13 Sep 2026 — no credit, per experience-seeder
// skill's rule that a user-supplied image gets heroImageCredit left null,
// never a placeholder string like "User-supplied image."
const EXPERIENCE_ID = "d08d93fc-b017-42dc-8106-efca573f69c1";
const localFile = "Images/Qatar GP - Lusail Hill GA.png";
const imageKey = "experiences/hero/qatar-gp-lusail-hill-general-admission.png";
const alt = "General Admission viewing hill outside Turn 1 at Lusail International Circuit";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/png",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const [result] = await db
  .update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: alt,
    heroImageCredit: null,
  })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl });

console.log(`✓ ${result.title}`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  hero_image_url: ${result.heroImageUrl}`);

await client.end();
