import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Two fixes to "Staying in Milan — The City Base Strategy", 19 Sep 2026:
//
// 1. Real Google Maps rating links added inline for all 3 named hotels
//    (this experience was multi-venue with zero ratings before this pass —
//    per feedback_multi_venue_ratings_registry_mandatory.md, that's a
//    same-session gap, not a later cleanup). Hyatt Centric and Hilton Milan
//    both have real Google Maps place listings with cid identifiers found
//    directly; BB Hotels Smarthotel Re Milano Nord has no direct cid link
//    found via search, so its rating link uses the maps.app.goo.gl short
//    link the founder supplied directly, 19 Sep 2026.
//
// 2. Address correction: BB Hotels Smarthotel Re Milano Nord is actually in
//    Cinisello Balsamo (Via Milanese 308/310), not Sesto San Giovanni as
//    originally written throughout body/address/gettingThere. Confirmed via
//    multiple booking-site listings, 19 Sep 2026 — Sesto San Giovanni is the
//    nearest well-known place name and metro stop, which is likely how the
//    mix-up happened, but the hotel's real municipality is Cinisello
//    Balsamo. Founder-approved fix, same session.
//
// google_maps_rating/review_count/url left untouched at null (already null
// — correct for a multi-venue experience). MULTI_VENUE_RATINGS entry
// ("staying-in-milan-city-base-strategy-": { venueCount: 3, venueNoun:
// "hotels" }) added to app/experience/[slug]/page.tsx in the same pass.

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "staying-in-milan-city-base-strategy-mrbv33on";

const bodyContent = `Monza itself has a small handful of hotels, and they get booked out fast and priced accordingly for race weekend. Most people who've done this trip more than once end up basing in Milan instead, and the train math is the reason why: Trenord runs Milano Centrale to Monza in 9 minutes, with trains roughly every hour from 5:25am to 11:22pm. That's a shorter commute than plenty of people have to their own office.

Three areas make sense depending on what you want out of the trip. Right around Milano Centrale itself puts you two minutes from the fastest train to Monza and inside easy walking distance of the Hyatt Centric Milan Centrale, a 141-room hotel with a proper spa setup (Roman bath, sauna, Turkish bath, salt cave) if you want to recover between sessions. [See live rating and reviews on Google Maps](https://www.google.com/maps/place/Hyatt+Centric+Milan+Centrale/data=!4m2!3m1!1s0x4786c6ce52b00f99:0xb430ad05ecf4f9b4). The Hilton Milan sits a couple of blocks further out on Via Luigi Galvani, still inside that same walk-to-the-station radius, and tends to run a little more corporate and a little less design-forward than the Hyatt, which some people prefer for a race weekend where you're mostly just sleeping there. [See live rating and reviews on Google Maps](https://www.google.com/maps/place/Hilton+Milan/data=!4m2!3m1!1s0x0:0xd3cc6ec5720a7aeb).

If you'd rather trade a few minutes of commute for a lower nightly rate, Cinisello Balsamo is worth knowing about — just north of Sesto San Giovanni, with the Bignami stop on Milan's M5 metro line giving direct access into the city center and a short connection toward Monza without needing a car. The BB Hotels Smarthotel Re Milano Nord sits in this area, a 43-room 4-star property with a garden and terrace that's meaningfully cheaper than anything near Centrale, at the cost of a couple of metro/train changes to get anywhere central. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/GfYyxuhh59GsR5Lp6).

The bigger case for Milan over Monza itself is what happens outside race hours. Monza empties out at night during a normal week. Milan doesn't. You get actual restaurants, actual nightlife, and a city that isn't purely organized around a racetrack, which matters over a three or four night stay more than people expect going in.`;

const address = "Milano Centrale area — Hyatt Centric Milan Centrale, Via Giovanni Battista Pirelli 20, 20124 Milano MI; Hilton Milan, Via Luigi Galvani 12, 20124 Milano MI; BB Hotels Smarthotel Re Milano Nord, Via Milanese 308/310, 20092 Cinisello Balsamo MI";

const gettingThere = "Milano Centrale to Monza by Trenord train takes 9 minutes with no changes; from Cinisello Balsamo, take the M5 metro to Bignami or central Milan, then connect via Trenord toward Monza.";

const editorialNote = "Sources: trenord.it Milano Centrale-Monza route page (9 min, hourly, 05:25-23:22), hyatt.com Hyatt Centric Milan Centrale hotel-info (141 rooms, spa amenities), hilton.com Hilton Milan (Via Luigi Galvani 12 address), booking.com / bbhotels.it BB Hotels Smarthotel Re Milano Nord listing (43 rooms, garden/terrace, real address Via Milanese 308/310, Cinisello Balsamo — corrected 19 Sep 2026 from an earlier, wrong \"Sesto San Giovanni\" location claim), rome2rio.com Cinisello Balsamo to Monza (M5 metro + Trenord connection). Real Google Maps rating links added 19 Sep 2026, per feedback_multi_venue_ratings_registry_mandatory.md: Hyatt Centric Milan Centrale and Hilton Milan both have direct Google Maps place/cid links found via search; BB Hotels Smarthotel Re Milano Nord has no direct cid link found via search — its link is the maps.app.goo.gl short link the founder supplied directly, 19 Sep 2026, which resolves to its real Google Maps listing. Multi-venue experience — inline Google Maps links per venue per skill §2c, no single top-level rating field set; MULTI_VENUE_RATINGS entry (venueCount: 3, venueNoun: \"hotels\") added to app/experience/[slug]/page.tsx in the same pass. GTG: no Monza/Italian GP listings found. Booking.com: all three hotels confirmed listed and bookable — TODO: add affiliate links in a batch pass alongside #8 Hotel de la Ville and #10 Lake Como, per user decision 8 Jul 2026. Hero image: FlavMi, CC BY-SA 3.0, Wikimedia Commons. Verified 8 Jul 2026; ratings + address fix verified 19 Sep 2026.";

try {
  const [result] = await db
    .update(experiences)
    .set({
      bodyContent,
      address,
      gettingThere,
      editorialNote,
      lastVerifiedDate: "2026-09-19",
    })
    .where(eq(experiences.slug, SLUG))
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  console.log("✓ Updated:", result?.title, "|", result?.id, "|", result?.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
