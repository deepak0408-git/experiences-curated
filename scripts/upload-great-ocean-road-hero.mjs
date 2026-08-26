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

const imageKey = "experiences/hero/Great Ocean Road Twelve Apostles.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/Great Ocean Road - Twelve Apostles Golden Hour.jpg");

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
      heroImageAlt: "The Twelve Apostles limestone sea stacks at golden hour, Great Ocean Road",
      heroImageCredit: "Graham Holtshausen, Unsplash Licence",
    })
    .where(eq(experiences.title, "Great Ocean Road & the Twelve Apostles"))
    .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl });

  console.log("Updated:", result.title);
  console.log("Hero image URL:", result.heroImageUrl);
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
