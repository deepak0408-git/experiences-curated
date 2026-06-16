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
const slug = "stavelot-abbey-circuit-museum-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const imageFilename = "Stavelot Abbey Circuit Museum and Town.jpg";
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

const bodyContent = `Stavelot is the town closest to the circuit gates — roughly 3km from the entrance, a 10-minute drive. Most visitors to the Belgian GP pass through it without stopping. That is a mistake.

The abbey is the reason to stop. Founded in 651 AD by Saint Remacle, it became one of the most powerful ecclesiastical principalities in medieval Europe, controlling a territory that extended well beyond modern Belgium. The French Revolution largely dismantled it; what remains is an 18th-century monastic complex built around the ruins of the original 11th-century church, its foundations now excavated and visible at ground level. The complex houses three separate museums under one admission (€11 adult, €9.50 concessions, under-6 free), open daily 10:00–18:00, last entry 17:00.

The Spa-Francorchamps Circuit Museum occupies the abbey's vaulted cellars. It covers 100 years of circuit history through working vintage racing cars — Minardi, Lotus, and Arrows F1 cars among them, alongside endurance vehicles from the 24-hour race. There is a large circuit model and PS4 simulators for a virtual lap. For anyone at the Belgian GP, this is the most specific context you can get for the circuit you just watched: the corner by corner history, the cars that raced it across decades, the accidents and records that define its reputation. Budget 30 minutes to an hour; more if the simulators have a queue.

The Historical Museum of the Principality of Stavelot-Malmedy covers the abbey's political and religious history from the 7th to the 18th century through manuscripts, artefacts, 3D reconstructions, and portraits of the abbots who ran what amounted to an independent state. It takes 1.5–2 hours if you engage with it properly. The Guillaume Apollinaire Museum is the third component — the only museum in the world dedicated to the French poet, who spent the summer of 1899 here at age 19 with his mother (who was drawn to the Spa casino nearby). The 2026 temporary exhibition, running through November, covers Japanese woodblock printing and manga.

Beyond the abbey, the town itself is worth an hour. Place Saint-Remacle, the main square, is cobbled slate and Ardennes limestone with an 18th-century fountain at its centre. The Vinâve district — the oldest part of town — is a cluster of narrow alleys with slate-clad houses and a 1777 stone fountain. Église Saint-Sébastien on the square holds the reliquary shrine of Saint Remacle, a 13th-century Mosan goldsmithing piece two metres long that is one of the finest medieval objects in the region.

For food, La Table de Figaro (Rue Général Jacques 20) is the most reliable dinner option in Stavelot — Belgian and French classics, book ahead for race weekend evenings. Acqua Rossa on Route du Circuit is specifically positioned for the race crowd and stays open late. Both fill from reservations on Saturday and Sunday; Thursday and Friday are more manageable without advance booking.

Getting there from the circuit is straightforward: the Stavelot exit off the N62 is signposted from the circuit approach road. From Spa town it is a 15-minute drive southeast through the Ardennes. On race days, Stavelot is significantly less congested than the circuit approach itself and the roads into Francorchamps — it is a practical base as well as a cultural one.`;

const whyItsSpecial = `Every race guide for the Belgian GP mentions Spa town, the thermal baths, and the casino. Almost none mention Stavelot, which is closer to the circuit and has the one attraction in the region that is directly connected to what you came to watch.

The Spa-Francorchamps Circuit Museum in the abbey vaults is not a gift shop with a simulator bolted on. It is a proper museum covering a century of racing history on a circuit that has a stronger historical claim to importance than almost any other on the F1 calendar. Fangio won here. Senna was controversial here. The record for fastest F1 lap belongs to Spa. The museum puts all of that in order, with actual cars — not replicas — and a layout that treats the circuit's history seriously. For someone who has just spent a weekend watching racing on the same track, visiting this museum within 3km of the gates is the closest thing the weekend has to a closing argument.

The abbey itself is the other half of that argument. Founded four years before Mecca was established as a major pilgrimage destination, still standing, still housing functioning museums, 3km from a Formula 1 circuit. The juxtaposition is genuinely strange and the strangeness is worth sitting with. Stavelot is not a day trip bolted onto a race weekend. It is what the weekend looks like when you treat the Ardennes as a place rather than just a venue.`;

