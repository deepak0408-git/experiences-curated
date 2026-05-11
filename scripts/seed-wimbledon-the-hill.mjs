import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
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
const slug = "the-hill-wimbledon-" + Date.now().toString(36);

// ─── 1. Upload hero image to R2 ───────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-henman-hill.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-henman-hill.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Get Wimbledon 2026 sporting event ─────────────────────────────────────

await db
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
  .onConflictDoNothing();

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026"));

const wimbledonEventId = event?.id ?? null;
console.log("✓ Sporting event ID:", wimbledonEventId);

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `The All England Club charges £30 for a Grounds Pass on Day 1. What you get for that is access to the grounds, the outer courts, and — if you find a spot on the grass bank at Aorangi Terrace — an afternoon of Centre Court tennis on a screen roughly the size of a bus.

The Hill sits north of Court 1, gently sloping. On most days during The Championships, the screen broadcasts whatever is happening on Centre Court live. You can't hear the commentary from the back rows without headphones plugged into the Wimbledon app, but you don't especially need it. The crowd on the Hill responds to what it sees. A break of serve passes round the slope within seconds.

What makes this different from a pub screening, or a sports bar, or any other communal watching arrangement, is where you're sitting. You're on the actual Wimbledon grass, inside the actual grounds, watching actual matches played roughly two hundred metres away. The gap between the Hill and Centre Court is thin in physical terms. In atmosphere, there's no gap at all.

People bring blankets and folding chairs. Carrier bags full of Pimm's and plastic cups. Someone always has a punnet of strawberries. By the first week of July, SW19 has a very specific smell — the grass, the berries, something warm and faintly fizzy — and you get it most strongly here.

The queuing logic matters. Grounds Passes go on sale from around 9am at Gate 3 on Church Road. There's no online purchase option — you show up. Position roughly 2,000 in the queue is where ground passes typically start running out on peak first-week days. Once inside, the Hill fills from about 11am onward. If you arrive midday on a busy day you'll find yourself toward the rear, which is still fine — the screen is large and angle matters less than you'd expect.

The Club's bag size limit (40cm x 30cm x 30cm) is enforced at the gates without exceptions. Folding chairs are allowed if they collapse within the limit. Large rucksacks won't get through. If you're planning a full afternoon — and you should — pack everything before you leave home.

Most people on The Hill aren't watching one match intently. They're talking, eating, half-watching, and then suddenly leaning forward because something is happening on the screen. When the scoreline tightens in a third set between two players the crowd didn't know they cared about, the whole bank goes quiet together. That particular collective attention — the way it spreads without anyone deciding it should — is worth understanding before it happens to you.

The Hill is not a consolation for people who couldn't get Centre Court tickets. It's a different experience. You're on the grass, in the sun, surrounded by people who made the same calculation: that being there is worth something separate from whether you have a numbered seat. The players don't know you're watching. The Hill always knows.

One practical note: the AELTC is expanding Aorangi Terrace's capacity by roughly 20% ahead of the 2027 Championships, the tournament's 150th anniversary. What exists now — its current proportions, its specific feel — is worth knowing before it changes.`;

const whyItsSpecial = `The Hill at Aorangi Terrace is one of the few genuinely communal sports experiences left in professional tennis. Everything else at this level has been monetised: branded terraces, hospitality rails, numbered seats with catering included. Here you buy a grounds pass for thirty pounds and sit on the grass and watch the same matches that people are paying considerably more to watch two hundred metres away.

What's unusual isn't the access. It's what happens when a few thousand people sit in the sun watching tennis together on a lawn. The Hill has its own collective attention — it reacts as a unit. When something goes wrong, a double fault on a break point or a player losing their composure, the response ripples round the slope almost immediately. This is a quality that doesn't come from being in an enclosed arena. It comes from everyone being able to see each other.

Wimbledon kept this. They could have developed the bank into corporate terrace seating with hospitality rails and charged accordingly. They maintained a grass slope where you bring your own food and sit in no particular order and watch Centre Court without a reserved seat. That decision says something about what the tournament thinks it's for.

For a first-time Wimbledon visitor who can't get inside the show courts, The Hill isn't the alternative option. It's the starting point. Come early enough to get a decent patch of grass, bring more food than you think you need, and plan to stay until the evening session ends.`;

