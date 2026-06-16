import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_ARDENNES_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const BELGIAN_GP_EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const slug = "spa-francorchamps-track-experiences-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const imageFilename = "Circuit de Spa-Francorchamps Track Experiences and Driving Days.jpg";
const r2Key = `experiences/hero/${imageFilename}`;
const imageBuffer = readFileSync(`Images/${imageFilename}`);

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: imageBuffer,
  ContentType: "image/jpeg",
}));

console.log("✓ Hero image uploaded to R2");

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/experiences/hero/${encodeURIComponent(imageFilename)}`;

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `The circuit offers three distinct ways to get from the grandstand to the track itself, at three very different price points and commitment levels. None of them require a racing licence. All of them end at the same place: Eau Rouge, at speed, from the driver's seat or the passenger's.

The Taxi Lap experience is the entry point. €209 including VAT, bookable directly at spa-francorchamps.be. The format is roughly 2.5 hours: a welcome briefing, a visit to the Race Control room, two passenger laps in an Alpine A110 with a professional driver, and then two parade laps in your own vehicle in convoy behind a lead car. The Race Control visit is not incidental — it is the strategic centre of track operations, not normally accessible to the public, and the briefing gives you a working sense of how the circuit runs. The Alpine laps are the obvious draw, but the convoy laps are what most people remember: the circuit at your own pace, through Eau Rouge, down the Kemmel Straight, through Pouhon and Blanchimont, at whatever speed you feel comfortable. Minimum age is 16 for passenger laps. You need your own vehicle for the convoy portion — a standard road car is fine.

The Public Driving Experience is the step up for those who want to drive rather than watch. You bring your own car; you pay for 25-minute track sessions individually or in packs. A single run is €135. Four runs cost €389, with an optional fifth at €115 subject to availability. Add a passenger bracelet for €40 per person, maximum three. Sessions run in morning and afternoon blocks, first lap always behind a safety car. The 2026 calendar includes July 29 — ten days after the Belgian GP — which makes it an obvious extension of a race weekend visit if you are already in the Ardennes. No slick tyres, no racing cars, no SUVs. Sound limit is 103dB. Arrive one hour before your first session; helmet rental is €30 if you do not have one.

RSRSpa runs the premium end. Their trackdays run on an open pitlane format — you drive when you want, for as long as you want, within the day. Entry for one car is €795 to €1,195 depending on the event, which includes a guided track walk, all-day catering and lunch at the Pit Brasserie, and access to the F1 pit lane. Maximum 100 cars per event. They also offer a Test Drive program — six laps with a personal instructor, fuel, helmet, and safety briefing included — for drivers who want circuit experience without committing to a full day. Coaching programs run from basic instruction at €249 per hour through to the Racer advanced program at €3,749 for your own car or €5,349 with a rental. After-6 evening sessions run two hours from 18:00, open pitlane format, at €299 for your own car. Contact: drive@rsrspa.com or +32 80 444 932.

The circuit's own calendar runs from mid-March to mid-November, with guided tours available daily at 14:00. Tours include access to areas normally closed to the public including the Race Control room and media centre. For Taxi Laps specifically, new July 29 and August 13 dates were added for the 2026 season — both within three weeks of the Belgian GP.`;

const whyItsSpecial = `Most F1 circuits allow you to watch. A small number allow you to walk the pit lane. Spa-Francorchamps lets you drive the track in your own road car, follow a professional driver through Eau Rouge at speed, or book a full trackday with open pit lane access and coaching. That combination is unusual. Brands Hatch and Silverstone have trackdays; Monza and Monaco do not. Spa sits in the middle — accessible enough to be within reach for a serious amateur, with enough depth in the experience offering to satisfy anyone from a first-timer to a club racer.

The specific draw here is what the circuit represents. The Eau Rouge-Raidillon sequence is the most discussed single corner in motor racing: the compression at the bottom, the blind crest at the top, the full-throttle commitment required at any serious speed. Driving through it, even in a standard road car at a pace that makes it feel nothing like what you see on television, is a direct physical experience of why the circuit exists in the conversation it does.

The Taxi Lap format — Race Control visit, Alpine A110 passenger laps, convoy in your own car — is structured better than most circuit experiences at this price point. The Race Control access in particular is the kind of detail that most operators skip. The RSRSpa operation runs a proper trackday with coaching infrastructure, not a traffic jam with a helmet requirement. The Public Driving Experience on July 29 sits immediately after the Belgian GP and is the logical next step for anyone who watched the race and wanted to understand what the drivers were doing.`;

