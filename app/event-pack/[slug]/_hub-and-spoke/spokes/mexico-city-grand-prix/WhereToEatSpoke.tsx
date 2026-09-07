import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const tacos = linkedExperiences.find((e) => e.slug.includes("mexico-city-tacos-al-pastor-"));
  const pujolContramar = linkedExperiences.find((e) => e.slug.includes("mexico-city-pujol-contramar-"));
  const mercadoRoma = linkedExperiences.find((e) => e.slug.includes("mexico-city-mercado-roma-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Mexico City Grand Prix"
      status="teaser"
      h1="From a 30-peso taco to a two-Michelin-star tasting menu — the real range"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every pick and price above is real and free. What's gated is the stuff that actually decides whether your meals happen: the exact 30-day countdown for Pujol's booking calendar (miss it and there's no back channel, concierge or otherwise), the precise arrival window that gets you into Contramar same-day, our real taco-crawl sequencing, and a guided food-tour option with a real booking link if you'd rather not choose at all."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Mexico City now has more Michelin-recognized restaurants than Paris, and the real argument for this
        city&apos;s food scene isn&apos;t choosing between the street stand and the tasting menu — it&apos;s that
        both can be genuinely world-class on the same trip, sometimes the same night.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Budget — the street-food essential</p>
      {tacos && (
        <div className="mb-8">
          <SpokeExperienceCard experience={tacos} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Moderate — a food hall covering every craving</p>
      {mercadoRoma && (
        <div className="mb-8">
          <SpokeExperienceCard experience={mercadoRoma} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Splurge — the two hardest tables in the city</p>
      {pujolContramar && (
        <div className="mb-8">
          <SpokeExperienceCard experience={pujolContramar} isPro={isPro} hideProCtas />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Don&apos;t want to pick just one — a guided food tour</p>
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              If narrowing the city&apos;s food scene down to two or three stops feels like the wrong problem to
              have, a guided tour through the Historic Center covers the range in one sitting — 8+ tastings across
              markets, hidden eateries, and local favorites, including chilaquiles, mole-covered enchiladas, fresh
              guacamole and tortillas, tacos at a locals&apos; taquería, Mexican pastry, artisanal chocolate, and a
              genuine surprise dish kept off the menu until you get there. Led by a local guide, with free
              cancellation up to 24 hours ahead — check the link below for current pricing and availability.
            </p>
            <a
              href="https://www.getyourguide.com/mexico-city-l194/mexico-city-old-town-food-tour-of-7-tastings-secret-dish-t220743/?partner_id=HCNITTS&utm_medium=online_publisher"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
            >
              Book with GetYourGuide ↗
            </a>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d actually sequence a food-focused day</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Start with a genuine sampling crawl across two or three taco stands in one evening — El Vilsito, Los
            Cocuyos, or a nearby Orinoco branch — rather than filling up at the first one, since each stand&apos;s
            trompo has its own marinade and char worth comparing. Save Mercado Roma for a day when your group
            can&apos;t agree on one cuisine, or when you want to sample widely without committing to one restaurant
            for the whole meal. Reserve for Pujol and Contramar weeks, not days, ahead — Pujol&apos;s calendar
            releases exactly 30 days out at midnight Mexico City time, and Contramar takes same-day walk-ins only if
            you arrive 10 minutes before opening.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The reservation detail that actually matters</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            If Pujol is the one non-negotiable meal of your trip, set a reminder for exactly 30 days before your
            target date and be online at midnight Mexico City time — popular dates have filled within minutes of the
            calendar releasing, and there is no back-channel booking route through a concierge service. For
            Contramar, arriving 10 minutes before opening (11am weekends, 12pm weekdays) is a meaningfully better
            strategy than showing up at the posted opening time itself, which is often already too late for a
            same-day walk-in table.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
