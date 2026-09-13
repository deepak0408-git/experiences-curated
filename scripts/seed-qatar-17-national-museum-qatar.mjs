// Qatar GP 2026 — Experience 17/21: National Museum of Qatar

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DOHA_ID = "4e53af71-7526-4d55-bf81-5d57d6f22136";
const QATAR_GP_EVENT_ID = "8ab4460a-122e-4c1b-bcfe-81f93359c899";
const slug = "qatar-gp-national-museum-qatar-" + Date.now().toString(36);

const bodyContent = `French architect Jean Nouvel designed the National Museum of Qatar around a single natural form: the desert rose, a crystalline mineral cluster that forms in arid ground like Qatar's own desert. The building translates that shape into architecture at genuine scale — a series of enormous, interlocking disks curving inward across a 350-metre structure, unlike anything else on Doha's skyline. Completed in 2019, the museum was built directly around the preserved centerpiece of Sheikh Abdullah bin Jassim Al Thani's original palace, folding a real piece of Qatari royal history into the new building rather than displacing it.

Inside, the galleries trace Qatar's own story — geology and natural history through to the pearling economy, oil discovery, and the country's rapid modern development — told through immersive, technology-forward exhibits rather than static cases. A 220-seat auditorium and a range of dining options sit within the building, and a landscaped park surrounding it is planted specifically with Qatar's indigenous flora, tying the grounds back to the same desert landscape that inspired Nouvel's design.

Hours run generously: Saturday to Thursday 8am-10pm, Friday 1pm-10pm — genuinely late by museum standards, useful for anyone whose days are built around race sessions. Admission is free for Qatar residents, QAR 25 for students, QAR 50 for adult non-residents. The rating reflects the scale of what's inside: 4.7 on Google from 21,752 reviews, one of the largest, most decisively positive samples of any attraction in the city. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=14340941977510748870&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA)`;

const whyItsSpecial = `Where the Museum of Islamic Art tells a story about the broader Islamic world, the National Museum of Qatar tells Qatar's own story specifically — and the building itself is part of that narrative, physically wrapped around a real royal palace rather than built on a cleared site. Nouvel's desert rose form isn't decorative flourish; it's a direct architectural translation of the same desert that shaped the country's history, which the museum's actual exhibits then walk you through room by room.

For anyone visiting Doha for a single race weekend and choosing between the city's two major museums, this is the one that answers "what is Qatar, actually" rather than "what has Qatar collected" — a genuinely different, complementary kind of visit to the Museum of Islamic Art, not a redundant one.`;

const insiderTips = [
  "The late closing hours (10pm most days) make this the easier of Doha's two major museums to fit around a full day at the circuit — arrive in the evening after sessions wrap rather than trying to squeeze it into a packed daytime schedule.",
  "The museum was built directly around the preserved original Al Thani palace — look for where the historic structure is visible within the new building, a detail easy to miss if you're moving quickly through the galleries.",
];

const whatToAvoid = "Don't treat this as interchangeable with the Museum of Islamic Art if you only have time for one — MIA covers 14 centuries of Islamic art broadly, while this museum is specifically Qatar's own national story, a genuinely different visit. Don't skip the surrounding park assuming it's just landscaping — it's planted specifically with Qatar's indigenous plants and ties directly into the museum's own narrative about the desert environment.";

const practicalInfo = {
  hours: "Sat-Thu 8am-10pm, Fri 1pm-10pm",
  costRange: "QAR 50 adult non-resident, QAR 25 student, free for residents",
  bookingMethod: "Walk-in, though advance online booking is available and recommended for peak periods.",
  website: "https://nmoq.org.qa/",
  howToBook: "",
};

const gettingThere = "Central Doha, near the Corniche — nearest metro is Qatar National Museum station, Gold Line. Roughly 30 minutes by car or taxi from Lusail International Circuit.";

const [inserted] = await db.insert(experiences).values({
  title: "National Museum of Qatar",
  subtitle: "Jean Nouvel's desert rose, built around a real royal palace",
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
  googleMapsReviewCount: 21752,
  googleMapsUrl: "https://maps.google.com/?cid=14340941977510748870&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  editorialNote: "Sources: nmoq.org.qa (official hours/admission), timeoutdoha.com, architizer.com, re-thinkingthefuture.com (Nouvel design, desert rose concept, Al Thani palace integration). Google Places API lookup 12 Sep 2026: 4.7/21,752 reviews.",
}).returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

await db.insert(sportingEventExperiences)
  .values({ experienceId: inserted.id, sportingEventId: QATAR_GP_EVENT_ID })
  .onConflictDoNothing();

console.log("Seeded:", inserted);

await client.end();
