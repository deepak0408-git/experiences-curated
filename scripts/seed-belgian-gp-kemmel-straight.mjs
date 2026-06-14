import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

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

const BELGIAN_ARDENNES_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const BELGIAN_GP_EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const slug = "kemmel-straight-general-admission-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
// NOTE: Placeholder image (Raidillon) used — replace with licensed Kemmel Straight
// shot once FOM press permission obtained. Contact: press@formula1.com
// Ideal image: media.formula1.com/image/upload/.../spa-2023-2.webp (FOM copyright)

const imageKey = "experiences/hero/kemmel-straight-general-admission.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Eau Rouge Raidillon Gold 3 Grandstand.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded (placeholder — replace pending FOM licence):", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `The Kemmel Straight is 1.05 kilometres long. It climbs uphill the entire way — 35 metres of elevation, a gradient between 2% and 6%, with a slight right-hand kink that F1 cars take without lifting. Cars exit Raidillon at the top of Eau Rouge and immediately hit this straight, already doing well over 300km/h, DRS open, accelerating. The speed record stands at 359.4km/h, set by Charles Leclerc in 2020. That is 223mph on an uphill road through a forest.

This is where the Belgian Grand Prix is won and lost. The DRS zone — adjusted in recent years after the move was deemed too easy — now activates 305 metres after the Raidillon corner and runs to the Les Combes braking zone at the far end. When a driver gets a run on the car ahead coming out of Eau Rouge, you can see the move developing from the moment they crest the hill. A kilometre of anticipation, then the braking zone, then either a clean pass or a lunge into Les Combes. Repeat for 44 laps.

The experience here is entirely general admission — Bronze ticket, no assigned seat, bring your own chair. A paved spectator path runs the full length of the straight from Raidillon's exit to Les Combes, elevated slightly above the catch fence. The bank between the path and the fence is rocky and steep. The mound roughly mid-straight is the best position: high enough to look over the barrier rather than through it, with two large screens visible for timing and replays.

The closer you are to the Raidillon end, the faster the cars look. The closer you are to Les Combes, the more overtaking action you see. Neither is wrong. Most regulars pick a spot mid-straight and commit to it early — fence-side positions are gone before 7am on race Sunday.

General admission means exactly that: no cover, no fixed seat, and a 15-minute walk from the main entrance through forest tracks. The terrain is uneven. July in the Ardennes brings unpredictable weather — the same afternoon can be 28 degrees and then a downpour within the hour. A fold-up chair, waterproof jacket, and ear defenders are not optional extras here.

What general admission gives you that grandstands cannot is freedom of movement. You can walk the straight during support races, find your spot for qualifying, change ends between sessions. The circuit is 7km long and a single Bronze ticket unlocks most of it. Many experienced Spa visitors spend Friday exploring, Saturday morning at the Kemmel for qualifying, and Sunday at Eau Rouge for the race — treating the weekend as a roaming experience rather than one fixed vantage point.`;

const whyItsSpecial = `Most F1 circuits have a grandstand experience and a general admission experience, and the gap between them is usually just comfort. At Spa it's something else. The Kemmel Straight from the mound is one of the few places in motorsport where you are genuinely exposed to what the sport is — not packaged, not organised, just standing in a forest watching machines do something that shouldn't be physically possible.

The freedom matters. You are not in a seat. You are not in a hospitality suite. You are on a grassy bank in the Ardennes with 389,000 other people, most of whom have been doing this for years and know exactly where to stand. That community is part of it — the regulars who arrive before dawn, the camping groups who've booked the same pitch for a decade, the person next to you who can tell you which sector time means someone's going to make a move before the Les Combes braking zone.

It is also honest value. A Bronze ticket for the full Belgian Grand Prix weekend costs a fraction of what Gold grandstand seats command, and the racing you watch is identical. The discomfort is real — standing for hours, no guaranteed fence-side spot, whatever weather July decides to throw — but it's the kind of discomfort that's easy to romanticise afterwards. Nobody who's stood on the Kemmel mound on a wet qualifying Saturday wishes they'd been somewhere more comfortable.`;

