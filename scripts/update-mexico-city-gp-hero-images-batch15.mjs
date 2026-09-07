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

async function uploadLocal(localPath, r2Key) {
  const file = readFileSync(localPath);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: file,
    ContentType: "image/jpeg",
  }));
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
}

// #18 — Teotihuacán — option 3
const teotihuacanUrl = await uploadLocal(
  "Images/Mexico City GP - Teotihuacan Avenue Ralf Roletschek.jpg",
  "experiences/hero/Mexico City GP - Teotihuacan Avenue Ralf Roletschek.jpg"
);
console.log("✓ Uploaded Teotihuacán image:", teotihuacanUrl);

// #19 — Xochimilco — option 1 (only verified option)
const xochimilcoUrl = await uploadLocal(
  "Images/Mexico City GP - Xochimilco Trajinera Arian Zwegers.jpg",
  "experiences/hero/Mexico City GP - Xochimilco Trajinera Arian Zwegers.jpg"
);
console.log("✓ Uploaded Xochimilco image:", xochimilcoUrl);

// #20 — Día de Muertos — option 1
const diaDeMuertosUrl = await uploadLocal(
  "Images/Mexico City GP - Dia de Muertos Parade German Troconis.jpg",
  "experiences/hero/Mexico City GP - Dia de Muertos Parade German Troconis.jpg"
);
console.log("✓ Uploaded Día de Muertos image:", diaDeMuertosUrl);

// #21 — Weather & What to Pack — option 1
const weatherUrl = await uploadLocal(
  "Images/Mexico City GP - Reforma Skyline Jonathan Salvador.jpg",
  "experiences/hero/Mexico City GP - Reforma Skyline Jonathan Salvador.jpg"
);
console.log("✓ Uploaded Reforma skyline image:", weatherUrl);

const updates = [
  {
    slug: "mexico-city-teotihuacan-day-trip-mtpe58vq",
    heroImageUrl: teotihuacanUrl,
    heroImageAlt: "Avenue of the Dead and Pyramid of the Sun, Teotihuacán",
    heroImageCredit: "Ralf Roletschek — GFDL / Free Art License",
  },
  {
    slug: "mexico-city-xochimilco-mtpe705o",
    heroImageUrl: xochimilcoUrl,
    heroImageAlt: "Colorful trajinera boats on the Xochimilco canals",
    heroImageCredit: "Arian Zwegers — CC BY 2.0",
  },
  {
    slug: "mexico-city-dia-de-muertos-mtpe8i82",
    heroImageUrl: diaDeMuertosUrl,
    heroImageAlt: "Day of the Dead parade, Mexico City",
    heroImageCredit: "Germán Troconis Trens — CC BY-SA 4.0",
  },
  {
    slug: "mexico-city-weather-packing-mtpea3kv",
    heroImageUrl: weatherUrl,
    heroImageAlt: "Reforma avenue skyline and Chapultepec park, Mexico City",
    heroImageCredit: "Jonathan Salvador — CC BY-SA 4.0",
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
