import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

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

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian Grand Prix 2027
const slug = "trackside-corner-lounges-villas-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/trackside-corner-lounges-villas.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Italian GP - Ultimate Lounge.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Paddock Club and Champions Club sit on the start-finish straight, looking down at the garages. Monza's other hospitality tier does something different: it puts you at the corners themselves, and each one is built around a specific piece of track rather than a specific view of the pits.

Dolce Vita Lounge sits near the exit of Parabolica, the final corner before the pit straight and arguably the most consequential piece of tarmac at Monza — every driver fighting for the win has to get the exit right under pressure, because a bad line here costs a straight-line drafting battle all the way to the line. The lounge runs a private trackside terrace with the same open-bar, buffet-lunch, simulator-and-music setup common to Monza's hospitality tier, open 9am to 6pm across the weekend, with one parking pass for every 10 tickets.

Garden Lounge takes the opposite end of the lap: the run from the starting grid down to the First Chicane, where the field is still bunched up seconds after the lights go out. It's an open-air setup with covered seating rather than an enclosed structure, live feed screens covering the rest of the circuit, and a notably better parking ratio — one pass per four guests, against the one-per-ten most of the other lounges offer.

Ultimate Lounge is the newest and most specific of the four. It's a purpose-built structure between the Ascari chicane and Curva Alboreto — the corner Monza old-timers still call Parabolica by its original name — with a dedicated grandstand built directly into the hospitality facility itself, not shared with general ticket holders. Ascari is named for Alberto Ascari, the double world champion killed testing at that exact corner in 1955, and it's still one of the circuit's more technical sequences: how a driver carries speed out of the chicane usually decides who leads onto the run to Parabolica. From this lounge you're positioned to watch both that exit and, close by, the corner that decides the race.

Green House is the outlier — a genuinely different feel, not another straight-adjacent structure. It looks over Curva Lesmo 2, a fast, technical right-hander deep in the trees on the circuit's old-park side, away from the crowd noise around the grandstands. It's the closest thing to a garden setting the venue offers, and it's pitched as the relaxed alternative for people who've already done a grandstand seat here before and want a quieter weekend.

All four run the same core structure: breakfast, snacks, buffet lunch, big-screen live coverage, entertainment space, and Print@home tickets, with hours fixed at 9am–6pm. None of them include a race ticket bundled with hotel or flights — they're hospitality add-ons layered on top of a standard admission, sold directly by the circuit or its ticketing partners rather than at the gate.`;

const whyItsSpecial = `Paddock Club sells proximity to the sport — the garages, the mechanics, the sense of being inside the operation. These four lounges sell something else: proximity to a specific piece of racing. Dolce Vita puts you at the corner that decides who wins the sprint to the line. Ultimate Lounge sits between a corner named for a driver who died there and the corner that still catches people out under pressure seven decades later. That's not incidental scenery — it's the actual argument for choosing a corner lounge over a straight-line one.

Green House is the one worth calling out separately. Everything else at Monza pulls you toward the noise: the grandstands, the straight, the Tifosi flares after the podium. Lesmo 2 pulls you the other way, into the old parkland the circuit was carved out of in 1922, and that contrast — quiet trees a few hundred metres from the loudest fan base in the sport — is a genuinely different day at the same race.`;

const practicalInfo = {
  hours: "9:00am–6:00pm, Friday–Sunday race weekend (3–5 Sep 2027).",
  costRange: "Not yet published for 2027 — pricing is issued via Monzanet's own downloadable hospitality brochure rather than listed on the page itself; contact the circuit directly for current rates.",
  bookingMethod: "All four lounges are sold directly by the circuit through Monzanet's official hospitality programme, separately from grandstand and general admission tickets. Dolce Vita and Green House run as 2-day (Saturday–Sunday) packages; Garden Lounge and Ultimate Lounge are 3-day. Full package details and the downloadable brochure are on Monzanet's own hospitality page — email garanzini@monzanet.it directly to check current availability and pricing.",
  website: "https://www.monzanet.it/en/hospitality/",
  reservationsRequired: true,
};

const gettingThere = "Trenord train to Monza or Biassono-Lesmo station, then circuit shuttle bus to the hospitality entrance gate specified on your confirmation email.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Trackside Corner Lounges & Villas",
      subtitle: "Four hospitality lounges built around Monza's corners, not the paddock — Parabolica, First Chicane, Ascari, Lesmo 2.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Autodromo Nazionale Monza",
      address: "Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy",
      heroImageUrl,
      heroImageAlt: "F1 hospitality lounge overlooking a corner at Monza",
      heroImageCredit: "Representative Image",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Garden Lounge has the best parking ratio of the four — one pass per four guests versus one per ten everywhere else — worth factoring in if you're driving as a group rather than taking the train.",
        "Monzanet doesn't publish hospitality pricing on the site itself — it's issued through a downloadable brochure — so email garanzini@monzanet.it directly rather than waiting for a public price list to appear.",
      ],
      whatToAvoid: "Don't assume \"hospitality\" means you're guaranteed a seat with a sightline of the actual apex — Dolce Vita and Green House are lounge-and-terrace setups without a dedicated grandstand, unlike Ultimate Lounge, which does have its own built-in stand. And don't book based on corner name recognition alone — Ultimate Lounge's location is genuinely between two different named corners (Ascari and Curva Alboreto/Parabolica), so check the venue's own seating diagram rather than assuming which specific apex you'll be closest to.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: monzanet.it/en/hospitality/ (official circuit hospitality page) — Dolce Vita, Garden Lounge, and Ultimate Hospitality location/amenities/contact email confirmed via direct WebFetch, 20 Sep 2026. Green House location/amenities cross-checked against third-party ticket-info aggregators (not cited in copy) since it isn't individually named on Monzanet's own page — flagged as the one lounge without a direct official-site confirmation; revisit once Monzanet's downloadable brochure is obtained. Ascari corner history from formula1.com's 'How every corner at Monza got its name.' GTG: no Monza/Italian GP listings found. Booking.com: N/A. Hero image: user-supplied, Images/Italian GP - Ultimate Lounge.jpg, credited as Representative Image per user instruction. Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["exclusive", "relaxed"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-20",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Review at:    http://localhost:3000/curator/review");
  console.log("→ Experience:   http://localhost:3000/experience/" + result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
