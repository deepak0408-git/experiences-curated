import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync, readFileSync } from "fs";
import https from "https";
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

function download(url, dest, attempt = 1) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "ExperiencesCuratedBot/1.0 (contact: hello@experiences-curated.com)" } }, (res) => {
      if (res.statusCode === 429 && attempt < 4) {
        res.resume();
        return setTimeout(() => download(url, dest, attempt + 1).then(resolve, reject), 3000 * attempt);
      }
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest, attempt).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => { writeFileSync(dest, Buffer.concat(chunks)); resolve(); });
    }).on("error", reject);
  });
}

async function uploadHero(localPath, imageKey) {
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync(localPath),
    ContentType: "image/jpeg",
  }));
  return heroImageUrl;
}

try {
  // ─── 1. Where to Stay in Sandton ─────────────────────────────────────
  const sandtonImgPath = "Images/Sandton Skyline.jpg";
  await download("https://upload.wikimedia.org/wikipedia/commons/b/b6/View_Of_Sandto_From_The_West_Cliff_Hotel_In_Forst_Town.jpg", sandtonImgPath);
  const sandtonHero = await uploadHero(sandtonImgPath, "experiences/hero/where-to-stay-in-sandton.jpg");

  const sandtonBookingLinks = [
    { platform: "booking.com", label: "The Michelangelo Towers", url: "https://www.booking.com/hotel/za/the-michelangelo-towers.html" },
    { platform: "booking.com", label: "Radisson Blu Gautrain Hotel", url: "https://www.booking.com/hotel/za/radisson-blu-gautrain.html" },
  ];
  const sandtonPracticalInfo = {
    hours: "Standard hotel check-in from 2pm, check-out by 11am at both properties — confirm directly for early check-in/late check-out during peak tour dates",
    website: "https://www.legacyhotels.co.za/michelangelo-towers, https://www.radissonhotels.com/en-us/hotels/radisson-blu-johannesburg-sandton-gautrain",
    costRange: "Michelangelo Towers roughly R4,500-R20,000/night depending on suite category — genuinely wide range since every room is a full apartment-style suite; Radisson Blu Gautrain Hotel roughly R1,400-R2,500/night — both rates are guides only and will move with September-October tour demand",
    bookingMethod: "Book directly with each hotel or via Booking.com. Book ahead of the September-October tour window given the scale of a marquee Australia series.",
    reservationsRequired: true,
  };
  const [r1] = await db.update(experiences).set({
    heroImageUrl: sandtonHero,
    heroImageAlt: "Sandton skyline, Johannesburg, viewed from Westcliff",
    heroImageCredit: "Bizcallers, CC BY-SA 3.0",
    practicalInfo: sandtonPracticalInfo,
    bookingLinks: sandtonBookingLinks,
    editorialNote: "Sources: michelangelo.co.za, legacyhotels.co.za, expedia.com, tripadvisor.com, kayak.com (real price ranges), radissonhotels.com, booking.com (confirmed listings for both properties). Verified 15 Jul 2026.",
  }).where(eq(experiences.id, "a800fac2-aa69-4a68-a009-abc75cd39ca7")).returning({ title: experiences.title });
  console.log("✓", r1.title);

  // ─── 2. Braai Culture & Sandton/Melrose Arch Dining ──────────────────
  const braaiPracticalInfo = {
    hours: "The Braai Room: breakfast, lunch, and dinner service — confirm current hours directly via braairoom.co.za. March Restaurant: standard evening dinner service, check melrosearch.co.za for current hours.",
    website: "https://www.braairoom.co.za, https://www.melrosearch.co.za",
    costRange: "The Braai Room sits in the moderate range for a full meal with meat and sides; March Restaurant runs higher, into the splurge range for a full dinner",
    bookingMethod: "The Braai Room takes bookings via Dineplan (dineplan.com) — worth reserving ahead on weekends. March Restaurant and other Melrose Arch venues typically take direct restaurant bookings.",
    reservationsRequired: false,
  };
  const [r2res] = await db.update(experiences).set({
    practicalInfo: braaiPracticalInfo,
  }).where(eq(experiences.id, "a2a1487a-fbd2-4a8c-abda-4062c15b62da")).returning({ title: experiences.title });
  console.log("✓", r2res.title, "(website field fixed, no hero image found — no genuine venue-specific licensed photo exists)");

  // ─── 3. Soweto & the Apartheid Museum ─────────────────────────────────
  const soweto = "Images/Apartheid Museum Entrance.jpg";
  await download("https://upload.wikimedia.org/wikipedia/commons/4/4b/Apartheid_Museum_Entrance%2C_Johannesburg.JPG", soweto);
  const sowetoHero = await uploadHero(soweto, "experiences/hero/soweto-apartheid-museum.jpg");
  const [r3] = await db.update(experiences).set({
    heroImageUrl: sowetoHero,
    heroImageAlt: "Entrance to the Apartheid Museum, Johannesburg, showing the racially-assigned entrance gates",
    heroImageCredit: "Annette Kurylo, CC BY-SA 3.0",
  }).where(eq(experiences.id, "fbc0dcc8-95f2-4916-a692-14ef46385273")).returning({ title: experiences.title });
  console.log("✓", r3.title);

  // ─── 4. Kruger National Park — 2-Day Big 5 Safari ─────────────────────
  const kruger = "Images/Kruger Elephant.jpg";
  await download("https://upload.wikimedia.org/wikipedia/commons/2/22/Elephant_side-view_Kruger.jpg", kruger);
  const krugerHero = await uploadHero(kruger, "experiences/hero/kruger-2-day-safari-johannesburg.jpg");
  const [r4] = await db.update(experiences).set({
    heroImageUrl: krugerHero,
    heroImageAlt: "African elephant in Kruger National Park",
    heroImageCredit: "Felix Andrews, CC BY-SA 3.0",
  }).where(eq(experiences.id, "e288394a-eaeb-4dfc-bd5c-3cb852782eb5")).returning({ title: experiences.title });
  console.log("✓", r4.title);

  // ─── 5. Cradle of Humankind ────────────────────────────────────────────
  const cradle = "Images/Sterkfontein Caves.jpg";
  await download("https://upload.wikimedia.org/wikipedia/commons/5/51/Sterkfontein_Caves_16.jpg", cradle);
  const cradleHero = await uploadHero(cradle, "experiences/hero/cradle-of-humankind.jpg");
  const [r5] = await db.update(experiences).set({
    heroImageUrl: cradleHero,
    heroImageAlt: "Interior of Sterkfontein Caves, Cradle of Humankind",
    heroImageCredit: "Mike Peel (mikepeel.net), CC BY-SA 4.0",
  }).where(eq(experiences.id, "b5dde4ef-b23b-4519-a975-094ae4f5cfec")).returning({ title: experiences.title });
  console.log("✓", r5.title);

  console.log("\nDone. Getting to the Wanderers: no content bug found, no hero image sourced yet (no genuine Gautrain/Sandton-transit-specific licensed photo found this pass).");
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
