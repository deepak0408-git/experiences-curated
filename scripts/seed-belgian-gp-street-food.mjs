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
const slug = "belgian-race-weekend-street-food-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const imageFilename = "Belgian Race Weekend Street Food.jpg";
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

const bodyContent = `The food at Spa does two things well: it is Belgian, and it is expensive. Those two facts coexist without contradiction. The circuit charges what circuits always charge, and the vendors near the gates in Francorchamps village do slightly better. Neither category is trying to compete with the restaurants in Spa town. What matters is knowing which food is worth buying and which you should have sorted before you arrived at the circuit.

Start with the frites. Belgium did not invent the name, but it did invent the method — twice-fried in beef fat, served in a paper cone with mayonnaise from a pump gun. At the circuit, a cone runs around €7. That is not cheap by any measure, but it is the thing to eat. The quality varies by stall. The Fan Zone near Eau Rouge has the highest concentration of vendors and moves the most volume. Pouhon has its own cluster, smaller, and often with shorter queues. The smaller stalls scattered along the GA routes are worth scanning as you pass — the turnover at the big Fan Zone stalls on race day can mean frites that have been sitting longer than they should.

The Liège waffle is the other thing worth buying on site. Not the flat Brussels waffle with powdered sugar that you get from a tourist stall — the Liège version is dense brioche dough with pearl sugar caramelised into the outside. It is a handheld thing. It is heavy. It is best eaten warm, standing up, while something fast is going past on track. Several stalls in the Fan Zone sell them; look for the ones with a visible queue of Belgians rather than the ones facing the main pedestrian route.

Stoofvlees — beef slowly braised in dark Belgian beer with onions and a spice bread thickener — is Belgium's national dish by general consensus, and it shows up as a served option at a handful of stalls on circuit, typically alongside frites. It is comfort food by design: rich, dark, and heavy enough that one portion will carry you through an afternoon of qualifying. The quality is inconsistent from stall to stall. The campsite in Green Zone has a local sports club serving meals that reliably includes stoofvlees; the circuit stall version is less predictable.

Belgian beer on circuit is a half-litre for around €6–7. The token card system is worth knowing: instead of cash or card at each individual stall, you load credit onto a prepay card at top-up points. The card costs €2 if you load less than €25 onto it. Load at least €30 at the start of the day.

Off circuit, in Francorchamps village itself — a short walk from the La Source and Combes gates — a handful of places are open across the race weekend. Le Formule Un on Route du Circuit and Le Legends nearby both operate on race days. Acqua Rossa, slightly further along, draws the race crowd specifically and is known for staying open late. None of these require a reservation for lunch on Thursday or Friday; Saturday and Sunday evening are a different matter and should be booked before you travel.

The practical alternative that most campers and experienced attendees use is a supermarket run before arriving. Lidl and Colruyt stores in Liège and Verviers are 30–40 minutes from the circuit. A day's food for two people costs €20–25. No glass is permitted on circuit, so decant anything bottled into plastic. The circuit has free water refill points throughout the site — at least four near grandstands, more on the approach routes — so hydration costs nothing.`;

const whyItsSpecial = `Most race weekends, the food conversation ends at "it's overpriced, bring your own." The Belgian GP is the one round on the calendar where what you eat on circuit is actually worth thinking about, because the food on offer is specifically Belgian in a way that matters.

Frites are not an incidental snack here. Belgium has a legitimate claim to having invented them — the double-fry method, the beef fat, the mayonnaise rather than ketchup — and a cone from a decent stall at Spa, eaten while standing trackside, is the correct food for this specific race. The Liège waffle is the same logic applied to dessert: dense, warm, caramelised sugar on the outside, nothing like what gets sold under the Belgian waffle name in airports. Stoofvlees has been Belgium's national dish for long enough that it now has its own public holiday, and it is the thing to eat if you want to feel like you are somewhere specific rather than at a generic European race.

The beer deserves a mention separately from the logistics. Rochefort, Orval, and Chimay are all brewed within 60km of the circuit. None of them are available on circuit in their full form — you will get a draft Belgian lager rather than a Trappist abbey ale — but the surrounding area has a beer culture worth dipping into beyond what the stalls offer. The brasseries in Stavelot and Spa town carry the full range.

The reason this experience exists is that the food question at the Belgian GP is answerable in a way that adds something to the weekend rather than just solving a logistical problem. Knowing the difference between the two types of Belgian waffle, understanding what stoofvlees actually is, and having a plan for where to eat off-circuit on Saturday night is the difference between eating well at Spa and eating €16 pasta from a stall.`;

