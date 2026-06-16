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
const slug = "ardennes-beyond-the-circuit-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const imageFilename = "The Ardennes Beyond the Circuit.jpg";
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

const bodyContent = `The Belgian GP gives you three days in the Ardennes. The circuit fills those days — but it doesn't have to fill all of them. Thursday has no on-track sessions. Friday morning is free until FP1 at 13:30. Three towns within an hour of the gates are worth the detour, and each suits a different kind of half-day or full day out.

**La Roche-en-Ardenne** is 45km from the circuit — 37 minutes on the N68 and N89. A feudal castle founded in 844 AD sits on a rocky spur above a horseshoe bend in the Ourthe river, its towers visible from most of the town below. The castle (Rue du Vieux Château 4) is open daily in July from 10:00 to 18:00; adults €8.50, children €6.50. During race week, two things coincide: the Ghost of Berthe evening show runs from 4 July through 22 August at 22:00 (a ticketed sound and light production in the ruins), and the Grand Fireworks Display falls on 20 July. Neither requires a race ticket. The town also has the Musée de la Bataille des Ardennes — the Battle of the Bulge museum at Rue Chamont 5 — covering the winter 1944 fighting that centred on this part of the Ardennes. Open daily April through September; adults €12, children €6.

Below the castle, the Ourthe is flat and gentle and suited to beginners. Ardenne Aventures (ardenneaventures.com) runs kayak routes from 28 March through 1 November; the Axion route from Maboge to La Roche is 10km and takes around 90 minutes at €25 per person, with transport from the town included. For food, Chez Henri is the most consistent option for Ardennes cooking — regional ham, trout, marcassin — and draws strong reviews year-round. La Roche is compact enough that castle, museum, lunch, and river take a full day comfortably, or castle and lunch fit a Friday morning before getting back for FP1.

**Durbuy** is 46km from the circuit — 44 minutes via the E25 and N86. It holds a royal charter from 1331 granting it city status, which gives it a legitimate claim to being one of Europe's smallest cities at around 400 permanent residents. The medieval centre — cobbled alleys, a 17th-century castle on the hill (privately owned, exterior only), the Church of St Nicholas, and a dense cluster of terrace restaurants along the Ourthe — takes two hours to walk through properly. The Parc des Topiaires on the edge of town has 250 sculpted boxwood and yew figures across 10,000 square metres; open daily March through December, 10:00–17:00, adults €4.50. For something with more time in it, Adventure Valley Durbuy (adventure-valley.be) runs kayaking, rock climbing, mountain biking, and caving from the same base; kayak departures at 10:30 and 11:00, online booking only. For dinner, Le Sanglier des Ardennes is the town's Michelin-listed restaurant — Ardennes game, regional produce, reservation essential (+32 86 21 32 62). Durbuy is noticeably busier than La Roche in July peak season; arriving before 10:00 or after 16:00 avoids the worst of the crowds.

**Han-sur-Lesse** is 78km away — an hour and 18 minutes. It is further than the other two and it earns the drive. The Grottes de Han are one of the most significant cave systems in Western Europe: the River Lesse bored through a limestone massif underground and then changed course, leaving behind a sequence of chambers that took around 20 million years to form. Access starts with a vintage narrow-gauge tram from the village centre to the cave entrance. Inside, the chambers are substantial — the Dome Hall has a ceiling 62 metres high, one of the largest underground spaces in Europe. The temperature is a constant 12°C regardless of the July heat outside; bring a layer. Two tour formats: Cave Discovery (1h15, moderate) and Cave Journey (2 hours, 510 steps, full traverse including the underground river exit). Adults €29, children 4–11 €22. The combined PassHan ticket adds the wildlife park: 250 hectares housing the European Big Five — European bison, brown bear, wolf, lynx, and wolverine — plus 650 animals across the full reserve. PassHan: adults €41.50, children €31.50. Advance online booking is mandatory at tickets.grotte-de-han.be; the domain does not accept walk-up visitors in July. Budget 4–6 hours for cave and wildlife park combined. Han-sur-Lesse is a full-day proposition — Thursday, not Friday morning.`;

const whyItsSpecial = `Most Belgian GP guides stop at Spa town and the casino. The circuit is in Francorchamps, which is in the commune of Stavelot, which is in the Ardennes — a region of river valleys, medieval towns, and limestone geology that extends for hundreds of kilometres in every direction. Three days at a race circuit is an unusual way to spend time in one of Europe's more distinctive landscapes, and Thursday and Friday morning give you a genuine window to use it.

The specific case for each of these three: La Roche has the castle and the river and the Battle of the Bulge museum, which together make it the most historically layered town close to the circuit. If you care about what happened in this part of Belgium in December 1944, the proximity is striking — the fighting that the Bulge museum covers happened on ground you can see from the castle walls. Durbuy is the one that rewards a slow morning — the medieval centre is genuinely pretty and compact enough that you don't need a plan, just time. Han-sur-Lesse is in a different category: the caves are a serious natural spectacle, the wildlife park is the only place in Belgium where you can see European brown bears and wolves in something approaching their natural range, and the combination makes it the most memorable single day available within two hours of the circuit.

None of these are tourist traps dressed up for the race crowd. They draw Belgian and German and Dutch visitors year-round because they are genuinely good. The Belgian GP weekend happens to put you within easy range of all three.`;