const insiderTips = [
  "The Circuit Museum in the abbey vaults is open daily 10:00–18:00 (last entry 17:00) — go on Thursday or Friday when the museum is quieter; the simulators have shorter queues and you can spend more time with the vintage F1 cars.",
  "La Table de Figaro (Rue Général Jacques 20, Stavelot) is the best dinner option closest to the circuit — book at least 2 weeks before race weekend for Saturday or Sunday evening; it fills from regulars and race-week visitors combined.",
];

const whatToAvoid = `Don't arrive at the abbey after 17:00 — last entry is strictly one hour before closing and the circuit museum in the vaults requires time to do properly; a rushed 30-minute visit at the end of the day misses most of it. Don't try to drive into Stavelot from the circuit on race Sunday afternoon — the N62 backs up significantly post-race and the Stavelot approach roads are affected; leave either before the podium ceremony or budget 90 minutes for the 3km journey.`;

const practicalInfo = {
  hours: "Abbey museums: daily 10:00–18:00, last entry 17:00. Closed some public holidays — check abbayedestavelot.be. Église Saint-Sébastien: open during daylight hours.",
  costRange: "Abbey all-in ticket (3 museums + temporary exhibition): €11 adult, €9.50 seniors/children 6–18, under 6 free. Town and square: free.",
  bookingMethod: "Walk-in available. Online tickets at abbayedestavelot.be. Restaurant reservations direct with venues.",
  howToBook: "Book abbey tickets online at abbayedestavelot.be to skip the queue on busy race-weekend days — the museum draws visitors year-round and Thursday/Friday of GP week sees above-average footfall. For La Table de Figaro: book by phone or email well in advance for race weekend evenings (Rue Général Jacques 20, Stavelot). For Acqua Rossa (Route du Circuit): no reservation required for lunch but essential for Saturday and Sunday dinner. The abbey runs group packages combining museum visit, guided town walk, and meal — contact +32 80 88 08 78 for race week group bookings.",
  website: "https://abbayedestavelot.be/en/",
  reservationsRequired: false,
};

const gettingThere = `Stavelot is 3km from Circuit de Spa-Francorchamps — follow the N68 south from the circuit entrance, journey time approximately 10 minutes in normal conditions. From Spa town: 12km southeast via the N62 and N68, approximately 15 minutes. Abbey address: Cour de l'Abbaye 1, 4970 Stavelot. Free parking in front of the abbey. On race days, allow extra time on all approach roads.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Stavelot — Abbey, Circuit Museum & Town",
      subtitle: "3km from the gates: a 7th-century abbey, the Spa-Francorchamps circuit history museum, and slate-cobbled streets",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Stavelot",
      address: "Cour de l'Abbaye 1, 4970 Stavelot, Belgium",
      heroImageUrl,
      heroImageAlt: "Exterior of the Abbaye de Stavelot, a historic Benedictine abbey in Stavelot, Belgium",
      heroImageCredit: "FrDr / Wikimedia Commons (CC BY-SA 4.0)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "Abbey museum details, prices, and hours from abbayedestavelot.be (verified June 2026). Circuit Museum exhibits (Minardi, Lotus, Arrows F1 cars, simulators) from visitwallonia.com and thecrazytourist.com. Town attractions (Place Saint-Remacle, Vinâve, Église Saint-Sébastien) from thecrazytourist.com. Restaurant recommendations from fastway1.com and gpdestinations.com. Distance to circuit (3km) from Belgium GP travel guides. Hero image: Abbaye de Stavelot exterior, FrDr, CC BY-SA 4.0, Wikimedia Commons. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["cultural", "adventure", "relaxation"],
      interestCategories: ["sport", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "0",
      budgetMaxCost: "11",
      bestSeasons: ["jul"],
      advanceBookingRequired: false,
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