const insiderTips = [
  "The July 29 Public Driving Experience date falls 10 days after the Belgian GP — book it alongside your race tickets if you want to drive the same circuit while your memory of watching the race is still fresh.",
  "The Race Control room visit included in the Taxi Lap package (€209) is normally closed to the public — it manages circuit safety in real time during races and is genuinely worth the time before your Alpine laps.",
  "RSRSpa's Test Drive program (6 laps, personal instructor, fuel, helmet, two guest passes) within a Premium Trackday is the most efficient entry point if you want real coaching without committing to a full driving day — email drive@rsrspa.com for availability.",
];

const whatToAvoid = `Don't bring an SUV, a car on slick tyres, or any vehicle over 103dB to the Public Driving Experience — it will be turned away at the gate with no refund, as all bookings are non-refundable. Don't leave RSRSpa trackday bookings to the week before race weekend — their Premium Trackdays cap at 100 cars and fill from their club membership base first; available slots in the July dates are typically limited by the time a general search turns them up.`;

const practicalInfo = {
  hours: "Circuit open mid-March to mid-November. Guided tours daily at 14:00. Taxi Laps and Public Driving Experience dates vary — check spa-francorchamps.be for 2026 calendar. RSRSpa trackdays run throughout the season.",
  costRange: "Taxi Laps €209/person. Public Driving Experience: 1 run €135, 4 runs €389. RSRSpa trackday from €795/day. Coaching from €249/hour.",
  bookingMethod: "Taxi Laps and Public Driving Experience bookable at spa-francorchamps.be. RSRSpa trackdays at rsrspa.com or drive@rsrspa.com.",
  howToBook: "Taxi Laps: book at spa-francorchamps.be/en/track-experiences — gift vouchers valid 2 years if buying ahead of a specific visit. July 29 is the closest PDE date to the 2026 Belgian GP and sells out weeks in advance; book early. For groups or custom arrangements contact Sylvain Kerten: +32 (0)87 29 37 19. RSRSpa: Test Drive program (6 laps, instructor, fuel, helmet, two guest passes) is the best entry point within a Premium Trackday — email drive@rsrspa.com for current availability. For Academy programs: 'Skill' (28 laps, full-day coaching, €2,499 own car / €3,499 rental) for genuine beginners; 'Lap Times' (42 laps, €2,999 / €4,549) for drivers with prior track experience. RSRSpa F1 pit lane access is included in Premium Trackday entry — available on non-race days only.",
  website: "https://www.spa-francorchamps.be/en/track-experiences",
  reservationsRequired: true,
};

const gettingThere = `Circuit de Spa-Francorchamps, Route du Circuit 55, 4970 Stavelot. By car via N62 from Spa or Liège toward Francorchamps. Parking on site. For transport options during race weekend see the Getting to the Circuit experience. RSRSpa facility is within the circuit complex — same entrance.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Spa-Francorchamps — Track Experiences & Driving Days",
      subtitle: "Taxi laps in an Alpine A110, driving your own car, or a full RSRSpa trackday — how to get on the circuit",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Francorchamps",
      address: "Route du Circuit 55, 4970 Stavelot, Belgium",
      heroImageUrl,
      heroImageAlt: "Racing cars on track at Circuit de Spa-Francorchamps during the 2022 4 Hours of Spa",
      heroImageCredit: "David Lord / United Autosports (CC BY-SA 2.0)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "Taxi Lap pricing, format, and dates from spa-francorchamps.be/en/track-experiences (verified June 2026). Public Driving Experience pricing and 2026 dates from spa-francorchamps.be/en/public-driving-experience. RSRSpa trackday pricing, programs, and coaching rates from rsrspa.com. Hero image: 2022 4 Hours of Spa-Francorchamps, CC BY-SA 2.0, David Lord / United Autosports, Wikimedia Commons. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["adventure", "active"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      budgetMinCost: "135",
      budgetMaxCost: "5349",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "perennial",
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
