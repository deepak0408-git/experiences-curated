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

const EXPERIENCE_ID = "ab56c73e-cbd6-47fb-802e-f92e6b150e90"; // Where to Stay in Chennai for the Test
const LOCAL_PATH = "Images/BGT - Where to Stay Chennai Kapaleeshwarar.jpg";
const R2_KEY = "experiences/hero/bgt-where-to-stay-chennai.jpg";

// Source: Wikimedia Commons, credit Roehan Rengadurai, CC BY-SA 3.0, 4912x2760px
// https://commons.wikimedia.org/wiki/File:Kapaleeshwarar_Temple,_East_Gopuram.jpg
// Note: temple imagery on an accommodation experience — curator's explicit choice despite content mismatch, confirmed 7 Oct 2026

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
