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

const SLUG = "india-australia-modern-test-cricket-rivalry";
const LOCAL_PATH = "Images/BGT - India Australia T20I MCG Melbourne.jpg";
const R2_KEY = "blog/hero/india-australia-modern-test-cricket-rivalry.jpg";

// Source: Wikimedia Commons, CC BY-SA 4.0, uploader Abhi psy pu (own work), 2576x1932px
// https://commons.wikimedia.org/wiki/File:T20I_Cricket_Match_between_India_vs_Australia,_at_MCG,_Melbourne.jpg
// India vs Australia match at the MCG, Melbourne — chosen by curator.

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
