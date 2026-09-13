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

async function uploadRemote(url, r2Key) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: buf,
    ContentType: "image/jpeg",
  }));
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
}

async function setHero(slug, heroImageUrl, heroImageAlt, heroImageCredit) {
  await db.update(experiences)
    .set({ heroImageUrl, heroImageAlt, heroImageCredit: heroImageCredit ?? null })
    .where(eq(experiences.slug, slug));
  console.log(`✓ ${slug} → ${heroImageUrl}`);
}

// #1 Court Philippe-Chatrier & Suzanne-Lenglen — user-supplied, no credit
{
  const url = await uploadLocal("Images/French Open - Philip Chatrier.jpg", "experiences/hero/french-open-chatrier-lenglen-v2.jpg");
  await setHero("court-philippe-chatrier-suzanne-lenglen", url, "Court Philippe-Chatrier, Roland-Garros", null);
}

// #2 Grounds Pass — user-supplied, no credit
{
  const url = await uploadLocal("Images/French Open - Grounds Pass.jpg", "experiences/hero/french-open-grounds-pass-v2.jpg");
  await setHero("roland-garros-grounds-pass-tickets", url, "Roland-Garros grounds and outside courts", null);
}

// #3 Hospitality — user-supplied, no credit
{
  const url = await uploadLocal("Images/French Open - Hospitality.jpg", "experiences/hero/french-open-hospitality-v2.jpg");
  await setHero("roland-garros-official-hospitality", url, "Roland-Garros hospitality", null);
}

// #4 Roland-Garros Travel — user-supplied, no credit
{
  const url = await uploadLocal("Images/French Open - Roland Garros.jpg", "experiences/hero/french-open-travel-v2.jpg");
  await setHero("roland-garros-travel-official-packages", url, "Roland-Garros", null);
}

// #5 Stadium Tour + Tenniseum — Option 2 (Tenniseum trophies)
{
  const url = await uploadRemote(
    "https://upload.wikimedia.org/wikipedia/commons/c/c5/French_Tennis_Federation_Museum%2C_Roland_Garros%2C_Paris_06.jpg",
    "experiences/hero/french-open-tenniseum-v2.jpg"
  );
  await setHero("roland-garros-stadium-tour-tenniseum", url, "Tenniseum exhibit — French Open trophies", "Ank kumar, CC BY-SA 4.0");
}

// #6 Night Sessions — Option 1 from #1's original set (Court Philippe-Chatrier match, CC BY-SA 4.0)
{
  const url = await uploadRemote(
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/Court_Philippe_Chatrier_2023_cropped.jpg",
    "experiences/hero/french-open-night-sessions-v2.jpg"
  );
  await setHero("roland-garros-night-sessions", url, "Court Philippe-Chatrier during a 2023 French Open match", "Remi Mathis, CC BY-SA 4.0");
}

// #7 Practice Courts & Outside Courts — user-supplied, no credit
{
  const url = await uploadLocal("Images/French Open - Outside Courts.jpg", "experiences/hero/french-open-practice-courts-v2.jpg");
  await setHero("roland-garros-practice-courts-outside-courts", url, "Outside courts at Roland-Garros", null);
}

// #8 What to Eat — Option 1 (waffle with Nutella)
{
  const url = await uploadRemote(
    "https://images.unsplash.com/photo-1485629066172-81a49ed3aa29?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "experiences/hero/french-open-food-v2.jpg"
  );
  await setHero("what-to-eat-inside-roland-garros", url, "Waffle with Nutella, a Roland-Garros classic", "Pietro De Grandi, Unsplash Licence");
}

// #9 Luxury Dining — new upscale restaurant interior (Rachel Claire, Pexels)
{
  const url = await uploadRemote(
    "https://images.pexels.com/photos/5490972/pexels-photo-5490972.jpeg",
    "experiences/hero/french-open-luxury-dining-v2.jpg"
  );
  await setHero("french-open-luxury-dining-bois-de-boulogne", url, "Upscale restaurant interior", "Rachel Claire, Pexels Licence");
}

// #10 Everyday Parisian Eating — Option 3 (Crêpes with Nutella)
{
  const url = await uploadRemote(
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/Crêpes_con_la_Nutella.JPG",
    "experiences/hero/french-open-everyday-eating-v2.jpg"
  );
  await setHero("everyday-parisian-eating-baguette-jambon-beurre", url, "Crêpes topped with Nutella and powdered sugar", "Dawid Skalec, CC BY-SA 3.0");
}

