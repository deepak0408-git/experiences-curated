import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const luxuryHotels = linkedExperiences.find((e) => e.slug.includes("atp-finals-luxury-hotels"));
  const portaNuova = linkedExperiences.find((e) => e.slug.includes("atp-finals-porta-nuova-neighborhood"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Nitto ATP Finals"
      status="teaser"
      h1="Central luxury vs. station-side value — no arena-walkable option exists"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="The real neighborhoods and hotel names are all free above. The Event Pack adds our actual verdict — which specific area to book for a first ATP Finals trip, and how to weigh proximity to Porta Nuova station (useful for a Barolo day trip) against the historic squares' atmosphere."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        No hotel in Turin is walking distance from Inalpi Arena — the arena sits in the Santa Rita district, reached
        by tram, not on foot from the city&apos;s hotel districts. That means choosing where to stay is really about
        which part of central Turin suits your trip, not about arena proximity.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {luxuryHotels && <SpokeExperienceCard experience={luxuryHotels} isPro={isPro} />}
        {portaNuova && <SpokeExperienceCard experience={portaNuova} isPro={isPro} />}
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Every hotel needs the tram connection</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Regardless of which area you pick, every route to Inalpi Arena runs through Sebastopoli tram stop (lines 4
          and 10) — see the{" "}
          <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Getting There guide
          </a>{" "}
          for the full journey.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            If you&apos;re planning a Barolo or Langhe day trip (see the{" "}
            <a href={`/event-pack/${eventSlug}/day-trips`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Day Trips guide
            </a>
            ), book near Porta Nuova
            station specifically — Grand Hotel Sitea or Royal Palace Hotel, both a 7-8 minute walk from the platform
            your day-trip train leaves from, removes a whole transit leg on your earliest, most time-pressured
            morning of the trip. If a day trip isn&apos;t on your itinerary, Principi di Piemonte&apos;s Alpine-arch
            views and central-square position are worth the trade-off — you lose nothing practical by choosing it
            over the station-district hotels.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Turin&apos;s central hotel stock is genuinely limited compared to a larger European capital — book as
            early as you&apos;ve confirmed your ticket dates, since ATP Finals week creates real, concentrated demand
            across a relatively small number of central rooms.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