const insiderTips = [
  "Load at least €30 onto your prepay token card at the first top-up point you pass — the card costs €2 if you load under €25, and topping up mid-queue wastes time.",
  "The Liège waffle stalls with a visible queue of local Belgian attendees rather than those facing the main tourist walkway are where the turnover is fastest — the waffle is best when it comes off the iron within the last few minutes.",
  "Do your supermarket run at Lidl or Colruyt in Liège or Verviers, 30–40 minutes from the circuit, before getting onto the N62 — the roads narrow sharply in the final kilometres and a detour to shop adds unpredictable time on Saturday morning.",
];

const whatToAvoid = `Don't plan a restaurant dinner in Francorchamps or Spa town on Saturday without a reservation — by Thursday afternoon, most tables for Saturday and Sunday are spoken for and walk-in availability on race night is essentially zero. Don't bring glass onto the circuit; it is banned and security checks at the gate, so decant wine, beer, or spirits into plastic before you arrive.`;

const practicalInfo = {
  hours: "Circuit stalls open from gate opening (06:00) each race day. Francorchamps village restaurants open from midday — check individual venues for race weekend hours.",
  costRange: "Frites ~€7, hot dog €8, pizza slice €9, nachos €10–11, beer (500ml) €6–7.20. Village restaurants €15–30 per head.",
  bookingMethod: "No booking required for circuit stalls. Village restaurants — contact directly; book Saturday and Sunday evenings well in advance.",
  howToBook: "For Saturday or Sunday evening in Francorchamps, book Acqua Rossa and Le Legends (Route du Circuit 22) at least 2–3 weeks before race weekend — both fill quickly once hospitality guests and circuit staff lock in their tables. Le Formule Un (Route du Circuit 8) is better for a race-day lunch: less demand, faster service. For the best stoofvlees off-circuit, La Table de Figaro in Stavelot (10 min drive, Rue Général Jacques 20) serves a reliable regional version; book for dinner. Brasserie Lounge Roannay in Francorchamps is a quieter option with good regional food and shorter waits than the circuit-facing restaurants.",
  website: "https://www.spagrandprix.com",
  reservationsRequired: false,
};

const gettingThere = `Circuit food stalls are inside the venue — accessible once through the gate. Fan Zone concentration near Eau Rouge/La Source entrance; Pouhon cluster accessible from Silver grandstand entrances. Francorchamps village restaurants are a 5–10 min walk from the La Source gate on Route du Circuit.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Belgian Race Weekend Street Food",
      subtitle: "Frites, Liège waffles, and stoofvlees — what to eat, where to find it, and what the circuit stalls won't tell you",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Francorchamps",
      address: "Circuit de Spa-Francorchamps Fan Zone & Route du Circuit, Francorchamps, 4970 Stavelot, Belgium",
      heroImageUrl,
      heroImageAlt: "A Belgian fritkot street frites stall in Brussels",
      heroImageCredit: "Laurent van Roy / Wikimedia Commons (CC BY 2.5)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "Circuit food pricing and stall locations from GPDestinations.com (2026 Belgian GP guide) and Undiscovered Path Home guide. Token card system from FastWay1 food guide. Village restaurant names from spa-francorchamps.be and fastway1.com. Stoofvlees background from carryitlikeharry.com. Fritkot image CC BY 2.5, Laurent van Roy, Wikimedia Commons. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["social", "budget", "adventure"],
      interestCategories: ["food_drink", "sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "7",
      budgetMaxCost: "30",
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
