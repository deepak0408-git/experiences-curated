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
const slug = "domino-steak-house-spa-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const imageFilename = "Domino Steak House Spa.jpg";
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

const bodyContent = `Domino Steak House sits on Place Verte in Spa town, a 10-minute walk from Place Royale. It has been the go-to steakhouse for race weekend visitors for years — the restaurant explicitly welcomes Belgian GP guests and books out on Saturday and Sunday evenings well ahead of race weekend. The kitchen closes at 22:30 on weekdays and runs to midnight on Fridays and Saturdays; Wednesday is the one night it is dark.

The menu is built around beef sourced from three origins: Angus, Uruguay Grain Fed, and Wagyu. The main cuts are côte à l'os (bone-in ribeye), entrecôte, and filet pur. The côte à l'os is the order here — it is a large bone-in cut that takes time and arrives properly rested. The Wagyu option exists for those who want it but the Uruguay Grain Fed entrecôte at a lower price point is what most regulars return to. Sides run to frites and salads; the frites at a Belgian steakhouse are not an afterthought. The restaurant also does mixed grill, chicken skewers, marinated pork ribs, and fish for those not eating beef — the menu is wide enough for a group with mixed preferences.

Pricing runs €30–60 per head for a full dinner including a starter. Over 1,000 Google reviews and a consistent 4.3/5 rating; the comments converge on fast service, good meat, and honest pricing for the quality. The interior is stone walls and wooden furnishings — the kind of room that works for a group dinner after a long Saturday of qualifying without feeling like a sports hospitality tent.

The restaurant runs lunch on Saturdays and Sundays from midday, which makes it the practical choice for a pre-race meal on Sunday before heading to the circuit. Evening service starts at 18:00 across all open days. Online reservations are available at dominosteakhouse.com — the website also carries the full menu as a PDF.

Race weekend booking note: Thursday and Friday evenings are busy but manageable on the night if you arrive by 19:00. Saturday dinner and Sunday lunch are a different matter — both fill from reservations placed weeks in advance. Sunday evening after the race is effectively impossible to walk into; the kitchen is at capacity from post-podium arrivals by 20:00.`;

const whyItsSpecial = `Most race weekend restaurant guides in Spa point to the brasseries on Place Royale or the venues in Francorchamps village. Domino Steak House is the one place in town that has built a consistent identity around the race weekend specifically and the quality to sustain it.

The beef sourcing is the substance behind the reputation. Angus, Uruguay Grain Fed, and Wagyu are not interchangeable marketing terms here — the kitchen works with three genuinely distinct products and the menu makes the distinction visible rather than hiding it in a single "premium beef" category. The côte à l'os in particular is the kind of cut that takes a kitchen confident enough to let the meat do the work: long rest, bone-in, served on the timing it needs rather than the timing the service flow wants.

The other reason this place works for race weekend is practical. Place Verte is walkable from the main hotels in Spa town, accessible by the 744 bus from the circuit, and far enough from the Francorchamps traffic that you are not sitting in the post-race jam while your food gets cold. Saturday qualifying ends mid-afternoon; Sunday race is done by early evening. The 13km between here and the circuit is navigable within an hour by taxi if booked in advance. It is the dinner that makes sense of the race day if you are based in Spa town rather than camping at the circuit.`;

const insiderTips = [
  "Book Saturday dinner and Sunday lunch at least 3 weeks before race weekend — both services fill from advance reservations and walk-in availability on those nights is essentially zero by race week itself.",
  "The Uruguay Grain Fed entrecôte is the best value order on the menu — noticeably better than the price difference from the standard steak suggests, and what most regulars choose over the Wagyu at twice the cost.",
];

const whatToAvoid = `Don't arrive on Sunday evening after the race without a reservation — the kitchen is at capacity from post-podium arrivals by 20:00 and walk-ins are turned away. Wednesday is the one night the restaurant is closed; if your race schedule puts you in Spa on a Wednesday, make alternative plans.`;

const practicalInfo = {
  hours: "Mon–Tue, Thu: 18:00–22:30. Fri: 18:00–midnight. Sat: 12:00–midnight. Sun: 12:00–22:30. Closed Wednesday.",
  costRange: "€30–60 per head for a full dinner. Lunch menus typically lower.",
  bookingMethod: "Online reservations at dominosteakhouse.com/reservation-en-ligne or by phone.",
  howToBook: "Book online at dominosteakhouse.com/reservation-en-ligne — the system shows live availability by date and time. For Saturday dinner or Sunday lunch during race weekend, book 3–4 weeks in advance; these slots fill earliest. For groups of 6+, call directly on +32 87 77 15 05 or email hello@dominosteakhouse.com to confirm capacity. The full menu PDF is downloadable at dominosteakhouse.com/menu before you arrive. Taxi from the circuit to Place Verte after the race: book in advance (Taxis Gilles +32 87 77 29 28); on-demand taxis from Francorchamps after the podium are effectively unavailable.",
  website: "https://dominosteakhouse.com/spa/",
  reservationsRequired: true,
};

const gettingThere = `Place Verte 80, 4900 Spa, Belgium. 10-minute walk from Place Royale. 13km from Circuit de Spa-Francorchamps via the N62 — pre-book a taxi for race days. The 744 bus from Francorchamps village to Spa centre stops near Place Verte (~19 min, ~€3) but check return schedules against race finish times.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Domino Steak House, Spa",
      subtitle: "Angus, Uruguay Grain Fed and Wagyu on Place Verte — Spa town's race weekend steakhouse",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Spa",
      address: "Place Verte 80, 4900 Spa, Belgium",
      heroImageUrl,
      heroImageAlt: "Charcoal-grilled Black Angus entrecôte plated at a restaurant table",
      heroImageCredit: "JIP / Wikimedia Commons (CC BY-SA 4.0)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "Restaurant details from dominosteakhouse.com/spa (verified June 2026). Hours, cuts, beef origins from debestesteakvanbelgie.be and rankeat.fr. Pricing (€30–60/head) and Google rating (4.3/5, 1000+ reviews) from restaurantguru.com. Race weekend booking advice from restaurantguru.com reviews and wanderlog.com. Hero image: Black Angus entrecôte at restaurant Fat Lizard, JIP, CC BY-SA 4.0, Wikimedia Commons. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["social", "cultural"],
      interestCategories: ["food_drink", "sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "30",
      budgetMaxCost: "60",
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
