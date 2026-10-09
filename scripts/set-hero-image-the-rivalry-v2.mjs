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

const EXPERIENCE_ID = "1ce38664-d52b-499c-8e0c-1b7832d6a2f8"; // The Rivalry — A History of Border-Gavaskar Test Cricket
const LOCAL_PATH = "Images/BGT - The Rivalry History v2.jpg";
const R2_KEY = "experiences/hero/bgt-the-rivalry-pm-rohit-sharma.jpg";

// Source: Wikimedia Commons, credit Prime Minister's Office (India), Government Open Data License - India (GODL), attribution required, 2200x1415px
// https://commons.wikimedia.org/wiki/File:PM_hand_shake_to_Indian_cricketer,_Rohit_Sharma_during_India_vs_Australia_4th_Test_match_at_Narendra_Modi_Stadium_at_Ahmedabad,_with_Gujarat_CM_and_Governor_in_Gujarat_on_March_09,_2023.jpg
// Replaces earlier Nathan Lyon bowling photo per curator swap, 7 Oct 2026

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
