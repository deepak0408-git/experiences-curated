import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40";
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";
const slug = "the-bullring-wanderers-test-" + Date.now().toString(36);

const bodyContent = `The Wanderers Stadium sits in Illovo, a short drive south of Sandton, and everyone in South African cricket calls it the Bullring. The nickname isn't decoration. The stadium's steep, close-in stands were built to funnel crowd noise back down onto the pitch, and touring teams have talked for decades about how much louder and more claustrophobic it feels here than at most other Test grounds.

The current stadium dates to 1956, replacing the Old Wanderers ground that used to sit where Johannesburg's main railway station is now. After South Africa's return to international cricket in 1991, the ground went through a serious rebuild, and in 1996 five new floodlight towers, each 65 metres tall, went up to allow day-night cricket. Capacity is reported differently depending on the source — official listings put it around 34,000, though some seating counts land closer to 28,000-30,000 depending on how temporary stands are configured for a given match.

This ground has hosted two finals that matter well beyond South African cricket. The 2003 Cricket World Cup final was played here, Australia beating India comfortably to complete an unbeaten tournament. Four years later, the Wanderers hosted the first-ever T20 World Cup final, India against Pakistan, decided by five runs in one of the format's defining early moments. Both finals happened on this exact square.

For the Australia tour in September 2026, the Wanderers hosts the second ODI of the series on 27 September. Sandton sits close enough that most visitors base themselves there and treat the Wanderers as a short trip rather than a destination in its own right.`;

const whyItsSpecial = `Most stadiums that claim an intimidating atmosphere are trading on reputation more than physical reality. The Bullring earns it structurally. The stands are close and steep by design, so crowd noise doesn't dissipate, it gets thrown straight back at the players. Touring sides have said as much for years.

What I find genuinely compelling is that two of the format's biggest finals landed here, a 50-over final in 2003, a 20-over final in 2007, both decided on the same square four years apart. That's not something most grounds anywhere in the world can claim.`;

const practicalInfo = {
  hours: "Gates typically open ahead of the toss; for a day-night ODI, expect an early-afternoon start with play running into the evening under lights",
  costRange: "General admission and grandstand pricing for the 2026-27 season to be confirmed on TicketPro closer to the match",
  bookingMethod: "Tickets sold through Cricket South Africa's official partner, TicketPro (tickets.cricket.co.za). Note: reported capacity varies by source (28,000-34,000) depending on stand configuration for the match.",
  website: "https://www.wanderersclub.co.za",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "The Bullring — A Test at the Wanderers",
      subtitle: "Johannesburg's cricket ground earns its nickname from a design built to amplify noise and pressure",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Illovo / Sandton",
      address: "Corlett Drive, Illovo, Sandton, 2196",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The stands are steep and close by design — sit anywhere in the lower tiers for the full effect of the ground's noise.",
        "The Wanderers hosts the 2nd ODI (27 Sep 2026), a day-night fixture — expect an afternoon start running into the evening under lights.",
      ],
      whatToAvoid: "Don't assume a fixed capacity number when planning — official listings say ~34,000 but some seating configurations run closer to 28,000-30,000, which can affect ticket availability for a popular fixture like an Australia ODI.",
      practicalInfo,
      gettingThere: "The Wanderers sits just south of Sandton in Illovo, off Corlett Drive (accessible from the M1). A taxi or rideshare from central Sandton takes around 7-10 minutes. There is no direct rail link to the ground itself.",
      editorialNote: "Sources: Wikipedia (Wanderers Stadium), ESPNcricinfo, thecricscope.com, Wikipedia (2007 World Twenty20 final), sa-venues.com. Verified 14 Jul 2026. Capacity discrepancy (28-30k vs 34k) flagged in copy rather than picking one arbitrarily.",
      sport: ["cricket"],
      moodTags: ["electric-atmosphere", "historic", "iconic"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "ZAR",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
      availability: "event_only",
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
} finally {
  await client.end();
}
