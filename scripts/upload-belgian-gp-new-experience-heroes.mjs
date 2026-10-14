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

// Hero images chosen by founder, 12 Oct 2026, for the 5 new Belgian GP
// Ticket Intelligence write-ups. Gold 1, La Source, and Bus Stop Chicane
// are real Wikimedia Commons photos of the actual circuit/corner. Les
// Combes and Paddock Club are representative/reused images (no genuine
// Les Combes-specific or Spa Paddock Club interior photo was found after a
// thorough search) — credited honestly as such, not as if they were
// verified Spa-specific photography.
const ITEMS = [
  {
    expId: "a2fe932f-4d96-495a-9e2b-af99da8955a3", // Gold 1: Pit Grandstand
    localFile: "Images/Belgian GP 2026 - Spa Old Pit Lane.jpg",
    r2Key: "experiences/hero/belgian-gp-gold1-pit.jpg",
    alt: "Spa-Francorchamps pit lane building",
    credit: "Hejnjahns, CC BY-SA 4.0, via Wikimedia Commons",
  },
  {
    expId: "415ad447-2dcf-434a-8706-947d1e9ba096", // Les Combes
    localFile: "Images/Belgian GP 2027 - Les Combes.jpg",
    r2Key: "experiences/hero/belgian-gp-les-combes.jpg",
    alt: "Les Combes braking zone, representative image",
    credit: "Representative Image",
  },
  {
    expId: "cde406a7-9ac9-47bd-8662-3c0586390c11", // La Source Hairpin
    localFile: "Images/Belgian GP 2026 - La Source Hairpin.jpg",
    r2Key: "experiences/hero/belgian-gp-la-source.jpg",
    alt: "La Source hairpin at Spa-Francorchamps",
    credit: "Hejnjahns, CC BY-SA 4.0, via Wikimedia Commons",
  },
  {
    expId: "ae6b94d2-84e5-455a-b143-f4dfc26e5562", // Paddock Club
    localFile: "Images/Mexico City GP - Paddock Jason Puddephatt CC by 4.0.jpg",
    r2Key: "experiences/hero/belgian-gp-paddock-club.jpg",
    alt: "F1 Paddock Club hospitality, representative image (Mexico City GP)",
    credit: "Jason Puddephatt, CC BY 4.0",
  },
  {
    expId: "fcc5ff87-f014-4814-92d1-b5dbcf10ff4b", // Bus Stop Chicane
    localFile: "Images/Belgian GP 2026 - Bus Stop Chicane.jpg",
    r2Key: "experiences/hero/belgian-gp-bus-stop-chicane.jpg",
    alt: "Bus Stop Chicane and La Source viewed from Bruxelles, Spa-Francorchamps",
    credit: "DoomWarrior, CC BY-SA 3.0, via Wikimedia Commons",
  },
];

for (const item of ITEMS) {
  const file = readFileSync(item.localFile);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: item.r2Key,
    Body: file,
    ContentType: "image/jpeg",
  }));
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.r2Key}`;

  await db.update(experiences)
    .set({
      heroImageUrl,
      heroImageAlt: item.alt,
      heroImageCredit: item.credit,
    })
    .where(eq(experiences.id, item.expId));

  console.log(`✓ ${item.localFile} → ${heroImageUrl} (exp ${item.expId})`);
}

await client.end();