const insiderTips = [
  "Mid-straight on the mound, roughly level with the two large screens, is the sweet spot — high enough to see over the barrier, close enough to both ends to watch DRS battles develop before Les Combes.",
  "Arrive before 7am on race Sunday for any fence-side position; by 9:30am the entire bank is full and you'll be standing behind other people for the rest of the day.",
  "Spend Friday roaming the full circuit — Bronze gives you access almost everywhere, and you'll find your preferred spots before committing on Saturday qualifying.",
];

const whatToAvoid = `Don't arrive at the Kemmel Straight on race morning without a fold-up chair, waterproofs, and ear defenders — the bank is steep and rocky, there's no cover anywhere along the straight, and the weather changes fast. Don't position yourself at the Les Fagnes end if clear sightlines are your priority: you lose the screen views and end up looking through the fence rather than over it. And don't try to move positions once a session has started — the crowd locks in when the pitlane opens, and pushing through packed spectators on a steep bank is nobody's idea of a good time.`;

const practicalInfo = {
  hours: "Circuit gates open from 07:00 each race day; arrive early to secure good positions",
  costRange: "Bronze 3-day general admission approx. €120–€150 (check official site for 2026 pricing)",
  bookingMethod: "Bronze general admission tickets sold via the official F1 ticketing site — widely available but buy early to secure circuit shuttle access.",
  howToBook: "Bronze tickets are the last to sell out but the circuit shuttle booking system fills up faster — buy tickets early to unlock shuttle reservations. Use the Kemmel entrances and park in Yellow or Green zones; book parking passes in advance on the official circuit site as walk-in parking is limited on race Sunday. For a premium version of the GA experience, the F1 Experiences Ardennes Club Gold 2 package adds grandstand seating plus VIP hospitality — a worthwhile upgrade if you want the Kemmel view with a guaranteed seat and a roof (f1experiences.com/2026-belgian-grand-prix/ardennes-club-gold-2).",
  website: "https://www.formula1.com/en/racing/2026/belgium",
  reservationsRequired: false,
};

const gettingThere = `Use the Kemmel entrances and park in Yellow or Green zones — these are closest to the straight. No public transport runs directly to the circuit during race weekend. Shuttle buses operate from Spa town (13km), Stavelot (5km), Malmedy (6km) and Liège (50km) — approx. €60–105 return per day, bookable via the official F1 ticketing site. From the main circuit entrance, the Kemmel Straight is a 15-minute walk through forest tracks.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Kemmel Straight — General Admission",
      subtitle: "A kilometre of flat-out F1 at 220mph, watched from a grassy bank with no seat and no roof",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Francorchamps",
      address: "Route du Circuit 55, 4970 Stavelot, Belgium",
      heroImageUrl,
      heroImageAlt: "Cars climbing the Raidillon at Spa-Francorchamps, feeding onto the Kemmel Straight — placeholder pending licensed image",
      heroImageCredit: "Maximilian Schönherr, CC BY-SA 3.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [
        { platform: "F1 Experiences — Ardennes Club Gold 2", url: "https://f1experiences.com/2026-belgian-grand-prix/ardennes-club-gold-2" },
      ],
      editorialNote: "Speed record (359.4km/h, Leclerc 2020) and straight dimensions (1.05km, 35m elevation) from oversteer48.com Kemmel Straight guide. DRS activation point (305m after Raidillon) from racingnews365.com FIA change article. GA viewing experience from oversteer48.com Bronze area guide and celtichorizontours.com. Hero image is placeholder — replace with FOM-licensed image (press@formula1.com). Verified June 2026.",
      moodTags: ["electric", "adrenaline", "social"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "120",
      budgetMaxCost: "150",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-14",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: BELGIAN_GP_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("  → Join row inserted into sporting_event_experiences");
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