const insiderTips = [
  "Han-sur-Lesse requires advance online booking — grotte-de-han.be does not accept walk-ups in July. Book the cave tour and wildlife park before you book anything else for the weekend.",
  "Thursday (no F1 sessions) is the ideal day for Han-sur-Lesse or a full day in La Roche; Friday morning works for La Roche or Durbuy with time back for FP1 at 13:30.",
];

const whatToAvoid = `Don't attempt Han-sur-Lesse on Friday morning — at 78km and 1h18 each way, you won't be back for FP1 at 13:30. Save it for Thursday. Don't visit Durbuy on a Saturday or Sunday afternoon in July — the medieval centre is at its most crowded and the approach roads back up; it works best on a weekday morning. At the Han-sur-Lesse caves, don't underestimate the cold — 12°C inside year-round means a July morning at the circuit (potentially 25°C+) and the caves feel like different seasons; a light layer in your bag is non-negotiable.`;

const practicalInfo = {
  hours: "La Roche castle: daily Jul–Aug 10:00–18:00 (€8.50 adult). Han-sur-Lesse caves: daily, advance booking only, first tour 10:00 (€29 adult cave only, PassHan €41.50). Durbuy Topiary Park: daily Mar–Dec 10:00–17:00 (€4.50 adult).",
  costRange: "La Roche: €8.50–€12 per attraction. Durbuy: €4.50 (Topiary Park); restaurants from €25/head. Han-sur-Lesse: €41.50 PassHan (cave + wildlife park) per adult.",
  bookingMethod: "La Roche and Durbuy: walk-in. Han-sur-Lesse caves and wildlife park: advance online booking mandatory at tickets.grotte-de-han.be.",
  howToBook: "Han-sur-Lesse: book cave tour and wildlife park at tickets.grotte-de-han.be/en/classic — select date and tour type (Cave Discovery 1h15 or Cave Journey 2h) and book the PassHan (€41.50 adult, €31.50 child 4–11) to include the wildlife park. July slots sell out; book as early as possible, ideally weeks before the race weekend. La Roche kayaking (Ardenne Aventures): book at ardenneaventures.com; Axion route (10km, ~1h30, €25/person) departs from La Roche to Maboge with transport included. Chez Henri in La Roche: no online booking — call ahead for race week to confirm availability. Le Sanglier des Ardennes in Durbuy: book directly on +32 86 21 32 62; essential for any evening in July.",
  website: "https://grotte-de-han.be/en",
  reservationsRequired: false,
};

const gettingThere = `All three destinations are reached by car from the circuit. La Roche-en-Ardenne: 45km via N68/N89, approximately 37 minutes. Durbuy: 46km via E25/N86, approximately 44 minutes. Han-sur-Lesse: 78km via N89/N4, approximately 1 hour 18 minutes. No practical public transport connections from the circuit to any of these towns — a car or pre-booked taxi is required. Free parking at La Roche castle and Han-sur-Lesse village centre. Durbuy: paid parking on the approach roads to the old town.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Ardennes Beyond the Circuit",
      subtitle: "La Roche-en-Ardenne, Durbuy & Han-sur-Lesse — three day trips within 80km of the gates",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Ardennes",
      address: "Belgian Ardennes, Belgium",
      heroImageUrl,
      heroImageAlt: "La Roche-en-Ardenne feudal castle ruins and Saint-Nicolas church against the Ardennes skyline, Belgium",
      heroImageCredit: "Jacky Maillet / Wikimedia Commons (CC BY-SA 4.0)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "La Roche castle hours, prices, and July events (Ghost of Berthe, fireworks, Medieval Weekend) from chateaudelaroche.be and la-roche-tourisme.com (verified June 2026). Battle of the Bulge museum from la-roche-tourisme.com and landofmemory.eu — daily hours not confirmed online, verify by phone +32 84 41 17 25. Kayak pricing and routes from ardenneaventures.com. Durbuy Topiary Park from visitwallonia.com. Adventure Valley from adventure-valley.be. Le Sanglier des Ardennes from Michelin guide. Han-sur-Lesse caves and wildlife park prices (PassHan €41.50), hours, and booking from grotte-de-han.be/en/prices and grotte-de-han.be/en/opening-times (June 2026). Distances from rome2rio. Hero image: La Roche-en-Ardenne castle and Saint-Nicolas church, Jacky Maillet, CC BY-SA 4.0, Wikimedia Commons. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["adventure", "cultural", "relaxation"],
      interestCategories: ["culture", "sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "0",
      budgetMaxCost: "42",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-15",
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
