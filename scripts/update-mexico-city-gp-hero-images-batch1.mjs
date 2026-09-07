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

// Shared aerial image used for both Foro Sol and Where to Sit
const imageKey = "experiences/hero/Mexico City GP - Autodromo Aerial ProtoplasmaKid.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
const file = readFileSync("Images/Mexico City GP - Autodromo Aerial ProtoplasmaKid.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Uploaded shared aerial image:", heroImageUrl);

const updates = [
  {
    slug: "foro-sol-mexico-city-gp-mtpdg1hx",
    heroImageUrl,
    heroImageAlt: "Aerial drone view of the Autódromo Hermanos Rodríguez and Foro Sol stadium section",
    heroImageCredit: "ProtoplasmaKid — CC BY-SA 4.0",
  },
  {
    slug: "mexico-city-gp-where-to-sit-mtpdhggj",
    heroImageUrl,
    heroImageAlt: "Aerial drone view of the Autódromo Hermanos Rodríguez circuit",
    heroImageCredit: "ProtoplasmaKid — CC BY-SA 4.0",
  },
  {
    slug: "mexico-city-gp-paddock-club-mtpdkh8d",
    heroImageUrl: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/US GP - Champions Club Jonathan Borba Pexels.jpg",
    heroImageAlt: "F1 pit lane and garage scene",
    heroImageCredit: "Jonathan Borba — Pexels Licence",
  },
];

for (const u of updates) {
  const [result] = await db
    .update(experiences)
    .set({
      heroImageUrl: u.heroImageUrl,
      heroImageAlt: u.heroImageAlt,
      heroImageCredit: u.heroImageCredit,
    })
    .where(eq(experiences.slug, u.slug))
    .returning({ id: experiences.id, title: experiences.title });
  console.log("Updated:", result.title, "|", result.id);
}

await client.end();
