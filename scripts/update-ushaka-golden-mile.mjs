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

const EXPERIENCE_ID = "d3d88d46-1425-4362-a561-5f313553261f";

const bodyContent = `uShaka Marine World sits at the southern tip of the Golden Mile, at Point Waterfront, and works as two attractions in one site: the aquarium and marine park (uShaka Sea World), and the water park (Wet 'n Wild) next to it. The complex opened in April 2004, designed around a theme of a wrecked 1940s cargo ship, with the aquarium's underwater viewing galleries built to run through and beneath a series of recreated shipwrecks rather than standard tank corridors. It's the largest aquarium in the Southern Hemisphere.

Sea World tickets run around R202 for adults, R154 for children and seniors. The aquarium alone, without the marine park elements, is R104 for adults and R94 for children and seniors, open daily. Wet 'n Wild costs roughly R192/R156 and only operates Wednesday to Sunday.

The site includes dolphin and seal shows in a 1,200-seat stadium, along with a penguin enclosure — and it's worth knowing these shows have drawn real, ongoing criticism. Animal rights groups have held protests outside the park as recently as 2024, and there have been documented concerns about inbreeding among the dolphin population and the welfare implications of keeping cetaceans, which navigate primarily by echolocation, in concrete tanks. This is a live, unresolved debate in South Africa's conservation community, worth knowing before buying a Sea World ticket specifically for the dolphin show.

The wider Golden Mile deserves more than a passing mention, because it's genuinely one of Durban's best free activities regardless of what you decide on uShaka. The full beachfront promenade runs from Addington Beach in the south, past uShaka, up through South Beach and North Beach, to Blue Lagoon in the north — about two hours end to end at an easy walking pace. South Beach is where most people learn to surf, its breaks gentle enough for first-timers; North Beach has the sharper, better-known break further out. In between, the promenade passes the saltwater Marine Parade pools, the Bay of Plenty (a popular fishing spot), and two small, easy-to-miss attractions worth building in if you're walking anyway: Mini Town, a 1:25-scale model village of Durban landmarks that's been running since the 1960s, and the Time Warp Surf Museum, a small collection tracing Durban's surf culture and community history. Neither takes more than 20-30 minutes, and both work well as a break in the walk rather than a destination in themselves.`;

const insiderTips = [
  "Arrive at opening time on a weekday rather than a weekend — you'll get the first pick of lockers, empty queues at the aquarium entrance, and the water park slides largely to yourself for the first hour before the midday rush builds.",
  "If you only want the aquarium and not the marine park shows, buy the aquarium-only ticket (R104) — less than half the price of Sea World and covers the shipwreck-themed galleries.",
  "Wet 'n Wild is closed Monday and Tuesday — build a water park day around Wednesday through Sunday.",
];

const bookingLinks = [
  {
    platform: "getyourguide",
    label: "Durban Full-Day uShaka Marine World Tour",
    url: "https://www.getyourguide.com/durban-l168/durban-full-day-ushaka-marine-world-tour-t1191306/?partner_id=HCNITTS&utm_medium=online_publisher",
  },
];

try {
  const imageKey = "experiences/hero/ushaka-marine-world-golden-mile.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync("Images/uShaka.jpg"),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const [result] = await db.update(experiences).set({
    heroImageUrl,
    heroImageAlt: "uShaka Marine World, Durban",
    heroImageCredit: "Wikimedia Commons",
    bodyContent,
    insiderTips,
    bookingLinks,
    editorialNote: "Sources: ushakamarine.com, ushakamarine.com/ratesandtimes, Wikipedia (uShaka Marine World, Golden Mile Durban), Earthrace Conservation, ECR News (dolphin show controversy), southafrica.net (Golden Mile beaches/promenade guide), sa-venues.com, thesurfatlas.com (surf breaks by beach). Verified 14-15 Jul 2026.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title });

  console.log("✓ Updated:", result.title, "|", result.id);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
