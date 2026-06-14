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
const BELGIAN_GP_SLUG = "belgian-gp-2026";
const slug = "eau-rouge-raidillon-gold3-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/eau-rouge-raidillon-gold3.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/eau-rouge-raidillon-gold3.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Create Belgian GP 2026 sporting event ─────────────────────────────────

const [event] = await db
  .insert(sportingEvents)
  .values({
    name: "Formula 1 Belgian Grand Prix 2026",
    slug: BELGIAN_GP_SLUG,
    sport: "formula_one",
    tournamentSeries: "Formula 1",
    editionYear: 2026,
    destinationId: BELGIAN_ARDENNES_ID,
    venueName: "Circuit de Spa-Francorchamps",
    venueAddress: "Route du Circuit 55, 4970 Stavelot, Belgium",
    startDate: "2026-07-17",
    endDate: "2026-07-19",
    recurrence: "annual",
    ticketingUrl: "https://tickets.formula1.com/en/f1-3286-belgium",
  })
  .onConflictDoNothing()
  .returning({ id: sportingEvents.id, name: sportingEvents.name });

let belgianGpEventId;
if (event) {
  belgianGpEventId = event.id;
  console.log("✓ Sporting event created:", event.name, "→", belgianGpEventId);
} else {
  const [existing] = await db
    .select({ id: sportingEvents.id })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, BELGIAN_GP_SLUG));
  belgianGpEventId = existing?.id;
  console.log("✓ Sporting event already exists, ID:", belgianGpEventId);
}

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `There is a corner in the Ardennes forest that has ended careers and defined them. Eau Rouge drops sharply left at the bottom of a valley, feeds into Raidillon, and climbs 40.8 metres in a matter of seconds at a gradient of up to 17 degrees. On television it looks fast. Sitting in Gold 3, at the top of Raidillon, it looks impossible.

The Gold 3 grandstand was rebuilt as a permanent, covered structure in 2022. It sits precisely at the apex of Raidillon — not at the bottom of the sequence, not beside it, but above it, looking back down the slope. From your seat you watch cars leave La Source hairpin, gather speed down to Eau Rouge, disappear briefly into the valley, and then reappear climbing straight at you before flicking right at the top and launching onto the Kemmel Straight. The whole sequence takes around four seconds at race pace. It takes longer to describe than to witness.

The grandstand has 6 blocks, labelled A through F, each with 22 rows. Blocks B through E are the ones worth targeting — they sit mid-stand, fully under the roof, with the best angle down the Raidillon. Blocks A and F sit at the exposed ends and catch the weather. Front rows (1–10) are closer to the action but lose roof cover in heavy rain; rows 18–22 in blocks B and C gain a sightline over to the Bus Stop Chicane on the far side of the circuit. If the chicane matters to you, go high. If you want the sensation of the cars coming directly at you up the climb, sit mid-height.

A 3-day Gold 3 ticket gives access to the grandstand across all three days — Friday practice, Saturday qualifying, Sunday race — plus free movement through all general admission Bronze areas and the Fan Zone at the foot of Raidillon. Qualifying on Saturday is the session most experienced Spa visitors choose for this grandstand: drivers are pushing to the limit individually, there's no race traffic muddying the picture, and you see the corner in its purest form. Lap after lap, car after car, the same line attempted slightly differently each time. The gaps it reveals between drivers are visible in a way they rarely are on race day.

Wet weather changes everything here. Eau Rouge and Raidillon in the rain is one of the outstanding spectacles in motor racing. The runoff area was extended after Anthoine Hubert's fatal accident in 2019, but the corner remains genuinely demanding when the track is damp — cars push the limit of what the physics allows, and the crowd knows it. Bring waterproofs regardless of the forecast. July in the Ardennes means anything.

The circuit is 7 kilometres long and Gold 3 sits on its western side. Getting there from the main entrance requires a 15-minute walk uphill through forest paths. On race Sunday, go early. The atmosphere around Raidillon in the hour before lights out is worth the time: fans packed onto the hillside banks above, music drifting up from the Fan Zone below, the smell of the forest mixed with whatever is cooking in the food trucks.`;

