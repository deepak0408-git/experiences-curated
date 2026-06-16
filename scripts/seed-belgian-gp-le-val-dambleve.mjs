import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_ARDENNES_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const BELGIAN_GP_EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const slug = "romantik-hotel-le-val-dambleve-" + Date.now().toString(36);

// ─── Content ──────────────────────────────────────────────────────────────────

const bodyContent = `Le Val d'Amblève sits on Route de Malmedy at the edge of Stavelot, set in a park of century-old trees with views across the Amblève valley. The hotel is a member of the Romantik Hotels chain — a European collection of independently run properties in historic buildings — and it is listed on the Circuit de Spa-Francorchamps' own official accommodation partner page. Race weekend visitors find it from that listing and it books out early because of it; July rooms go well before spring.

The property runs across three buildings. The main house has four rooms including one suite. An adjacent residence 25 metres away holds 14 rooms and the wellness area — sauna and hammam. A third building, Le Jardin des Princes, sits 300 metres away in the grounds and adds a further six rooms with a more private, villa-like feel. Total capacity is 24 rooms in the main complex. The spread across buildings means the hotel never feels like a rack-rate operation — check-in has the texture of a private house rather than a front desk.

The restaurant is the centrepiece. It holds a Gault&Milau rating of 12.5/20 and sits at number one on TripAdvisor among Stavelot's 25 restaurants. The kitchen works with Ardennes produce — game in season, regional ingredients throughout — in a style that reviewers consistently call "Michelin level" without the formality. Lunch runs to three courses at €67.50; dinner is four courses at €85.00, drinks separate. The restaurant closes on Mondays outside public holidays, but hotel guests can still dine Monday evenings. For race weekend, book before you book the room: Saturday dinner and Sunday lunch are the first things to fill.

The wellness area — sauna and hammam in the residence building — is available to hotel guests. There is no staffed spa with treatment menu; this is facilities rather than full service. The rooftop terrace attached to the wellness area has panoramic views across the valley. EV charging is on site; parking is free. The hotel is pet-friendly at €20 per night.

Distance to the circuit is approximately 8km by road — around 10 minutes in normal conditions, significantly longer on race Sunday. The circuit's own shuttle (€65 one-way, book via spagrandprix.com) departs from designated car parks rather than hotels, so factor in a short drive to a pickup point or arrange a taxi. Stavelot town centre — the abbey, Place Saint-Remacle, the circuit museum — is a 10-minute walk from the hotel. Spa town is 16km northwest, roughly 15 minutes by car.

Book direct at levaldambleve.be, or via the Romantik Hotels chain site at romantikhotels.com. The hotel is also available on Booking.com, Expedia, and the major OTAs. For the Belgian GP weekend in July, book direct and call to confirm availability — the booking engine may show rooms available when the hotel is holding allocation for direct enquiries.`;

const whyItsSpecial = `Most accommodation guides for the Belgian GP focus on Spa town — the thermal resort 13km from the circuit with hotels, restaurants, and the casino. Le Val d'Amblève makes the case for Stavelot instead, and it is a strong one.

The hotel is 8km from the gates rather than 13. The town it sits in has the Circuit Museum — the only museum in the region that is directly connected to what you came to watch. The abbey is a 10-minute walk. On race Sunday, when the roads between Spa town and the circuit are at their worst, the difference in position matters. Le Val d'Amblève is also quieter than anything in Spa town proper: a park, a valley view, century-old trees. Race weekend is loud and crowded at the circuit; the hotel is the decompression chamber.

The restaurant is what elevates it above the practical choice into the right choice. A Gault&Milau-rated kitchen serving Ardennes game and regional produce, rated the best restaurant in Stavelot, within walking distance of the abbey and the town square — this is the kind of dinner that makes the trip feel considered rather than just logistically competent. You don't get this in a chain hotel near the circuit. The Belgian GP is not a short trip for most people. Le Val d'Amblève is the version of that trip where the accommodation is part of the experience rather than just somewhere to sleep between sessions.`;

const insiderTips = [
  "Book the restaurant at the same time as the room — Saturday dinner and Sunday lunch fill first, often weeks before the race weekend itself.",
  "Call the hotel directly on +32 80 28 14 40 to confirm July availability before committing to the online booking engine — the hotel holds allocation for direct guests that may not appear online.",
];

const whatToAvoid = `Don't leave accommodation booking until spring if you want July race weekend. Le Val d'Amblève is listed on the circuit's own partner accommodation page, which means race visitors find it early — rooms go well before summer. Don't rely on the shuttle from the hotel: the circuit's official shuttle departs from designated car parks, not hotels. Arrange a taxi to the nearest pickup point or drive to park-and-ride. Don't book just Saturday night — most hotels in the area operate an informal 3-night minimum (Thursday to Sunday) for race weekend even when it isn't published; enquire directly about this when booking.`;

const practicalInfo = {
  hours: "Hotel: year-round except mid-December to mid-January. Restaurant: lunch and dinner daily except Monday (hotel guests may dine Monday evenings). Aperitifs from 18:00.",
  costRange: "Rooms from approx €165/night. Restaurant: lunch €67.50 (3 courses), dinner €85.00 (4 courses). Race weekend rates higher.",
  bookingMethod: "Book direct at levaldambleve.be or via Romantik Hotels at romantikhotels.com. Also on Booking.com and major OTAs.",
  howToBook: "Book direct at levaldambleve.be/en/rooms — the Cubilis booking engine shows live availability by room type. For race weekend July 2026, call +32 80 28 14 40 or email info@levaldambleve.be to confirm availability; the hotel may hold rooms for direct enquiries not visible online. Restaurant reservations are separate and essential for Saturday dinner and Sunday lunch — book by phone or email at the same time as your room. For Le Jardin des Princes (the villa building, 300m from main hotel): enquire directly as it suits small groups wanting more privacy. Taxi from circuit after the race: pre-book; on-demand taxis from Francorchamps post-podium are effectively unavailable.",
  website: "https://levaldambleve.be",
  reservationsRequired: true,
};

const gettingThere = `Route de Malmedy 7, 4970 Stavelot, Belgium. From Circuit de Spa-Francorchamps: approximately 8km via the N68 and N62, around 10 minutes in normal conditions — allow significantly more on race Sunday. From Spa town: 16km southeast via the N62, approximately 15 minutes. Free parking on site with EV charging. Stavelot town centre and the Abbaye de Stavelot are a 10-minute walk from the hotel.`;

// ─── Insert experience ─────────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Romantik Hotel Le Val d'Amblève",
      subtitle: "8km from the circuit, Gault&Milau restaurant, valley views — Stavelot's best hotel for the Belgian GP",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Stavelot",
      address: "Route de Malmedy 7, 4970 Stavelot, Belgium",
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
      editorialNote: "Hotel details, room count, and building layout from levaldambleve.be (verified June 2026). Distance to circuit (8km) from rome2rio and Expedia. Restaurant rating (Gault&Milau 12.5/20, TripAdvisor #1 of 25) from tripadvisor.com and romantikhotels.com. Pricing (rooms from €165, lunch €67.50, dinner €85) from romantikhotels.com, trip.com, and momondo. Race weekend booking advice from gpdestinations.com and TripAdvisor reviews. Circuit accommodation partner listing from spa-francorchamps.be/en/housing/le-val-dambleve. No CC-licensed hero image found — seeded without image. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["relaxation", "cultural", "social"],
      interestCategories: ["accommodation", "food_drink"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      budgetMinCost: "165",
      budgetMaxCost: "255",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
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
