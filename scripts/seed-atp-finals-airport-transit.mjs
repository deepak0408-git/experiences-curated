import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "1a968a48-105b-4c30-b092-56e0cdc4a0a2";
const EVENT_ID = "8e4d5aac-f472-48ac-b515-d253487cda50";
const slug = "atp-finals-airport-to-city-" + Date.now().toString(36);

const bodyContent = `Turin Airport (officially Turin-Caselle, IATA code TRN) sits about 21km north of the city centre and 16km from Inalpi Arena, and it's genuinely well connected by rail — the airport has its own station, Torino Aeroporto di Caselle, on the Turin Metropolitan Railway Service (SFM).

Trains run roughly every 30 minutes between 6am and 10pm, taking about 30 minutes to reach Torino Porta Susa station. From Porta Susa, the city's Linea 1 metro connects onward into the centre — the airport train doesn't reach the metro network directly, so Porta Susa is genuinely the transfer point, not an optional stop.

If you'd rather skip the transfer, an "Integrato B" combined ticket (around €4.20) covers the regional train plus a connecting urban transit trip — metro to Porta Nuova or Lingotto, for instance — within a 120-minute window from first validation, which is the simplest single-ticket option for a first arrival.

Bus is the alternative: SADEM and Terravision both run airport-to-city services, roughly 40 minutes and around €3.30-3.50 one-way, useful if your train timing doesn't line up or you're arriving outside the 6am-10pm rail window.

For Inalpi Arena specifically, there's no single-transfer route from the airport — you'll take the train or bus into the centre first, then connect onward via tram 4 or 10 to Sebastopoli (see the Getting to Inalpi Arena experience). Budget roughly an hour door-to-door from touchdown to arena on a good connection, more if your flight lands outside train hours.`;

const whyItsSpecial = `What's easy to get wrong here is assuming Turin's transit map is as simple as it looks — one metro line reads as straightforward, but the airport isn't actually on it. The real route (SFM train to Porta Susa, then metro or tram onward) is a genuine two-leg journey, not a single hop, and knowing that before you land means you're not standing at the airport station working it out for the first time with luggage and a match to get to. The Integrato B combined ticket is the detail most visitors don't discover until their second trip — it turns what looks like buying two separate tickets into one purchase covering both legs.`;

const insiderTips = [
  "Buy the Integrato B combined ticket (~€4.20) rather than separate train and metro/tram tickets — it covers the airport train plus a connecting city transit trip within 120 minutes of first validation.",
  "The airport train doesn't run 24 hours (roughly 6am-10pm) — if your flight lands outside that window, SADEM or Terravision buses are the fallback, not the train.",
];

const whatToAvoid = `Don't plan on a direct train-to-arena journey — the airport rail line reaches Porta Susa, not Inalpi Arena, so factor in the onward tram connection (roughly 15-20 extra minutes) rather than assuming door-to-door rail coverage.`;

const practicalInfo = {
  hours: "SFM airport trains: roughly every 30 min, 6am-10pm. SADEM/Terravision buses run outside these hours as an alternative.",
  costRange: "SFM train ~€4.20 (Integrato B combined ticket, includes connecting transit); bus ~€3.30-3.50 one-way.",
  bookingMethod: "Train tickets at airport station machines or via Trenitalia; bus tickets from operator counters/websites (SADEM, Terravision).",
  howToBook: "",
  website: "https://muoversiatorino.it/en/tickets/, https://www.gtt.to.it",
  reservationsRequired: false,
};

const gettingThere = "Torino Aeroporto di Caselle station (SFM Line 4/7) to Torino Porta Susa, then connect via Linea 1 metro or tram onward.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Turin Airport to the city — the real route",
      subtitle: "SFM train to Porta Susa, then a connection — not a single-leg journey",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Caselle",
      address: "Torino-Caselle Airport (TRN), Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "SFM train timing/route confirmed via multiple sources (andybtravels.com, airmundo.com, chamonix.net) cross-checked for consistency. Integrato B combined ticket detail from airmundo.com. Bus operator names (SADEM, Terravision) confirmed via multiple sources. Verified 4 Aug 2026.",
      sport: ["tennis"],
      moodTags: ["practical", "planning"],
      interestCategories: ["transit"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
