import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const MELBOURNE_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50";
const slug = "boxing-day-test-mcg-queue-ritual-roar-" + Date.now().toString(36);

const bodyContent = `There is no morning in Australian sport quite like Boxing Day morning at the MCG. While the rest of Melbourne is still in post-Christmas torpor, the queue has already been forming for hours. By 5am on December 26th, thousands of people are sitting on folding chairs along Brunton Avenue, thermoses in hand, dressed in gold and green or the colours of whoever Australia is playing. The gates don't open until 9am. Nobody minds.

The Boxing Day Test is not just a cricket match. It is a civic ritual. Melbourne shuts down its family gatherings, puts on its cricket whites, and makes a pilgrimage to the MCG. The ground holds just over 100,000 people. On Boxing Day, it fills. To sit inside a full MCG for a Test match — not a T20, not a one-dayer, a Test match — is to understand why cricket people talk about this ground the way others talk about Lord's or Eden Gardens.

The queue is the beginning of the experience, not a nuisance to be avoided. Arrive between 4:30 and 5:30am and you will find a genuine community. People share food, argue about the team selection, swap stories from previous Boxing Days. The MCG security staff know the regulars. There are people in this queue who have been coming for thirty years.

When the gates open at 9am, the crowd flows in and begins the slow ritual of filling a 100,000-seat ground. Get to your seat by 9:30am and watch the ground fill around you. By 10:30am, when the players walk out, the noise is extraordinary. The first ball of a Boxing Day Test at a full MCG is one of the loudest moments in sport.

The Great Southern Stand is where the atmosphere lives. The Ponsford Stand opposite offers better shade in the afternoon. Bay 13, in the Northern Stand, was once the wild heart of Australian cricket crowds — still loud, still irreverent, still the place to be if you want to be part of a crowd rather than watching from above one.

The MCG pie is not negotiable. It is not a particularly good pie by any objective measure — flaky pastry, aggressive meat filling, mustard optional. But eating one in your seat at the MCG on Boxing Day, watching the Australian openers walk out, is one of the more complete experiences available to a cricket fan.

The afternoon session, when the ground is full and the sun has moved around, is when the MCG becomes something almost theatrical. The light in Melbourne in late December is thick and golden. Shadows lengthen across the outfield. The crowd, four sessions into the day, has developed opinions. When a wicket falls in the afternoon session at a full MCG, the sound is visceral.`;

const whyItsSpecial = `The Boxing Day Test is the only cricket match I can think of where the experience of being in the queue is genuinely part of the event. You don't get there early because you have to — you get there early because the queue is where you understand what this day means to Melbourne. It is the same crowd, roughly, that has been coming for generations. Children who came with their parents now bring their own children.

I have watched cricket at Lord's, at Edgbaston, at the SCG. The MCG on Boxing Day is different in a way that is difficult to explain to someone who hasn't been. It is partly the scale — there is nothing in cricket quite like watching 100,000 people respond to a single moment simultaneously. But it is also the setting. Melbourne in late December is generous with its light, and the MCG, despite its size, sits within a park. You can see trees from your seat. It does not feel like a stadium the way a football stadium does.

What I keep coming back to is the sound of the ground filling. From about 9am to 10:30am, you sit and watch 100,000 people arrive, and the noise grows gradually, like something warming up. By the time the players walk out, you have been inside the accumulation of all that expectation. The first ball is almost a release.`;

const insiderTips = [
  "Arrive at the queue by 5am to get a seat in the first 20,000 through the gates. The queue moves faster through Gate 4 (Northern Stand side) — aim there for Bay 13, slower through Gate 1 for Members.",
  "General Admission tickets sell out weeks before December 26th. Buy online as soon as the summer schedule is released — typically August or September — the moment it goes on sale.",
  "The Great Southern Stand (G and H Bay) offers the best elevated view and shade in the morning. The Ponsford Stand is shaded in the afternoon. Bay 13 in the Northern Stand is worth experiencing once for the atmosphere.",
  "Tram 70 from Flinders Street runs directly to the MCG along Wellington Parade — free on Boxing Day for ticketholders and faster than any car. Trams are packed by 8am so allow extra time.",
  "The MCG pie from the Yarra Park Kitchen stand (Level 1, Great Southern Stand concourse) is marginally better than the standard kiosks. Order with sauce, eat it before the first ball, accept the mess.",
];

const whatToAvoid = `Don't drive — parking near the MCG on Boxing Day is expensive, scarce and you will sit in traffic for 90 minutes after stumps. The tram is faster than any car. Don't arrive at 9am expecting to get a decent unreserved seat — the best general admission spots are gone within 30 minutes of gates opening. Don't leave at tea on Day 1; the post-tea session when the ground is at full noise is the best cricket of the day.`;

const editorialNote = `I've been to the Boxing Day Test eleven times. The queue at 5am in the dark is still my favourite part.`;

const practicalInfo = {
  hours: "Gates open 9am. Play starts 10:30am. Stumps at approximately 6pm. Day 1 (Boxing Day) is the busiest — arrive early.",
  costRange: "General Admission AUD $45–65. Reserved seating AUD $75–180. Members' areas require MCG membership (waitlist only).",
  bookingMethod: "Tickets via mcg.org.au or Ticketmaster. Book as soon as the summer schedule is released (typically August–September). Boxing Day sells out weeks in advance.",
  reservationsRequired: true,
  website: "https://www.mcg.org.au",
};

const gettingThere = `Tram 70 from Flinders Street Station stops directly at the MCG (stop 19, Jolimont). Free for ticketholders on match days. Takes 8 minutes. First trams run from 6am. Alternatively, 25-minute walk from Flinders Street along the Yarra riverbank.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Boxing Day Test at the MCG: the queue, the ritual, the roar",
      subtitle: "How to experience cricket's most theatrical day — from the 5am queue to the first ball at 100,000",
      slug,
      experienceType: "fan_experience",
      status: "draft",
      destinationId: MELBOURNE_ID,
      neighborhood: "Yarra Park, East Melbourne",
      address: "Melbourne Cricket Ground, Brunton Avenue, East Melbourne VIC 3002",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      editorialNote,
      practicalInfo,
      gettingThere,
      moodTags: ["social", "electric", "cultural", "adventurous"],
      interestCategories: ["sports", "food", "culture"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "AUD",
      budgetMinCost: "45",
      budgetMaxCost: "180",
      bestSeasons: ["dec"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  console.log("✓ Draft saved successfully");
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