const whyItsSpecial = `Most grandstands put you beside the action. Gold 3 puts you above it, which is the only position from which Eau Rouge and Raidillon make complete sense. You understand the elevation change. You understand why drivers speak about this corner with a particular kind of respect that doesn't attach to chicanes or hairpins.

The sequence is unlike anything else on the F1 calendar. Monza has its slipstream battles. Monaco has its walls. Silverstone has Copse. But Raidillon is the only corner where the question isn't about grip or braking point — it's about nerve. At race speed, going flat through the compression and trusting the car to hold through the climb is an act of faith in the engineers as much as in the driver. The cars that don't quite make it flat through twitch visibly. That twitch, from a seat 40 metres above the valley floor, is something that stays with you.

The covered structure matters more than the ticketing materials suggest. The Ardennes weather is not like Monza or even Silverstone. It can be 26 degrees on Friday and bucketing on Sunday, and often is. Having a roof overhead while the rest of the circuit stands in waterproofs eating soggy chips is not a minor detail. It is the difference between watching qualifying and enduring it.

A first Belgian Grand Prix, Gold 3, Saturday qualifying: that is the recommendation. The Fan Zone below is always there if you want noise and crowds. The grandstand is where you actually watch the racing.`;

const insiderTips = [
  "Target blocks B or C, rows 18–22 — fully under the roof, best angle down Raidillon, and a partial sightline to the Bus Stop Chicane across the circuit.",
  "Saturday qualifying is the session most Spa regulars choose for Gold 3: single-lap effort, no race traffic, and the corner differences between drivers are starkly visible.",
  "The Fan Zone at the foot of Raidillon is free with any circuit ticket — Thursday evening driver stage appearances are far less crowded than race days.",
  "Gold 3 sells out faster than any other grandstand; monitor belgium.gp from September the year before and sign up for their newsletter for the release date.",
];

const whatToAvoid = `Don't book blocks A or F if there's any chance of rain — they sit at the exposed ends of the grandstand beyond the roof line. Don't arrive at Gold 3 for the first time on race Sunday without having walked the forest path from the main entrance beforehand: it's 15 minutes uphill and the Sunday morning crowd makes it slower. And don't try to drive away immediately after the race — the road network around Spa-Francorchamps is a single carriageway through forest, and the Sunday evening exit queue regularly runs to two hours. Stay for the podium ceremony, get something to eat, and let it clear.`;

const practicalInfo = {
  hours: "Circuit gates open from 07:00 each race day; Gold 3 accessible throughout all sessions",
  costRange: "3-day Gold 3 ticket approx. €610 (2023 pricing; check belgium.gp for 2026 prices)",
  bookingMethod: "Tickets sold via the official Belgian Grand Prix site at belgium.gp; book as early as possible — Gold 3 is the first grandstand to sell out.",
  website: "https://www.formula1.com/en/racing/2026/belgium",
  reservationsRequired: true,
};

const gettingThere = `No public transport runs directly to the circuit during race weekend. Shuttle buses operate from Spa town (13km), Stavelot (5km), Malmedy (6km) and Liège (50km) — prices approx. €60–105 return per day, bookable via belgium.gp. From Spa town, follow the N62 south toward Francorchamps; the circuit is well signposted. Driving and on-site parking is available but expect 1–2 hour delays leaving on Sunday evening — plan accordingly.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Eau Rouge / Raidillon — Gold 3 Grandstand",
      subtitle: "The most famous corner in motorsport, watched from the only covered grandstand at its peak",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: belgianGpEventId ?? null,
      neighborhood: "Francorchamps",
      address: "Route du Circuit 55, 4970 Stavelot, Belgium",
      heroImageUrl,
      heroImageAlt: "Cars navigating the Raidillon climb at Circuit de Spa-Francorchamps during the 2021 6 Hours of Spa",
      heroImageCredit: "United Autosports, CC BY-SA 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Grandstand block/row detail from oversteer48.com Gold 3 guide. Elevation figure (40.8m) from official circuit documentation and circuitsofthepast.com. Ticket pricing from belgium.gp 2023 reference. Accident context (Hubert 2019) from public record. Verified June 2026.",
      moodTags: ["electric", "iconic", "adrenaline"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      budgetMinCost: "610",
      budgetMaxCost: "610",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-14",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: belgianGpEventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("  Belgian GP Event ID:", belgianGpEventId);
  console.log("  → Join row inserted into sporting_event_experiences");
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
