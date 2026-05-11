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

const NO1_COURT_ID = "28924575-e7d6-4b4b-b2d4-65adbfa25b77";
const RAIN_ID = "0a950e7b-7da9-4ffa-9a84-f44d77d07ebc";

// ─── 1. Upload new rain hero image ────────────────────────────────────────────

const rainImageKey = "experiences/hero/wimbledon-rain-delay.jpg";
const rainImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${rainImageKey}`;

const rainFile = readFileSync("Images/wimbledon-rain-delay-2023.png");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: rainImageKey,
  Body: rainFile,
  ContentType: "image/png",
}));
console.log("✓ New rain hero image uploaded:", rainImageUrl);

// ─── 2. Update No. 1 Court — whyItsSpecial + insider tip #4 ─────────────────

const no1WhyItsSpecial = `There's a tendency, among people who haven't been to Wimbledon, to treat any ticket that isn't Centre Court as a lesser thing. The naming doesn't help — "No. 1 Court" sounds like second place. It isn't.

No. 1 Court is where the tennis is often more interesting. The draw sends established names to Centre Court for tidy first-round wins; Court 1 gets the players doing something, working their way through a quarter of the draw where anything can happen. The 2025 Championships made this case on Day 1. Women's world No. 2 Coco Gauff — then the reigning French Open champion — walked onto No. 1 Court against Dayana Yastremska and walked off having lost 7-6(3), 6-1. Gauff made nine double faults and 29 unforced errors. The biggest seed to fall in the first two days of the tournament, gone in a round where Centre Court had no comparable shock.

On the same court, same fortnight: fifth seed Taylor Fritz trailed two sets to love against Giovanni Mpetshi Perricard, who had just recorded the fastest serve in Wimbledon history at 153mph. Fritz was then 1-5 down in the fourth-set tiebreak, two points from elimination, before winning seven of the next eight points to force a decider. Fritz took the fifth set and survived. Mpetshi Perricard's serve record stands. Neither of those matches happened on Centre Court.

The 45-degree viewing angle matters more than it sounds. You're not watching through a camera lens or from directly behind a baseline — you're reading the whole court at once. The movement patterns before the ball is struck, the serve directions, the way a player positions themselves before they know where the next shot is going: all of this is visible from that angle in a way that a conventional sideline view doesn't provide.

Practically: the queue for No. 1 Court runs shorter than Centre Court on most days. The debenture lounge access is the same. The tennis is frequently as good. The ticket price, whether ballot face value or debenture resale, is meaningfully lower. For a first-time Wimbledon visitor who receives a No. 1 Court ticket in the ballot, this is not a consolation prize.`;

const no1InsiderTips = [
  "Debenture seats in the front 17 rows sit at a 45-degree angle to the court — many experienced Wimbledon regulars consider this the best live perspective for reading tennis.",
  "Floodlights allow play until 11pm; check the order of play for evening sessions, which have a different atmosphere from afternoon matches.",
  "The Queue releases Court 1 day tickets each morning alongside Centre Court — expect a shorter line, though demand grows in the second week as doubles finals move here.",
  "The first Friday (Day 5) and first Saturday (Day 6) of the Championships are the best days for No. 1 Court — rounds 2 and 3 are in full swing, the draw is still packed with top seeds, and the matches here often outshine Centre Court for sheer competitive intensity.",
  "The ballot covers both Centre Court and No. 1 Court in the same application — court and day are assigned; you cannot specify a preference.",
  "If your ticket runs into an evening session under the roof and floodlights, stay — night Wimbledon on Court 1 is worth the later finish.",
];

await db
  .update(experiences)
  .set({ whyItsSpecial: no1WhyItsSpecial, insiderTips: no1InsiderTips })
  .where(eq(experiences.id, NO1_COURT_ID));
console.log("✓ No. 1 Court — whyItsSpecial and insiderTips updated");

// ─── 3. Update When It Rains — hero image + whyItsSpecial ────────────────────

const rainWhyItsSpecial = `Wimbledon's rain has produced some of the most memorable tennis in the tournament's history — not despite the weather but partly because of what it creates. The long rain delay that compresses the schedule, forcing a match to finish under lights into the evening. The crowd that was about to leave, now held together inside a sealed Centre Court. The point that should have ended the set, played three hours later in a completely different atmosphere.

A specific example: at the 2024 Championships, Donna Vekić and Dayana Yastremska began their third-round match on Court 18. After the first set, rain came in and play was suspended. When the match resumed, it had been moved to No. 1 Court — under the roof. Vekić had taken the first set; Yastremska won the second in a tiebreak; then came the third. On the covered court, closed from the elements, Vekić dismantled the second set. She won the decider 6-1. Whether the roof changed the match or the players' nerves or simply Vekić's serving conditions is impossible to say with certainty. What the scoreline shows is that something shifted when the conditions did.

There's something specific about being at Wimbledon in the rain that a sun-drenched day doesn't provide. In good weather it's easy — the food is good, the grass is bright, everything works. In the rain, you're waiting alongside everyone else, sharing something uncertain. The crowd in a rain delay has a quality that a smooth Wimbledon afternoon doesn't. Something slightly suspended, like a held breath. And when play resumes — particularly indoors under lights — the intensity in the stadium is different from what it would have been without the interruption.

The rain also reveals something about who's there for the tennis versus who came for the event. A sustained delay thins out the crowd that was principally there for the strawberries. What remains in the stands when play finally resumes tends to care more.

This experience applies to every ticket type and every day of the fortnight. Preparing for rain isn't pessimism — it's the thing that keeps a rained-out day from being a wasted one.`;

await db
  .update(experiences)
  .set({
    whyItsSpecial: rainWhyItsSpecial,
    heroImageUrl: rainImageUrl,
    heroImageAlt: "Ground crew removing tarpaulin covers from a Wimbledon court after a rain delay during the 2023 Championships",
    heroImageCredit: "Photo by Paige Lorenze, CC BY 3.0",
  })
  .where(eq(experiences.id, RAIN_ID));
console.log("✓ When It Rains — hero image and whyItsSpecial updated");

await client.end();
console.log("\n✓ All updates applied. Reload /curator/review to check.");
