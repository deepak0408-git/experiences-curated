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

const EXPERIENCE_ID = "fd935095-93fd-48ac-a037-2b4202f8b3f1";

try {
  const imageKey = "experiences/hero/kingsmead-cricket-by-the-beach.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync("Images/Kingsmead_Panorama.jpg"),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const practicalInfo = {
    hours: "1st ODI: 24 Sep 2026. 1st Test: 9-13 Oct 2026 (five days). Gates typically open 2-3 hours before play — check ESPNcricinfo's match page or the CSA app for confirmed start times closer to the tour, since ODI and Test start times differ and can shift for weather/TV scheduling.",
    website: "https://www.espncricinfo.com/cricket-grounds/kingsmead-durban-59089",
    costRange: "Tickets from ZAR 50 (Test, day 1) via Ticketpro — full tier breakdown to be confirmed closer to the tour",
    bookingMethod: "Tickets are on sale now via Ticketpro, Cricket South Africa's official ticketing partner, at tickets.cricket.co.za — search the South Africa vs Australia event listing directly rather than a generic cricket.co.za search, since individual match pages go live separately.",
    reservationsRequired: true,
  };

  const bookingLinks = [
    {
      platform: "ticketpro",
      label: "South Africa vs Australia — Official Tickets",
      url: "https://tickets.cricket.co.za/event/south-africa-vs-australia-zpzkjm",
    },
  ];

  const whatToAvoid = "Don't repeat the tide theory to a Durban local as established fact — a Kingsmead curator has gone on record dismissing it, pointing out you only need to dig about a metre down anywhere on the ground to hit water, tide or no tide. The real reason seamers get help late in the day is the coastal humidity turning muggy before the afternoon thunderstorms, not the Indian Ocean creeping in. Great story, wrong mechanism — know the difference before you repeat it as insider knowledge.";

  const [result] = await db.update(experiences).set({
    heroImageUrl,
    heroImageAlt: "Panoramic view of Kingsmead Cricket Stadium, Durban",
    heroImageCredit: "Marc Forrest, CC BY 2.0",
    practicalInfo,
    bookingLinks,
    whatToAvoid,
    editorialNote: "Sources: espncricinfo.com/cricket-grounds/kingsmead-durban-59089, Wikipedia (Kingsmead Cricket Ground), sahistory.org.za, sportsistan.com, sacricketmag.com/kingsmead (tide-myth debunk, curator quote), tickets.cricket.co.za (Ticketpro, CSA's official ticketing partner — confirmed live listing, on-sale now). Verified 14 Jul 2026.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
