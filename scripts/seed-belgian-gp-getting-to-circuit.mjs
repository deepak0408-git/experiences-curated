import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_ARDENNES_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const BELGIAN_GP_EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const slug = "getting-to-circuit-belgian-gp-" + Date.now().toString(36);

// ─── 1. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Getting to Circuit de Spa-Francorchamps during race weekend is the first logistical test of the trip. The circuit sits in a valley in the Ardennes, 13km from Spa town, 5km from Stavelot, and 50km from Liège. There is no train station nearby. The roads narrow as they approach Francorchamps village. This is not a venue you stumble into by accident.

The City Shuttle is the cleanest option for most visitors. Coaches run from 14 cities across Belgium and the Netherlands — including Brussels, Liège, Namur, Ghent, Antwerp, and Luxembourg — directly to Rue de Sart, a 15-minute walk from the La Source hairpin. Tickets are sold as day returns, not single journeys: you buy a return for a specific day and specific departure city. Pricing runs from approximately €65 for Liège to €75 for Brussels. Sales close on 26 June 2026, well before race weekend — if you are considering this option, book it now. Booking is via spagrandprix.com.

The train gets you to Verviers-Central, 35km from the circuit. Your GP e-ticket includes a 50% SNCB discount code — apply it when booking at sncb.be. From Verviers-Central, TEC buses run to the circuit on Friday and Saturday (line 394 or 395, approx. €3.50 each way), and the official GP shuttle bus operates from Verviers on Sunday (approx. €10 per day). The Sunday shuttle sells out; book via spagrandprix.com when you book your race ticket.

If you are driving, parking is pre-booked only — you cannot pay on the day. Three colour-coded zones exist: Yellow (closest to the circuit, €31.50/day), Green (mid-distance, €28/day), and Red (furthest, €25/day). All three require a specific-day booking. Gates open at 06:00. Traffic on Rue du Circuit and the N62 backs up significantly from 08:00 on Saturday and Sunday — arriving before 07:30 is the practical advice. Exit queues after the race on Sunday can run 90 minutes or more; the circuit recommends remaining in the venue for at least an hour post-podium.

Spa town itself is 13km from the circuit. That distance rules out walking. If you are based in Spa and not using the City Shuttle, options are: a pre-booked taxi (book a local firm the day before — race weekend taxis are not available on-demand), or the Liège City Shuttle which stops in Spa town on some departures. Check routing when booking at spagrandprix.com.

Stavelot, 5km away, is within cycling range for those with bikes. The climb back from the circuit is significant — the circuit sits higher than Stavelot. Factor that into any post-race plan.`;

const whyItsSpecial = `The Belgian GP draws 380,000 people to a circuit in a river valley with one main road in and one main road out. The transport planning is not a formality — it is the difference between a race weekend that works and one that is exhausting before you even reach your grandstand.

What the circuit does well is give you real options, each with a genuine logic behind it. The City Shuttle is the most thought-through: it runs from your city, deposits you close to La Source, and brings you back the same evening. The pricing is fair for what it is. The only catch is the booking deadline of 26 June, which catches people who plan late.

The train-plus-bus combination suits those already in Liège or Verviers — two cities with good rail connections from Brussels and from the Eurostar hub at Brussels-Midi. The 50% SNCB discount embedded in the GP e-ticket is a detail that saves real money and is easy to miss.

Driving makes sense if you are based somewhere rural in the Ardennes — Durbuy, La Roche, or similar — and if you book your parking zone the moment your circuit tickets arrive. The Yellow zone on race Sunday fills within hours of going on sale.

The reason this experience exists is that the transport question gets asked by every first-timer and answered badly by most general F1 travel sites, which conflate the options or miss the City Shuttle booking deadline entirely. Getting this right before you travel is worth more than any grandstand upgrade.`;

const insiderTips = [
  "City Shuttle sales close 26 June 2026 — book at spagrandprix.com now, not after your circuit tickets arrive.",
  "Your GP e-ticket includes a 50% SNCB train discount code — apply it when booking at sncb.be to cut your Verviers-Central train fare in half.",
  "Arrive by car before 07:30 on Saturday and Sunday — traffic on Rue du Circuit backs up from 08:00 and Yellow zone parking fills first.",
];

const whatToAvoid = `Don't assume you can pay for parking on the day — all three zones are pre-booked only and sell out, Yellow zone fastest. Don't leave City Shuttle booking until after the June cut-off (26 June 2026); the shuttle is the best transport option for most visitors and there is no walk-in equivalent once sales close. Don't plan to taxi from Spa town on race Sunday without a pre-booked firm — on-demand taxis do not operate during the Belgian GP weekend, and the 13km trip takes longer than it looks when every road around the circuit is at capacity.`;

const practicalInfo = {
  hours: "Circuit gates open 06:00 each day; City Shuttle first departures vary by city — check spagrandprix.com",
  costRange: "City Shuttle €65–75 day return; parking €25–31.50/day; TEC bus €3.50 each way; GP Sunday shuttle approx. €10",
  bookingMethod: "City Shuttle and Sunday GP shuttle bookable at spagrandprix.com. Parking via circuit ticketing portal. SNCB train via sncb.be with discount code from GP e-ticket.",
  howToBook: "City Shuttle: go to spagrandprix.com/en/tickets-city-shuttle, select your departure city and race day, buy the day return. Sales close 26 June — this is a hard deadline. Parking: log into your Belgium GP ticketing account at tickets.formula1.com/en/f1-3286-belgium; parking is sold as a separate product alongside tickets. Yellow zone (€31.50) sells out first, often within days of going on sale. TEC bus (Fri/Sat): buy on board or at Verviers-Central station, line 394 or 395. Sunday GP shuttle from Verviers: book via spagrandprix.com — same site as the City Shuttle. SNCB discount: find the code in your GP e-ticket PDF and apply at checkout on sncb.be.",
  website: "https://www.spagrandprix.com/en/tickets-city-shuttle",
  reservationsRequired: true,
};

const gettingThere = `Circuit de Spa-Francorchamps is at Route du Circuit 55, 4970 Stavelot. By City Shuttle: coaches drop off at Rue de Sart, a 15-minute flat walk to the La Source entrance. By train: Verviers-Central is the closest station (35km); TEC buses run Friday and Saturday, the GP Sunday shuttle on race day. By car: follow N62 from Spa or N62/N68 from Liège; parking zones are colour-coded and pre-booked only. Gates open 06:00.`;

// ─── 2. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to the Circuit — Shuttles, Driving & Parking",
      subtitle: "City Shuttle, train, and parking decoded — with the booking deadlines that catch first-timers out",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Francorchamps",
      address: "Route du Circuit 55, 4970 Stavelot, Belgium",
      heroImageUrl: null,
      heroImageAlt: null,
      heroImageCredit: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "Transport options from spagrandprix.com official shuttle page, sncb.be, and formula1.com/en/racing/2026/belgium. City Shuttle pricing and deadline (26 Jun) verified at spagrandprix.com. Parking zones and pricing from circuit official ticketing portal. SNCB 50% discount from GP e-ticket documentation. TEC bus lines from tec.be. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "adventure"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "25",
      budgetMaxCost: "75",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
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
