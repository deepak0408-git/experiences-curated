import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents } from "../schema/database.ts";

// ─── R2 client ────────────────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// ─── DB ───────────────────────────────────────────────────────────────────────

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "the-wimbledon-queue-" + Date.now().toString(36);

// ─── 1. Upload hero image to R2 ───────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-queue.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-queue.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Create Wimbledon 2026 sporting event ──────────────────────────────────

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "The Championships, Wimbledon 2026",
    slug: "wimbledon-2026",
    sport: "tennis",
    tournamentSeries: "Wimbledon",
    editionYear: 2026,
    destinationId: LONDON_ID,
    venueName: "All England Lawn Tennis and Croquet Club",
    venueAddress: "Church Road, Wimbledon, London SW19 5AE",
    startDate: "2026-06-29",
    endDate: "2026-07-12",
    recurrence: "annual",
    ticketingUrl: "https://www.wimbledon.com/tickets",
  })
  .onConflictDoNothing()
  .returning({ id: sportingEvents.id, name: sportingEvents.name });

let wimbledonEventId;
if (event) {
  wimbledonEventId = event.id;
  console.log("✓ Sporting event created:", event.name, "→", wimbledonEventId);
} else {
  // Already exists — fetch it
  const existing = await db
    .select({ id: sportingEvents.id })
    .from(sportingEvents)
    .where(sportingEvents.slug, "wimbledon-2026");
  wimbledonEventId = existing[0]?.id;
  console.log("✓ Sporting event already exists, ID:", wimbledonEventId);
}

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `The Wimbledon Queue is not an accident. Every year, the All England Club deliberately holds back a portion of Centre Court and Court 1 tickets and refuses to sell them through any advance channel. The only way to get them is to show up, join a line that will stretch several kilometres by the early hours, and wait.

They give it a capital Q. They issue Queue Cards — numbered, laminated — so you know exactly where you stand. They publish a Queue Guide. They have stewards who wake you at 6am and ask you to take your tent down. In almost every respect, this is a managed ritual. And the ritual is the whole point.

You join on Church Road and Wimbledon Park Road, the streets running alongside the grounds. The official queue opens the afternoon before each day's play. When you arrive, a steward gives you a Queue Card. That card is your place. Don't lose it. If you need to leave briefly — food, a walk, the portable facilities — your card holds your spot for up to 30 minutes. The stewards are strict about this. They have seen every variation.

Gates open at 9:30am. Gate 3 is where you want to be: it's the most direct route toward Centre Court once you're inside. Most people in the Queue don't know this. Now you do.

The honest answer on when to arrive is: it depends. The Club's own guidance says to join the Queue before midday the day before, and serious queuers do exactly that — arriving the previous afternoon to secure a good position before camping overnight. Demand shifts year to year, day to day, based on the draw, the weather, the players still in the tournament. Before you decide when to leave home, check @TheWimbledonQ on X — it's the real-time feed that regulars use, and it's more reliable than any fixed time you'll read elsewhere. One thing that consistently holds: a rainy forecast means a shorter queue. If the weather looks grim, don't stay home. That's your advantage.

What to bring: the Club hands out a Queue Guide with your Queue Card, and its packing list earns its place. Sleeping bag or heavy blanket, a camping mat (the pavement is harder than it looks), enough food and water for the overnight stretch, a fully charged portable charger — your phone will die otherwise — and layers for cold and rain. English summer does not behave. The Club also runs a bag storage facility near the gates. When the stewards wake you at 6am and ask you to take your tent down, you can drop your overnight kit there and walk in carrying nothing. A few pounds and completely worth it.

The Queue has its own social life, and this is the part nobody mentions until you've done it. People who make this an annual pilgrimage know each other by sight. Strangers become temporary neighbours for eight or ten hours. There's a rhythm to it: the arrival, the setup, the first coffee from someone's thermos in the small hours, card games in the dark, conversations that happen at 3am that wouldn't happen anywhere else, the sky going slowly from black to grey to the particular pale blue that means it's actually morning. There are cocktail parties in the tents. Singalongs. People passing strawberries down the line to people they've never met. The stewards who patrol through the night are, almost without exception, excellent at their jobs and oddly cheerful about doing them.

A Centre Court day ticket gives you access to the court for the full day's play. You're not locked into one match — you can come and go within the grounds, watch the main event and then wander the outer courts, come back for the late finish. Tickets typically run £50–£85 depending on the round and year. The Queue is not for everyone. If you have young children, need a guaranteed early hotel check-in, or can't face an overnight outdoors, the public ballot (which opens each autumn) and the debenture resale market both exist. But if you want to understand what Wimbledon actually feels like from the inside, this is where that understanding starts. Not the match. The night before it.`;

