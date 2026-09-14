// Qatar GP 2026 — fix: remove redundant inline "[See live rating...]" Google
// Maps links from single-venue experiences. Found 14 Sep 2026: the previous
// batch fix (fix-qatar-gp-remove-rating-sentences-batch.mjs) correctly
// stripped raw rating/review-count prose, but mistakenly kept the inline
// multi-venue-style live link on experiences that are actually single-venue
// (they already have a real googleMapsRating/googleMapsReviewCount/
// googleMapsUrl set, rendered at the top of the experience page — see
// experience-researcher skill §2c rule 4). The inline link pattern is
// reserved for genuinely multi-venue experiences only, where no single
// top-of-page rating exists to show. Same class of fix already applied to
// qatar-gp-west-bay-hotel-mtymvrc6.
//
// Confirmed single-venue (has top-level googleMapsRating) — link removed:
// - qatar-gp-khor-al-adaid-mtyn3hq9 (4.9/475)
// - qatar-gp-museum-islamic-art-mtyn1cdh (4.7/16,929)
// - qatar-gp-national-museum-qatar-mtyn2dn1 (4.7/21,752)
// - qatar-gp-parisa-atmosphere-dining-mtyn04fd (4.3/2,358)
// - qatar-gp-sawa-by-sanad-mtymykut (4.6/299)
// - qatar-gp-souq-waqif-mtyn629z (4.7/34,013)
//
// Confirmed genuinely multi-venue (top-level fields null) — untouched:
// - qatar-gp-pearl-katara-mtyn4luu (Pearl + Katara, 2 distinct venues)
// - qatar-gp-qatari-cuisine-souq-mtymxb0w (Shay Al Shomous + Al Aker Sweets)

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const NOTE_SUFFIX =
  " 14 Sep 2026 (follow-up): removed the inline '[See live rating...]' Google Maps link from bodyContent — this is a single-venue experience with its own googleMapsRating/googleMapsReviewCount/googleMapsUrl already rendered at the top of the page, so the multi-venue inline-link pattern (skill §2c) doesn't apply here. Caught by founder on qatar-gp-sawa-by-sanad; swept the same batch for the same mistake.";

