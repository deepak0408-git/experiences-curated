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

// 13 Sep 2026: curator-approved EXCEPTION — this hero image is AI-generated,
// not a real photo of the venue. Confirmed explicitly by the curator after
// being flagged (RGBA PNG, no credit, atypical for a licensed photo). Standing
// site policy is real/verified imagery only; this is a one-off override, not
// a new default — do not treat this script as precedent for future images.
const EXPERIENCE_ID_LUSAIL_HILL_LOUNGE = "c84fa5f9-4e60-4eb4-ab42-b8f03ceddae5"; // qatar-gp-lusail-hill-lounge-mtymm3gw

const localFile = "Images/Qatar GP - Lusail Hill Lounge.png";
const imageKey = "experiences/hero/qatar-gp-lusail-hill-lounge.png";

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
    heroImageAlt: "Elevated lounge viewing area at Lusail Hill",
    heroImageCredit: "AI-generated — curator exception, 13 Sep 2026",
  })
  .where(eq(experiences.id, EXPERIENCE_ID_LUSAIL_HILL_LOUNGE))
  .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl });

console.log(`✓ ${result.title}`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  hero_image_url: ${result.heroImageUrl}`);
console.log(`  NOTE: hero_image_credit flagged as AI-generated / curator exception`);

await client.end();
