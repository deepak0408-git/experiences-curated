import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40";
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";
const slug = "getting-to-wanderers-sandton-" + Date.now().toString(36);

const bodyContent = `Most visitors get to the Wanderers via Sandton, which sits just a few minutes north of the ground. The Gautrain is the backbone of this — Africa's first high-speed rail system, running up to 180 km/h, and it's genuinely the safest, most reliable way to move around Johannesburg. Sandton Gautrain station connects directly to OR Tambo Airport as well as Rosebank and Pretoria.

From Sandton station, the practical last leg to the Wanderers is Uber or Bolt, not walking. The distance is around 3 miles and the ride runs roughly 7-10 minutes. One detail worth knowing: Uber drivers at Sandton Gautrain station don't pick up directly outside the station entrance because of ongoing friction with metered taxi operators there. Request your pickup from inside a nearby mall or hotel instead — it's a small adjustment that avoids an awkward standoff at the curb.

There's no confirmed direct Rea Vaya bus route running specifically to Illovo or the Wanderers itself. The Rea Vaya Phase 1C network does connect Sandton to the Johannesburg CBD and other northern suburbs, with a station on Rivonia Road just one block from Sandton's Gautrain stop, but it's not the practical choice for the final stretch to the ground on matchday.

Standard big-city precautions apply and nothing more dramatic than that: stick to app-based rideshares rather than hailing a taxi on the street, avoid walking between the station and the ground after dark, and keep your phone and valuables out of sight in the car. Download Uber, Bolt, and the Gautrain app before you land, not once you're already trying to get to a match.`;

const whyItsSpecial = `Johannesburg's transport reputation runs ahead of the actual experience most visitors have if they stick to the Sandton-Gautrain-Uber triangle. The Gautrain in particular is a genuinely well-run piece of infrastructure, fast, clean, and reliable in a way that surprises people who arrive expecting chaos.

What actually trips visitors up isn't danger, it's small logistics, like not knowing Uber won't pick you up right outside the Gautrain station. Getting that detail right in advance saves a confusing five minutes on the day you least want one.`;

const practicalInfo = {
  hours: "Gautrain typically runs from early morning to around 8-9pm — confirm current timetable at gautrain.co.za, especially for a late finish under lights",
  costRange: "Gautrain single fare from OR Tambo to Sandton runs in the moderate range; Uber/Bolt from Sandton to the Wanderers typically a short-ride fare",
  bookingMethod: "Download the Gautrain app, Uber, and Bolt before travelling. Request Uber pickups from inside a mall or hotel near Sandton station rather than the station entrance itself.",
  website: "https://www.gautrain.co.za",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to the Wanderers — Sandton & Rea Vaya",
      subtitle: "The Gautrain gets you to Sandton reliably — the last few minutes to the ground come down to one small trick",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Sandton",
      address: null,
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Request Uber/Bolt pickups from inside a nearby mall or hotel rather than right outside Sandton Gautrain station — drivers avoid stopping there due to tension with metered taxis.",
        "The Gautrain connects Sandton directly to OR Tambo Airport, so it's worth using for your arrival transfer as well as matchday transport.",
      ],
      whatToAvoid: "Don't plan on walking from Sandton to the Wanderers, even though it looks short on a map — the direct route isn't a comfortable or well-signed pedestrian path, and a 7-10 minute rideshare is the practical option.",
      practicalInfo,
      gettingThere: "Sandton Gautrain station is the hub — from OR Tambo Airport, the Gautrain runs directly to Sandton. From Sandton, an Uber or Bolt to the Wanderers (Corlett Drive, Illovo) takes roughly 7-10 minutes.",
      editorialNote: "Sources: reavaya.org.za, sandton.info (Gautrain/Uber guide), thingstodoinjohannesburg.com. Verified 14 Jul 2026. No confirmed direct Rea Vaya route to Illovo/Wanderers found — framed honestly rather than inventing one.",
      sport: ["cricket"],
      moodTags: ["practical", "insider-knowledge"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "ZAR",
      bestSeasons: ["sep", "oct"],
      advanceBookingRequired: false,
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
