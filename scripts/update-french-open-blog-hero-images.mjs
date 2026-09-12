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

async function uploadAndSet(slug, localPath, r2Key, heroImageAlt, heroImageCredit) {
  const file = readFileSync(localPath);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: file,
    ContentType: "image/jpeg",
  }));
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;

  const [row] = await db
    .update(blogArticles)
    .set({ heroImageUrl, heroImageAlt, heroImageCredit })
    .where(eq(blogArticles.slug, slug))
    .returning({ slug: blogArticles.slug, heroImageUrl: blogArticles.heroImageUrl });

  console.log("✓", row.slug, "→", row.heroImageUrl);
}

// Article 2: Alcaraz vs Sinner — switch to Option 3 (Alcaraz opening match 2025)
await uploadAndSet(
  "alcaraz-vs-sinner-2025-longest-french-open-final",
  "Images/French Open Blog - Alcaraz Opening Match 2025.jpg",
  "blog/hero/alcaraz-sinner-2025-french-open-final-v2.jpg",
  "Carlos Alcaraz at Roland-Garros, 2025",
  "Martin Terrien (Wikimedia Commons, CC BY-SA 4.0)"
);

// Article 4: The Mark in the Clay — switch to Option 2 (chair umpire alt angle)
await uploadAndSet(
  "the-mark-in-the-clay-roland-garros-wont-trust-a-machine",
  "Images/French Open Blog - Chair Umpire Alt Angle.jpg",
  "blog/hero/mark-in-the-clay-roland-garros-umpires-v2.jpg",
  "Chair umpire at Roland-Garros, 2025",
  "Like tears in rain (Wikimedia Commons, CC BY-SA 4.0)"
);

await client.end();
