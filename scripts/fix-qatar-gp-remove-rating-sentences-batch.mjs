// Qatar GP 2026 — batch fix: remove raw star-rating/review-count sentences
// from bodyContent and whyItsSpecial across 8 in_review experiences.
// Standing rule (feedback_no_rating_review_count_in_body_or_why.md, 14 Sep
// 2026, now also codified as a MANDATORY gate in experience-researcher
// skill §2c): never state a star rating or review count as prose in body
// or why_its_special — those numbers live only in the dedicated
// googleMapsRating/googleMapsReviewCount fields (single-venue) or the live
// "[See live rating and reviews on Google Maps]" link (multi-venue, §2c).
// The live links themselves are kept everywhere they already existed —
// only the raw number sentences are removed/rewritten.
//
// Affected experiences (all in_review):
// - qatar-gp-khor-al-adaid-mtyn3hq9 (single distinct rated operator, mid-paragraph)
// - qatar-gp-museum-islamic-art-mtyn1cdh (single-venue, mid-paragraph)
// - qatar-gp-national-museum-qatar-mtyn2dn1 (single-venue, mid-paragraph)
// - qatar-gp-parisa-atmosphere-dining-mtyn04fd (single-venue, own paragraph)
// - qatar-gp-pearl-katara-mtyn4luu (multi-venue: 2 body mentions + 1 in why)
// - qatar-gp-qatari-cuisine-souq-mtymxb0w (multi-venue: 2 body mentions)
// - qatar-gp-sawa-by-sanad-mtymykut (single-venue, own paragraph)
// - qatar-gp-souq-waqif-mtyn629z (single-venue, own paragraph)

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const NOTE_SUFFIX =
  " 14 Sep 2026: removed raw star-rating/review-count sentence(s) from bodyContent/whyItsSpecial per founder instruction — standing rule, now codified in experience-researcher skill §2c (see feedback_no_rating_review_count_in_body_or_why.md). Live Google Maps rating link(s) kept in place.";

