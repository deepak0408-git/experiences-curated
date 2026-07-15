import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "e288394a-eaeb-4dfc-bd5c-3cb852782eb5";

const bodyContent = `Kruger National Park sits roughly five hours from Johannesburg by road. A 3-day, 2-night trip is the realistic sweet spot for a cricket-tour visitor — long enough for genuinely good wildlife odds, short enough not to eat a week of your trip.

The standard 3-day shape, run by multiple operators including Africa Moja Tours, looks like this. Day one: early departure from Johannesburg, travelling via Nelspruit through the Elands Valley, entering Kruger for lunch and an afternoon game drive, then overnighting at a lodge in Hazyview (Tembo Guest Lodge is a commonly used property). Day two: a dawn game drive chasing the Big Five before breakfast, then a midday stop at a local watering hole to see hippos, crocodiles, and waterbirds, followed by rest and a second afternoon or evening drive. Day three: a final morning in the park, lunch on the Highveld en route back, arriving in Johannesburg or Pretoria by late afternoon. That gives you three real game-drive sessions across dawn, dusk, and one additional window, rather than the two you'd get on a 2-day trip — a meaningful difference in Big Five odds without adding real driving time, since the extra day is spent in the park, not on the road.

For a genuinely budget-conscious version, glamping packages exist too — one runs from around R9,185 per person sharing, rated 4.7 stars across 49 reviews, covering both Kruger itself and the private Blue Canyon Reserve, with an optional Panorama Route add-on. It's a real trade-off: simpler tented accommodation in exchange for a meaningfully lower price than a lodge-based package.

If you genuinely have more time, it's worth knowing what a longer trip buys you. A 4- or 5-day safari, run by operators like Kurt Safari or Big Six Tour Safaris, typically adds either a second Kruger region (Southern and Central Kruger, rather than just the south) or folds in the Panorama Route — Blyde River Canyon and the Drakensberg escarpment — as a genuinely worthwhile addition rather than padding. Some 5-day options fly you in directly, cutting the road time in favour of more game-drive time. If your tour schedule has a longer gap, this is where to spend it.

Self-driving is also a real option, not just a guided-tour alternative. Kruger's daily conservation fee is charged per person, not per vehicle — roughly $26 per international adult per day — so a self-drive trip's real costs are that entry fee plus vehicle rental (roughly $30-100/day depending on vehicle type) and fuel. A guided game drive booked separately through SANParks or a park operator runs around $25-40 per person per session if you want a guide's expertise without committing to a full guided package. Accommodation inside the park (SANParks-run rest camps like Skukuza) ranges from around R695/night for a basic hut to R1,600/night for a fully equipped bungalow, with camping around R300-400/night for two — all genuinely cheaper than a lodge package if you're comfortable planning your own route and drives.

Dining inside the park is better than "pack your own food" — Skukuza, the park's largest rest camp, has the Cattle Baron Steakhouse overlooking the Sabie River and Kruger Station, a family-friendly spot on the old train platform serving burgers, pizza, and steak. Smaller rest camps like Berg-en-Dal, Mopani, Punda Maria, and Shingwedzi have their own restaurants too, so a self-drive trip doesn't mean cooking every meal.

Malaria is a real, non-optional consideration. Kruger sits in a malaria area, and South Africa's Health Department recommends prophylaxis for visitors travelling September through May — which covers this entire tour window. Consult a doctor at least a week before travelling, since the standard antimalarials (doxycycline, atovaquone/proguanil, or mefloquine) need to be started in advance, not picked up on arrival. Alongside medication, cover up between dusk and dawn (long sleeves, trousers, DEET-based repellent), and keep to closed accommodation with screens where possible.

Pack light, neutral-toned clothing (avoid white, which shows dirt and stands out to animals), a couple of long-sleeved layers for cool mornings and evenings, a wide-brimmed hat, sunscreen, and comfortable closed shoes — hiking boots aren't necessary unless you're booking a walking safari specifically. Binoculars are worth bringing rather than relying on a guide's, especially on a self-drive trip.`;

const whyItsSpecial = `I think the honest way to sell a Kruger add-on is to be upfront about the trade-offs at every length. A 2-day trip is efficient but thin — barely two real game drives against a lot of driving. A 3-day trip fixes that by adding one more genuine drive window without meaningfully increasing the road time, which is why it's the better default for most cricket-tour visitors with a few days to spare. A 5-day trip is a different, richer thing entirely — a second region or the Panorama Route folded in — but it's a real commitment, not a rounding error on a trip built around cricket.

What I'd actually push back on is treating this as purely a guided-package decision. Self-driving is a genuine option here, not a corner-cutting one, and for a fan who's comfortable planning a route, it's meaningfully cheaper than any packaged safari. Either way, this is the realistic way to add Kruger to a South Africa cricket trip rather than skip it — the alternative isn't a better trip, it's just no Kruger at all.`;

const insiderTips = [
  "The two-drives-a-day rhythm (dusk on arrival, dawn the next morning) exists because those are genuinely when wildlife is most active — don't skip the early start to sleep in, it's the single best window for actual sightings.",
  "Malaria prophylaxis needs to start about a week before you travel, not on arrival — book a GP appointment as soon as your Kruger dates are confirmed, not the week before you fly.",
  "If you're self-driving, Kruger's conservation fee is charged per person entering the park, not per vehicle — a group sharing one car doesn't get a bulk discount on entry, only on the rental and fuel cost, so budget per-person for the gate fee specifically.",
  "Skip packing white or brightly coloured clothing — beyond showing dirt quickly, pale colours make you more visible to wildlife and don't blend with the bush the way neutral khaki and olive tones do.",
];

const whatToAvoid = "Don't assume a 2-day trip and a 3-day trip cost proportionally more for the extra day — the extra night and drive session on a 3-day package is usually a smaller price jump than you'd expect, since the fixed transfer cost (the 5-hour drive each way) is the same either way and gets amortised over more time in the park. Compare the actual per-day cost before assuming the shorter trip is the better-value option. And don't book a self-drive trip assuming rental-car GPS or phone signal will reliably guide you between camps — Kruger's internal roads are well signposted but mobile coverage is patchy deep in the park, so download an offline map or pick up a physical park map at the gate rather than relying on a live signal.";

try {
  const [result] = await db.update(experiences).set({
    title: "Kruger National Park — 3-Day Big 5 Safari from Johannesburg",
    subtitle: "Three real game drives, a genuine safari rhythm, still a manageable add-on to a cricket trip",
    bodyContent,
    whyItsSpecial,
    insiderTips,
    whatToAvoid,
    editorialNote: "Sources: africamojatours.com, getyourguide.com (3-Day Classic Package itinerary, 3-Day Budget Glamping Safari pricing/rating), safaribookings.com + bigsixtoursafaris.com + kurtsafari.com (5-day options, Panorama Route), sanparks.org (conservation fees, malaria advisory, rest camp accommodation pricing), krugerpark.co.za + rhinoafrica.com + thesafaristore.com (packing list, self-drive costs), nicd.ac.za (malaria prophylaxis timing), sanparks.org/parks/kruger/what-to-do/facilities/restaurants + krugergatehotel.com (Skukuza dining, Cattle Baron, Kruger Station). Verified 15 Jul 2026. Retitled from 2-day to 3-day per user direction, matching both GYG affiliate packages and reflecting that 3 days gives meaningfully better game-drive odds without proportionally more driving time.",
  }).where(eq(experiences.id, EXPERIENCE_ID)).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

  console.log("✓ Updated:", result.title, "|", result.id, "| slug:", result.slug);
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
