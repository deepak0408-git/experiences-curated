import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40";
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";
const slug = "braai-culture-sandton-melrose-arch-" + Date.now().toString(36);

const bodyContent = `Braai comes from the Afrikaans braaivleis, meaning grilled meat, and it's less a cuisine than a shared social ritual that crosses every cultural line in South Africa. It traces back to indigenous fire-cooking traditions that predate colonial settlement, later became a weekend fixture of Afrikaner farming life, and today shows up everywhere from stylish Weber grills in Sandton gardens to open fires in Soweto backyards. The staples are boerewors, a spiced coiled sausage, alongside lamb chops, chicken, and increasingly a vegetarian skewer or two.

The Braai Room in Lonehill, run by Country Meat Butchery, is the most direct way to experience it properly if you're not being hosted at someone's home. The meat is aged and cut at the attached butchery, the setting looks out over the Lonehill Koppie and Dam, and the menu runs breakfast through dinner with genuinely good wood-fired pizza alongside the grilled meat. It's a 15-20 minute drive from central Sandton, further out than Melrose Arch, but it's the real thing rather than a hotel-restaurant version of it.

Melrose Arch itself, a compact, walkable retail and dining precinct a short drive from Sandton, runs a different register entirely — closer to a European piazza than a braai. March Restaurant is the standout for a proper sit-down dinner, modern European cooking built on locally sourced ingredients, a polished setting, and attentive service. It's not braai food, but it's a strong contrast if you want one upscale night that isn't grilled meat and fire.

Between the two, you get a genuine sense of Johannesburg's range: fire-cooked tradition on one end, contemporary fine dining on the other, both within easy reach of a Sandton base.`;

const whyItsSpecial = `Braai gets flattened into "South African barbecue" in a lot of travel writing, which misses what actually makes it interesting. It's not really about the food technique, it's the social structure around it — everyone gathers, someone tends the fire for hours, and the meal happens slowly rather than being served all at once.

The Braai Room lets a visitor get close to that without needing an actual invitation to someone's backyard, which is genuinely the more common way South Africans experience it. Pairing that with a night at Melrose Arch gives you the other half of Johannesburg's food identity — a city that does both fire-pit tradition and polished contemporary dining seriously, not one at the expense of the other.`;

const practicalInfo = {
  hours: "The Braai Room: breakfast, lunch, and dinner service — confirm current hours directly via braairoom.co.za. March Restaurant: standard evening dinner service, check melrosearch.co.za for current hours.",
  costRange: "The Braai Room sits in the moderate range for a full meal with meat and sides; March Restaurant runs higher, into the splurge range for a full dinner",
  bookingMethod: "The Braai Room takes bookings via Dineplan (dineplan.com) — worth reserving ahead on weekends. March Restaurant and other Melrose Arch venues typically take direct restaurant bookings.",
  website: "braairoom.co.za / melrosearch.co.za",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Braai Culture & Sandton/Melrose Arch Dining",
      subtitle: "Fire-cooked tradition at The Braai Room, then contemporary dining a short drive away at Melrose Arch",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Lonehill / Melrose Arch",
      address: "The Braai Room, Lonehill, Fourways, Sandton",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The Braai Room is run by an on-site butchery (Country Meat) — the meat quality is a real step up from a typical restaurant braai, not just a marketing line.",
        "Melrose Arch is walkable once you're there — worth parking once and exploring multiple restaurants and bars in the same precinct rather than driving between spots.",
      ],
      whatToAvoid: "Don't expect The Braai Room to be a quick meal — reviews consistently note it runs at a relaxed, sometimes slow pace, which fits the braai tradition of a long, unhurried gathering but can surprise visitors expecting fast table turnover.",
      practicalInfo,
      gettingThere: "The Braai Room in Lonehill is roughly a 15-20 minute drive from central Sandton. Melrose Arch is closer, around 10-15 minutes from Sandton by car or rideshare.",
      editorialNote: "Sources: joburgetc.com (braai culture history), redcarnationhotels.com, eatout.co.za, foodandhome.co.za, braairoom.co.za, tripadvisor.co.za (The Braai Room reviews), melrosearch.co.za. Verified 14 Jul 2026.",
      sport: ["cricket"],
      moodTags: ["cultural", "culinary", "social"],
      interestCategories: ["food", "culture"],
      pace: "slow",
      physicalIntensity: 1,
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
} finally {
  await client.end();
}
