import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

// Adds real inline Google Maps rating links to 5 genuinely multi-venue
// Italian GP experiences that had none: Eating in Milan (2 restaurants),
// Aperitivo Before the Race (3 bars), Eating in Monza (4 restaurants —
// re-scoped from single-venue after discovering its body names 4 separate
// restaurants, not just the one at the row's address), Monza Town & the
// Royal Villa (4 sights), and Lake Como (3 named hotels). All ratings and
// Google Maps short links supplied directly by the founder, 19 Sep 2026, per
// feedback_multi_venue_ratings_registry_mandatory.md — this pass also adds
// each to MULTI_VENUE_RATINGS in app/experience/[slug]/page.tsx in the same
// session. google_maps_rating/review_count/url on each row stay null
// (correct for multi-venue — a stray single value would override the
// jump-link).
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const UPDATES = [
  {
    slug: "eating-in-milan-serious-italians-mrbxw8xs",
    bodyContent: `Milan's food scene splits cleanly into two registers, and both are worth knowing about for race weekend. One is the trattoria that hasn't changed its menu philosophy in a century. The other is a chef who's rebuilt Italian fine dining inside a nineteenth-century shopping arcade.

Trattoria Masuelli San Marco has been run by the same family since 1921 and is now in its fourth generation. It sits on Viale Umbria in Porta Romana, a few tram stops from the centre, and the room still has the chandeliers and framed memorabilia you'd expect from somewhere that's been feeding the same neighbourhood for a hundred years. The dish to order is risotto allo zafferano with ossobuco, saffron risotto under a braised veal shank with the marrow still in the bone, plus the classics: cotoletta alla milanese, vitello tonnato, polpette. Expect to spend €46-65 a head. It's closed Sunday and Monday, and Tuesday is dinner only, so plan around that if you're trying to fit it into a race weekend. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/eFad1dsC6ovUrdbF8).

Cracco in Galleria sits at the opposite end of the spectrum. Carlo Cracco's restaurant occupies four floors inside the Galleria Vittorio Emanuele II, Milan's grand nineteenth-century arcade next to the Duomo, and holds a Michelin star. Tasting menus have run around €200 per person in past seasons, and the dining room itself, glass roof, marble floors, the arcade's foot traffic passing just outside, is as much the draw as the food. There's also a ground-floor café attached that's open all day and doesn't take bookings, which is a genuinely useful fallback if the restaurant proper is full or you just want a coffee and don't need the full tasting menu experience. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/qAboA6dxxTsHGP6Z8).

Both are close enough to central Milan hotels to fit into an evening around race weekend without a long trip back. Masuelli works well after a long day at the circuit when you want something that feels like a home-cooked meal scaled up for a dining room. Cracco works better as the one big meal of the trip, the kind you book ahead for rather than walk into.`,
    editorialNote: "Sources per original seed. Real Google Maps rating links added 19 Sep 2026, per feedback_multi_venue_ratings_registry_mandatory.md: Trattoria Masuelli San Marco 4.3/1417 reviews, Cracco in Galleria 4.7/115811 reviews — both maps.app.goo.gl short links supplied directly by the founder, 19 Sep 2026. Multi-venue experience — inline Google Maps links per venue per skill §2c, no single top-level rating field set; MULTI_VENUE_RATINGS entry (venueCount: 2, venueNoun: \"restaurants\") added to app/experience/[slug]/page.tsx in the same pass.",
  },
  {
    slug: "aperitivo-before-the-race-milan-ritual-mrc3qv4h",
    bodyContent: `Gaspare Campari opened his first Milan bar in the 1860s, making his own bitters and cordials in the basement, and by the time his son Davide moved the business into the Galleria Vittorio Emanuele II, the aperitivo as Milan understands it, a bitter drink meant to open your appetite before dinner, not replace it, was already taking shape. That history is still walkable. Camparino in Galleria sits on Piazza Duomo, in the same arcade where Gaspare set up shop, open daily from 8am with a proper Negroni menu and a direct line to where the whole tradition started. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/Kp6VL4KTzrQZt2pCA).

Two neighbourhoods do this differently. Navigli, the canal district in the southwest of the city, is the loud version: Thursday and Friday evenings, the banks fill with people drinking at bar terraces along the water. Brera is the quieter, more polished version, better suited to a conversation before a late trattoria dinner than a crowd scene. N'Ombra de Vin fits that mould exactly, a wine bar in a former 16th-century Augustinian refectory that's been running since 1973, with a cellar holding over 2,500 bottles. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/cR6jk2UdbjoJhCpr5).

If cost matters more than atmosphere, Fonderie Milanesi runs an industrial-chic former foundry with a genuinely generous complimentary spread, charcuterie, cheese, bruschetta, pasta salads, alongside the drinks, at the cheapest end of the three. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/vAsyhhzVdwXKADAw8).

One thing worth knowing before you go: Milan invented apericena in the 1990s, aperitivo plus dinner, an all-you-can-eat buffet built around your drink order. It sounds like good value and at €8-12 a head it usually is, but the food is mass-produced and sits out for hours, and most people who take their aperitivo seriously in Milan now treat it as something to avoid rather than seek out. The better version of the ritual is a proper drink with a curated plate of something small on the side, not a buffet designed to fill you up.

Timing matters too. Most Milanese go out for aperitivo between 6 and 8pm, an hour or so before whatever comes next, which lines up well with a pre-race evening or a wind-down after a day at the circuit.`,
    editorialNote: "Sources per original seed. Real Google Maps rating links added 19 Sep 2026, per feedback_multi_venue_ratings_registry_mandatory.md: Camparino in Galleria 4.4/2788 reviews, N'Ombra de Vin 4.0/2177 reviews, Fonderie Milanesi 4.0/3353 reviews — all maps.app.goo.gl short links supplied directly by the founder, 19 Sep 2026. Multi-venue experience — inline Google Maps links per venue per skill §2c, no single top-level rating field set; MULTI_VENUE_RATINGS entry (venueCount: 3, venueNoun: \"bars\") added to app/experience/[slug]/page.tsx in the same pass.",
  },
  {
    slug: "eating-in-monza-risotto-luganega-mqzei8if",
    bodyContent: `Monza sits in Brianza — the strip of Lombardy between Milan and the lakes — and the local food reflects that position exactly. Not as polished as Milan, not as tourist-facing as the lakes. The cooking here is direct: good ingredients, traditional technique, no fuss. You'll eat better than you expect to.

The dish to order is risotto con la luganega. Luganega is the local pork sausage — coarse-ground, intensely flavoured, with none of the sweetness of supermarket sausage. Combined with saffron risotto and finished properly (mantecato, not dry), it's one of the definitive plates of northern Italy. Il Feudo dei Sapori on Via Antonio Gramsci does a version with saffron rice and Parmesan wafer that gets consistently praised; they also run ossobuco with saffron rice, busecca (tripe soup, a Lombard staple), and taroz — a Brianza potato and green bean casserole that sounds humble and tastes better than it sounds. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/t5Dmis1cfjj61AxS7).

La Cucina di Via Zucchi (Via Bartolomeo Zucchi 10) has been running since 1968 and is the local reference point for territorial cuisine. The focus is on seasonal risotti, slow-cooked mains, and artisanal pinse. Business lunch changes daily and runs seven days a week — which matters on a race weekend when half of Monza closes. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/Xp6vScfvi84gVtiw9).

Trattoria Mercato at Vicolo Spalto Isolino 2 stays open until midnight. For post-qualifying dinner when you're back from the circuit later than planned, it's the practical choice. Not the most refined room in Monza but one of the most reliable. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/KJWYgxaxFM4THDem9).

Derby Grill at Hotel de la Ville is the serious option — Brianza-inspired tasting menus, three Michelin forks, locally sourced. Book a table even if you're not staying at the hotel. Just remember it's closed Sunday and Monday. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/eKtd9oJfZ9oUS3ou6).`,
    address: "Il Feudo dei Sapori, Via Antonio Gramsci 17, 20900 Monza MB, Italy; La Cucina di Via Zucchi, Via Bartolomeo Zucchi 10, 20900 Monza MB, Italy; Trattoria Mercato, Vicolo Spalto Isolino 2, 20900 Monza MB, Italy; Derby Grill, Viale Regina Margherita di Savoia 15, 20900 Monza MB, Italy",
    editorialNote: "Sources per original seed. Re-scoped 19 Sep 2026 from single-venue to multi-venue — body names 4 distinct restaurants, not just Il Feudo dei Sapori at the row's original single address; address field corrected to list all 4. Real Google Maps rating links added, per feedback_multi_venue_ratings_registry_mandatory.md: Il Feudo dei Sapori 4.5/564 reviews, La Cucina di Via Zucchi 4.3/1619 reviews, Trattoria Mercato 4.0/167 reviews, Derby Grill 4.6/684 reviews — all maps.app.goo.gl short links supplied directly by the founder, 19 Sep 2026. Multi-venue experience — inline Google Maps links per venue per skill §2c, no single top-level rating field set; MULTI_VENUE_RATINGS entry (venueCount: 4, venueNoun: \"restaurants\") added to app/experience/[slug]/page.tsx in the same pass.",
  },
  {
    slug: "monza-town-royal-villa-mqzf83fr",
    bodyContent: `Monza's historic centre is ten minutes from the circuit by taxi and feels like a different world. The GP crowd stays inside Parco di Monza. That's their loss.

Start in Piazza Roma. The Arengario — Monza's medieval town hall, black-and-white striped marble — anchors the square. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/yxKR8JKrwzvS2LiT7). From there it's a short walk to the Duomo di San Giovanni Battista, the cathedral Queen Theodelinda founded in the 6th century. The facade is the same striped Lombard Romanesque as the Arengario. Inside: the Cappella di Teodolinda, lined with 15th-century frescoes, and the Iron Crown of Lombardy. This is the object that Charlemagne, Frederick Barbarossa, Charles V, and Napoleon each placed on their heads to claim dominion over Italy. It's kept in a glass case above the altar. The guided tour to see it up close costs €8 and lasts about 30 minutes — book by phone (+39 039 326383) as walk-up availability is limited. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/7SsHqpuPcUx9w9Tu8).

The Museo e Tesoro del Duomo next door (entrance on Via Lambro) holds fourteen centuries of Lombard religious art connected to the Basilica. Combined ticket with the chapel and crown is €14. Open Tuesday–Sunday 09:00–18:00, closed Monday. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/QRKjtgB7gB9XaCAb8).

Villa Reale di Monza sits just north, directly opposite Hotel de la Ville. The Habsburgs commissioned it in 1777 from architect Giuseppe Piermarini — the same architect who designed La Scala in Milan. The state rooms on the first noble floor still have their original neoclassical decorations. Tours run Wednesday–Friday 10:00–16:00, Saturday–Sunday 10:30–18:30. Full ticket €15, reduced €12. Book via villarealemonza.org or call 039 5787160. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/qSpKbJe8gaeW9F1m8).

The Giardini Reali behind the villa — English landscape gardens with ponds, grottos, and a small temple — are free to enter and worth the walk through even if you skip the palace interior.`,
    editorialNote: "Sources per original seed. Real Google Maps rating links added 19 Sep 2026, per feedback_multi_venue_ratings_registry_mandatory.md: Arengario 4.4/3133 reviews, Duomo di San Giovanni Battista 4.7/6318 reviews, Museo e Tesoro del Duomo 4.7/353 reviews, Villa Reale di Monza 4.6/7553 reviews — all maps.app.goo.gl short links supplied directly by the founder, 19 Sep 2026. Multi-venue experience — inline Google Maps links per venue per skill §2c, no single top-level rating field set; MULTI_VENUE_RATINGS entry (venueCount: 4, venueNoun: \"sights\") added to app/experience/[slug]/page.tsx in the same pass.",
  },
  {
    slug: "lake-como-race-weekend-from-the-lake-mrbw7ctf",
    bodyContent: `Some people basing themselves for Monza want the fastest possible commute. Others want a place worth waking up in even on the days they're not at the circuit. Lake Como is for the second group, and it's worth being honest about the trade-off before recommending it: this is not a quick hop to the track.

Varenna is the practical base of the two main options. It has its own train station with a direct Trenord service to Milano Centrale in about 64 minutes, running roughly hourly from 05:35 to 21:35. From there, getting to Monza means either continuing on to Milano Centrale and picking up the separate direct Como–Monza line, or routing via Milan generally, since there's no single direct train from Varenna to Monza itself. Realistically, budget close to two hours door to door on a race day, not the "quick weekend trip" some guides imply.

Bellagio, the more famous of the two towns, doesn't have a train station at all. Getting there means a ferry from Varenna (about 15 minutes, running hourly, first departure 6:45am) or a bus from Como (just over an hour). It's the prettier base of the two, with genuine promenade views and a slower pace, but every day you head to the circuit adds a ferry or bus leg on top of the train.

For where to stay, Varenna keeps things simpler. Hotel Olivedo sits two minutes from the ferry pier in a Liberty-style 1896 building, though it only operates February through October, so check dates if you're eyeing shoulder-season travel. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/5XiwGdMLSFFQKR9dA). Albergo Milano, a few hundred metres away, runs a strong reputation for the price. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/KYn1QHrg6xSvf48QA). In Bellagio, Hotel Belvedere has been run by the same family for five generations and looks straight across the lake and up toward the Alps, which is the actual reason to choose Bellagio over Varenna in the first place. [See live rating and reviews on Google Maps](https://maps.app.goo.gl/CfYEyMj2q7vMKHWa9).

The honest recommendation: this works well for a longer stay where race day is one part of a bigger trip, less well if you're trying to squeeze in three tight circuit days around a day job's worth of commuting.`,
    editorialNote: "Sources per original seed. Real Google Maps rating links added 19 Sep 2026, per feedback_multi_venue_ratings_registry_mandatory.md: Hotel Olivedo 4.0/513 reviews, Albergo Milano 4.5/178 reviews, Hotel Belvedere 4.7/603 reviews — all maps.app.goo.gl short links supplied directly by the founder, 19 Sep 2026. Multi-venue experience — inline Google Maps links per venue per skill §2c, no single top-level rating field set; MULTI_VENUE_RATINGS entry (venueCount: 3, venueNoun: \"hotels\") added to app/experience/[slug]/page.tsx in the same pass.",
  },
];

for (const u of UPDATES) {
  const setValues = { bodyContent: u.bodyContent, editorialNote: u.editorialNote, lastVerifiedDate: "2026-09-19" };
  if (u.address) setValues.address = u.address;

  const [row] = await db
    .update(experiences)
    .set(setValues)
    .where(eq(experiences.slug, u.slug))
    .returning({ title: experiences.title, slug: experiences.slug });
  console.log(row ? `✓ ${row.title} (${row.slug})` : `✗ not found: ${u.slug}`);
}

await client.end();
