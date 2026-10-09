import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "04682cdc-cc39-4f6a-8dc4-98fc4ac478f9";
const EVENT_ID = "a81c5c8c-9bb8-40ef-aa7a-bac527d4bffd";
const slug = "vca-stadium-jamtha-" + Date.now().toString(36);

const bodyContent = `The Vidarbha Cricket Association Stadium sits about 15km south of central Nagpur in Jamtha, out past the Wardha Road, and it doesn't try to hide that it's a working ground rather than a heritage one. It opened in 2008, seats 45,000, and by field area is the second-largest cricket venue in the country. There's no old pavilion to admire here, no century of history soaked into the stands. What you get instead is a red-soil pitch with a genuine personality, and that turns out to matter more.

Day one at Jamtha tends to play true and even a little slow, the kind of surface that rewards patient batting. By the second session of day two, spin starts to grip. Day three is when it actually decides matches. Australia found this out the hard way in 2008, the only other time these two sides met here: Jason Krejza took 8 for 215 on Test debut, then added four more in the second innings for a 12-wicket match haul, and Australia still lost by 172 runs. It's one of the stranger stat lines in Test cricket, a bowler destroys the opposition and his own team collapses anyway.

The more recent form book is even more lopsided. When India hosted Australia here in 2023, the match was over inside three days, India winning by an innings and 132 runs after the pitch offered sharp turn from day two onward. India's spinners took 85% of the wickets in that game. The ICC rated the surface "below average" afterward, which tells you plenty about how the pitch played and nothing about how one-sided the cricket actually was.

None of that guarantees anything for January 2027. Pitches get relaid, groundstaff change their preparation, and Australia will arrive better prepared for turn than they were in either of the last two visits. But Nagpur opening a five-Test series carries its own weight regardless of who wins. First Tests set a tone the rest of the tour either confirms or fights against, and this ground has a habit of deciding things early rather than letting them build.

Away from the cricket, Jamtha is fairly bare, a stadium precinct rather than a neighbourhood, with the food court and parking lots doing most of the work outside the gates. The stadium itself runs on solar power and has decent sightlines from most tiers. Reviewers consistently rate the crowd management and facilities well, though a few flag that queues for food and toilets back up once a session gets underway. It's a modern, purpose-built arena rather than a characterful one. The pitch is the character.`;

const whyItsSpecial = `Nagpur isn't a cricket-tourism destination the way Chennai or Ahmedabad are. There's no century-old pavilion, no obvious city-wide reason to linger beyond the Test itself. What makes VCA worth building a trip around is narrower and, I'd argue, more honest: this specific pitch has decided two of India's last two home Tests against Australia inside three days, and it's opening a five-match series both boards are treating as the biggest contest in the format right now. You're not watching a ground with history so much as watching one that keeps making it. If the surface plays anything like 2023, day three here won't just be good cricket, it'll likely be the day someone's tour report starts going wrong. That's a specific, verifiable reason to be in the stands, not an atmospheric one.`;

const insiderTips = [
  "If you can only get to the ground for one day, make it day three — the pitch here has turned hard and decisive from the second afternoon onward in both of the last two India-Australia Tests.",
  "Outside food, drinks, and large bags aren't allowed past the gates — eat properly before you arrive, the food court queues get long fast once play starts.",
];

const whatToAvoid = `Jamtha itself has almost nowhere worth staying — book a room in central Nagpur (Sadar or Civil Lines) and treat the ground as a commute, not a walkable base. Don't trust the normal 25-35 minute drive time on matchday either — traffic management around an India-Australia fixture backs roads up well before the gates open, so leave earlier than usual.`;

const gettingThere = `About 15km/25-35 minutes from Nagpur Junction via Wardha Road or the Ring Road. The nearest metro stop is Khapri, roughly 6km away, followed by an auto-rickshaw or taxi for the last stretch.`;

const practicalInfo = {
  hours: "Match days only — gates typically open around 2 hours before the first ball",
  costRange: "₹300–₹500 general to ₹10,000–₹30,000 VIP/corporate (2025 baseline; 2027 Test pricing not yet announced)",
  bookingMethod: "Tickets via BookMyShow and VCA's own channels closer to the match; sold out within 10-14 days of release for the last India-Australia Test here.",
  website: "https://www.vca.co.in",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "VCA Stadium, Jamtha — Where the Pitch Turns Late",
      subtitle: "A 45,000-seat ground on Nagpur's edge where day one plays flat and day three belongs to the spinners.",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Jamtha",
      address: "Vidarbha Cricket Association Stadium, Wardha Road, Jamtha, Nagpur, Maharashtra 441108, India",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Researched and written 23 Sep 2026. Sources: Wikipedia (VCA Stadium), ESPNcricinfo ground page, ESPN 2008 4th Test report, ABC News (Krejza debut), CricketStadiumsInfo visitor guide, Tripadvisor reviews. Google Places API lookup confirmed rating/review count same date.",
      googleMapsRating: "4.5",
      googleMapsReviewCount: 5048,
      googleMapsUrl: "https://maps.google.com/?cid=4619098253743587766",
      sport: ["cricket"],
      moodTags: ["first-test", "spin-friendly", "series-opener"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "INR",
      bestSeasons: ["jan"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-23",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
