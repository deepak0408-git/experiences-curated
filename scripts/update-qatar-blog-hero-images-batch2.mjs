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

const localFile = "Images/Qatar GP - Marc Marquez Losail 2018.jpg";
const imageKey = "blog/hero/marc-marquez-losail-2018.jpg";
const alt = "Marc Márquez leads the field at the 2018 Qatar motorcycle Grand Prix, Losail International Circuit";
const credit = "Friedemann Kirn / Box Repsol / CC BY 2.0";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const slugs = [
  "lusail-built-for-motogp-not-f1-history",
  "qatar-gp-2023-heat-crisis-driver-safety",
];

for (const slug of slugs) {
  const [row] = await db
    .update(blogArticles)
    .set({ heroImageUrl, heroImageAlt: alt, heroImageCredit: credit, updatedAt: new Date() })
    .where(eq(blogArticles.slug, slug))
    .returning({ slug: blogArticles.slug, title: blogArticles.title, heroImageUrl: blogArticles.heroImageUrl });
  console.log("✓ Updated:", row.title);
  console.log("  Hero:  ", row.heroImageUrl);
}

await client.end();
