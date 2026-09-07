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

// Ibis Boulogne-Billancourt — Mid-Range Stay. Image is a generic Ibis-brand room
// (Hôtel Ibis Yerevan, not this specific property) — used as representative B-roll
// per founder direction 7 Sep 2026, credited honestly as a generic Ibis interior
// rather than implied to be this exact hotel. Also fixes the exact street address,
// previously missing from both the address field and practicalInfo.
{
  const url = await uploadLocal(
    "Images/Ibis - Generic Room B-Roll - Benoit Prieur CC0.jpg",
    "experiences/hero/french-open-ibis-boulogne-v3.jpg"
  );
  await db.update(experiences)
    .set({
      heroImageUrl: url,
      heroImageAlt: "A typical Ibis hotel room interior",
      heroImageCredit: "Benoît Prieur, CC0",
      address: "12 Rue de la Ferme, 92100 Boulogne-Billancourt, France",
      practicalInfo: {
        hours: "24-hour reception",
        address: "Ibis Paris Boulogne Billancourt, 12 Rue de la Ferme, 92100 Boulogne-Billancourt, France",
        website: "https://all.accor.com/hotel/6245/index.en.shtml",
        costRange: "Mid-range Ibis pricing, typically €120-200/night depending on season and tournament demand",
        bookingMethod: "Book directly via all.accor.com or standard platforms (Booking.com, Expedia). Book early for Roland-Garros dates — rooms this close to the venue sell out well ahead of the tournament.",
        reservationsRequired: true,
      },
    })
    .where(eq(experiences.slug, "ibis-boulogne-billancourt-midrange-stay"));
  console.log(`✓ ibis-boulogne-billancourt-midrange-stay → ${url} + address fixed`);
}

await client.end();
