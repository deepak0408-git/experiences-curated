import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { sportingEvents } from "../schema/database.ts";
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

const localPath = "Images/Brazilian GP - Hero Image.jpg";
const r2Key = "sporting-events/hero/brazilian-grand-prix.jpg";

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
  .update(sportingEvents)
  .set({ heroImageUrl })
  .where(eq(sportingEvents.slug, "brazilian-grand-prix"))
  .returning({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug });

console.log("Updated:", result?.name, "|", result?.slug, "|", result?.id);

await client.end();
