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

const file = readFileSync("Images/Brazilian GP - Grandstand M Governo do Estado de São Paulo CC by 2.0.jpg");
const r2Key = "sporting-events/hero/brazilian-grand-prix-grandstand-m.jpg";
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;

const [row] = await db
  .update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "Grandstand M, Interlagos",
    heroImageCredit: "Governo do Estado de São Paulo (CC BY 2.0)",
  })
  .where(eq(experiences.id, "7aa40a62-7576-4944-8017-665fad028542"))
  .returning({ title: experiences.title, heroImageUrl: experiences.heroImageUrl });

console.log("✓", row.title, "→", row.heroImageUrl);
await client.end();
