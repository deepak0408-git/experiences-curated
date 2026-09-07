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

// #3 — Mexico City GP Ticket Guide — curator-supplied image
const ticketGuideUrl = await uploadLocal(
  "Images/Mexico City GP - Ticket Guide credit Tsoncch22 CC4.0.jpg",
  "experiences/hero/Mexico City GP - Ticket Guide credit Tsoncch22 CC4.0.jpg"
);
console.log("✓ Uploaded Ticket Guide image:", ticketGuideUrl);

// #5 — Fan Zone — curator-supplied image
const fanZoneUrl = await uploadLocal(
  "Images/Mexico City GP - Fan Zone Gobierno CDMX CC1.0.jpg",
  "experiences/hero/Mexico City GP - Fan Zone Gobierno CDMX CC1.0.jpg"
);
console.log("✓ Uploaded Fan Zone image:", fanZoneUrl);

// #6 — Autódromo Hermanos Rodríguez — Inside the Venue — option 2 from artifact
// (Vista aérea ...02.jpg, ProtoplasmaKid, CC BY-SA 4.0)
const autodromoVenueUrl = await uploadLocal(
  "Images/Mexico City GP - Autodromo Venue Aerial 2 ProtoplasmaKid.jpg",
  "experiences/hero/Mexico City GP - Autodromo Venue Aerial 2 ProtoplasmaKid.jpg"
);
console.log("✓ Uploaded Autódromo venue image:", autodromoVenueUrl);

const updates = [
  {
    slug: "mexico-city-gp-ticket-guide-mtpdisxk",
    heroImageUrl: ticketGuideUrl,
    heroImageAlt: "Mexico City Grand Prix ticket guide",
    heroImageCredit: "Tsoncch22 — CC BY 4.0",
  },
  {
    slug: "mexico-city-gp-fan-zone-mtpdlqj4",
    heroImageUrl: fanZoneUrl,
    heroImageAlt: "Mexico City Grand Prix fan zone",
    heroImageCredit: "Gobierno CDMX — CC0 1.0",
  },
  {
    slug: "autodromo-hermanos-rodriguez-venue-mtpdn8im",
    heroImageUrl: autodromoVenueUrl,
    heroImageAlt: "Aerial drone view of the Autódromo Hermanos Rodríguez and Estadio GNP Seguros",
    heroImageCredit: "ProtoplasmaKid — CC BY-SA 4.0",
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
