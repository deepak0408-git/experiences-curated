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

// #16 — Chapultepec Park & the National Museum of Anthropology — option 2
const chapultepecUrl = await uploadLocal(
  "Images/Mexico City GP - Chapultepec Castle lion05.jpg",
  "experiences/hero/Mexico City GP - Chapultepec Castle lion05.jpg"
);
console.log("✓ Uploaded Chapultepec Castle image:", chapultepecUrl);

// #17 — Frida Kahlo Museum (Casa Azul) — option 2
const fridaUrl = await uploadLocal(
  "Images/Mexico City GP - Frida Kahlo Museum Panorama Fuzheado.jpg",
  "experiences/hero/Mexico City GP - Frida Kahlo Museum Panorama Fuzheado.jpg"
);
console.log("✓ Uploaded Frida Kahlo Museum panorama image:", fridaUrl);

const updates = [
  {
    slug: "mexico-city-chapultepec-anthropology-mtpe1wl4",
    heroImageUrl: chapultepecUrl,
    heroImageAlt: "Chapultepec Castle, Mexico City",
    heroImageCredit: "lion05 — CC BY 2.0",
  },
  {
    slug: "mexico-city-frida-kahlo-museum-mtpe3qfy",
    heroImageUrl: fridaUrl,
    heroImageAlt: "Frida Kahlo Museum (Casa Azul), Coyoacán, Mexico City",
    heroImageCredit: "Fuzheado — CC0 1.0",
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
