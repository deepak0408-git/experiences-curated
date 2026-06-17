import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "263faaad-ceed-4355-acb7-9f2073cb1028";
const EVENT_SLUG = "open-championship-2026";
const EVENT_ID = "ccb585a6-3cdb-40ce-999e-a1d455854301";
const slug = "open-bold-hotel-" + Date.now().toString(36);

// ─── 1. Resolve sporting event ────────────────────────────────────────────────

const [existing] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

const eventId = existing?.id ?? EVENT_ID;
console.log("✓ Sporting event ID:", eventId);

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `The Bold opened in 1832, before Lord Street became the boulevard it is now. Thomas Mawdsley built it as The Bold Arms — one of Southport's first proper hotels, in late Georgian style — and the building has been on this corner ever since.

The Napoleon III connection is Southport's favourite story: Prince Louis Napoleon stayed here in 1838 during his English exile, was reportedly struck by the tree-lined elegance of Lord Street, and is said to have carried that impression through to the Haussmann redesign of Paris in the 1850s. Historians debate the causal link, but the legend has stuck, and Lord Street still looks the part — glass canopies, wide pavements, stucco facades the length of the street.

Red Rum is the other chapter. The three-time Grand National winner stayed the night before his first win in 1973, and was led back into the hotel for his victory party after the third in 1977. A mural by Paul Curtis depicting that finish hangs in the bar. Antique brass jockey scales sit behind it. The function suite is named the Red Rum Suite. It is not subtle, but it earns its place.

The hotel runs to 23 rooms across two floors — no lift, which is worth knowing before you pack heavily. Bay window rooms overlooking Lord Street are the ones to request: king-size beds, Egyptian cotton, views across the boulevard. The Bold Bar & Grill occupies the ground floor: British grill and carvery, casual, reliably good on Sundays. The carvery is locally regarded; weekday service is more variable.

Royal Birkdale is approximately 2 miles. A taxi takes 5–10 minutes and costs £8–12. Arriva Line 47 bus from Duke Street runs direct to the course in 6 minutes every half hour. Southport station is close — Merseyrail to Hillside puts you 300 metres from the Royal Birkdale entrance.

With 23 rooms and no large-group capacity, the hotel fills fast for Open week. By June, July availability is likely gone. Book as soon as your tickets are confirmed — 12 months ahead is not too early.`;

const whyItsSpecial = `There are larger hotels closer to the course. What The Bold has is a specific kind of accumulated history that most golf-adjacent accommodation doesn't: a horse that won three Grand Nationals was led through its front door in 1977. A French emperor-in-exile may have looked out onto its street and taken an idea back to Paris. The Rolling Stones stayed here. These aren't marketing claims invented to dress up a standard room — they're documented in the building's own walls, in a mural and a set of jockey scales and a carved wooden horse above the entrance.

At 23 rooms it stays human-scaled. It won Hotel of the Year at the Southport Stars Awards in 2025. For the Open, that combination — genuine character, central location, Merseyrail 90 seconds away — is harder to find than it looks.`;

const insiderTips = [
  "Request a bay window room on the upper floor — Lord Street views, quieter than ground level, and the elevation reduces road noise.",
  "Line 47 bus from Duke Street (2 minutes' walk from the hotel) runs to Royal Birkdale in 6 minutes — faster than waiting for a taxi on busy championship days.",
];

const whatToAvoid = `There is no lift. Upper floor rooms require a full flight of stairs — factor this in before you pack heavily or if you have mobility considerations. Don't leave it to check-in to discover. The carvery is the kitchen's strength; weekday à la carte is more variable, so if you're eating in on a non-Sunday evening, walk the short distance to Lord Street's other restaurants instead.`;

const gettingThere = `Southport Railway Station is a short walk from the hotel (Merseyrail from Liverpool Central, 38 minutes). For Royal Birkdale: Arriva Line 47 bus from Duke Street (2 min walk) — 6 minutes to the course, every 30 minutes. Taxi: 5–10 minutes, £8–12. Merseyrail option: Southport station → Hillside station, then 300m walk to Royal Birkdale entrance.`;

const practicalInfo = {
  hours: "Check-in 3:00 PM / Check-out 11:00 AM.",
  costRange: "From £67/night standard; Open Championship week on request. Breakfast £12.50/person. Parking on-site ~£5/day (7 spaces, first-come).",
  bookingMethod: "Book directly at boldhotel.com or call 01704 532578. With only 23 rooms, Open Championship week sells out 12+ months in advance — contact as soon as tickets are confirmed. Request a Lord Street bay window room on the upper floor. Golf packages for the Open available through GolfBreaks (golfbreaks.com) and Southport Golf Tours if you want transport and tickets bundled.",
  howToBook: null,
  website: "https://www.boldhotel.com/",
  reservationsRequired: true,
};

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Bold Hotel, Lord Street",
      subtitle: "Georgian hotel on Southport's boulevard since 1832 — 23 rooms, Red Rum slept here, 10 minutes from Royal Birkdale.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Lord Street, Southport",
      address: "585 Lord Street, Southport, PR9 0BE",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: boldhotel.com (official, Jun 2026), TripAdvisor (4.0/5, 1,862 reviews, #3 of 20 Southport hotels), Booking.com (booking.com/hotel/gb/the-bold.en-gb.html — add affiliate link once programme approved), standupforsouthport.com (Hotel of the Year 2025), thetravellocker.com (room review), visitsouthport.com. Napoleon III/Paris legend noted as local legend — causal link disputed by historians. Hero image outstanding — request from boldhotel.com press contact or check Wikimedia Commons for Lord Street CC images. Verified Jun 2026.",
      sport: ["golf"],
      moodTags: ["historic", "local", "luxury"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-17",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Experience at: http://localhost:3000/experience/" + result.slug);
  console.log("→ Review at:     http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
