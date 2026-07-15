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

const EXPERIENCE_ID = "a800fac2-aa69-4a68-a009-abc75cd39ca7";

const insiderTips = [
  "The Michelangelo Towers' in-house restaurant, Parc Ferme, runs breakfast through dinner with al fresco seating — book ahead if you want a table on a match evening when the hotel is busier than usual.",
  "Both hotels offer airport shuttles to OR Tambo, but at very different price points: Michelangelo Towers charges around R1,090 per person one-way, while the Radisson Blu's shuttle runs about R695 per vehicle (not per person) and reaches OR Tambo in roughly 25 minutes — for two or more people, the Radisson Blu shuttle is meaningfully cheaper, and either way the Gautrain is usually the faster, cheaper option for a solo traveller.",
  "The Michelangelo Towers' spa (massages, body treatments, facials) is worth booking a day or two ahead rather than walking in — it's a genuine amenity, not just a hotel-brochure listing, and slots fill up around busy tour dates.",
];

const whatToAvoid = "Don't walk between your hotel and Nelson Mandela Square or nearby restaurants after dark, even though the distance looks trivial — Sandton's central business district empties out fast once the workday crowd leaves, and while the area is genuinely well-policed and well-lit, an Uber or Bolt for even a five-minute walk is the standard local advice after sunset, not overcaution. And don't assume both hotels' airport shuttles are priced the same way — the Michelangelo's is per person, the Radisson Blu's is per vehicle, and mixing that up when budgeting for a group can throw off your transport costs by a lot more than expected.";

try {
  const imageKey = "experiences/hero/where-to-stay-in-sandton.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync("Images/Sandton Skyline 1.jpg"),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const bookingLinks = [
    {
      platform: "booking.com",
      label: "The Michelangelo Towers",
      url: "https://www.dpbolvw.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fza%2Fthe-michelangelo-towers.en-gb.html%3Flabel%3Dgen173nr-10CAso-wFCF3RoZS1taWNoZWxhbmdlbG8tdG93ZXJzSDNYBGhsiAEBmAEzuAEXyAEM2AED6AEB-AEBiAIBqAIBuALe49zSBsACAdICJDFhOWFmYTJjLTc5ZDItNGUzMC05OThkLWI2NmExNzhiZWRlZtgCAeACAQ%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26dist%3D0%26group_adults%3D2%26group_children%3D0%26keep_landing%3D1%26no_rooms%3D1%26sb_price_type%3Dtotal%26type%3Dtotal%26",
    },
    {
      platform: "booking.com",
      label: "Radisson Blu Gautrain Hotel, Sandton",
      url: "https://www.tkqlhce.com/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fza%2Fradisson-blu-gautrain.en-gb.html%3Faid%3D304142%26label%3Dgen173nr-10CAEoggI46AdIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Atfg3NIGwAIB0gIkZWFhYzUyNmUtOTc0Zi00NzNmLWFhZjktN2I2ZDk5NWRhYWI42AIB4AIB%26sid%3D2f7dda1a3ed8c96947c6a99064bd7a3c%26all_sr_blocks%3D24156103_94360746_2_2_0_469497%26checkin%3D2026-09-23%26checkout%3D2026-09-27%26dest_id%3D241561%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D24156103_94360746_2_2_0_469497%26hpos%3D1%26matching_block_id%3D24156103_94360746_2_2_0_469497%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D24156103_94360746_2_2_0_469497_828720%26srepoch%3D1784099024%26srpvid%3D182831a05a5e08bc%26type%3Dtotal%26ucfs%3D1%26",
    },
  ];

  const [result] = await db.update(experiences).set({
    heroImageUrl,
    heroImageAlt: "Sandton skyline, Johannesburg",
    heroImageCredit: "Wikimedia Commons",
    insiderTips,
    whatToAvoid,
    bookingLinks,
    editorialNote: "Sources: michelangelo.co.za, legacyhotels.co.za, expedia.com, tripadvisor.com, kayak.com (real price ranges), radissonhotels.com, booking.com (confirmed listings, Michelangelo Towers 8.0/10 Very Good on 334 reviews — the 5.5 rating initially flagged by the user belongs to a separately-listed apartment unit, 'Michelangelo Towers 0801', not the hotel itself), sandton-info.co.za + tripadvisor.com forums (evening safety advice). Verified 15 Jul 2026.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
