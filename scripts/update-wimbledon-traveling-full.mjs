import { config } from "dotenv";
config({ path: ".env.local" });

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

const EXPERIENCE_ID = "6dc038b8-c59e-4edc-a9fe-b6606621f6b7";

// ─── 1. Download tube image from Unsplash and upload to R2 ──────────────────

const imageUrl = "https://images.unsplash.com/photo-1530435622277-39544076a5f8?fm=jpg&q=80&w=3000&auto=format&fit=crop";
const imageKey = "experiences/hero/wimbledon-traveling.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const res = await fetch(imageUrl);
if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
const imageBuffer = Buffer.from(await res.arrayBuffer());

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: imageBuffer,
  ContentType: "image/jpeg",
}));
console.log("✓ Tube hero image uploaded:", heroImageUrl);

// ─── 2. Updated content ──────────────────────────────────────────────────────

const bodyContent = `The received wisdom on getting to Wimbledon is the District line. It is not the best advice. The District line will get you to Wimbledon station, but it adds a journey time from central London that Southwestern Railway's direct service from Waterloo doesn't. From Waterloo, the journey to Wimbledon takes 21 minutes. From the District line, it depends on where you're starting and how many changes you make along the way.

The fastest and least complicated route is Southwestern Railway from London Waterloo to Wimbledon station. Trains run every few minutes during peak tournament hours and take 21 minutes direct. From Wimbledon station, the ground is a 15-minute walk along Church Road, clearly signed, flat the entire way. The walk passes the queue if you arrive early, which is its own introduction to the Wimbledon atmosphere.

The District line option — Wimbledon Branch — terminates at Wimbledon station, the same destination. It's a longer journey from most starting points in central London, involves changes in the majority of cases, and the connection at Earls Court can be slow during tournament hours. If you're staying in Earl's Court, West Kensington, or Putney, the District line makes sense. From the City, Victoria, or Waterloo areas, the SWR train is consistently faster.

Southfields station, two stops before Wimbledon on the District line, is worth knowing about. It's a shorter walk to the southern gates than Wimbledon station — useful if you're approaching from east or northeast London, and noticeably less crowded on the exit during busy days. Some regulars prefer it precisely because the Wimbledon station exit crowd can slow the walk to the ground by ten minutes on a sold-out day.

The 93 bus from Putney runs to the ground and drops near the main entrance on Church Road. It's slower than the train but useful if you're coming from Putney or staying in that area. During the tournament, a dedicated shuttle service operates from Wimbledon town centre on a loop from early morning until the end of play each day.

If you're arriving from Kings Cross, Victoria, or the City: the cleanest route is Tube to Waterloo — Jubilee or Northern line — then SWR train direct to Wimbledon. Total journey time from most central London stations is 35 to 45 minutes. From Canary Wharf on the Jubilee line to Waterloo is 8 minutes; add 21 for the train. That's 29 minutes total, often faster than a District line journey with changes.

For those who prefer a cab, black taxis and ride-hailing apps are a practical option for earlier departures or the return journey late in the evening. Licensed black cabs are available at Waterloo, King's Cross, Victoria, and most major interchange stations — they can be hailed on the street or booked via the Gett app. Uber and Bolt operate across London much as they do in any other major city. A direct cab from central London to Wimbledon typically takes 35 to 55 minutes depending on traffic, and costs roughly £35–55. During the tournament, traffic around Church Road and the surrounding streets can be heavy from mid-morning on high-attendance days; the train consistently outperforms the cab on journey time during peak hours. For early-morning arrivals or the return after the crowds have thinned, a cab is more competitive. One caution: minicabs must be pre-booked through a licensed operator — they cannot be legally hailed on the street. Unlicensed touts around major venues are common; decline them.

Driving to Wimbledon during the tournament is rarely the right call. Parking on the roads around the ground is restricted, and the main All England Club car park requires an advance parking ticket — included with some hospitality packages, otherwise purchased separately well in advance. The Wimbledon Park cricket ground operates as overflow parking and is generally available on the day, but fills by mid-morning on high-attendance days. If you must drive, build in 30 minutes of contingency.

Timing makes a difference you don't see until you've got it wrong. The gates open at 10:30am. Arriving 30 minutes before — whether from the queue or from the car park — is the comfortable margin. The peak entry crush is mid-morning when the first matches begin and a wave of late arrivals converges on the gate at once. On the way out: the crowd exit after the day's last match is heavy. If you're not in a rush, 20 to 30 minutes inside after play finishes will clear most of it.`;

const insiderTips = [
  "SWR trains from Waterloo run every few minutes during tournament hours — no need to check the timetable, just turn up at the platform.",
  "Southfields station (District line) is better than Wimbledon station if you're arriving from east London or staying in Kensington — shorter walk, less crowded exit.",
  "For cabs, Uber and Bolt work reliably across London. For black taxis, the Gett app lets you pre-book — useful for early-morning arrivals or late-evening departures.",
  "Plan your route before you leave using the TfL Journey Planner (tfl.gov.uk/plan-a-journey), Citymapper, or Google Maps — all handle real-time disruptions well.",
  "On the way back, give it 20–30 minutes after the last match before leaving if you want to avoid the peak exit crush.",
];

// ─── 3. Update experience ────────────────────────────────────────────────────

await db
  .update(experiences)
  .set({ bodyContent, insiderTips, heroImageUrl, budgetTier: "budget" })
  .where(eq(experiences.id, EXPERIENCE_ID));

console.log("✓ Traveling experience fully updated");
await client.end();
