import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { blogArticles } from "../schema/database.ts";

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

const SLUG = "border-gavaskar-trophy-origin-story";
const LOCAL_PATH = "Images/BGT - Border Gavaskar Civic Reception MCG 2014.jpg";
const R2_KEY = "blog/hero/border-gavaskar-trophy-origin-story.jpg";

// Source: Wikimedia Commons, Government Open Data License - India (GODL),
// uploaded via PIB (Press Information Bureau) / PMO Government of India, 2200x1187px
// https://commons.wikimedia.org/wiki/File:Narendra_Modi_with_the_Prime_Minister_of_Australia,_Mr._Tony_Abbott,_Shri_Sunil_Gavaskar,_Shri_Kapil_Dev_and_Shri_V.V.S._Laxman_at_the_Civic_Reception_hosted_by_the_Australian_PM,_at_MCG,_Australia_on_November_18,_2014_(2).jpg
// Shows Sunil Gavaskar (among other cricket figures) at a civic reception at the MCG, Nov 2014 — chosen by curator.

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
    .update(blogArticles)
    .set({ heroImageUrl })
    .where(eq(blogArticles.slug, SLUG))
    .returning({ id: blogArticles.id, slug: blogArticles.slug, title: blogArticles.title });

  console.log("Updated:", result?.title, "|", result?.id, "|", heroImageUrl);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