const insiderTips = [
  "Arrive at Gate 3 on Church Road before 9:30am for a guaranteed grounds pass on first-week peak days — position 2,000 in the queue is typically where passes run out. Later in the fortnight (Days 9-14), passes drop to £25-£20 and the queue is considerably shorter.",
  "Headphones plugged into the official Wimbledon app will sync live broadcast commentary to the screen — without them on a busy day, you're reading the crowd rather than hearing the match.",
  "Folding garden chairs are worth bringing and fit within the 40cm x 30cm x 30cm bag limit; the grass looks comfortable until you've been sitting on it for three hours.",
  "The returned-ticket kiosk inside the grounds sells Show Court seats that become available throughout the day for £10 each — ask a steward for its location when you enter.",
  "The Hill fills from 11am on first-week days; head there directly after entry if you want a position near the centre rather than the back edge.",
  "Days 3-7 of the tournament give the best Hill experience: the draw is still full, the crowds have settled from Day 1 hysteria, and the matches on Centre Court are typically the most interesting.",
  "A rainy morning often means a quieter Hill — matches are sometimes delayed but the screen still shows updates, and the crowd that braved the weather is unusually good company.",
];

const whatToAvoid = `Don't bring a bag exceeding 40cm x 30cm x 30cm — enforcement at the gates is consistent and you'll have to return to drop it somewhere, which wastes the morning. Don't arrive mid-afternoon on a first-week day expecting to find ground-level central space on the Hill; you'll be in a standing position at the back edge. Don't rely on the on-site kiosk queues for food — they run 20-30 minutes by midday and bringing your own is cheaper and simpler.`;

const practicalInfo = {
  hours: "Gates open from approximately 9am (queue) / 10am (grounds entry) daily. Outer courts from 11am. Grounds close in the evening. Centre Court and No. 1 Court matches from 1:30pm.",
  costRange: "£30 Days 1-8, £25 Days 9-11, £20 Days 12-14 (Grounds Pass, includes Hill access). Pimm's £10-13 per cup from vendors. Strawberries £4 per 500g from official kiosks.",
  bookingMethod: "Physical queue at Gate 3, Church Road. No online or advance purchase available.",
  reservationsRequired: false,
  website: "https://www.wimbledon.com/tickets",
};

const gettingThere = `District Line to Southfields (Zone 3), then a 12-minute walk east along Wimbledon Park Road to Gate 3 on Church Road. Southfields is slightly closer to the Gate 3 queue than Wimbledon station, and there's a small convenience store on Wimbledon Park Road for last-minute supplies. From Wimbledon station, bus 493 runs directly to the AELTC. Don't drive — residential permit zones in SW19 are enforced during the Championships and parking is effectively unavailable.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Hill",
      subtitle: "The grass bank with the giant screen where a grounds pass becomes the most social afternoon in tennis",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId,
      neighborhood: "SW19, Wimbledon",
      address: "Aorangi Terrace, All England Club, Church Road, Wimbledon, London SW19 5AE",
      heroImageUrl,
      heroImageAlt: "Fans gathered on Henman Hill at Wimbledon, watching the big screen on the grass bank during the 2010 Championships",
      heroImageCredit: "Photo by Marc Di Luzio, CC BY-SA 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Verified against official Wimbledon grounds pass guidance (2025) and the Club's published Aorangi Terrace expansion plans for 2027. Pricing confirmed from official site and Green & Purple's 2026 guide. Bag size restrictions from official AELTC policy.",
      moodTags: ["social", "electric", "authentic"],
      interestCategories: ["sports", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "GBP",
      budgetMinCost: "30",
      budgetMaxCost: "30",
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
