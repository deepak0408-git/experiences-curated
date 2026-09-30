import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import ZoomableImage from "../../_components/ZoomableImage";

const SPOKE_ID = "map";

// Official Suzuka Circuit grounds/facilities map, sourced from
// suzukacircuit.jp, uploaded 23 Sep 2026 (see
// scripts/seed-japanese-gp-circuit-map.mjs). Real dimensions 878x551.
// Rendered via ZoomableImage — same pattern as Italian GP/Qatar GP/
// Australian GP/French Open MapSpokes — so the dense Japanese-language
// legend is actually legible on click.
const CIRCUIT_MAP_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/japanese-grand-prix-circuit-map.jpg";

// Real content sourced from two seeded experiences (japanese-gp-suzuka-
// circuit-park-motopia, japanese-gp-suzuka-city), 22 Sep 2026 — the
// Circuit Challenger fact (driving an EV kart around the actual F1 East
// Course, on non-race days) independently confirmed via suzukacircuit.jp.
//
// 30 Sep 2026: removed the Suzuka City SpokeExperienceCard from this spoke
// — it's already the featured card in ItinerarySpoke's "if you're adding a
// non-race day" section, so it was rendering (and back-linking) in two
// spokes, which breaks the pack's one-card-one-spoke rule (see Brazilian
// GP's MapSpoke comment for the same fix there). Founder then flagged the
// whole "Suzuka City — beyond the circuit gates" section (Nabana no Sato,
// Tsubaki Ōgamiyashiro Shrine, the onsen) as misplaced on the venue/map
// spoke entirely, not just the duplicated card — removed the section
// outright; that content already lives properly in ItinerarySpoke.
//
// Same pass: added a circuit description directly below the map image
// (matching Brazilian/Mexico City GP's MapSpoke pattern, which this spoke
// was missing entirely) and an "On-site facilities" section (also missing
// entirely). Facts researched directly, not fabricated: figure-8 East/West
// course layout and 1962 opening — suzukacircuit.jp course page; cashless
// payment coexisting with cash, toilets with baby-care rooms, age
// restrictions (3+ needs a ticket) — suzukacircuit.jp FAQ and japan.gp's
// "At the Circuit" page; phone signal overload on race Sundays and
// grandstand noise/earplug guidance — cross-verified across japan.gp and
// independent fan-guide sources. Honda Racing Gallery's exact visit
// duration isn't published anywhere found — stated honestly as unknown
// rather than guessed, per skill §2a-3; it runs on Suzuka Circuit Park's
//
// Food facility row expanded 30 Sep 2026 — founder flagged that no spoke
// in this pack mentioned in-circuit food at all (WhereToEatSpoke only
// covers Nagoya city dining, deliberately — that's a real, separate scope,
// so nothing there duplicates this). Named stalls (Suzu-tako, Suzu-kara,
// Yonakiya, CoCo Ichibanya, Ise Udon), Suzuka Circuit Park's own kitchens,
// Course Side Pizzeria "Grand View" (84 seats over Ise Bay), and the
// Center House restaurant "SUZUKA-ZE" (10am-2pm, 170 seats) all sourced
// directly from suzukacircuit.jp's official food page. Standard trackside
// pricing (~¥1,000-2,500 meals, ~¥250 drinks, ~¥500 beer) and the Nadaman
// pre-order bento tiers (¥3,000-10,000) cross-verified via jrpass.com's
// "Experience F1 Racing Japan" guide and gpdestinations.com's Suzuka
// trackside guide, which also independently confirmed vendors have run out
// of food/drink later in the day on busy sessions — included as a genuine
// planning caveat, not invented.
// general 9:30am-5pm schedule (already sourced in the Motopia seed script).
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const motopia = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-circuit-park-motopia"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Japanese Grand Prix"
      status="public"
      h1="A figure-8 circuit built by Honda in 1962, with a real amusement park attached"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Suzuka opened in 1962 as Japan&apos;s first full-scale international racing course, built on the
        conviction of Honda founder Soichiro Honda that racing was essential to improving road cars. Dutch
        designer John Hugenholtz gave it a genuinely unusual layout — a figure-eight, with the track crossing over
        itself on a bridge after the Dunlop Curve — rather than the simple loop most circuits use. The Esses and
        130R, both on this course, are among the most respected sequences in motorsport specifically because that
        figure-eight layout demands a different kind of car balance from a standard circuit.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Circuit Map</p>
      <ZoomableImage
        src={CIRCUIT_MAP_URL}
        alt="Suzuka Circuit grounds and facilities map"
        aspectClassName="aspect-[878/551]"
      />
      <p className="text-xs text-[#6A6A6A] mb-8">Credit: suzukacircuit.jp</p>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The map above marks the circuit&apos;s grounds in full — the East Course (the Grand Prix layout), the
          grandstands ringing turns 1 through the final corner, Suzuka Circuit Park and Motopia sitting inside the
          venue rather than beside it, and the entrance gates covered in the Arrival guide. Unlike most F1 venues,
          Suzuka is genuinely a single site that&apos;s part race track and part amusement park — the map reflects
          that, rather than showing a track with a car park attached.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Motopia — more than 30 attractions, not a token kids&apos; corner</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Boats and mini-cars for younger kids, a small circuit-style coaster, an electric-cart track, and
          seasonal additions like a Ferris wheel and a summer pool complex. Suzuka Circuit Park runs on its own
          seasonal schedule, independent of the Grand Prix calendar — a genuine option for a rest day before or
          after the race.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Honda Racing Gallery — real cars, not replicas</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sits inside the GP paddock area — a real museum covering Honda&apos;s motorsport history, with actual F1
          cars and MotoGP bikes on display. Pair it with the Main Theater, which replays historic F1 races on a
          19-metre screen with a full sensory sound system, for a genuine sense of what Suzuka has meant to the
          sport across decades. It runs on Suzuka Circuit Park&apos;s general opening hours (typically 9:30am-5pm,
          seasonal) — how long a visit actually takes isn&apos;t published anywhere, so build in flexible time
          rather than assuming a quick stop.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Circuit Challenger — a real lap of the actual F1 track</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The detail that separates Suzuka from almost every other F1 venue: an electric kart, developed with
          input from racing driver Takuma Sato, that you can drive yourself around the actual East Course —
          start/finish straight, first corner, S curves — on non-race days. Not the full-speed experience the
          drivers get (top speed is 35 km/h against a real F1 car&apos;s 350 km/h), but a genuine lap of a real
          Grand Prix circuit, something very few venues in the world let ordinary visitors do at all.
        </p>
      </div>

      {motopia && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={motopia} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">On-site facilities</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Food inside the circuit — genuinely more than concession-stand basics</p>
          <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
            Grandstand-area stalls cover a real spread — Suzu-tako for takoyaki, Suzu-kara for fried chicken,
            Yonakiya for ramen, CoCo Ichibanya&apos;s curry, and Ise Udon among them — alongside Suzuka Circuit
            Park&apos;s own kitchens in the Putti Town and Adventure areas. Course Side Pizzeria &quot;Grand
            View&quot; is the one worth planning around specifically: real pizza and gelato from 84 trackside
            seats overlooking Ise Bay. The Center House restaurant &quot;SUZUKA-ZE&quot; runs 10:00am-2:00pm
            (170 seats) with dishes like stamina sticky udon and pork cutlet curry, both around ¥1,480.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Standard trackside meals run roughly ¥1,000-2,500, soft drinks around ¥250, beer around ¥500. Premium
            pre-order bento from Nadaman are the other real option — from a ¥3,000 sukiyaki-sauce box up to a
            ¥10,000 Kobe/Matsusaka/Iga beef kaiseki box, ordered ahead rather than bought on the day. Cash remains
            the most reliable payment method — cashless is accepted at Center House and growing elsewhere, but
            isn&apos;t universal, and some vendors have genuinely run out of food and drink later in the day on
            busy sessions, so don&apos;t plan on eating late in the afternoon as your only option.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Toilets & accessibility</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Toilets are available at each parking lot, including temporary race-weekend lots, with dedicated
            baby-care rooms for feeding and diaper changes. The circuit is equipped with elevators, ramps, and
            designated accessible seating for visitors with disabilities.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Phone signal on race day</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Mobile networks can become overloaded during the race weekend, Sunday worst of all — download maps,
            tickets, and anything else you need before you arrive, and agree a physical meeting point with anyone
            you might get separated from rather than counting on being able to call or message them.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Noise — bring earplugs if you're close to the track</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Standard grandstands are loud but manageable; anywhere genuinely close to the track is not, and
            earplugs are a real, practical add rather than overcaution — worth it for kids specifically.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-1">Age restrictions</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Children aged 3 and older need their own ticket, and must be supervised by an adult at all times —
            plan around this if you're bringing a family.
          </p>
        </div>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          If you&apos;ve got any non-race time built into the trip, the Honda Racing Gallery and a Circuit
          Challenger lap are the two things worth prioritizing over the rest of Motopia&apos;s attractions — real
          motorsport history and a genuine lap of the actual circuit, both things you can&apos;t get anywhere
          else on the calendar.
        </p>
      </div>
    </SpokeShell>
  );
}
