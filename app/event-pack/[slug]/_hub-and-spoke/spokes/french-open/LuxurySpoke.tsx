import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";
import Link from "next/link";

const SPOKE_ID = "luxury";

// Real hospitality tiers researched during experience seeding
// (sodexolive-hospitality.com, sportstravelhospitality.com — Le Pavillon,
// La Mezzanine, L'Orangerie Category 1/Gold). Premium transit: real
// fixed-price CDG/Orly chauffeur services (transfeero.com et al.).
// Off-venue luxury: Hôtel Plaza Athénée's real French-style afternoon tea
// (dorchestercollection.com) — presented honestly as a general Paris
// luxury tradition, not a fabricated tennis-specific one (no genuine
// Roland-Garros tea tradition found, unlike Wimbledon's Dorchester tea).
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, tickets } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const hospitality = linkedExperiences.find((e) => e.slug.includes("roland-garros-official-hospitality"));
  const molitor = linkedExperiences.find((e) => e.slug.includes("hotel-molitor-paris-luxury-stay"));
  const luxuryDining = linkedExperiences.find((e) => e.slug.includes("french-open-luxury-dining-bois-de-boulogne"));
  const tier4 = tickets.find((t) => t.tier === "tier4");

  const packages = [
    {
      name: "Le Pavillon",
      detail:
        "A beach-house-styled dining room with a 500-square-metre terrace over the practice courts, built for a long, unhurried lunch between sessions. Doors 10am-5:30pm, premium Chatrier seating included.",
    },
    {
      name: "La Mezzanine",
      detail:
        "A brighter, more informal lounge on L'Orangerie's first floor — screens showing live play, a steady rotation of canapés rather than a seated meal. The pick for staying mobile between matches.",
    },
    {
      name: "L'Orangerie — Category 1 / Category Gold",
      detail:
        "L'Orangerie's own seating categories, both with premium Chatrier access and the full drinks/catering package built in — Category Gold sits closer to the court.",
    },
  ];

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="teaser"
      h1="Three real hospitality rooms, a luxury stay, and where the trip goes off-venue"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="All 3 real hospitality rooms and their real inclusions are free above — no vague 'premium experience' language. What free research can't tell you is which room fits which kind of day, and how to sequence a hospitality day so you're not queuing for a table the one day you paid not to. Unlocking adds that verdict."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Luxury at Roland-Garros is a stack of decisions, not one purchase — where you stay and how you eat around
        the grounds matter as much as which hospitality room you book. The tournament runs official hospitality
        through Sodexo Live!, its sole sanctioned hospitality operator, in three genuinely different rooms.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Multiple licensed operators run fixed-price chauffeur transfers between CDG or Orly and central Paris —
          typically from around €140 in a Mercedes E-Class, with flight tracking, meet-and-greet, and no
          surge pricing regardless of arrival time. Worth arranging specifically for a hospitality day or a finals
          weekend arrival, when you don't want a delayed RER or a taxi queue to be the thing that goes wrong.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Off-venue luxury</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 mb-6">
        <p className="text-sm font-bold text-white mb-1">Afternoon tea, Hôtel Plaza Athénée</p>
        <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3] mb-2">
          <span className="text-[#AAFF00]">★</span>
          <a
            href="https://maps.google.com/?cid=12024421303133918331"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white hover:text-[#AAFF00] transition-colors"
          >
            4.6
          </a>
          <span>(2,878 Google reviews)</span>
        </div>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Not a Roland-Garros tradition specifically — a genuine Paris luxury institution worth knowing about
          regardless. La Galerie serves French-style afternoon tea (pastries and confections rather than the
          British sandwiches-and-scones format), crafted by World Pastry Champion Angelo Musa, with a harpist
          accompanying each sitting. A real central-Paris alternative to a village restaurant on a rest day, from
          €64 per person.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The 3 official hospitality rooms</p>
      <div className="flex flex-col gap-3 mb-8">
        {packages.map((pkg) => (
          <div key={pkg.name} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
            <p className="text-sm font-bold text-white mb-1.5">{pkg.name}</p>
            <p className="text-xs text-[#A3A3A3] leading-5">{pkg.detail}</p>
          </div>
        ))}
      </div>
      {tier4 && (
        <p className="text-xs text-[#6A6A6A] -mt-4 mb-8">
          Approx. US${Math.round(Number(tier4.costLow))}-{Math.round(Number(tier4.costHigh))} per person per day
          depending on tier — 2027 pricing not yet published. See the{" "}
          <Link href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Ticket Guide
          </Link>{" "}
          for how this compares to standard tickets.
        </p>
      )}

      {hospitality && (
        <div className="mb-8">
          <SpokeExperienceCard experience={hospitality} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book early — hospitality typically sells out well ahead</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Hospitality packages typically go on sale several months before the tournament and sell out before the
          event itself — finals weekend and the tournament's second week are the first to go. Book as soon as
          packages open, not once you've decided which days to attend.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A premium stay</p>
      {molitor && (
        <div className="mb-8">
          <SpokeExperienceCard experience={molitor} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A luxury dinner</p>
      {luxuryDining && (
        <div className="mb-8">
          <SpokeExperienceCard experience={luxuryDining} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which room we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Le Pavillon is the sharper choice if lunch itself is part of the point — a real seated meal with a view
            over the practice courts, unhurried, not catering dressed up as an event. La Mezzanine is the better
            call if staying mobile between matches matters more than a sit-down meal — canapés and screens rather
            than a table. L&apos;Orangerie&apos;s Category Gold is the pick if a specific close seat on Chatrier
            is the actual priority over the room itself.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A luxury day, sequenced</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Base yourself at Hôtel Molitor — the 10-minute walk matters more on a hospitality day, when you want a
            proper unwind in the hotel's own pools afterward rather than a Métro journey back into central Paris.
            Book Le Pré Catelan or La Grande Cascade (see the full{" "}
            <Link href={`/event-pack/${eventSlug}/where-to-eat`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Eat guide
            </Link>
            ) for the evening after a hospitality day, not the same lunch — stacking two long meals in one day
            undercuts both. The Plaza Athénée's afternoon tea is the sharper call for a rest day rather than a
            grounds day, ideally in central Paris rather than squeezed in around a match.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: sodexolive-hospitality.com, sportstravelhospitality.com (hospitality tiers), transfeero.com
        (airport transfer pricing), dorchestercollection.com (Plaza Athénée afternoon tea).
      </p>
    </SpokeShell>
  );
}
