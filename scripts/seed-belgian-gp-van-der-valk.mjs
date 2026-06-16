import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_ARDENNES_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const BELGIAN_GP_EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const slug = "van-der-valk-hotel-spa-" + Date.now().toString(36);

// ─── Content ──────────────────────────────────────────────────────────────────

const bodyContent = `The Van der Valk Hotel Spa sits on Place Royale, the main square at the centre of Spa town. It took over the building in May 2024 from Radisson Blu, which had operated there for 20 years; the property and its 120 rooms are the same, now trading under the Van der Valk name. The address is Place Royale 39.

The hotel's defining feature is a private funicular that connects the building directly to Les Thermes de Spa on the hill above. The public funicular from the town centre exists too, but this one starts from the hotel — meaning guests can reach the thermal baths without going outside. The thermes are not included in the room rate; access is booked separately at thermesdespa.com (see the Spa Town experience for pricing and what to expect inside). The funicular connection is the practical reason to stay here rather than anywhere else in Spa during race weekend: you walk from your room to the thermal pool without touching the street.

The 120 rooms split into standard doubles, 15 Superior rooms, 8 Junior Suites, and one Palace Suite. Superior rooms and above tend to have views over Place Royale or the surrounding Ardennes hillside; standard doubles vary. The Junior Suite format runs as a corridor connecting an entrance area with minibar, bathroom and storage through to a separate bedroom — not a large suite, but a proper two-room separation. Balconies are available on some upper-floor rooms; worth requesting at booking if the terrace view matters.

The restaurant is Le Royal, the in-house fine dining room, with the brasserie alongside it for less formal eating. The brasserie does comfort food and revisited Belgian classics in a warmer setting; Le Royal takes a more composed seasonal approach. The terrace overlooks Place Royale and the historic centre — it is the better choice for an aperitif on a dry July evening than either the restaurant interior. Breakfast is a buffet, open to hotel guests and also sold separately.

Race weekend logistics from this base: the circuit is 13km via the N62 — roughly 20 minutes in normal conditions, longer on race Sunday when the approach roads are at capacity. Taxis from Spa town to the circuit are bookable in advance (see the Getting to the Circuit experience); relying on on-demand taxis on race Sunday from Place Royale is not realistic. Parking at the hotel is available (indoor and outdoor, approximately 42 spaces), but circuit-day driving requires leaving early. The 744 bus from Spa centre to Francorchamps village — roughly 19 minutes, around €3 — stops near the hotel. For those willing to pay more for less hassle, the City Shuttle coaches do not serve Spa town directly; the nearest stop is Liège.

The hotel is open to general visitors for restaurant bookings, not just overnight guests. During race week, the terrace and brasserie draw a paddock-adjacent crowd on Thursday and Friday evenings.`;

const whyItsSpecial = `There are closer hotels to the circuit. The ones in Francorchamps village or on the N62 approach are 5–10 minutes from the gate and sell out at race-weekend premiums that reflect their convenience. This hotel trades that convenience for something different: a functioning 4-star property on the main square of one of Europe's more interesting small towns, with a private lift to a thermal spa that has been operating since the 18th century.

The funicular is the thing. Most hotels that claim proximity to wellness facilities mean a shuttle or a 10-minute walk. This one means a corridor from your floor to a cable car that opens at the thermes door. For a race weekend that runs Thursday to Sunday — four days with a lot of concrete, grandstands, and noise — a Thursday or Friday evening in a thermal pool accessible from your room is a specific counterweight that no hotel near the circuit can offer.

The location on Place Royale also gives you the actual town of Spa, which is worth having. The casino, the park, the Pouhon spring, the brasseries on the square — all of it is on foot. Stavelot and the circuit are a 20-minute drive. It is a base that works in two directions, which is not true of anything within walking distance of the gates.`;

const insiderTips = [
  "The hotel's private funicular starts from the building itself — not the public cable car stop in town — so guests reach Les Thermes de Spa without going outside; book your thermes slot at thermesdespa.com before arriving, as funicular access alone does not guarantee entry.",
  "The brasserie terrace on Place Royale draws a race-week crowd on Thursday and Friday evenings — arrive early for a terrace table; it is one of the better spots in Spa to watch the pre-race atmosphere without being at the circuit.",
];

const whatToAvoid = `Don't rely on on-demand taxis from Place Royale on race Sunday — post-race availability from Spa town is effectively zero and the 744 bus runs to a normal schedule that may not align with race finish time; arrange a pre-booked taxi before race day or commit to the bus for the outbound journey only. Don't assume thermes access is included in your room rate — it is a separate booking and a separate cost regardless of which package you choose.`;

const practicalInfo = {
  hours: "24-hour reception. Check-in 15:00, check-out 12:00.",
  costRange: "From approximately €168/person for thermal package (room + thermes). Race weekend rates significantly higher — book well in advance.",
  bookingMethod: "Book direct at vandervalkhotelspa.be or via Booking.com.",
  howToBook: "Contact the hotel at reception@valkspa.be or +32 87 27 97 00 for race weekend availability and group bookings. Email directly for multi-night race weekend packages and to request specific room types (upper-floor rooms with Place Royale view or balcony). The thermal package bundles room and thermes access but the thermes must still be booked separately at thermesdespa.com for a specific slot — funicular access alone does not guarantee thermes entry without prior reservation. Taxis from the hotel to the circuit must be pre-booked for all race days; Taxis Gilles (+32 87 77 29 28) is one local operator. For groups of 4+ arriving by car, on-site parking is limited and the 744 bus to Francorchamps is the more practical race-day option from this base.",
  website: "https://www.vandervalkhotelspa.be/en",
  reservationsRequired: true,
};

const gettingThere = `Place Royale 39, 4900 Spa, Belgium. 13km from Circuit de Spa-Francorchamps via the N62 — approximately 20 minutes in normal conditions. Parking on site (indoor and outdoor, ~42 spaces). 744 bus from Spa centre to Francorchamps village, ~19 min, ~€3. City Shuttle coaches do not serve Spa town; nearest stop is Liège.`;

// ─── Insert ───────────────────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Van der Valk Hotel Spa — Place Royale",
      subtitle: "The hotel on the main square with a private funicular to the thermal baths — 13km from the circuit",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Spa",
      address: "Place Royale 39, 4900 Spa, Belgium",
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
      editorialNote: "Hotel details from vandervalkhotelspa.be (verified June 2026). Rebrand from Radisson Blu Palace confirmed via Cushman & Wakefield announcement Dec 2023 — Van der Valk takeover effective May 2024. Room types and funicular connection from thermesdespa.com/vandervalk. Race weekend logistics from gpdestinations.com. No CC-licensed hero image available — hotel has no public press library; contact reception@valkspa.be for editorial image use. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["relaxation", "cultural"],
      interestCategories: ["sport", "wellness"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      budgetMinCost: "168",
      budgetMaxCost: "500",
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
