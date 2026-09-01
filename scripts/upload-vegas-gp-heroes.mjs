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
    experienceId: "00fdb184-c5dd-44ea-bb1d-2fe32c4ba833", // #5 T-Mobile Zone at Sphere
    localFile: "Las Vegas GP - Sphere with F1 Grandstands.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-sphere-f1-grandstands.jpg",
    alt: "The Sphere illuminated at night with F1 grandstands visible during Las Vegas Grand Prix race week",
    credit: "Harold Litwiler, CC BY-SA 2.0",
  },
  {
    experienceId: "fbf4cc53-e27f-438a-aaf4-cc8fbfcb7897", // #6 F1 Paddock Club
    localFile: "Las Vegas GP - F1 Pit Lane Garage.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-paddock-club.jpg",
    alt: "Formula 1 pit lane and garage scene during race preparations",
    credit: "Jonathan Borba, Pexels Licence",
  },
  {
    experienceId: "48e12a48-7659-442d-a561-b47e9b9d2aa9", // #7 Getting Around Race Weekend
    localFile: "Las Vegas GP - Monorail MGM Grand Station.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-monorail.jpg",
    alt: "Las Vegas Monorail train at MGM Grand station",
    credit: "Joseph Zadeh, CC BY 4.0",
  },
  {
    experienceId: "5513f38a-73a8-4528-a540-afb722647764", // #8 First-Timer Orientation
    localFile: "Las Vegas GP - Night Crowd Neon.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-night-crowd.jpg",
    alt: "Large crowd gathered outdoors at a night event under neon lights",
    credit: "Stephen Leonardi, Pexels Licence",
  },
  {
    experienceId: "cc4f8dc9-b258-4bee-a9e1-5cff97ec8120", // #9 Staying Trackside
    localFile: "Las Vegas GP - Bellagio Across the Lake.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-bellagio-lake.jpg",
    alt: "Bellagio Casino and Hotel viewed across the lake at night",
    credit: "Dave Toussaint, CC BY-SA 3.0",
  },
  {
    experienceId: "8bb77fba-28bf-41c1-a98b-0b282d6a92eb", // #10 Staying Off-Strip
    localFile: "Las Vegas GP - Circa Sign.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-circa-sign.jpg",
    alt: "Circa Resort & Casino's main sign in downtown Las Vegas",
    credit: "Julian Lupyan, CC0 1.0 Public Domain",
  },
  {
    experienceId: "73769d80-7f26-45d7-848a-500c18581c4d", // #11 Bellagio & Caesars Dining
    localFile: "Las Vegas GP - Caesars Palace at Night.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-caesars-palace.jpg",
    alt: "Caesars Palace illuminated at night in Las Vegas",
    credit: "Simeon87, CC BY-SA 3.0",
  },
  {
    experienceId: "3b1edfaa-dfdc-4ca4-836d-68419da4362f", // #12 Fremont Street & Downtown Dining
    localFile: "Las Vegas GP - Fremont Street Experience.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-fremont-street.jpg",
    alt: "Fremont Street Experience at night with Golden Nugget neon signage",
    credit: "Pierre André Leclercq, CC BY-SA 4.0",
  },
  {
    experienceId: "a7b5a59d-0a26-4fd8-b49d-331b32e74fbf", // #13 Bellagio Fountains and Sphere
    localFile: "Las Vegas GP - Fountains_of_Bellagio_at_night.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-fountains-of-bellagio.jpg",
    alt: "The Fountains of Bellagio illuminated at night",
    credit: null,
  },
  {
    experienceId: "ed779ba9-ff07-4deb-b3d6-20231de6da76", // #14 The Strip at Night
    localFile: "Las Vegas GP - Strip Panorama.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-strip-panorama.jpg",
    alt: "Panoramic view of the Las Vegas Strip at night, including the Eiffel Tower replica and Bellagio",
    credit: "Matthew Field, CC BY 2.5",
  },
  {
    experienceId: "63af4ff9-1a38-4420-aac1-0ad49c26e0ef", // #15 Red Rock Canyon
    localFile: "Las Vegas GP - Calico Hills Panorama.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-calico-hills.jpg",
    alt: "Panoramic view of the Calico Hills rock formations at Red Rock Canyon National Conservation Area",
    credit: "The Cosmonaut, CC BY-SA 2.5 CA",
  },
  {
    experienceId: "898b912b-4293-4aea-b71f-318d90975f83", // #16 Hoover Dam
    localFile: "Las Vegas GP - Hoover Dam.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-hoover-dam.jpg",
    alt: "Hoover Dam spanning the Colorado River between Nevada and Arizona",
    credit: "Christian David",
  },
  {
    experienceId: "0144feab-7ad2-4f1d-a872-617b25783c29", // #17 Race Week on the Strip
    localFile: "Las Vegas GP - Las_Vegas_Grand_Prix.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-race-week.jpg",
    alt: "Las Vegas Grand Prix race week on the Strip",
    credit: "DHSgov",
  },
  {
    experienceId: "d4fdbc36-bde0-47eb-9dc1-c318de755a60", // #18 Watching From a Sportsbook
    localFile: "Las Vegas GP - Circa Stadium Swim.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-stadium-swim.jpg",
    alt: "Circa Resort's Stadium Swim, viewed from the pool deck toward the hotel tower",
    credit: "Xnatedawgx, CC BY-SA 4.0",
  },
  {
    experienceId: "2c75de3a-ab35-4ddd-9e27-cd779405e373", // #19 Practice & Qualifying
    localFile: "Las Vegas GP - Qualifying.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-qualifying.jpg",
    alt: "Las Vegas Grand Prix qualifying session at night",
    credit: "DHSgov",
  },
  {
    experienceId: "5825be81-9e55-40dd-a7da-f2daee38dc66", // #20 The Strip's Casinos
    localFile: "Las Vegas GP - Canal Shoppes.jpg",
    r2Key: "sporting-events/hero/las-vegas-gp-canal-shoppes.jpg",
    alt: "The Venetian's indoor Grand Canal Shoppes with a gondola",
    credit: "APK, CC BY-SA 4.0",
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
      .returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

    console.log(`✓ ${result.title} -> ${heroImageUrl}`);
  } catch (e) {
    console.error(`✗ Failed for ${item.localFile}:`, e.message);
  }
}

await client.end();
console.log("\nDone.");
