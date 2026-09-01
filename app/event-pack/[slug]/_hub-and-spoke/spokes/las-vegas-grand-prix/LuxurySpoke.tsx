import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Per hub-and-spoke skill §2i: Luxury spoke must cover the whole trip, not
// just the top hospitality tier. Real researched content: House 44 (Lewis
// Hamilton-branded Paddock Club tier), Trackside Tavern rooftop bar, the
// official F1 Afterparty at Sphere (Backstreet Boys), Blacklane fixed-rate
// chauffeur service, and a new Bellagio Fountain View Penthouse Suite fact
// distinct from the existing Trackside Hotels experience's room categories.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const paddockClub = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-paddock-club"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="teaser"
      h1="Luxury here is a stack of decisions, not one hospitality ticket"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every option above is real and free — the pack adds which specific combination we'd actually book for a genuine high-spend first trip, and the exact lead-time each one needs before it sells out."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        A genuinely luxury Las Vegas GP weekend spans more than one ticket product — hospitality tier, premium
        transit, in-circuit amenities beyond the top hospitality suite, and where a high-spend fan goes once the
        session ends. Here&apos;s the real, researched picture across all of it.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers beyond the top one</p>
      <div className="flex flex-col gap-4 mb-8">
        <LuxuryCard
          title="House 44 — the Lewis Hamilton-branded tier"
          detail="A distinct, higher tier within the Paddock Club structure, roughly $4,000 more per 3-day pass than standard Paddock Club — the same garage-level location and paddock tour, with a more curated, branded format layered on top."
        />
        <LuxuryCard
          title="Trackside Tavern — Paddock Club Rooftop"
          detail="A sports-bar-format hospitality tier sitting on top of the Paddock building itself, with panoramic circuit views, all-inclusive food and drink, and big screens — a genuinely different atmosphere from the main Paddock Club floor below it."
        />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Fixed-rate chauffeur services (Blacklane and similar operators) run pre-booked transfers from Harry Reid
          International Airport directly to any Strip hotel, with the driver waiting a full hour post-landing — a
          genuine advantage over rideshare during a week when pickup points get congested. Pricing is quoted
          upfront per route rather than a single flat figure; treat any specific number as one illustrative
          example, not a guaranteed rate, and cross-reference the Getting There spoke for how road closures affect
          any private transfer's actual route on race days.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Where luxury goes after the session</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The official F1 Afterparty runs at Sphere on Saturday 21 Nov, 11:30pm-1am, headlined by the Backstreet
          Boys as the event&apos;s Official Post-Race Show — a genuine, confirmed event tie-in, not a generic
          nightlife recommendation. It&apos;s not a standalone ticket: access comes bundled with a qualifying 3-day
          T-Mobile Zone package (GA from $925, grandstand from $1,560, both including taxes and fees), a
          Venetian Resort hotel-and-race bundle via Vibee from $2,062 per person, or as a $116 add-on if you
          already hold a qualifying T-Mobile Zone ticket.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">One new luxury-hotel fact</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Beyond Bellagio&apos;s standard Fountain View room categories, the property
          also offers a Fountain View Penthouse Suite — a full one-bedroom penthouse category with premium
          bedding and a private minibar, sitting above the standard Fountain View King/Two Queen rooms in both
          size and price. Confirm the specific suite number has a genuine track sightline before booking; not
          every Fountain View-branded category guarantees one.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The single biggest luxury decision</p>
      {paddockClub && (
        <div className="mb-8">
          <SpokeExperienceCard experience={paddockClub} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The combination we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first luxury Las Vegas GP, standard Paddock Club for the 3-day pass plus a Fountain View room
            at Bellagio gives the strongest combination for the money — garage-level access and the paddock tour,
            paired with a hotel room that doubles as a second viewing spot. House 44&apos;s branded premium is
            worth paying only if the Lewis Hamilton tie-in specifically matters to you; the underlying access is
            otherwise identical to standard Paddock Club.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking Paddock Club and House 44</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Neither tier has instant self-serve checkout at this price point — call F1 Experiences directly at
            +1 888 326 5430 (or hospitality@f1experiences.com) and confirm which specific tier still has
            availability for your dates before assuming anything you see listed online is still open. Both tiers
            have a documented history of selling out well before race weekend at this event specifically, so treat
            this as a call to make months out, not a browse-and-buy decision closer to the date.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking a premium chauffeur</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Blacklane&apos;s Las Vegas airport transfer runs on upfront, fixed pricing with a full hour of
            post-landing wait time built in — book online or via their app, and get your specific pickup point
            confirmed in writing before race day, since a driver without a precise pre-cleared spot may not be
            able to reach you once Strip closures are active. Their site doesn&apos;t publish a race-week-specific
            rate, so treat any quote as needing reconfirmation once F1-weekend demand pricing kicks in.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking the F1 Afterparty</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Access is bundled, not standalone — via f1lasvegasgp.com/f1-afterparty or tickets.formula1.com, either
            as part of a qualifying 3-day T-Mobile Zone package (GA from $925, grandstand from $1,560), the
            Venetian Resort hotel-and-race bundle via Vibee (from $2,062pp), or the $116 add-on if you already hold
            a qualifying T-Mobile Zone ticket. The add-on route is the cheapest way in if you&apos;ve already
            bought T-Mobile Zone tickets separately.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: f1experiences.com and tickets.formula1.com (House 44/Paddock Club contact, tier structure),
        blacklane.com (Las Vegas airport transfer service), f1lasvegasgp.com official F1 Afterparty page and
        corp.formula1.com (Backstreet Boys Afterparty announcement, ticket package pricing).
      </p>
    </SpokeShell>
  );
}

function LuxuryCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-sm font-bold text-white mb-1.5">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
