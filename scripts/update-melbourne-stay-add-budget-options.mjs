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

const newBodyContent =
  existing.bodyContent +
  "\n\nNot every trip needs a hotel. Short-term rentals are a real option, but Victoria's Short Stay Levy adds 7.5% to the total booking fee on any Airbnb-style platform stay (nightly rate, cleaning fee, and GST all included) — the levy doesn't apply to hotels or hostels, so it's a real cost difference to weigh before comparing prices across booking types. Hosts price up hard for this exact period and often set minimum-stay requirements once the tournament dates lock in, so a rental that looks affordable months out can be gone or repriced by December. Richmond and South Yarra carry noticeably more apartment-style rental stock than East Melbourne's hotel-dominated core, both a short tram ride from the MCG/Melbourne Park precinct rather than a walk.\n\nOn the budget end, Melbourne has a genuine hostel scene. Bounce Melbourne sits directly across from Flinders Street Station in the CBD, a short walk to Federation Square and the city's laneway network. Space Hotel on Russell Street is a short walk further into the CBD and known for its rooftop terrace. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=4478292184152123594&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) for Bounce Melbourne, and [Google Maps](https://maps.google.com/?cid=13309062134439501868&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) for Space Hotel. Both are a tram ride or a 20-25 minute walk from the MCG/Melbourne Park precinct rather than the East Melbourne walk-up distance, which is the real tradeoff for the lower price. Availability for this exact week tends to disappear five to seven months out, well before general ticket sale even opens — book the moment your dates are fixed rather than waiting to compare prices.";

const newInsiderTips = [
  ...existing.insiderTips,
  "Bounce Melbourne and Space Hotel both fill for this week 5-7 months out — earlier than the hotels above, since budget stock is thinner to begin with and gets booked by backpackers on a different, longer-lead-time travel calendar.",
];

const newWhatToAvoid =
  existing.whatToAvoid +
  " Don't book an Airbnb for this week without checking Victoria's 7.5% Short Stay Levy is included in the quoted price — it's charged on the total booking fee, not just the nightly rate, and some listings show it as a separate line item added at checkout rather than folded into the headline price.";

const [updated] = await db
  .update(experiences)
  .set({
    bodyContent: newBodyContent,
    insiderTips: newInsiderTips,
    whatToAvoid: newWhatToAvoid,
    practicalInfo: {
      ...existing.practicalInfo,
      website: existing.practicalInfo.website + ", https://www.hostelworld.com/hosteldetails.php/Bounce-Melbourne/Melbourne/312364, https://www.hostelworld.com/hosteldetails.php/Space-Hotel/Melbourne/1944",
      costRange:
        existing.practicalInfo.costRange +
        ". Budget alternative: Bounce Melbourne (from roughly AU$92/night for a 1-person dorm bed, AO2027-week dates) and Space Hotel (from roughly AU$69/night, same dates) — both checked live on Hostelworld for 18-22 Jan 2027; rates move fast for this week, so treat these as a starting point, not a locked-in price. Victoria's 7.5% Short Stay Levy applies separately to any Airbnb-style booking, not to these hostels.",
    },
    editorialNote:
      existing.editorialNote +
      " Budget-tier options added 26 Aug 2026: Bounce Melbourne (250 Flinders St, Melbourne VIC 3000, Google rating 4.6/671 reviews) and Space Hotel (380 Russell St, Melbourne VIC 3000, Google rating 4.3/1,648 reviews) — both confirmed via a live Google Places API (New) searchText lookup, 26 Aug 2026. Both also verified as currently trading with live Jan 2027 date-range availability on Hostelworld (screenshots confirmed by founder, 18-22 Jan 2027, 1 guest). Prices founder-confirmed per-night from Hostelworld in INR (Bounce Melbourne ₹6,303.81 — the free-cancellation 10-bed mixed dorm rate, not the earlier ₹6,084.22 non-refundable rate initially used in error — and Space Hotel ₹4,720.16) converted to AUD at the live INR/AUD rate (0.01465, frankfurter.app, checked 26 Aug 2026) — approx AU$92 and AU$69/night respectively, both explicitly confirmed as per-night by the founder, 26 Aug 2026. The Nunnery, Fitzroy was considered and dropped — founder confirmed it's unavailable for these dates. Victoria's Short Stay Levy (7.5% on total booking fee, hotels/hostels exempt, effective 1 Jan 2025) and the Richmond/South Yarra short-term-rental neighbourhood alternative were researched and confirmed via State Revenue Office Victoria (sro.vic.gov.au), Parliament of Victoria, and Harwood Andrews Lawyers coverage of the Short Stay Levy Act 2024.",
    lastVerifiedDate: new Date().toISOString().slice(0, 10),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug });

console.log("Updated:", updated);
await client.end();
