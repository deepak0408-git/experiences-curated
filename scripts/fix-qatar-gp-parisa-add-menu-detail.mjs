// Qatar GP 2026 — fix qatar-gp-parisa-atmosphere-dining-mtyn04fd: bodyContent
// was thin on the actual food — one generic line ("kebabs, fragrant rice
// dishes, and slow-cooked stews"). Founder flagged 14 Sep 2026, asked for
// real popular dishes and preparation style.
// Sources (WebSearch, cross-checked across Marhaba Qatar, Tripadvisor,
// Evendo, GreatList, QTTAR — consistent across independent listings):
// Jooje Kebab (saffron-marinated chicken), Koobideh (minced beef kebab),
// lamb chops, Tikeh Masti (yogurt-marinated beef kebab) — charcoal-grilled;
// Khoresht Bademjan (lamb, tomato sauce, fried eggplant); Taj Berah Kebab
// (chef's signature); Kebab Vaziri (mixed lamb/beef/chicken combination);
// rice served in saffron, dill, and steamed white varieties; Faloudeh
// Shirazi (rosewater-syrup noodle dessert) for dessert.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-parisa-atmosphere-dining-mtyn04fd";

const bodyContent = `Parisa sits on Al Souq Street in the heart of Souq Waqif, and its interior alone is worth the trip regardless of what you order. The two-floor dining room is covered almost entirely in intricate mosaic work, hung with ornate chandeliers, and dotted with alcove tables framed by hand-painted murals depicting ancient Persian legends. Thousands of tiny mirrors, hand-selected from Iran, were assembled into the space over three and a half years of construction — this isn't themed decor bought off a catalog, it's a genuine, deliberate build.

The kitchen runs on charcoal-grilled kebabs as its backbone: Jooje Kebab (saffron-marinated chicken), Koobideh (minced beef, seasoned and skewered), lamb chops, and Tikeh Masti (beef marinated in yogurt before grilling) are the regulars, usually ordered as part of Kebab Vaziri, a mixed platter that puts lamb, beef, and chicken on the same tray. Taj Berah Kebab is the kitchen's own signature cut. Every kebab order comes with a choice of saffron rice, dill rice, or plain steamed rice, and the stews lean on Khoresht Bademjan, slow-cooked lamb in tomato sauce with fried eggplant. For dessert, Faloudeh Shirazi, thin frozen noodles in rosewater syrup, is the traditional closer.

It's not fusion or a modernized reinterpretation — the food plays it straight, letting the room carry the spectacle.

Reservations are genuinely recommended, especially on weekends and during peak evening hours — this is one of Souq Waqif's most in-demand tables, not a walk-in backup option.`;

const [existing] = await db
  .select({ editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const result = await db
  .update(experiences)
  .set({
    bodyContent,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: added real menu/preparation detail to bodyContent (Jooje Kebab, Koobideh, Tikeh Masti, Kebab Vaziri, Taj Berah Kebab, Khoresht Bademjan, Faloudeh Shirazi) — was previously a single generic line. Sources: marhaba.qa, tripadvisor.com, evendo.com, greatlist.com, qttar.com, cross-checked for consistency across independent listings.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
