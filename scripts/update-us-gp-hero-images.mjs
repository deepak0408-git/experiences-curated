import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents } from "../schema/database.ts";

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

const updates = [
  {
    slug: "us-gp-main-grandstand-mtnarnxn",
    local: "Images/US GP - Main Grandstand Steve CC2.0.jpg",
    alt: "Sunset view of Circuit of the Americas",
    credit: "Steve from Austin, TX, USA — CC BY-SA 2.0",
  },
  {
    slug: "us-gp-turn-1-big-red-mtnau7yl",
    local: "Images/US GP - Turn 1 Lars Plougmann CC2.0.jpg",
    alt: "Turn 1 at Circuit of the Americas",
    credit: "Lars Plougmann — CC BY-SA 2.0",
  },
  {
    slug: "us-gp-turn-15-stadium-mtnawame",
    local: "Images/US GP - Turn 15 rsyphotography CC2.0.jpg",
    alt: "Turn 15 stadium section at Circuit of the Americas",
    credit: "rsyphotography — CC BY-SA 2.0",
  },
  {
    slug: "us-gp-paddock-club-mtnaymp3",
    local: "Images/US GP - Paddock Club rsyphotography CC4.0.jpg",
    alt: "Paddock Club hospitality area at Circuit of the Americas",
    credit: "rsyphotography — CC BY 4.0",
  },
  {
    slug: "us-gp-champions-club-mtnb0s29",
    local: "Images/US GP - Champions Club Jonathan Borba Pexels.jpg",
    alt: "F1 pit lane and garage scene",
    credit: "Jonathan Borba — Pexels Licence",
  },
  {
    slug: "us-gp-general-admission-mtnb3iak",
    local: "Images/US GP - General Admission.jpg",
    alt: "General admission area at Circuit of the Americas",
    credit: null,
  },
  {
    slug: "us-gp-super-stage-concerts-mtnb5txr",
    local: "Images/US GP - Super Stage Concerts Fausto Ferreira Pexels.jpg",
    alt: "Concert crowd under stage lights at night",
    credit: "Fausto Ferreira — Pexels Licence",
  },
  {
    slug: "us-gp-getting-to-cota-mtnb7nq3",
    local: "Images/US GP - Getting to COTA Wes Hicks Unsplash.jpg",
    alt: "Nighttime highway traffic in Austin, TX",
    credit: "Wes Hicks — Unsplash Licence",
  },
  {
    slug: "us-gp-first-timer-guide-mtnrkr17",
    local: "Images/US GP - Hero Image rsyphotography CC2.0.jpg",
    alt: "Circuit of the Americas",
    credit: "rsyphotography — CC BY-SA 2.0",
  },
  {
    slug: "us-gp-weather-what-to-pack-mtnrmi9a",
    local: "Images/US GP - Weather Steve CC2.0.jpg",
    alt: "Sunny skies over Circuit of the Americas",
    credit: "Steve from Austin, TX, USA — CC BY-SA 2.0",
  },
  {
    slug: "us-gp-where-to-stay-mtnrooyy",
    local: "Images/US GP - Where to Stay Justin Jensen CC2.0.jpg",
    alt: "South Congress Avenue with downtown Austin in the distance",
    credit: "Justin Jensen — CC BY 2.0",
  },
  {
    slug: "us-gp-franklin-barbecue-mtnrrnnn",
    local: "Images/US GP - Franklin Barbecue Larry D Moore CC4.0.jpg",
    alt: "Franklin Barbecue exterior in Austin",
    credit: "Larry D. Moore — CC BY 4.0",
  },
  {
    slug: "us-gp-bbq-beyond-franklin-mtnru00q",
    local: "Images/US GP - BBQ Beyond Franklin Wijs Pexels.jpg",
    alt: "Smoked meat on a barbecue grill",
    credit: "Wijs (Wise) — Pexels Licence",
  },
  {
    slug: "us-gp-south-congress-mtnrwh4s",
    local: "Images/US GP - Austin Max Miner.jpg",
    alt: "Downtown Austin skyline and lake view",
    credit: "Max Miner — Unsplash Licence",
  },
  {
    slug: "us-gp-sixth-rainey-street-mtnryp67",
    local: "Images/US GP - Austin at Night Kevin Payravi CC4.0.jpg",
    alt: "Sixth Street, Austin, at night",
    credit: "Kevin Payravi — CC BY-SA 4.0",
  },
  {
    slug: "us-gp-lady-bird-lake-mtns0w9a",
    local: "Images/US GP - Lake Cody McLain.jpg",
    alt: "Austin skyline reflected in the water at night",
    credit: "Cody McLain — Unsplash Licence",
  },
  {
    slug: "us-gp-zilker-barton-springs-mtns2uph",
    local: "Images/US GP - Barton Springs Wordandgesture CC3.0.jpg",
    alt: "Barton Springs Pool, Austin",
    credit: "Wordandgesture — CC BY-SA 3.0",
  },
  {
    slug: "us-gp-hill-country-fredericksburg-mtns599e",
    local: "Images/US GP - Wine Daniel Salgado.jpg",
    alt: "Vineyard in Texas Hill Country",
    credit: "Daniel Salgado — Unsplash Licence",
  },
  {
    slug: "us-gp-san-antonio-daytrip-mtns7igg",
    local: "Images/US GP - San Antonio Riis2602 CC4.0.jpg",
    alt: "Mission San José y San Miguel de Aguayo, San Antonio Missions National Historical Park",
    credit: "Riis2602 — CC BY-SA 4.0",
  },
  {
    slug: "us-gp-austin-live-music-mtns9lwz",
    local: "Images/US GP - Austin Live Music Larry D Moore CC4.0.jpg",
    alt: "The Broken Spoke dance hall, Austin",
    credit: "Larry D. Moore — CC BY 4.0",
  },
];

for (const u of updates) {
  const r2Key = `experiences/hero/${u.local.replace("Images/", "").replace(/\.jpg$/i, "")}.jpg`;
  const heroImageUrl = await uploadLocal(u.local, r2Key);

  await db
    .update(experiences)
    .set({
      heroImageUrl,
      heroImageAlt: u.alt,
      heroImageCredit: u.credit,
    })
    .where(eq(experiences.slug, u.slug));

  console.log(`✓ ${u.slug} → ${heroImageUrl}`);
}

// #9's image ("US GP - Hero Image rsyphotography CC2.0.jpg") also becomes
// the event pack's own hero image per the user's explicit instruction.
const eventHeroKey = "experiences/hero/US GP - Hero Image rsyphotography CC2.0.jpg";
const eventHeroUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${eventHeroKey}`;

await db
  .update(sportingEvents)
  .set({ heroImageUrl: eventHeroUrl })
  .where(eq(sportingEvents.slug, "united-states-grand-prix"));

console.log(`✓ Event pack hero image set → ${eventHeroUrl}`);

await client.end();