const whyItsSpecial = `Most sporting events have been optimised for convenience. Pre-book, scan a code, find your seat. The friction — the uncertainty, the waiting, the physical effort of getting there — has been engineered away.

Wimbledon kept The Queue. That decision tells you something about what the All England Club thinks the experience should be. You should earn it. The earning is part of what it is.

Spending the night on Church Road with several thousand strangers, watching the queue grow longer behind you as dawn comes in, talking to the couple from Melbourne who've done this six times — this is what sports travel is actually about. Not the statistics. Not the broadcast rights. The thing you can't get at home is the feeling of having gotten there, of having done the thing necessary to be in that building on that day.

The Queue also gives you Centre Court with a different quality of attention. You're not in a debenture seat calculating whether the hospitality was worth the price. You chose to be there at a very inconvenient hour, because you wanted it. That changes how the tennis feels when it finally starts.

For a first-time Wimbledon visitor, The Queue is the honest beginning. For someone who has always pre-booked — it's worth doing once, just to understand what the place is actually for.`;

const insiderTips = [
  "Join the Queue by the previous afternoon at the latest for a reliable Centre Court spot — the official guidance says before midday the day before. Exact timing varies hugely by year and day; follow @TheWimbledonQ on X for live queue length updates before you decide when to leave home.",
  "Gate 3 is the fastest route to Centre Court when the gates open at 9:30am. Most people in the Queue don't know this.",
  "Your Queue Card holds your spot for up to 30 minutes if you need to step away — keep it on you at all times.",
  "Drop overnight kit at the Club's bag storage facility in the morning (a few pounds) and walk in hands-free. Don't carry a rucksack around the grounds all day.",
  "Bring a portable charger. 8+ hours on a pavement will kill your phone and there are no second chances.",
  "Rainy forecast = shorter queue. Bad weather keeps a portion of regulars at home. Don't let it keep you at home too.",
  "Tuesday or Wednesday of Week 1 is the best entry point for first-timers — the draw is full, you get multiple matches, and the overnight queue is typically more manageable than the opening Monday.",
];

const whatToAvoid = `Don't arrive without a portable charger — your phone will not survive the overnight wait. Don't leave your Queue Card behind if you step away from your spot, even briefly; you will not get it back. Avoid the opening Monday of the tournament for a first attempt — it has the longest queue of the fortnight by some margin. Don't assume a different gate is faster; Gate 3 is the right call for Centre Court. Travel light on food the first time: the queue can last longer than expected and the nearest shops require leaving your spot.`;

const practicalInfo = {
  hours: "Queue opens the afternoon before each day's play. Gates open 9:30am. Stewards wake campers from 6am to pack down tents.",
  costRange: "Centre Court day tickets £50–£85 depending on round and year. Bag storage a few pounds. Queue itself is free.",
  bookingMethod: "Physical queue only — no advance booking, no app, no online option. Turn up, join the line, receive your Queue Card.",
  reservationsRequired: false,
  website: "https://www.wimbledon.com/tickets",
};

const gettingThere = `District Line to Southfields (Zone 3) is the standard approach — it's an 8-minute walk from Southfields station to the start of the Queue on Wimbledon Park Road. This route also drops you close to the shops if you need last-minute supplies before settling in for the night. Alternatively, take the train to Wimbledon station and bus 493 directly to the grounds. Don't drive — parking in SW19 during the Championships is expensive and the residential permit zones are enforced strictly.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Wimbledon Queue",
      subtitle: "How to join the overnight queue for Centre Court day tickets — and why the wait on Church Road is half the point",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId ?? null,
      neighborhood: "SW19, Wimbledon",
      address: "Church Road & Wimbledon Park Road, Wimbledon, London SW19",
      heroImageUrl,
      heroImageAlt: "The Wimbledon Queue — fans camping overnight on Church Road for Centre Court day tickets, Wimbledon 2011",
      heroImageCredit: "Photo by Carine06, CC BY-SA 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Verified against the official Wimbledon Queue Guide 2025 and reporting from the 2025 Championships. Timing guidance updated to reflect variable demand — fixed arrival times are unreliable year to year.",
      moodTags: ["social", "electric", "adventurous", "authentic"],
      interestCategories: ["sports", "culture"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      budgetMinCost: "50",
      budgetMaxCost: "85",
      bestSeasons: ["jun", "jul"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2025-07-10",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
