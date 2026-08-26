import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "where-to-stay-melbourne-boxing-day-msvp80zu";

const [existing] = await db.select().from(experiences).where(eq(experiences.slug, SLUG));

// 2) Move each Google Maps link directly after its own hotel's sentence,
// instead of both links bunched at the end of the paragraph.
const newBodyContent = existing.bodyContent.replace(
  `On the budget end, Melbourne has a genuine hostel scene. Bounce Melbourne sits directly across from Flinders Street Station in the CBD, a short walk to Federation Square and the city's laneway network. Space Hotel on Russell Street is a short walk further into the CBD and known for its rooftop terrace. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=4478292184152123594&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) for Bounce Melbourne, and [Google Maps](https://maps.google.com/?cid=13309062134439501868&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) for Space Hotel. Both are a tram ride or a 20-25 minute walk from the MCG/Melbourne Park precinct rather than the East Melbourne walk-up distance, which is the real tradeoff for the lower price. Availability for this exact week tends to disappear five to seven months out, well before general ticket sale even opens — book the moment your dates are fixed rather than waiting to compare prices.`,
  `On the budget end, Melbourne has a genuine hostel scene. Bounce Melbourne sits directly across from Flinders Street Station in the CBD, a short walk to Federation Square and the city's laneway network. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=4478292184152123594&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). Space Hotel on Russell Street is a short walk further into the CBD and known for its rooftop terrace. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13309062134439501868&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). Both are a tram ride or a 20-25 minute walk from the MCG/Melbourne Park precinct rather than the East Melbourne walk-up distance, which is the real tradeoff for the lower price. Availability for this exact week tends to disappear five to seven months out, well before general ticket sale even opens — book the moment your dates are fixed rather than waiting to compare prices.`
);

if (newBodyContent === existing.bodyContent) {
  throw new Error("bodyContent replacement did not match — aborting to avoid a silent no-op write.");
}

// 4) Getting There — add the 2 hostels alongside the existing 2 hotels.
const newGettingThere =
  existing.gettingThere +
  " Bounce Melbourne is directly across the road from Flinders Street Station — the single best-connected address of any option here, on every metro line and tram route through the city. Space Hotel on Russell Street is a 10-minute walk from Flinders Street Station, or a short ride on trams 30, 35, or 86 along La Trobe/Bourke. Both hostels are a 20-25 minute walk or one tram ride from the MCG/Melbourne Park precinct, versus East Melbourne's direct walk-up.";

// 5) Why It's Special — small addition on the hostel/budget angle.
const newWhyItsSpecial =
  existing.whyItsSpecial +
  " There's a third real option underneath the East Melbourne-versus-CBD question, too: if the precinct itself matters more to your trip than where you sleep, Bounce Melbourne and Space Hotel put a real, well-rated bed in the middle of the city for a fraction of either hotel's rate, at the honest cost of a tram ride instead of a walk on match days.";

const [updated] = await db
  .update(experiences)
  .set({
    bodyContent: newBodyContent,
    gettingThere: newGettingThere,
    whyItsSpecial: newWhyItsSpecial,
    practicalInfo: {
      ...existing.practicalInfo,
      // 3) Access / booking note for the hostels.
      bookingMethod:
        existing.practicalInfo.bookingMethod +
        " Bounce Melbourne and Space Hotel are both booked via hostelworld.com (www.hostelworld.com) rather than the hotel-direct sites above.",
    },
    editorialNote:
      existing.editorialNote +
      " 26 Aug 2026: venueCount in MULTI_VENUE_RATINGS updated from 2 to 4 (\"stay options\", not \"hotels\") to reflect the added hostels; per-hostel Google Maps links moved next to their own sentence instead of bunched at paragraph end; gettingThere, whyItsSpecial, and bookingMethod extended to cover both hostels.",
    lastVerifiedDate: new Date().toISOString().slice(0, 10),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug });

console.log("Updated:", updated);
await client.end();
