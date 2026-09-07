import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

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

const localPath = "Images/Mexico City GP - Dia de Muertos Malfet.jpg";
const r2Key = "experiences/hero/Mexico City GP - Dia de Muertos.jpg";

const file = readFileSync(localPath);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded:", heroImageUrl);

const [result] = await db
  .update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "Día de Muertos celebration with traditional face paint and decoration",
    heroImageCredit: "Nikita (malfet_) — CC BY 2.0 (Wikimedia Commons)",
  })
  .where(eq(experiences.slug, "mexico-city-dia-de-muertos-mtpe8i82"))
  .returning({ id: experiences.id, title: experiences.title });

console.log("Updated:", result?.title, "|", result?.id);

await client.end();