const fixes = [
  {
    slug: "qatar-gp-khor-al-adaid-mtyn3hq9",
    bodyContent: `Khor Al Adaid, the Inland Sea, sits roughly 80km southeast of Doha, at the point where the Arabian Gulf pushes directly into the desert — one of very few places on the planet where open sea and sand dunes meet with no coastline between them. It's a UNESCO-recognized natural reserve with a genuine ecosystem of its own, not just a scenic sand-and-water photo stop.

Getting there is most of the experience. Guided tours run 4-8 hours door-to-door with hotel pickup from Doha, covering dune bashing in a 4x4 across the rolling desert terrain before reaching the Inland Sea itself, where operators typically add camel rides, sandboarding, or ATV/quad biking, then a stop at a desert camp for tea, coffee, or a full meal depending on the tour length. Shared group tours run roughly $40-80 per person; private tours land higher, generally $150-300.

365 Adventures is one of the better-reviewed operators running these trips. November through March is the best window to visit, both for milder temperatures during the drive and dune activities, and for late-afternoon light at the Inland Sea itself, which regularly produces the best photography of the trip — timing that lines up well with a late-November race weekend.`,
  },
  {
    slug: "qatar-gp-museum-islamic-art-mtyn1cdh",
    bodyContent: `Pritzker Prize-winning architect I.M. Pei designed the Museum of Islamic Art on a purpose-built artificial island, 195 feet off Doha's mainland and connected by three bridges — a deliberate choice, made specifically so no future development could ever crowd the building. Pei was in his eighties when he took the commission, reportedly travelling across the Islamic world researching historic architecture before settling on his design, and drew the museum's stepped, block-form silhouette from a 13th-century ablution fountain in Cairo's Mosque of Ahmad Ibn Tulun — sharp geometric forms shaped by sunlight and shadow, the same visual language running through the whole building.

Inside, a five-storey domed atrium anchors the museum, with galleries wrapping around it across four floors and 18 rooms. The collection spans 14 centuries of Islamic art and artefacts sourced from across the Islamic world, one of the most significant collections of its kind assembled anywhere. The building itself, clad in pale limestone, is widely credited as the template that later inspired the wave of major architect-designed museums across the Gulf region — this was the original, not a follow-on.

Admission is free for Qatar residents and under-16 visitors; adult non-residents pay QAR 50, students QAR 25 — genuinely inexpensive for what the collection and building deliver. Hours run Saturday to Tuesday 9am-7pm, Thursday 9am-9pm, Friday 1:30pm-7pm, closed Wednesdays. Plan for at least two hours inside; most visitors happily spend two to three.

MIA Park surrounds the building with shaded paths and a waterfront breeze, worth a walk before or after the galleries, and Flag Plaza sits nearby for anyone wanting to extend the visit outdoors.`,
  },
  {
    slug: "qatar-gp-national-museum-qatar-mtyn2dn1",
    bodyContent: `French architect Jean Nouvel designed the National Museum of Qatar around a single natural form: the desert rose, a crystalline mineral cluster that forms in arid ground like Qatar's own desert. The building translates that shape into architecture at genuine scale — a series of enormous, interlocking disks curving inward across a 350-metre structure, unlike anything else on Doha's skyline. Completed in 2019, the museum was built directly around the preserved centerpiece of Sheikh Abdullah bin Jassim Al Thani's original palace, folding a real piece of Qatari royal history into the new building rather than displacing it.

Inside, the galleries trace Qatar's own story — geology and natural history through to the pearling economy, oil discovery, and the country's rapid modern development — told through immersive, technology-forward exhibits rather than static cases. A 220-seat auditorium and a range of dining options sit within the building, and a landscaped park surrounding it is planted specifically with Qatar's indigenous flora, tying the grounds back to the same desert landscape that inspired Nouvel's design.

Hours run generously: Saturday to Thursday 8am-10pm, Friday 1pm-10pm — genuinely late by museum standards, useful for anyone whose days are built around race sessions. Admission is free for Qatar residents, QAR 25 for students, QAR 50 for adult non-residents.`,
  },
  {
    slug: "qatar-gp-parisa-atmosphere-dining-mtyn04fd",
    bodyContent: `Parisa sits on Al Souq Street in the heart of Souq Waqif, and its interior alone is worth the trip regardless of what you order. The two-floor dining room is covered almost entirely in intricate mosaic work, hung with ornate chandeliers, and dotted with alcove tables framed by hand-painted murals depicting ancient Persian legends. Thousands of tiny mirrors, hand-selected from Iran, were assembled into the space over three and a half years of construction — this isn't themed decor bought off a catalog, it's a genuine, deliberate build.

The kitchen serves traditional Persian food: kebabs, fragrant rice dishes, and slow-cooked stews built around the same regional flavors the decor evokes. It's not fusion or a modernized reinterpretation — the food plays it straight, letting the room carry the spectacle.

Reservations are genuinely recommended, especially on weekends and during peak evening hours — this is one of Souq Waqif's most in-demand tables, not a walk-in backup option.`,
  },
  {
    slug: "qatar-gp-sawa-by-sanad-mtymykut",
    bodyContent: `Sawa by Sanad sits on the first floor of a private members' club on Mohammed Bin Jassim Street in Msheireb Downtown, Doha's rejuvenated city center — and despite the members' club setting, it's open to anyone, no membership required to eat there.

Executive Chef Anas Tabbara runs a modern Levantine menu built around sharing: Palestinian lamb maqlouba, chicken za'atar, and more experimental dishes like madrouba balls sit alongside classics, all designed to land in the middle of the table rather than as individual plates. The kitchen steps up its theatre at dinner — several dishes arrive tableside via trolley service, a deliberate flourish that separates the evening menu from a standard lunch sitting. Tabbara's Lebanese heritage runs through the cooking, filtered through techniques that push the dishes past straightforward tradition without losing what makes them recognizably Levantine.

The restaurant earned a place in the Michelin Guide – Doha 2025, real external validation in a city whose fine-dining scene is still relatively young.`,
  },
  {
    slug: "qatar-gp-souq-waqif-mtyn629z",
    bodyContent: `Souq Waqif began as a riverbank trading spot, where Doha's early residents gathered along a wadi to buy and sell goods long before the city existed in any modern form — the market's name literally means "the standing market." A fire in 2003 destroyed what remained of the original structure, and rather than replace it with something modern, Qatar rebuilt it deliberately in 19th-century style: whitewashed mud-rendered walls, roofs of wood and bamboo bound with clay and straw, thick mason construction throughout. It's a modern building with heritage as its actual design brief, not a preserved original — worth knowing before assuming everything here is centuries old.

The market runs a genuine maze of alleys given over to spices, textiles, traditional clothing, souvenirs, and shisha cafés, but its most distinctive section is the Falcon Souq, tucked between Al Asmakh and Al Ahmed streets, where falconry equipment and the birds themselves are bought, sold, and traded. Falconry runs deep in Gulf culture, treated here as genuine heritage sport rather than a tourist novelty, and the Falcon Hospital on site — open since 2008, reportedly the world's only dedicated falcon hospital — treats up to 150 birds a day during its September-to-January peak season, which lines up almost exactly with race weekend.

The souq comes alive specifically at night: cooler temperatures, lit alleyways, and a genuinely different energy than the same streets carry during the day.`,
  },
];

for (const fix of fixes) {
  const [existing] = await db
    .select({ editorialNote: experiences.editorialNote })
    .from(experiences)
    .where(eq(experiences.slug, fix.slug));

  const result = await db
    .update(experiences)
    .set({
      bodyContent: fix.bodyContent,
      editorialNote: (existing?.editorialNote || "") + NOTE_SUFFIX,
      updatedAt: new Date(),
    })
    .where(eq(experiences.slug, fix.slug))
    .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

  console.log("Updated:", result);
}

process.exit(0);
