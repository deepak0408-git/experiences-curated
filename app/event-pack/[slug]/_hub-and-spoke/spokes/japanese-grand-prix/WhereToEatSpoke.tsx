import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// Real content sourced from the seeded multi-venue dining experience
// (japanese-gp-nagoya-food-scene), 22 Sep 2026 — two named institutions
// (Atsuta Hōraiken since 1873, Yabaton since 1947), both with real,
// verified Google Maps ratings already set on the row (googleMapsRating
// stays null on the multi-venue row itself per experience-researcher §2c —
// live links only, no static number written in card/body copy).
//
// "Food inside the circuit" section added 30 Sep 2026 — same content
// verbatim as MapSpoke.tsx's On-site facilities food row (founder request:
// this genuinely belongs in the dining spoke too, not just the venue map).
// Named stalls (Suzu-tako, Suzu-kara, Yonakiya, CoCo Ichibanya, Ise Udon),
// Course Side Pizzeria "Grand View", and Center House's "SUZUKA-ZE" all
// sourced from suzukacircuit.jp's official food page; pricing and the
// Nadaman pre-order bento tiers cross-verified via jrpass.com and
// gpdestinations.com. Kept in sync manually with MapSpoke's copy rather
// than extracted into a shared component — see that file if this content
// is ever updated, both copies need the same edit.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const foodScene = linkedExperiences.find((e) => e.slug.includes("japanese-gp-nagoya-food-scene"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Japanese Grand Prix"
      status="teaser"
      h1="Hitsumabushi and miso katsu — the two dishes that genuinely define Nagoya"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The two anchor dishes and where to eat them are free above. The pack adds our direct verdict on tebasaki spots worth a detour, a genuine Sakae/Osu dinner plan for a night without a set agenda, and the practical timing detail that gets you into Atsuta Hōraiken without the real lunchtime queue."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Nagoya&apos;s food identity doesn&apos;t get talked about the way Tokyo&apos;s or Osaka&apos;s does, but
        it&apos;s genuinely distinct — richer, more specific, and built around a handful of dishes you won&apos;t
        find done the same way anywhere else in Japan.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hitsumabushi — Atsuta Hōraiken, since 1873</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Grilled eel over rice, eaten in a specific ritual — first as it comes, then with condiments mixed in,
          finally with dashi broth poured over the last portion to turn it into a light ochazuke. The queue at
          lunchtime is a genuine indicator of how seriously locals take it, not a tourist-trap symptom.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Miso katsu — Yabaton, since 1947</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A genuine variation on standard tonkatsu, not a minor twist — the pork cutlet gets topped with a rich,
          dark, red miso sauce, noticeably heavier and more savory than usual tonkatsu sauce. The Sakae Matsuzakaya
          branch is a solid, central pick if you&apos;re already in that part of town.
        </p>
      </div>

      {foodScene && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={foodScene} isPro={isPro} hideProCtas />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Beyond the two anchor dishes</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Tebasaki — Nagoya-style fried chicken wings, double-fried and coated in a sweet-savory glaze with sesame
          and pepper — is the city&apos;s genuine izakaya staple. Kushikatsu (skewered, deep-fried items) and
          tenmusu (small shrimp tempura rice balls) round out the list of dishes locals actually eat regularly, as
          opposed to dishes built for tourists.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Food inside the circuit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
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

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If you&apos;re only eating two things</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            Hitsumabushi and miso katsu are the two dishes that most define Nagoya&apos;s food identity — everything
            else is worth trying if you have the time, but these two are the ones you&apos;d genuinely regret
            skipping on a short trip. Book neither in advance — both restaurants run on standard walk-in service —
            but time Atsuta Hōraiken around the real lunchtime queue: arrive right at opening (11:30am) or well
            off-peak in the afternoon, since the queue builds fast once locals start their lunch break.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A genuine night without a set agenda</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Sakae is Nagoya&apos;s central entertainment and dining district — dense with izakaya specializing in
            tebasaki, an easy walk from where the Yabaton branch already puts you. Osu, a short ride away, trades
            polish for genuine chaos — a covered shopping arcade dense with small food stalls, kushikatsu counters,
            and the kind of unplanned dinner that works best with no reservation and no fixed plan. Either one is
            a real option for an evening between race sessions, not just a between-meal filler.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
