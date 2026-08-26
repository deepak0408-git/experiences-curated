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

const imageKey = "experiences/hero/Where NZ Fans Actually Eat City Guide.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/Melbourne - Centre Place Dining Lane.jpg");

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("Hero image uploaded:", heroImageUrl);

try {
  const [result] = await db.update(experiences)
    .set({
      heroImageUrl,
      heroImageAlt: "A Melbourne laneway lined with cafes and bars, tables full at midday",
      heroImageCredit: "Nick-D, CC BY-SA 3.0 (Wikimedia Commons)",
    })
    .where(eq(experiences.slug, "where-nz-fans-actually-eat-city-guide-msvrvq4acy"))
    .returning({ id: experiences.id, title: experiences.title, slug: experiences.slug, heroImageUrl: experiences.heroImageUrl });

  console.log("Updated:", result.title);
  console.log("Slug (unchanged):", result.slug);
  console.log("Hero image URL:", result.heroImageUrl);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
