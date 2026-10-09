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

const EXPERIENCE_ID = "413a124e-2911-4fe4-896c-0411903b9a91"; // Gir National Park — 2-Day Asiatic Lion Safari from Ahmedabad
const LOCAL_PATH = "Images/BGT - Gir National Park Asiatic Lion.jpg";
const R2_KEY = "experiences/hero/bgt-gir-national-park-asiatic-lion.jpg";

// Source: Wikimedia Commons, credit Bernard Gagnon, CC BY-SA 3.0, 5058x3256px
// https://commons.wikimedia.org/wiki/File:Asiatic_lion_03.jpg

try {
  const file = readFileSync(LOCAL_PATH);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: R2_KEY,
    Body: file,
    ContentType: "image/jpeg",
  }));
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;

  const [result] = await db
    .update(experiences)
    .set({ heroImageUrl })
    .where(eq(experiences.id, EXPERIENCE_ID))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  console.log("Updated:", result?.title, "|", result?.id, "|", heroImageUrl);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
