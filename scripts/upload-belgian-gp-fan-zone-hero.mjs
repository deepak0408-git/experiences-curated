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

// Founder-provided hero image for The Fan Zone at Raidillon, 13 Oct 2026.
// Filename ends "Representative Image" — same naming/credit pattern as the
// Les Combes and Paddock Club heroes already in upload-belgian-gp-new-
// experience-heroes.mjs, no CC/photographer attribution claimed.
const expId = "e0c36bc7-2478-41b0-8f85-5cd94f5d5fcb"; // The Fan Zone at Raidillon
const localFile = "Images/Belgian GP 2026 - Fan Zone Representative Image.jpg";
const r2Key = "experiences/hero/belgian-gp-fan-zone-raidillon.jpg";
const alt = "Fan Zone atmosphere at Raidillon, representative image";
const credit = "Representative Image";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;

await db.update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: alt,
    heroImageCredit: credit,
  })
  .where(eq(experiences.id, expId));

console.log(`✓ ${localFile} → ${heroImageUrl} (exp ${expId})`);

await client.end();
