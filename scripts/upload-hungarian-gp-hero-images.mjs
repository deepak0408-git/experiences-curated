import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";

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

const items = [
  {
    experienceId: "32aa24f0-c709-4c7a-b030-ed30b7810fd8", // Where to Sit
    localFile: "Hungaroring Where to Sit.jpg",
    r2Key: "experiences/hero/where-to-sit-hungaroring.jpg",
    alt: "Wide panoramic view of the Hungaroring circuit",
    credit: "VargaA, Wikimedia Commons, CC BY-SA 4.0",
  },
  {
    experienceId: "6199e022-81d0-4354-8a0f-0ab40fed63a2", // F1 Fan Lounge
    localFile: "F1 Fan Lounge Hungaroring.jpg",
    r2Key: "experiences/hero/f1-fan-lounge-hungaroring.jpg",
    alt: "Cozy bar interior with warm ambient lighting",
    credit: "Okan Yaşar, Pexels Licence",
  },
  {
    experienceId: "e3e50157-5d58-42ad-b4f9-62ff16a25659", // Getting to the Hungaroring
    localFile: "Getting to Hungaroring Metro.jpg",
    r2Key: "experiences/hero/getting-to-hungaroring.jpg",
    alt: "Budapest M2 metro train at Blaha Lujza tér station",
    credit: "Christo, Wikimedia Commons, CC BY-SA 4.0",
  },
  {
    experienceId: "f5ff8cd5-9be3-4992-8858-59f2c60d338f", // Camping at the Circuit
    localFile: "Camping Hungaroring.jpg",
    r2Key: "experiences/hero/camping-hungaroring.jpg",
    alt: "Motorhomes and trailers at a forested campsite",
    credit: "IslandHopper X, Pexels Licence",
  },
  {
    experienceId: "ac9439b1-54bd-4ef2-ba9c-85cf34335e6f", // Staying in Pest
    localFile: "Staying in Pest Budapest.jpg",
    r2Key: "experiences/hero/staying-in-pest.jpg",
    alt: "Aerial view of Budapest with the Danube dividing Buda and Pest",
    credit: "Incze Sándor Zoltán, Pexels Licence",
  },
  {
    experienceId: "f809c882-3cc0-4088-bd60-cf5b11c3481c", // Four Seasons Gresham Palace
    localFile: "Four Seasons Gresham Palace.jpg",
    r2Key: "experiences/hero/four-seasons-gresham-palace.jpg",
    alt: "Facade of the Four Seasons Gresham Palace, Budapest",
    credit: "Sarah Stierch, Wikimedia Commons, CC BY 4.0",
  },
  {
    experienceId: "a5b5a60e-8d24-42f1-a0e7-077e114d53fe", // Gödöllő
    localFile: "Hotel_Queen_Elisabeth,_Gödöllő_01.JPG",
    r2Key: "experiences/hero/godollo-near-circuit-stay.jpg",
    alt: "Hotel Queen Elisabeth (Erzsébet Királyné), Gödöllő",
    credit: "User-provided image",
  },
  {
    experienceId: "e1d2dcdf-e17e-40c1-bcf3-39465e440cd6", // Gettó Gulyás
    localFile: "Getto Gulyas Goulash.jpg",
    r2Key: "experiences/hero/getto-gulyas-jewish-quarter.jpg",
    alt: "A bowl of traditional Hungarian goulash soup",
    credit: "Christo, Wikimedia Commons, CC BY-SA 4.0",
  },
  {
    experienceId: "ee6ca54b-203b-43e6-8b85-bd3c61f760c5", // Stand25 Bisztró
    localFile: "Stand25 Bisztro Interior.jpg",
    r2Key: "experiences/hero/stand25-bisztro.jpg",
    alt: "Modern restaurant interior in dark tones",
    credit: "wewe yang, Pexels Licence",
  },
  {
    experienceId: "1cec44b6-8c15-4ff5-ae93-b485dee66b06", // Széchenyi Thermal Bath
    localFile: "Szechenyi Thermal Bath.jpg",
    r2Key: "experiences/hero/szechenyi-thermal-bath.jpg",
    alt: "Széchenyi thermal bath building and outdoor pool",
    credit: "Petr Vilgus, Wikimedia Commons, CC BY-SA 3.0",
  },
  {
    experienceId: "07205ca7-5528-470c-b9c3-05af68eab44b", // Szimpla Kert
    localFile: "Szimpla Kert Ruin Bar.jpg",
    r2Key: "experiences/hero/szimpla-kert.jpg",
    alt: "Interior of Szimpla Kert ruin bar, Budapest",
    credit: "Jorge Franganillo, Wikimedia Commons, CC BY 2.0",
  },
  {
    experienceId: "6a46f802-68a0-4ff3-8229-cbb279822d87", // A Day in Budapest
    localFile: "A Day in Budapest Parliament.jpg",
    r2Key: "experiences/hero/a-day-in-budapest.jpg",
    alt: "Hungarian Parliament Building and Chain Bridge at sunset",
    credit: "Himmel S, Unsplash Licence",
  },
  {
    experienceId: "752d5d06-1e81-403b-8e57-4f77dd8b57e3", // Paddock Club
    localFile: "Paddock Club Pit Lane.jpg",
    r2Key: "experiences/hero/paddock-club-hungaroring.jpg",
    alt: "Formula 1 pit lane and garage scene",
    credit: "Jonathan Borba, Pexels Licence",
  },
  {
    experienceId: "3d4dd55a-bd01-4d8c-8daa-6a5702ed35cf", // Ticket Guide
    localFile: "Hungarian GP Ticket Template.jpg",
    r2Key: "experiences/hero/hungarian-gp-ticket-guide.jpg",
    alt: "Hungarian Grand Prix ticket guide graphic",
    credit: "User-provided image",
  },
];

for (const item of items) {
  try {
    const file = readFileSync(`Images/${item.localFile}`);
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: item.r2Key,
      Body: file,
      ContentType: "image/jpeg",
    }));
    const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.r2Key}`;

    const [result] = await db
      .update(experiences)
      .set({ heroImageUrl, heroImageAlt: item.alt, heroImageCredit: item.credit })
      .where(eq(experiences.id, item.experienceId))
      .returning({ id: experiences.id, title: experiences.title });

    console.log(`✓ ${result.title}`);
  } catch (e) {
    console.error(`✗ Failed for ${item.localFile}:`, e.message);
  }
}

await client.end();
console.log("\nDone.");
