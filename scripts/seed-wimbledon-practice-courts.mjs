import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents } from "../schema/database.ts";

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

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "wimbledon-practice-courts-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-practice-court-14.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-practice-court-14.jpg");
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

const bodyContent = `Somewhere between 10am and midday on any day of the Championships, the players competing that afternoon or the following morning will be on the Aorangi Park practice courts. Running through the preparation session that's the most unfiltered version of what they actually do. No crowd expectations. No line calls contested. Just the specific work each player has figured out over years of tournament play.

The Aorangi Park complex — 14 grass courts on the western edge of the AELTC grounds, behind Aorangi Terrace — is accessible to spectators with a grounds pass. There's a viewing bank around several courts that lets you stand or sit and watch a world number one hit full groundstrokes from about ten metres away.

Ten metres from a professional tennis player hitting at full pace on grass is not a casual proximity. It's a genuinely different distance from anything you get inside a stadium. The sound of the ball off the racket comes through in a way that no broadcast captures. The force of the shot, the height of the kick on a second serve, the recovery speed between points — these are legible here in a way that Centre Court, for all its drama, doesn't deliver.

The practice sessions have no fixed schedule published for spectators. Players and their coaching teams book courts, and which player is on which court at any moment depends on the draw, the day's order of play, and what each individual needs. Some days Aorangi is full of activity across multiple courts simultaneously. Other days it's quieter. The practical approach: check the day's order of play on the Wimbledon app that morning. Players typically practice within 24-48 hours of their next scheduled match — arriving at the courts between 10am and noon gives you the best chance of finding someone specific.

The session when a player is preparing for a significant match is different from a casual hit. The coaching staff are closer in, more focused. The shots being drilled — a specific slice backhand, an inside-in forehand from the deuce side, a particular serve pattern — reveal something about the opponent they're thinking about. You don't need to analyse this consciously. You feel the intensity as soon as you're standing near it.

The other thing the practice courts provide is proximity to the touring professionals as people rather than figures on a screen. After a session, some players sign autographs or take photographs with fans at the courtside fence. Others don't. There's no official guidance on this — patience and not blocking anyone's exit are the relevant rules. Some of the most significant interactions fans describe from Wimbledon visits happen here, not in the show courts.

Adjacent to the practice complex, the Aorangi Restaurant is a mid-range option for lunch inside the grounds with shorter queues than the main food areas. If you're planning a long morning at the practice courts before the afternoon's outer court session, this is worth knowing as a lunch stop.

The practice courts are one of the most significant undersells in the whole Wimbledon offer. On days when the outer courts are full and the Hill is packed, Aorangi Park is rarely crowded. A clear view from the practice court bank, of a player working through something specific before they walk onto Centre Court, is often available with no queuing at all.`;

const whyItsSpecial = `Every major stadium event has a distance problem. The seats are numbered, the performer is on a stage or court or pitch, and between you and them is everything the venue put there deliberately. The Wimbledon outer courts are better than most for closing this gap — but the practice courts are closer still.

There's something clarifying about watching a player you've seen on television, at television distance, suddenly at 10 metres. The size of the swing, the sound of impact, the speed of recovery — none of these come through properly on a broadcast. Standing at the practice court fence, they come through completely.

What you're watching is also unperformed. A professional in a match is managing their image, their crowd, their emotions, and their shot selection simultaneously under pressure. A professional in practice is doing exactly what they need to do to win the next match. These are different things to observe. The practice court version is more honest and, I think, more interesting if you actually care about how the game works at this level.

The fact that this access is included in a grounds pass — and that most visitors spend their time at the Hill or the outer courts and don't find Aorangi — means the practice banks are often available. This is one of the better-kept secrets at a tournament that is otherwise very thoroughly documented.`;

const insiderTips = [
  "Cross-reference the day's order of play (Wimbledon app) with your practice court visit: players typically hit within 24-48 hours of their next scheduled match, and arriving between 10am-noon maximises the chance of catching someone specific.",
  "The Aorangi complex is west of the main grounds, behind the Hill — first-time visitors often miss it entirely. Pick up a grounds map at the gate and locate it before you head in.",
  "Autograph opportunities are most consistent after a session has finished and the player is relaxed about their day. Don't approach during warm-up or mid-drill.",
  "The Aorangi Restaurant, next to the practice courts, has shorter queues than the main food areas and is worth knowing as a lunch option if you're spending the morning here.",
  "On days with rain delays, the practice schedule shifts significantly — some players move indoors, others skip entirely. Follow @Wimbledon on X for live updates on what's happening across the grounds.",
  "The viewing banks around the practice courts are informal — there are no numbered seats and no reserved spots. Arrive at a court when a session is starting and stay for it rather than rotating constantly.",
  "The practice courts are accessible regardless of whether you later upgrade to a Show Court ticket; your grounds pass covers the Aorangi complex for the full day.",
];

const whatToAvoid = `Don't plan the morning around a specific player without a backup option — practice schedules are fluid and players sometimes hit at different times or move to indoor courts. Don't shout to players during a session; it disrupts their preparation and coaching staff present will make clear it's not welcome. Don't lean on the practice court fences — they're lower than match court barriers and stewards will ask you to step back. Don't expect the practice courts to appear on the main grounds map prominently; they're there, but you may need to ask a steward where Aorangi Park is.`;

const practicalInfo = {
  hours: "Practice sessions typically run from 9am onwards. Best spectator window is 10am-12 noon. Courts accessible during all grounds opening hours.",
  costRange: "Included in Grounds Pass: £30 Days 1-8, £25 Days 9-11, £20 Days 12-14. No separate admission to the practice courts.",
  bookingMethod: "No booking required. Access via standard grounds pass through Gate 3, Church Road.",
  reservationsRequired: false,
  website: "https://www.wimbledon.com/tickets",
};

const gettingThere = `Access via the main AELTC gate on Church Road using a standard grounds pass. Once inside, the Aorangi complex is a 5-minute walk west from the main entrance — it's behind Aorangi Terrace (the Hill) and signposted, but easy to miss on a first visit. Ask a steward for directions to the practice courts when you enter. Nearest station: Southfields (District Line Zone 3), 12-minute walk east to Gate 3.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Practice Courts",
      subtitle: "Watching world number ones at ten metres in Aorangi Park — included in a grounds pass and unknown to most visitors",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId,
      neighborhood: "SW19, Wimbledon",
      address: "Aorangi Park Practice Courts, All England Club, Church Road, Wimbledon, London SW19 5AE",
      heroImageUrl,
      heroImageAlt: "Grass court at Wimbledon's All England Club showing the distinctive turf and court lines",
      heroImageCredit: "Photo by Bonoahx, CC BY-SA 4.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Verified against official Wimbledon Vantage Point article on practice courts (2019, still current structure), Club Facebook posts confirming spectator viewing access to Aorangi, and multiple first-person accounts of access. 14 practice courts figure from official AELTC location documentation. Viewing bank access confirmed included in grounds pass via aeltc.com and the-squa.re guide (2025). Sources checked April 2026.",
      moodTags: ["electric", "authentic", "intimate"],
      interestCategories: ["sports"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "GBP",
      budgetMinCost: "20",
      budgetMaxCost: "30",
      bestSeasons: ["jun", "jul"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-04-25",
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
