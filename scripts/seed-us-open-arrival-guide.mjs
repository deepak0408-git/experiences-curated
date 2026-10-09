import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10"; // New York
const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9"; // US Open 2026
const slug = "us-open-arrival-guide-" + Date.now().toString(36);

const bodyContent = `The US Open doesn't run an overnight queue the way Wimbledon does — there's no camping, no numbered queue cards, no waiting through the night. Gates for day sessions open at 9:30am for most of the main draw (30 August through 9 September), shifting to 11am on 10 and 11 September as the draw narrows; evening sessions open at 6pm regardless of date. The real arrival decision isn't about beating a queue, it's about what you actually want out of the first hour once you're inside.

If watching top players practice is the goal, arrive at or just after 9:30am and head straight for the practice courts — a cluster to the left of the fountains in front of Arthur Ashe Stadium, plus 12 additional courts just outside the main gate. Check the Schedule of Play the evening before on the official app; practice slots are assigned to specific players at specific times, so knowing who's scheduled where before you arrive is the difference between stumbling onto a session and actually planning to see someone specific. The crowds here are real but not overwhelming most mornings — Fan Week and the qualifying rounds the week before the main draw are genuinely the best windows to get close with minimal competition for a good spot, but even during the main draw, a 9:30am arrival beats an 11am one by a wide margin.

For a straightforward Grounds Pass day with no reserved seat, there's no real benefit to arriving earlier than gate-opening — outer-court seating on Louis Armstrong's general-admission sections and the field courts is first-come, but the grounds themselves aren't rationed by how early you show up, only individual court seating is. Walk in at 9:30am, get a sense of the day's schedule, and move court to court as matches start rather than racing to plant yourself somewhere before the gates even open.

For a reserved seat at Arthur Ashe, Louis Armstrong, or the Grandstand, your seat is yours regardless of arrival time, so there's no competitive reason to rush the gate. Most visitors budget 45-60 minutes before their session's first match to clear the bag check and security line and actually find their section — security moves faster earlier in the day session than it does right before an evening session's 6pm entry, when the queue is often longest. Bags are capped at 12"W x 12"H x 16"L, one per guest, with no on-site storage for anything larger, so arriving with an oversized bag and hoping to check it is a real way to lose 20 minutes you didn't plan for.

For a night session specifically, gates open at 6pm but play rarely starts before 7pm, which leaves a real window to catch whatever's still finishing on the outer courts from the day session before heading to your seat — arriving right at 6pm rather than waiting until 6:45pm gets you that extra hour of tennis for free.`;

const whyItsSpecial = `Most Grand Slam arrival advice is really queue advice — how early to camp out, how to survive the wait. The US Open doesn't have that problem, and most first-timers show up braced for a fight that was never going to happen. What actually separates a good US Open morning from a mediocre one isn't how early you arrived, it's whether you arrived with a plan. A 9:30am gate time rewards someone who checked the practice schedule the night before and knows exactly which court to walk to; it does nothing at all for someone who wanders in at the same time with no idea who's hitting where. That's a genuinely different kind of advantage than beating a crowd — it's informational, not physical, and it costs nothing but five minutes on the app before you leave the hotel. The tournament gives every single grounds-pass holder the same 9:30am start. What you do with it is the only real variable.`;

const insiderTips = [
  "Security lines run noticeably longer right before a 6pm evening-session gate than during the day — if you're attending a night session, arriving by 6pm rather than 6:30-6:45pm avoids the worst of the crush and gets you time to watch the day session's final matches on the outer courts for free.",
  "The week of qualifying and Fan Week (23-29 August, before the main draw starts) offers the lightest practice-court crowds of the whole event — if your trip dates allow it, a visit during that window gets meaningfully closer access to top players than the main draw's 9:30am rush.",
];

const whatToAvoid = `Don't assume a reserved show-court seat means you can arrive right as the first match starts — security and bag-check lines can run 30-45 minutes on a busy day, and missing even the first few games of a marquee match over a slow entry line is a real, avoidable loss. Don't bring a bag larger than 12"W x 12"H x 16"L expecting to check it at the gate — there's no on-site storage for oversized bags, and you'll be turned away or forced to find off-site storage before you can even get in line.`;

const gettingThere = `7 train to Mets-Willets Point, roughly a 10-minute walk to the gates. See the Getting There guide for the full route.`;

const practicalInfo = {
  hours: "Day session gates 9:30am (11am on 10-11 Sep 2026); evening session gates 6pm",
  costRange: "Included with any valid ticket or Grounds Pass — no separate arrival/practice-viewing fee",
  bookingMethod: "No booking required beyond your ticket or Grounds Pass — check the official US Open app's Schedule of Play the evening before to plan a practice-court visit, and arrive at gate-opening for the best combination of access and shortest security lines.",
  website: "https://www.usopen.org",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "When to Arrive at the US Open — By Ticket Type",
      subtitle: "9:30am for a real shot at practice courts, gate time for everyone else",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Flushing Meadows-Corona Park, Queens",
      address: "USTA Billie Jean King National Tennis Center, Flushing Meadows-Corona Park, Queens, NY 11368",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from Ticketmaster US Open fan buying guide, Radical Storage bag policy page, usopentennisinfo.com Fan Week guide, roadto45tennis.com. Verified 5 Oct 2026.",
      googleMapsReviewCount: null,
      sport: ["tennis"],
      moodTags: ["strategic", "insider"],
      interestCategories: ["event-logistics"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["aug", "sep"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
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
