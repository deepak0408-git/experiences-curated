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
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian GP 2026
const slug = "curva-grande-general-admission-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/curva-grande-general-admission.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Curva Grande General Admission.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Curva Grande is the first proper corner at Monza, and it's not really a corner so much as a very fast bend that happens to be shaped like one. Cars come off the start-finish straight already past 300 km/h and carry something close to 340 km/h into it before the braking zone for the Roggia chicane. It's the closest thing on the calendar to watching an F1 car at genuine top speed with nothing between you and the car but a fence and some gravel.

The General Admission ticket gets you into this section, along with the natural grandstand areas at the Lesmo curves, the Parabolica, and the run to the Ascari chicane. There's no seat, no reserved spot, just open parkland inside the old Royal Villa grounds. You pick your patch of grass and you defend it. On a three-day ticket the going rate for General Admission tends to sit at the bottom of the price list, which is exactly why it's popular and exactly why the good spots go early.

Most people treat Curva Grande as the calm option. Compared to the crush around the main straight or the Parabolica, this stretch has room to breathe and shade from the surrounding pine trees if you know where to stand. It's also one of the better places to actually watch racing rather than just spectate a big screen, because you can see cars arrive from the straight, hear the pitch change as they lift for an instant before committing, and watch the slipstream fights play out in a way you can't from a grandstand seat further round the lap.

The trade-off is obvious: no shelter if it rains, no toilets nearby unless you know the layout, and grass that turns muddy fast in September showers. Bring a folding chair or a blanket, because standing on uneven ground for six hours of practice sessions and a race gets old. Sunscreen matters more than people expect. Most of this parkland sits in direct sun with patchy tree cover, not the deep shade the word "forest" suggests.

Friday practice is the quiet day to learn the ground. Fewer fans, easier to walk the whole inside of the circuit, and you can scout exactly where you want to plant yourself for Saturday and Sunday before the crowds arrive. Do that, and race day becomes a matter of arriving early rather than guessing.`;

const whyItsSpecial = `Grandstand tickets tell you where to sit. General Admission at Curva Grande tells you to go find out. That's a different kind of experience, and at Monza specifically, it's one of the last places on the F1 calendar where the cheapest ticket gets you this close to full speed. Most modern circuits push general admission fans to the back of the property, behind fencing that keeps you a football pitch away from anything interesting. Monza doesn't, because the layout predates that instinct, cut through royal parkland well before anyone was designing circuits around hospitality tiers.

There's also something honest about watching from grass instead of a stand. You're standing where actual Italian fans have stood for the better part of a century, packed in under the pines, listening for the engine note to catch just before the car lifts off the throttle. It's less comfortable than a seat and more alive than one.`;

const practicalInfo = {
  hours: "Circuit gates typically open around 7:30am on race weekend days; sessions run through the day per the official schedule (Practice Friday, Qualifying Saturday, Race Sunday, 4–6 Sep 2026).",
  costRange: "General Admission is the lowest-priced ticket tier for the weekend — check monzanet.it or f1italy.com closer to the date for exact 2026 pricing.",
  bookingMethod: "General Admission tickets go on sale through the official Autodromo Nazionale Monza site and Formula1.com — buy early, as this tier sells out well before race weekend.",
  howToBook: "General Admission goes on sale roughly a year out (2026 tickets opened September 2025) — buy the moment they're live if you want any real shot at a good weekend, since this is the cheapest tier and moves fastest. For the actual day, park in the Green lot near Gate D rather than the more obvious central lots — it puts you within a short walk of Curva Grande and the Lesmo bends without fighting the crowds heading to the main straight. If you're driving from Milan, the Biassono-Lesmo train station drops you closer to this section than any of the road approaches. Use Friday practice, when the crowds are thinnest, to walk the full inside loop of the park and mark your spot for Saturday and Sunday — arriving at 7am on race day to a pre-scouted patch beats arriving at 7am and improvising. If a client wants more comfort without paying grandstand hospitality prices, Grandstands 8 and 9 sit right on this stretch and are a worthwhile upgrade recommendation — same corner, an actual seat.",
  website: "https://www.monzanet.it/en/tickets/",
  reservationsRequired: false,
};

const gettingThere = "Trenord trains run from Milano Porta Garibaldi to Biassono-Lesmo station, a short walk from this side of the circuit. By car, the Green parking area near Gate D gives the most direct access to the Curva Grande and Lesmo section.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Curva Grande — General Admission at the High-Speed Sweep",
      subtitle: "A grass bank in the trees where cars hit 340 km/h on entry. Get there before 9am or watch through someone's shoulder.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Autodromo Nazionale Monza",
      address: "Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy",
      heroImageUrl,
      heroImageAlt: "The first chicane section of the Autodromo Nazionale di Monza racing circuit",
      heroImageCredit: "crash71100 (Flickr), CC0 1.0",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Trenord trains to Biassono-Lesmo station put you closer to this section of the circuit than most of the road-based parking options.",
        "Grandstands 8 and 9 overlook this same stretch of track if a paying guest wants a reserved seat instead of general admission grass.",
      ],
      whatToAvoid: "Don't skip a folding chair or blanket — most of this parkland is uneven grass and bare ground, and six-plus hours standing adds up fast. And don't expect real shade: the pine cover here is patchy, not dense, so pack sunscreen and a hat rather than counting on the trees.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: f1italy.com/en/ticket-info/general-admission-3 (GA area coverage, pricing tier), racefans.net Monza circuit guide, enterf1.com where-to-sit-at-monza (Curva Grande speed and overtaking notes), oversteer48.com Monza GA review (shade, terrain, what to bring), monzanet.it how-to-reach-us (Green parking/Gate D, Biassono-Lesmo station). GTG: no Monza/Italian GP listings found. Booking.com: N/A (not accommodation). Hero image: crash71100 (Flickr), CC0 1.0. Verified 8 Jul 2026.",
      moodTags: ["high-energy", "authentic", "budget-friendly"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-08",
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
