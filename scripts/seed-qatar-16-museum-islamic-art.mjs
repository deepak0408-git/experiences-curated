// Qatar GP 2026 — Experience 16/21: Museum of Islamic Art

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-museum-islamic-art-" + Date.now().toString(36);

const bodyContent = `Pritzker Prize-winning architect I.M. Pei designed the Museum of Islamic Art on a purpose-built artificial island, 195 feet off Doha's mainland and connected by three bridges — a deliberate choice, made specifically so no future development could ever crowd the building. Pei was in his eighties when he took the commission, reportedly travelling across the Islamic world researching historic architecture before settling on his design, and drew the museum's stepped, block-form silhouette from a 13th-century ablution fountain in Cairo's Mosque of Ahmad Ibn Tulun — sharp geometric forms shaped by sunlight and shadow, the same visual language running through the whole building.

Inside, a five-storey domed atrium anchors the museum, with galleries wrapping around it across four floors and 18 rooms. The collection spans 14 centuries of Islamic art and artefacts sourced from across the Islamic world, one of the most significant collections of its kind assembled anywhere. The building itself, clad in pale limestone, is widely credited as the template that later inspired the wave of major architect-designed museums across the Gulf region — this was the original, not a follow-on.

Admission is free for Qatar residents and under-16 visitors; adult non-residents pay QAR 50, students QAR 25 — genuinely inexpensive for what the collection and building deliver. Hours run Saturday to Tuesday 9am-7pm, Thursday 9am-9pm, Friday 1:30pm-7pm, closed Wednesdays. Plan for at least two hours inside; most visitors happily spend two to three. Google rates it 4.7 from 16,929 reviews — an enormous, decisively strong sample. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8477200242049734269&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)

MIA Park surrounds the building with shaded paths and a waterfront breeze, worth a walk before or after the galleries, and Flag Plaza sits nearby for anyone wanting to extend the visit outdoors.`;

const whyItsSpecial = `Most fans arrive in Doha assuming the city's architectural highlights are all recent and commercial — towers, malls, stadiums. The Museum of Islamic Art is the counterpoint: a genuinely significant piece of late-career work from one of the 20th century's most important architects, built with the explicit intent of standing apart from everything commercial around it, permanently protected from encroachment by its own island siting.

It's also worth knowing this building predates the now-familiar pattern of Gulf capitals commissioning major Western architects for signature museums — MIA is widely credited as the project that set that template running, rather than one more entry in a trend that already existed when it opened. Visiting it isn't just seeing a good museum; it's seeing where a whole regional architectural movement effectively started.`;

const insiderTips = [
  "Thursday's extended hours (9am-9pm) are the best window for a race-weekend visit if your days are otherwise packed with circuit sessions — most other days close by 7pm or run a shortened Friday schedule.",
  "Walk MIA Park before or after the galleries rather than heading straight to a taxi — the waterfront path and skyline views are part of what makes Pei's island siting work, and skipping it misses half the design intent.",
];

const whatToAvoid = "Don't plan a rushed one-hour visit — the museum itself recommends at least two hours, and most visitors spend closer to three; budgeting less means either skipping galleries or moving through them too fast to actually take in Pei's design. Don't visit on a Wednesday — the museum is closed that day, easy to overlook if you're planning around race-weekend logistics rather than checking the actual weekly schedule.";

const practicalInfo = {
  hours: "Sat-Tue 9am-7pm, Thu 9am-9pm, Fri 1:30pm-7pm, closed Wednesdays",
  costRange: "QAR 50 adult non-resident, QAR 25 student, free for residents and under-16",
  bookingMethod: "Walk-in, no advance booking required for general admission.",
  website: "https://mia.org.qa/",
  howToBook: "",
};

const gettingThere = "On its own island off Doha's central waterfront, roughly 15 minutes from Hamad International Airport by car. Nearest metro: Qatar National Museum station, Gold Line — roughly 30 minutes by car or taxi from Lusail International Circuit.";

const [inserted] = await db.insert(experiences).values({
  title: "Museum of Islamic Art",
  subtitle: "I.M. Pei's final major work, on its own island to protect it from the city",
  slug,
  experienceType: "cultural_site",
  status: "in_review",
  destinationId: DOHA_ID,
  bodyContent,
  whyItsSpecial,
  practicalInfo,
  gettingThere,
  insiderTips,
  whatToAvoid,
  sport: ["formula_one"],
  budgetTier: "budget",
  curationTier: "editorial",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
  googleMapsRating: "4.7",
  googleMapsReviewCount: 16929,
  googleMapsUrl: "https://maps.google.com/?cid=8477200242049734269&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  editorialNote: "Sources: mia.org.qa (official hours/admission), archeyes.com, dezeen.com, aljazeera.com (Pei design history, island siting rationale). Google Places API lookup 12 Sep 2026: 4.7/16,929 reviews.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();
