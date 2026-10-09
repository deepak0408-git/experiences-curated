import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "where-to-stay-ahmedabad-muecpb9t";

const NEW_BODY = `Ahmedabad splits into a genuinely useful three-way choice for this trip: stay near the Sabarmati riverfront for stadium convenience, out toward SG Highway for a more contemporary hotel scene, or in the old city if you'd rather wake up inside the heritage district you're probably visiting anyway.

Hyatt Regency Ahmedabad, on Ashram Road in Usmanpura, sits along the Sabarmati and is the closest of the three to the stadium, roughly 7-8km / a 15-20 minute drive to Motera depending on traffic and bridge crossing, making it the most convenient base on matchday itself. It's a full-service five-star property: outdoor pool, 24-hour fitness centre, Aadi Spa, and four restaurants covering a genuine spread of cuisines, Tinello for Italian and continental, China House for Sichuan and other Chinese cooking, Sarvatt for Gujarati and Rajasthani thalis and street food, and Chai Shop as a 24-hour cafe for anything in between. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14566658954486663914)

Novotel Ahmedabad, out at Iscon Cross Roads on the Sarkhej-Gandhinagar Highway, carries the strongest rating and largest review count of the three options here, and it's a solid pick if you'd rather be near the city's more contemporary retail and dining strip than the older riverfront core. It's the furthest of the three from the stadium, figures vary by source but expect somewhere around 12-18km, a 20-30 minute drive depending on the route and time of day, so factor that into matchday planning. On-site it has an outdoor pool, a fitness centre, ODE Spa, and three restaurants, including The Square, a 24/7 multicuisine restaurant running Indian, Asian, and European menus in both buffet and live-cooking sections, and Alfresco, an open-air evening spot for short eats and grills. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10027319061442142519)

The House of MG is the distinctive choice: a heritage hotel inside a converted 1920s haveli built by the Mangaldas textile family, in the old city opposite the Sidi Saiyyed Mosque, putting you a short walk from the pols and stepwell architecture covered elsewhere in this pack. Rooms are air-conditioned but dressed with vintage photographs and handmade furniture rather than standard hotel furnishings, and the property has an indoor pool, a spa, and its own textile gallery alongside a heritage bookstore and crafts shop on-site. Its real draw, though, is Agashiye, the rooftop Gujarati thali restaurant that changes its menu daily and is worth visiting even if you stay elsewhere. Being in the old city, it's the furthest from Motera of the three and realistically needs a taxi or auto-rickshaw rather than a short walk, so budget 30-40 minutes each way to the ground depending on old-city traffic. It has a smaller but genuinely strong review base, and it's the pick if you want your stay itself to be part of the old-city experience rather than just a base for reaching it. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=2366808760588866536)`;

const NEW_GETTING_THERE = "Hyatt Regency is the shortest matchday run, roughly a 15-20 minute drive to Motera Stadium. Novotel is further out on SG Highway, figure 20-30 minutes depending on traffic. The House of MG, in the old city, is the longest of the three, 30-40 minutes by taxi or auto-rickshaw rather than a walkable distance despite being centrally located for the heritage sites. All three are reachable by the metro's Red Line with a final auto-rickshaw or taxi leg to the stadium gates, which is often faster than driving all the way on a packed matchday.";

const [row] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, SLUG));
console.log("Current body length:", row.bodyContent.length);

const [result] = await db.update(experiences)
  .set({ bodyContent: NEW_BODY, gettingThere: NEW_GETTING_THERE })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
console.log("New body length:", NEW_BODY.length);
process.exit(0);
