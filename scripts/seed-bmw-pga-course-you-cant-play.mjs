import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b015fab-26a0-48b4-a8ff-ef7c7ed977a7";
const EVENT_ID = "ea035967-b5d7-47e6-ad44-7cf4db07e70b";
const slug = "wentworth-club-course-you-cant-play-" + Date.now().toString(36);

const bodyContent = `Most tournament venues let you book a round if you're prepared to pay for it. Wentworth doesn't work that way, and it's worth understanding why before you go, because it changes what this whole trip actually is. Since Beijing-based Reignwood Group bought the club in 2014, Wentworth has run on a debenture membership structure, currently estimated around £200,000, and there are no public green fees at all. The only way onto the West Course is as a guest of a member, which brings its own cost, guest green fees start around £195 in winter and rise to roughly £360 in summer, including a caddie, and even then you need someone with membership willing to invite you.

That's a genuinely different relationship to the course than most fans have with a tournament venue. At the Open Championship, Royal Birkdale is the venue and Hillside next door gives fans a course they can actually book and play themselves. Wentworth offers no equivalent. You watch the West Course during tournament week, and for the other 361 days of the year, it belongs entirely to roughly the same small group of members and their guests.

Wentworth's three courses, the Harry Colt-designed West from 1926, the earlier East from 1924, and the newer Edinburgh Course, sit inside a 700-hectare private estate. It's also the headquarters of the DP World Tour itself and the Official World Golf Ranking, which tells you something about how central this one club is to European professional golf despite being functionally invisible to the golfing public outside of one week a year.`;

const whyItsSpecial = `I think there's real value in being upfront about this rather than implying access exists somewhere if you look hard enough. Wentworth's exclusivity isn't a marketing angle, it's structural, and pretending otherwise would just set someone up to be disappointed. What's interesting is that this makes tournament week genuinely rare rather than routine: it's the one period where the general public gets meaningfully close to a course that's otherwise sealed off entirely.

That contrast is worth sitting with. You're not visiting a course you could come back and play next month if you saved up. You're watching the best players in the world compete on a course that will, immediately after the final putt drops, go back to being completely private again.`;

const practicalInfo = {
  hours: "N/A — no public access to the West Course exists outside tournament spectating.",
  costRange: "Guest green fees (member invitation required, not applicable to tournament spectators): from approximately £195 in winter to £360 in summer, including a caddie.",
  bookingMethod: "There is no way to book a round at Wentworth as a member of the public — access requires an invitation from an existing club member. Tournament week spectating via a standard ticket is the only realistic way for most fans to see the West Course in person.",
  website: "https://www.wentworthclub.com/",
  reservationsRequired: false,
};

const gettingThere = "N/A — this entry is about the club's access policy rather than a specific visit; see the Getting to Wentworth experience for tournament-week travel.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Wentworth Club — The Course You Can't Play",
      subtitle: "No public green fees exist here — the honest story of Europe's most exclusive tournament venue.",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Wentworth Club, Virginia Water",
      address: "Wentworth Club, Wentworth Drive, Virginia Water, Surrey GU25 4LS",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Don't bother searching for a way to book a round as a member of the public — it genuinely doesn't exist; the only realistic path is an invitation from an existing member.",
        "If playing a Harry Colt course matters to you and Wentworth itself is out of reach, look into other Colt designs in the area that do take outside bookings — a worthwhile alternative rather than a consolation.",
      ],
      whatToAvoid: "Don't plan your trip assuming you might get a game in at Wentworth if you ask around locally — this isn't a course with informal workarounds, and tournament week spectating is the realistic way most fans will ever see the West Course.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: golfmonthly.com 'How Can I Play Wentworth?', caddiehq.com on Wentworth access, wentworthclub.com official site, thegolfinggazette.com on Wentworth history and Reignwood Group 2014 buyout, wikipedia.org Wentworth Club (debenture structure, three courses, DP World Tour HQ). Verified 10 Jul 2026.",
      sport: ["golf"],
      moodTags: ["exclusive", "insider", "prestigious"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "GBP",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-10",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
