import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40";
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";
const slug = "soweto-apartheid-museum-" + Date.now().toString(36);

const bodyContent = `Soweto and the Apartheid Museum aren't a sightseeing add-on to a Johannesburg trip, they're closer to essential context for understanding the city and country you're in. Most day tours combine the two, and that combination is deliberate - the museum gives you the structural history, Soweto gives you the place where a lot of that history actually happened.

The Apartheid Museum sits south of the city centre and is built to disorient you on purpose. Visitors are randomly assigned a "white" or "non-white" entrance on arrival, a small, blunt piece of design that sets the tone before the exhibits even start. Inside, photographs, video footage, and historical documents walk through the system's construction and its end. It's open Tuesday to Sunday, 9am to 5pm. As of May 2026, international visitor tickets run R240 for adults, R190 for students, pensioners, and children - South African citizens pay a reduced local rate with ID. The museum's own guidance says children under 11 aren't recommended, given the graphic nature of some content.

Soweto itself, a short drive further out, is where the Hector Pieterson Memorial and Museum sits, commemorating the 1976 student uprising against the enforced use of Afrikaans in schools, an event that reshaped the country's trajectory. A few streets over on Vilakazi Street, Mandela House is the modest, single-story brick home where Nelson Mandela lived with his family from 1946 to 1962, open daily 9am to 5pm. Vilakazi Street itself is unusual in a specific way - it's the only street in the world that's been home to two Nobel Peace Prize winners, Mandela and Desmond Tutu, who lived nearby.

Guided tours combining both sites typically run as a full day, with hotel pickup from Sandton available in the early morning window.`;

const whyItsSpecial = `A lot of destinations treat their darker history as something to mention briefly before moving on to the nicer parts of the trip. Johannesburg doesn't get that option, and honestly, it shouldn't want it. The Apartheid Museum's entrance system is jarring specifically because it's meant to be, a five-second experience that tells you more about how the system actually worked than a wall of text could.

Soweto adds the human scale that a museum alone can't. Standing on the actual street where Mandela lived, a few blocks from where students were shot during the 1976 uprising, changes how the exhibits land afterward. I think this is one of the more important things you can do on a South Africa trip, cricket schedule or not.`;

const practicalInfo = {
  hours: "Apartheid Museum: Tuesday-Sunday, 9am-5pm, most public holidays. Mandela House: daily, 9am-5pm.",
  costRange: "Apartheid Museum (from May 2026): international adults R240, students/pensioners/children R190. Mandela House and Hector Pieterson Museum have their own separate, lower entry fees - check each site directly. Guided full-day tours combining all three typically run higher as a package price.",
  bookingMethod: "The Apartheid Museum and Mandela House can both be visited independently without a guided tour. For the combined day, a guided tour with hotel pickup (Sandton pickup windows typically 7:30-9:30am) is the more practical option - book via GetYourGuide, Viator, or a local operator like Moafrika Tours.",
  website: "https://www.apartheidmuseum.org",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Soweto & the Apartheid Museum",
      subtitle: "The history that shapes Johannesburg, from a museum built to disorient you to a street that housed two Nobel laureates",
      slug,
      experienceType: "day_trip",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Soweto",
      address: "Apartheid Museum, Northern Parkway and Gold Reef Road, Johannesburg",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The Apartheid Museum's random entrance assignment (white/non-white) is a deliberate part of the experience, not a mistake - go in without trying to game which line to join.",
        "Vilakazi Street in Soweto is the only street in the world to have housed two Nobel Peace Prize winners - Mandela's house and a Desmond Tutu residence are both nearby.",
      ],
      whatToAvoid: "Don't rush the Apartheid Museum in under 90 minutes - reviewers consistently note the exhibits reward a slower pace, and treating it as a quick stop before Soweto undersells what's actually a dense, well-built museum.",
      practicalInfo,
      gettingThere: "The Apartheid Museum is roughly 25-30 minutes from Sandton by car. Soweto (Vilakazi Street, Hector Pieterson Memorial) is a further 20-30 minutes from the museum. A guided tour with hotel pickup is the simplest way to cover both without self-driving unfamiliar routes.",
      editorialNote: "Sources: apartheidmuseum.org/about-the-museum/visitor-information (official hours and 2026 pricing), tripadvisor.com (Hector Pieterson Museum), kupi.com (Mandela House hours), moafrikatours.com. Verified 14 Jul 2026.",
      sport: ["cricket"],
      moodTags: ["historic", "moving", "essential"],
      interestCategories: ["history", "culture"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
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
