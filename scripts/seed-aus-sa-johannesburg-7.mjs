import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40";
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";
const slug = "cradle-of-humankind-" + Date.now().toString(36);

const bodyContent = `The Cradle of Humankind sits about 40 kilometres northwest of Johannesburg, near Krugersdorp, and it's the kind of site that undersells itself in a single sentence - this is where some of the most significant hominid fossil discoveries anywhere in the world have been made, including "Little Foot," one of the most complete early hominid skeletons ever found. The whole area was declared a UNESCO World Heritage Site in 1999.

Sterkfontein Caves is the main visitor site within the Cradle, open Tuesday to Sunday, 9am to 4pm, closed Mondays. Guided tours run hourly, the last departing at 4pm, and each one runs roughly an hour to ninety minutes through the cave system itself before moving into the exhibition. Adult tickets are R150, covering both the cave tour and the exhibition. Children aged 6-18 pay R125, under-6s go free (capped at two per adult), and pensioners pay R100 with ID. The cave interior sits at a constant 20°C year-round, worth knowing if you're visiting straight from a hot Johannesburg afternoon.

A short drive away sits the Maropeng Visitor Centre, which works as a companion stop rather than a replacement - Maropeng handles the broader human origins story through interactive exhibits, while Sterkfontein gets you into the actual cave system where the fossils were found. Most visitors combine both in a half-day or full-day trip from Johannesburg, either self-driven or through a tour operator.

Compared to Kruger, this is the realistic option if you want a genuine day trip rather than a multi-day commitment - roughly an hour each way, a couple of hours on site, and you're back in Johannesburg well before dinner.`;

const whyItsSpecial = `Kruger gets most of the attention when people think about what to add to a Johannesburg trip, and it deserves it, but the Cradle of Humankind is doing something genuinely different and arguably just as significant. This isn't wildlife tourism, it's standing in the actual place where some of science's most important fossil finds happened.

What I like about it as a day trip specifically is the proportion - an hour there, an hour or so touring the caves, an hour back. You get a real UNESCO World Heritage Site without reorganizing your whole trip around it, which makes it a genuinely easy addition to a cricket-focused Johannesburg stay rather than a competing priority.`;

const practicalInfo = {
  hours: "Tuesday-Sunday, 9am-4pm (closed Mondays), last tour departs 4pm, tours run hourly and last approximately 1-1.5 hours",
  costRange: "Adults R150 (cave tour + exhibition), children 6-18 R125, under-6s free (max 2 per adult), pensioners R100 with ID",
  bookingMethod: "Tickets can be bought online via Webtickets or on-site. Calling ahead on the day is worth it during holidays, since tour capacity is capped at 30 people per hourly slot.",
  website: "https://sterkfonteincaves.wits.ac.za",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Cradle of Humankind",
      subtitle: "An hour from Johannesburg, a UNESCO World Heritage Site where some of the world's most significant fossil finds happened",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Cradle of Humankind, Krugersdorp",
      address: "Sterkfontein Caves, Cradle of Humankind World Heritage Site, Gauteng",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The cave interior stays at a constant 20°C year-round - a welcome break if you're visiting on a hot Johannesburg day.",
        "Combine Sterkfontein Caves with the nearby Maropeng Visitor Centre for the fuller picture - Sterkfontein is the actual dig site, Maropeng handles the broader exhibition.",
      ],
      whatToAvoid: "Don't turn up without checking the last-tour time - tours run hourly with the final one departing at 4pm sharp, and arriving late means missing the cave portion entirely.",
      practicalInfo,
      gettingThere: "Sterkfontein Caves is roughly an hour's drive from central Johannesburg or Sandton. Self-driving is straightforward, or book through a tour operator for a half-day guided trip that includes transport.",
      editorialNote: "Sources: sterkfonteincaves.wits.ac.za/plan-your-visit (official hours and current pricing), moafrikatours.com, tripadvisor.com. Verified 14 Jul 2026.",
      sport: ["cricket"],
      moodTags: ["educational", "historic", "unique"],
      interestCategories: ["history", "nature"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "ZAR",
      bestSeasons: ["sep", "oct"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-14",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