const fixes = [
  {
    slug: "qatar-gp-khor-al-adaid-mtyn3hq9",
    bodyContent: `Khor Al Adaid, the Inland Sea, sits roughly 80km southeast of Doha, at the point where the Arabian Gulf pushes directly into the desert — one of very few places on the planet where open sea and sand dunes meet with no coastline between them. It's a UNESCO-recognized natural reserve with a genuine ecosystem of its own, not just a scenic sand-and-water photo stop.

Getting there is most of the experience. Guided tours run 4-8 hours door-to-door with hotel pickup from Doha, covering dune bashing in a 4x4 across the rolling desert terrain before reaching the Inland Sea itself, where operators typically add camel rides, sandboarding, or ATV/quad biking, then a stop at a desert camp for tea, coffee, or a full meal depending on the tour length. Shared group tours run roughly $40-80 per person; private tours land higher, generally $150-300.

365 Adventures is one of the better-reviewed operators running these trips. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8962723100588617245&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) November through March is the best window to visit, both for milder temperatures during the drive and dune activities, and for late-afternoon light at the Inland Sea itself, which regularly produces the best photography of the trip — timing that lines up well with a late-November race weekend.`,
    whyItsSpecial: null,
  },
  {
    slug: "qatar-gp-museum-islamic-art-mtyn1cdh",
    bodyContent: `Pritzker Prize-winning architect I.M. Pei designed the Museum of Islamic Art on a purpose-built artificial island, 195 feet off Doha's mainland and connected by three bridges — a deliberate choice, made specifically so no future development could ever crowd the building. Pei was in his eighties when he took the commission, reportedly travelling across the Islamic world researching historic architecture before settling on his design, and drew the museum's stepped, block-form silhouette from a 13th-century ablution fountain in Cairo's Mosque of Ahmad Ibn Tulun — sharp geometric forms shaped by sunlight and shadow, the same visual language running through the whole building.

Inside, a five-storey domed atrium anchors the museum, with galleries wrapping around it across four floors and 18 rooms. The collection spans 14 centuries of Islamic art and artefacts sourced from across the Islamic world, one of the most significant collections of its kind assembled anywhere. The building itself, clad in pale limestone, is widely credited as the template that later inspired the wave of major architect-designed museums across the Gulf region — this was the original, not a follow-on.

Admission is free for Qatar residents and under-16 visitors; adult non-residents pay QAR 50, students QAR 25 — genuinely inexpensive for what the collection and building deliver. Hours run Saturday to Tuesday 9am-7pm, Thursday 9am-9pm, Friday 1:30pm-7pm, closed Wednesdays. Plan for at least two hours inside; most visitors happily spend two to three. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8477200242049734269&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

MIA Park surrounds the building with shaded paths and a waterfront breeze, worth a walk before or after the galleries, and Flag Plaza sits nearby for anyone wanting to extend the visit outdoors.`,
    whyItsSpecial: null,
  },
  {
    slug: "qatar-gp-national-museum-qatar-mtyn2dn1",
    bodyContent: `French architect Jean Nouvel designed the National Museum of Qatar around a single natural form: the desert rose, a crystalline mineral cluster that forms in arid ground like Qatar's own desert. The building translates that shape into architecture at genuine scale — a series of enormous, interlocking disks curving inward across a 350-metre structure, unlike anything else on Doha's skyline. Completed in 2019, the museum was built directly around the preserved centerpiece of Sheikh Abdullah bin Jassim Al Thani's original palace, folding a real piece of Qatari royal history into the new building rather than displacing it.

Inside, the galleries trace Qatar's own story — geology and natural history through to the pearling economy, oil discovery, and the country's rapid modern development — told through immersive, technology-forward exhibits rather than static cases. A 220-seat auditorium and a range of dining options sit within the building, and a landscaped park surrounding it is planted specifically with Qatar's indigenous flora, tying the grounds back to the same desert landscape that inspired Nouvel's design.

Hours run generously: Saturday to Thursday 8am-10pm, Friday 1pm-10pm — genuinely late by museum standards, useful for anyone whose days are built around race sessions. Admission is free for Qatar residents, QAR 25 for students, QAR 50 for adult non-residents. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14340941977510748870&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`,
    whyItsSpecial: null,
  },
  {
    slug: "qatar-gp-parisa-atmosphere-dining-mtyn04fd",
    bodyContent: `Parisa sits on Al Souq Street in the heart of Souq Waqif, and its interior alone is worth the trip regardless of what you order. The two-floor dining room is covered almost entirely in intricate mosaic work, hung with ornate chandeliers, and dotted with alcove tables framed by hand-painted murals depicting ancient Persian legends. Thousands of tiny mirrors, hand-selected from Iran, were assembled into the space over three and a half years of construction — this isn't themed decor bought off a catalog, it's a genuine, deliberate build.

The kitchen serves traditional Persian food: kebabs, fragrant rice dishes, and slow-cooked stews built around the same regional flavors the decor evokes. It's not fusion or a modernized reinterpretation — the food plays it straight, letting the room carry the spectacle.

[See live rating and reviews on Google Maps](https://maps.google.com/?cid=15438691681693687908&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) Reservations are genuinely recommended, especially on weekends and during peak evening hours — this is one of Souq Waqif's most in-demand tables, not a walk-in backup option.`,
    whyItsSpecial: null,
  },
  {
    slug: "qatar-gp-pearl-katara-mtyn4luu",
    bodyContent: `The Pearl-Qatar and Katara Cultural Village sit close enough together, both near West Bay, to make a natural evening pairing — one built for waterfront strolling and dining, the other for art and culture.

The Pearl is a man-made island, and Porto Arabia is its premium marina district: a 2.5km perimeter promenade lined with shops, restaurants, and cafés, with a covered, air-conditioned section for the hottest stretches of the year. It's genuinely at its best in the evening — lights come on along the marina, white yachts reflect in the water, and the whole promenade shifts from a daytime shopping walk into something closer to a proper waterfront night out. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=1994642396813798790&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Katara Cultural Village is a dedicated arts and culture district nearby, built around an open-air amphitheater, galleries, mosques architecturally significant in their own right, and a genuine restaurant scene. It's less about shopping and more about atmosphere and programming — exhibitions, performances, and public art fill the district in a way The Pearl's marina doesn't attempt. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=1269242859052149405&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Both sit near West Bay and Lusail, making a single evening covering both entirely realistic without a long drive between them.`,
    whyItsSpecial: `These two districts give you Doha's evening life from two different angles in one trip: The Pearl for the polish and spectacle of a purpose-built luxury marina, Katara for the substance of a genuine arts district with public programming that changes what's on offer depending on when you visit. Neither is a single sight to check off — both reward simply walking and being there as the sun goes down.

Katara in particular has become central to how both residents and visitors actually spend their evenings in Doha, not just a tourist-facing attraction built for visitors passing through.`,
  },
  {
    slug: "qatar-gp-qatari-cuisine-souq-mtymxb0w",
    bodyContent: `Souq Waqif holds two genuinely distinct food stops worth seeking out beyond the general dining crawl — one built around a real story, the other a decades-old institution.

Shay Al Shomous sits in one corner of the souq, owned and actively run by Shams Al Qassabi, a Qatari mother of five who built the restaurant around traditional home cooking. The menu runs authentic Qatari breakfast and daytime dishes: baid shakshoka (scrambled eggs), aseeda (a local wheat or corn porridge), khobiz regag (thin crepe-style bread, best ordered with honey and cheese per repeat reviewer praise), macboush (rice with chicken, lamb, or goat, marinated in tomato paste and crisped in a hot oven), and balaleet, a sweet vermicelli-and-egg breakfast dish flavored with turmeric and sugar. It's also a genuine symbol of women's financial independence in Qatar — Sheikha Moza herself visited the restaurant and its owner in 2014, a real stamp of national recognition. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=2672075516113976573&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

Al Aker Sweets, in the heart of the souq, is the city's benchmark for Arabic sweets — over 10 branches across Qatar, but this is the original, high-energy flagship location. The signature is cheese kunafa: crisp, thin pastry over a rich, stretchy cheese filling, alongside Umm Ali (a Middle Eastern bread pudding) and a range of Turkish sweets. Prices are genuinely modest and portions large enough to split. It ranks in the top third of over 1,500 restaurants across Doha on TripAdvisor. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14867311994093836247&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`,
    whyItsSpecial: null,
  },
  {
    slug: "qatar-gp-sawa-by-sanad-mtymykut",
    bodyContent: `Sawa by Sanad sits on the first floor of a private members' club on Mohammed Bin Jassim Street in Msheireb Downtown, Doha's rejuvenated city center — and despite the members' club setting, it's open to anyone, no membership required to eat there.

Executive Chef Anas Tabbara runs a modern Levantine menu built around sharing: Palestinian lamb maqlouba, chicken za'atar, and more experimental dishes like madrouba balls sit alongside classics, all designed to land in the middle of the table rather than as individual plates. The kitchen steps up its theatre at dinner — several dishes arrive tableside via trolley service, a deliberate flourish that separates the evening menu from a standard lunch sitting. Tabbara's Lebanese heritage runs through the cooking, filtered through techniques that push the dishes past straightforward tradition without losing what makes them recognizably Levantine.

The restaurant earned a place in the Michelin Guide – Doha 2025, real external validation in a city whose fine-dining scene is still relatively young. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13287209959574773534&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`,
    whyItsSpecial: null,
  },
  {
    slug: "qatar-gp-souq-waqif-mtyn629z",
    bodyContent: `Souq Waqif began as a riverbank trading spot, where Doha's early residents gathered along a wadi to buy and sell goods long before the city existed in any modern form — the market's name literally means "the standing market." A fire in 2003 destroyed what remained of the original structure, and rather than replace it with something modern, Qatar rebuilt it deliberately in 19th-century style: whitewashed mud-rendered walls, roofs of wood and bamboo bound with clay and straw, thick mason construction throughout. It's a modern building with heritage as its actual design brief, not a preserved original — worth knowing before assuming everything here is centuries old.

The market runs a genuine maze of alleys given over to spices, textiles, traditional clothing, souvenirs, and shisha cafés, but its most distinctive section is the Falcon Souq, tucked between Al Asmakh and Al Ahmed streets, where falconry equipment and the birds themselves are bought, sold, and traded. Falconry runs deep in Gulf culture, treated here as genuine heritage sport rather than a tourist novelty, and the Falcon Hospital on site — open since 2008, reportedly the world's only dedicated falcon hospital — treats up to 150 birds a day during its September-to-January peak season, which lines up almost exactly with race weekend.

The souq comes alive specifically at night: cooler temperatures, lit alleyways, and a genuinely different energy than the same streets carry during the day. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15414791335277025032&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`,
    whyItsSpecial: null,
  },
];

for (const fix of fixes) {
  const setValues = { updatedAt: new Date() };
  if (fix.bodyContent !== null && fix.bodyContent !== undefined) setValues.bodyContent = fix.bodyContent;
  if (fix.whyItsSpecial !== null && fix.whyItsSpecial !== undefined) setValues.whyItsSpecial = fix.whyItsSpecial;

  const [existing] = await db
    .select({ editorialNote: experiences.editorialNote })
    .from(experiences)
    .where(eq(experiences.slug, fix.slug));

  setValues.editorialNote = (existing?.editorialNote || "") + NOTE_SUFFIX;

  const result = await db
    .update(experiences)
    .set(setValues)
    .where(eq(experiences.slug, fix.slug))
    .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

  console.log("Updated:", result);
}

process.exit(0);
