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
const slug = "the-fan-zone-ascari-to-parabolica-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/the-fan-zone-ascari-to-parabolica.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/The Fan Zone Ascari to Parabolica.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Monza's Fan Zone sits on the Roccolo meadow, on the outside of the circuit between the high-speed section near Ascari and the straight leading into the Parabolica. It's bigger than the old fan zone that used to sit behind the main straight grandstands, and it's where most people end up spending a chunk of any downtime between sessions.

The activities are the usual mix, done well. F1 SimRacing rigs with daily prizes. A pit stop challenge where you race the clock changing a tyre, with a Sunday final for anyone who's been practicing all weekend. Augmented reality driver selfies. A showcar on display with sustainability information next to it, which is a strange but very 2026 touch. There's a wind tunnel-style "Blast Lane," a helmet and livery design activity, and a stage they call the DJ Podium where music and driver appearances happen across the weekend.

The drivers themselves tend to show up Friday or Saturday morning, not on a fixed schedule you can bank on, so if seeing one matters to you, plan to be in the Fan Zone early on one of those two mornings rather than treating it as a guaranteed Sunday thing. Over thirty vendor stands sell official merchandise, and there's a food market running from casual street food to the more gourmet end, which at Monza usually means someone selling proper risotto next to a burger van.

Access is included with any race ticket for the weekend, which makes it one of the only parts of the paddock experience that doesn't cost extra once you're through the gate. There's also a separate window on Thursday afternoon, roughly 13:00 to 20:00, when the Fan Zone opens to the general public for free through Gate G, no ticket required. If you're in Milan early and curious what the buildup feels like without committing to a ticket, that's the moment to go.

Expect it to be busy in the afternoons and around session breaks. Mornings before the first session of the day are quieter, and that's the better time to actually get on a simulator rather than queue for it.`;

const whyItsSpecial = `Most race weekends give you a choice between watching the track or doing everything else. Monza's Fan Zone exists because the circuit's layout leaves you with real dead time between sessions, and rather than let people wander a car park, the Autodromo built somewhere to put that time to use. It's not a VIP thing. It's not gated behind a separate ticket. It's just there, included, which says something about how this circuit thinks about the ordinary fan compared to venues that charge for every extra square foot.

I like that it sits between Ascari and the Parabolica rather than tucked behind the grandstands. You can walk out of a pit stop challenge and be trackside again in a couple of minutes. And the Thursday free-entry window is a genuinely useful thing to know about if you're building a trip around more than just race day.`;

const practicalInfo = {
  hours: "Thursday 13:00–20:00 (free public entry via Gate G, no ticket needed); Friday–Sunday, included with any race ticket during circuit opening hours.",
  costRange: "Free with any race ticket; free standalone on Thursday afternoon.",
  bookingMethod: "No separate ticket needed — access is included with any race weekend ticket, and Thursday afternoon is free to the public via Gate G.",
  howToBook: "There's nothing to actually book here, which is itself the tip worth passing on to a client: don't let anyone sell you a \"Fan Zone package.\" If a client's trip includes a spare Thursday in Milan before the weekend proper starts, send them to Gate G between 13:00 and 20:00 for free entry — it's a good low-key way to acclimatize to the scale of the event without spending anything. For driver sightings, the pattern holds across recent years: appearances cluster Friday or Saturday morning, so build any Fan Zone visit for that purpose into the first half of the day rather than the afternoon. If simulator queues matter to a client, mornings before first practice or qualifying are consistently quieter than the afternoon rush.",
  website: "https://www.f1italy.com/en/fan-zones-19",
  reservationsRequired: false,
};

const gettingThere = "Same access as the general circuit — Trenord trains from Milano Porta Garibaldi to Biassono-Lesmo station, or Gate G (Mirabello) directly for Thursday's free entry.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Fan Zone — Ascari to Parabolica",
      subtitle: "Simulators, pit-stop challenges, and driver stage appearances, included with every race ticket.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Autodromo Nazionale Monza",
      address: "Roccolo meadow, Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy",
      heroImageUrl,
      heroImageAlt: "Ferrari fans (tifosi) on the finish straight during the podium celebration at the Italian Grand Prix, Monza",
      heroImageCredit: "Luca Barni (Cortix93), CC BY-SA 3.0",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Thursday afternoon (roughly 13:00–20:00) the Fan Zone opens free to the public through Gate G, no race ticket required.",
        "Driver appearances on the Fan Zone stage tend to happen Friday or Saturday morning rather than race day itself.",
      ],
      whatToAvoid: "Don't wait until the afternoon to try the simulators — queues build up fast once the day's session finishes, and mornings before first practice or qualifying are noticeably quieter. And don't assume driver appearances follow a published schedule — they're generally confirmed only shortly before the weekend, so treat any sighting as a bonus rather than something to plan a whole visit around.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: f1italy.com/en/fan-zones-19 (location, activities, vendor stands), formula1.com 'What is the F1 Fanzone' article (SimRacing, pit stop challenge, driver appearance pattern), gpdestinations.com trackside guide (layout vs old fan zone location), Autodromo Nazionale Monza Instagram/Facebook (Thursday free entry via Gate G, confirmed for 2025). GTG: no Monza/Italian GP listings found. Booking.com: N/A (not accommodation). Hero image: Luca Barni (Cortix93), CC BY-SA 3.0, Wikimedia Commons. Verified 8 Jul 2026.",
      moodTags: ["high-energy", "family-friendly", "budget-friendly"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
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
