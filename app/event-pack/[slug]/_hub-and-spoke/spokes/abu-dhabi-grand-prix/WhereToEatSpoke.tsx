import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const garage = linkedExperiences.find((e) => e.slug.includes("garage-w-abu-dhabi"));
  const diningWalk = linkedExperiences.find((e) => e.slug.includes("yas-marina-dining-walk"));
  const shawarma = linkedExperiences.find((e) => e.slug.includes("cheap-shawarma-abu-dhabi-dubai"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Abu Dhabi Grand Prix"
      status="teaser"
      h1="From marina fine dining to AED 10 shawarma — the real range"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every pick and price above is real and free. The pack adds our actual reservation strategy for race week specifically — when to book, and the one genuine trade-off between the marina scene and the city's own everyday food culture."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Yas Marina&apos;s own dining runs splurge-tier by design — this is the real range across the whole trip,
        from genuine fine dining on the marina to real, everyday local institutions in both Abu Dhabi and Dubai
        where a full meal costs a fraction of anything trackside. And if you don&apos;t want to leave the circuit
        during race sessions, the venue&apos;s own fan zones are a real option too.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Eating inside Yas Marina Circuit itself</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Food and drink at the circuit itself is concentrated in named fan zones, each tied to a specific
          grandstand — North Oasis behind the North Grandstand, West Oasis behind the West Grandstand and Abu
          Dhabi Hill, and South &amp; Marina Oasis behind the Marina and South Grandstands. The Main Oasis, behind
          the Main Grandstand, is the largest of them — genuinely the best spot to feel the season-finale
          atmosphere, with live music running all weekend and a three-person giant swing offering a real view back
          over the circuit. Expect mostly fast-food-style options at reasonable prices, with a real range of
          cuisines and dietary options covered, though alcohol (21+) runs expensive. It&apos;s a genuinely
          reasonable way to eat well without leaving your session, not just a fallback for people who didn&apos;t
          plan ahead.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Splurge — trackside fine dining</p>
      {garage && (
        <div className="mb-8">
          <SpokeExperienceCard experience={garage} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Casual to mid-range — the marina walk</p>
      {diningWalk && (
        <div className="mb-8">
          <SpokeExperienceCard experience={diningWalk} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Budget — real local institutions</p>
      {shawarma && (
        <div className="mb-8">
          <SpokeExperienceCard experience={shawarma} isPro={isPro} hideProCtas />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which Oasis to pick inside the circuit</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            If your ticket is for the Main Grandstand, don&apos;t overthink it — the Main Oasis behind it is the
            largest fan zone at the whole circuit and genuinely the best place to feel the season-finale
            atmosphere between sessions, with live music running all weekend and its giant swing worth the short
            queue for the view alone. If you&apos;re seated at Abu Dhabi Hill or the West Grandstand, West Oasis is
            the closer, more practical choice — no reason to cross the circuit for food when a fully-stocked zone
            sits right behind your own seat. For Marina or South Grandstand tickets, South &amp; Marina Oasis puts
            you closest to the water, a genuinely nicer spot to eat if you want a breather from the crowd noise
            elsewhere. In every zone, expect fast-food-style pricing rather than a sit-down menu — treat it as a
            quick, reasonably priced refuel between sessions, not a destination meal in its own right.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What to actually order</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            At Garage, don&apos;t default to one menu — it runs as four distinct kitchen stations under one
            reservation: Meat Vault for prime Wagyu and USDA steaks, Nikkei House for Japanese-Peruvian dishes,
            Mezza Bar for Middle Eastern small plates, and Tart Van for dessert. Order across stations rather than
            settling into just one. Along the marina walk, Ishtar is the one worth timing deliberately — its live
            entertainment, including a belly dance show, is central to the venue rather than an occasional add-on,
            so confirm the night&apos;s show time when booking if catching the full performance matters. At Bait El
            Khetyar, the chicken and beef shawarma (roughly AED 10 and AED 11) are the real draw, alongside stuffed
            falafel and manakeesh — two people can eat well here for well under AED 150 total. At Al Mallah, take
            the outdoor seating on Al Dhiyafah Street specifically — it&apos;s part of the actual experience, not
            overflow seating, and the street-level people-watching is a real reason locals choose it.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Reserving for race week specifically</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Garage is consistently one of the hardest reservations on Yas Island during Grand Prix weekend —
            book well ahead of race week rather than trying your luck with a walk-in, and request terrace
            seating specifically if a track view matters to you, since the venue's multiple kitchens mean not
            every table faces the circuit. Stars &apos;N&apos; Bars, Ishtar, and Bar Du Port along the marina walk fill
            fastest in the two hours before and after each day&apos;s headline session — outside those windows,
            walk-in availability is genuinely realistic. If you want a late option after the Yasalam concerts or a
            late race-day evening, Al Ustad in Dubai stays open until 3:30am — most trackside splurge dining winds
            down long before then.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The real trade worth knowing: the marina scene is spectacular for atmosphere but genuinely expensive
            across the board. Bait El Khetyar and Al Mallah aren&apos;t backup options — they&apos;re a real,
            deliberate way to eat well for a fraction of the price on any evening you&apos;re not specifically
            chasing the marina view.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Google Maps ratings and reviews (Stars &apos;N&apos; Bars, Bait El Khetyar), venue-published menus
        and hours (Garage, Ishtar, Al Mallah, Al Ustad), yasmarinacircuit.com and fanamp.com (Oasis fan zones).
      </p>
    </SpokeShell>
  );
}