// #11 Hotel Molitor — Option 2 (generic indoor hotel pool)
{
  const url = await uploadRemote(
    "https://images.unsplash.com/photo-1771947550396-1fb9b5adb698?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "experiences/hero/french-open-hotel-molitor-v2.jpg"
  );
  await setHero("hotel-molitor-paris-luxury-stay", url, "Indoor hotel pool", "Latitude Suites, Unsplash Licence");
}

// #12 Ibis Boulogne-Billancourt — Option 1 (Hotel de Ville)
{
  const url = await uploadRemote(
    "https://upload.wikimedia.org/wikipedia/commons/2/2e/H%C3%B4tel_Ville_Boulogne_Billancourt_1.jpg",
    "experiences/hero/french-open-ibis-boulogne-v2.jpg"
  );
  await setHero("ibis-boulogne-billancourt-midrange-stay", url, "Hôtel de Ville, Boulogne-Billancourt", "Chabe01, CC BY-SA 4.0");
}

// #13 Boulogne-Billancourt short-let — new generic budget hotel interior (ikhbale, Unsplash)
{
  const url = await uploadRemote(
    "https://images.unsplash.com/photo-1725962441765-6aaa75327f3b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "experiences/hero/french-open-boulogne-shortlet-v2.jpg"
  );
  await setHero("boulogne-billancourt-short-let-budget-stay", url, "Modest budget hotel room", "ikhbale, Unsplash Licence");
}

// #14 Village d'Auteuil — Option 1 (Villa Boileau)
{
  const url = await uploadRemote(
    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Villa_Boileau_Paris_16e_001.JPG",
    "experiences/hero/french-open-village-auteuil-v2.jpg"
  );
  await setHero("village-dauteuil-neighborhood", url, "Entrance of Villa Boileau, Auteuil", "Moonik, CC BY-SA 3.0");
}

// #16 Montmartre — Option 1 (Sacre-Coeur)
{
  const url = await uploadRemote(
    "https://upload.wikimedia.org/wikipedia/commons/3/3f/Basilique_du_Sacr%C3%A9-C%C5%93ur_de_Montmartre_-_Paris_-_GT-01_-_2024.jpg",
    "experiences/hero/french-open-montmartre-v2.jpg"
  );
  await setHero("montmartre-neighborhood", url, "Sacré-Cœur Basilica, south facade", "Terragio67, CC BY-SA 4.0");
}

// #17 Le Caveau de la Huchette — Option 3 (generic jazz/saxophone)
{
  const url = await uploadRemote(
    "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0",
    "experiences/hero/french-open-caveau-v2.jpg"
  );
  await setHero("caveau-de-la-huchette-jazz", url, "Jazz concert", "Jens Thekkeveettil, Unsplash Licence");
}

// #18 Paris Icons — user-supplied, credit DXR CC BY-SA 2.0
{
  const url = await uploadLocal("Images/French Open - Paris Icons Eiffel Tower.jpg", "experiences/hero/french-open-paris-icons-v2.jpg");
  await setHero("paris-icons-eiffel-tower-seine-arc-de-triomphe", url, "Eiffel Tower", "DXR, CC BY-SA 2.0");
}

// #19 Paris Landmarks — Option 1 (Louvre Pyramid)
{
  const url = await uploadRemote(
    "https://upload.wikimedia.org/wikipedia/commons/6/66/Louvre_Museum_Wikimedia_Commons.jpg",
    "experiences/hero/french-open-paris-landmarks-v2.jpg"
  );
  await setHero("paris-landmarks-louvre-notre-dame", url, "Louvre Pyramid, Napoleon Courtyard, twilight", "Benh LIEU SONG, CC BY-SA 3.0");
}

// #20 Versailles — Option 1 (Chateau from the park)
{
  const url = await uploadRemote(
    "https://upload.wikimedia.org/wikipedia/commons/c/c2/Versailles_chateau.jpg",
    "experiences/hero/french-open-versailles-v2.jpg"
  );
  await setHero("versailles-day-trip", url, "Château de Versailles viewed from the park", "Marc Vassal, CC BY-SA 3.0");
}

// #21 Moulin Rouge — user-supplied, credit Nasreddine Nas'h CC BY-SA 4.0 (same as Option 1)
{
  const url = await uploadLocal("Images/French Open - Moulin Rouge.jpg", "experiences/hero/french-open-moulin-rouge-v2.jpg");
  await setHero("moulin-rouge-show", url, "Moulin Rouge cabaret at night", "Nasreddine Nas'h, CC BY-SA 4.0");
}

console.log("\nAll hero image updates complete.");
await client.end();
