import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
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

const BELGIAN_ARDENNES_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const BELGIAN_GP_EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const slug = "pouhon-corner-silver3-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/pouhon-corner-silver3.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Pouhon Corner Silver 3 Grandstand.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Pouhon is a double-left at the far end of the Spa-Francorchamps circuit, roughly 4.5 kilometres from the start line. It sits in a natural bowl between the forest on the left and the Fagnes plateau to the right, and it does something that most F1 corners don't: it loads laterally for an extended period. Where most corners are about braking, turning, and accelerating in sequence, Pouhon is about sustained commitment. Cars enter at around 280km/h and hold through the curve under sustained G-force — it is one of the highest lateral-load corners on the calendar.

The Silver 3 grandstand runs along the outside of the first apex, elevated above the catch fence on a gentle bank. From row 10 upwards you're looking slightly down at the cars as they arrive — you see the full entry, the compression through the left, and the exit onto the straight toward Campus and Stavelot. The sightline is clean in a way that many Spa grandstands aren't: no fence posts cutting across your view, no banking obscuring the exit.

Silver 3 holds around 2,500 seats across three sections. Sections A and B are directly opposite the corner's tightest point — the angle that shows the car working hardest and where any instability shows up most clearly. Section C shifts toward the exit of the corner and picks up more of the acceleration zone. If you want to see the moment of maximum load, aim for A or B. If you want the full arc of the car through both apexes, C gives you more of that picture.

A Silver ticket covers all three race weekend days — Friday practice, Saturday qualifying, Sunday race — and grants access to the general admission Bronze areas and Fan Zone. Unlike Gold grandstands closer to Raidillon, Silver 3 rarely sells out in the first wave. It is one of the last Silver-tier seats to go, which means it is frequently still available when Gold 3 and Gold 7 have been gone for months. That relative obscurity is part of the appeal — the crowd here knows why they've come to this particular corner rather than defaulting to the famous one.

Pouhon in qualifying is the argument for this grandstand. In race conditions, the corner is typically approached in traffic and the moves happen elsewhere. But in qualifying, each car attacks the double-left individually, and the differences between how drivers carry entry speed — who lifts fractionally, who trusts the car through the second apex, who carries more lateral load into the exit — are visible from Silver 3 in a way they simply aren't on television.

Practical notes: the grandstand is 15 minutes by foot from the main entrance through the forest, but this is a different 15 minutes to the climb up to Raidillon. The terrain here is flatter and the path is wider. Food trucks operate in the Fan Zone at Raidillon and at the smaller concession area near the Stavelot entrance — there's nothing at Pouhon itself, so carry food and water for the session. The nearest toilet block is a 5-minute walk back toward Campus corner.`;

const whyItsSpecial = `Most first-time Spa visitors go to Raidillon. This is correct — Raidillon is what it is. But Pouhon is where you understand the other thing F1 does, the thing that gets less attention than outright speed or braking: sustained lateral load. Watching a car hold through both apexes of a proper double-left at race pace is a different experience to watching it brake hard or accelerate out of a hairpin. The car is working the whole time you're watching it.

From Silver 3, you see this unobstructed. There's no post between you and the corner, no banking that hides the exit. The car comes in, commits to the left, and you watch what happens for several full seconds — which is an unusually long time to watch one corner work. In a sport where most corners are over in a fraction of a second, Pouhon holds your attention.

The crowd here also tends to be different. The regulars who pick Pouhon over Raidillon have usually been to Spa before. They've done Raidillon, they know what it gives you, and they've decided they want something else this time. That shifts the atmosphere — less noise, more watching, more conversation between sessions about what they just saw. It's not anti-social; it's the version of Spa where the racing is the point rather than the experience of being there.

Silver 3 is also the honest value play at this circuit. It gives you a better view than standing Bronze anywhere on the circuit, at a meaningful price difference from Gold. For a second or third Belgian GP visit especially, it is the pick.`;

const insiderTips = [
  "Sections A or B, rows 10–15 — directly opposite the first apex, high enough to see over the fence, with a clear view of both the entry commitment and exit load.",
  "Saturday qualifying is the session that justifies this grandstand: each car attacks Pouhon individually, and the differences between drivers through the double-left are stark without race traffic masking them.",
  "Silver 3 is the last Silver grandstand to sell out — if Gold 3 is gone, check Silver 3 before giving up on assigned seating entirely.",
  "Carry food and water from the Fan Zone before settling in — there are no concessions at Pouhon itself, and the nearest block is a 5-minute walk back toward Campus.",
];

const whatToAvoid = `Don't book Section C if your priority is watching the corner work — you pick up more of the exit but lose the angle on the first apex where the real commitment happens. Don't arrive at Silver 3 expecting the atmosphere of Raidillon; the crowd is smaller and quieter, which is a feature for some and a disappointment for others. And don't leave at the end of qualifying without walking to the Fan Zone at Raidillon for the post-session atmosphere — the two areas complement each other across the day.`;

const practicalInfo = {
  hours: "Circuit gates open from 07:00 each race day; Silver 3 accessible throughout all sessions",
  costRange: "3-day Silver ticket approx. €280–€320 (check belgium.gp for 2026 pricing)",
  bookingMethod: "Tickets sold via the official Belgian Grand Prix site at belgium.gp — Silver 3 is typically available after Gold grandstands sell out.",
  howToBook: "Silver 3 is one of the last grandstands to sell out, but 'last' at Spa still means gone by March in a typical year. Monitor belgium.gp from September the year before and sign up for the newsletter for the release date. No premium hospitality operators (GTG, F1 Experiences) currently offer Silver 3 packages — the only upgrade path from here is Gold 3 (Raidillon) or Gold 7 (Kemmel exit), both available via F1 Experiences if the official allocation is sold out (f1experiences.com/2026-belgian-grand-prix).",
  website: "https://www.formula1.com/en/racing/2026/belgium",
  reservationsRequired: true,
};

const gettingThere = `No public transport runs directly to the circuit during race weekend. Shuttle buses operate from Spa town (13km), Stavelot (5km), Malmedy (6km) and Liège (50km) — approx. €60–105 return per day, bookable via belgium.gp. From the main circuit entrance, Silver 3 is a 15-minute walk on a flat forest path toward the Pouhon section of the circuit — easier terrain than the climb to Raidillon.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Pouhon Corner — Silver 3 Grandstand",
      subtitle: "A sustained double-left at 280km/h, watched from an elevated grandstand where you see every second of it",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Francorchamps",
      address: "Route du Circuit 55, 4970 Stavelot, Belgium",
      heroImageUrl,
      heroImageAlt: "F1 cars navigating the Pouhon double-left corner at Circuit de Spa-Francorchamps",
      heroImageCredit: "Mr Rowlie, CC BY 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "Corner speed (280km/h) and lateral load characterisation from oversteer48.com Pouhon guide and motorsport.com circuit analysis. Grandstand section layout and capacity from belgium.gp seating maps. Hero image: Belgian_GP_-_Pouhon_Corner_(20718657840).jpg, Mr Rowlie, CC BY 2.0, Wikimedia Commons. Verified June 2026.",
      moodTags: ["electric", "adrenaline", "low-key"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "280",
      budgetMaxCost: "320",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-14",
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
