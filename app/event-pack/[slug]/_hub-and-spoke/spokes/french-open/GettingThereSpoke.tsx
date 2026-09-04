import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Real transit facts sourced during experience research (Porte d'Auteuil
// Métro Line 9 proximity, RATP as the real transit operator, Navigo
// Découverte pass pricing from planner_destination_bands' localTravelNote).
// The Roland-Garros Travel official ticket+hotel bundle experience card
// lives here, cross-linked to Tickets/Hotels for the fuller picture.
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, destinationBand } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const rgTravel = linkedExperiences.find((e) => e.slug.includes("roland-garros-travel-official-packages"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="public"
      h1="Line 9 is the real answer — plus what to do if it's jammed on match days"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Stade Roland-Garros sits in the 16th arrondissement at the southern edge of the Bois de Boulogne. The
        Métro gets you there directly on one line for almost every starting point in Paris — below is the real
        route, plus taxi, driving, and app guidance for match days specifically.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The fastest real route — by Métro</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Porte d&apos;Auteuil (Métro Line 9) is the closest stop to the main grounds, a 10-minute walk from the
          entrance gates. Porte de Saint-Cloud (Line 9) and Michel-Ange–Molitor (Lines 9 and 10) are both realistic
          15-20 minute walk alternatives when Porte d&apos;Auteuil gets jammed with match-day crowds — genuinely
          common in the hour either side of gates opening. RATP runs the whole network; a weekly Navigo Découverte
          pass (around €32.40 plus a one-off €5 card fee) covers unlimited Métro, bus, and RER travel across all
          zones and is the best value for a multi-day stay.
        </p>
        <FactRow label="Fastest route" value="Métro Line 9 to Porte d'Auteuil (10-min walk to the gates)" />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Taxi / rideshare</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A taxi or Uber into the 16th arrondissement is genuinely slower and pricier than the Métro during match
          hours — the streets around the stadium see real congestion in the hour either side of each day&apos;s
          first and last sessions. Worth it late in the evening after a night session, when Métro frequency drops,
          or if you&apos;re travelling with young children or heavy bags — otherwise Line 9 is the better call.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Driving &amp; parking</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Driving is the least recommended option — central Paris traffic, limited match-day parking directly around
          the venue, and the same congestion that slows taxis all make this genuinely harder than the Métro for
          almost everyone. If you do drive, book any official on-site or nearby parking well ahead through the
          official Roland-Garros site rather than expecting to find something on the day.
        </p>
      </div>

      {rgTravel && (
        <div className="mb-8">
          <SpokeExperienceCard experience={rgTravel} isPro={isPro} />
        </div>
      )}

      {destinationBand?.localTravelNote && (
        <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting around, cheaply</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.localTravelNote}</p>
        </div>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
        <p className="text-sm font-bold text-white mb-2">The apps worth having on your phone</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          <strong className="text-white">Citymapper</strong> or the official <strong className="text-white">RATP</strong>{" "}
          app for real-time Métro/RER journey planning — both cover live disruption, which matters on a
          high-traffic tournament day. <strong className="text-white">Uber</strong> or <strong className="text-white">Bolt</strong>{" "}
          both operate normally in Paris for the taxi/rideshare option above, no tourist-eligibility restriction on
          either.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: RATP (ratp.fr), Île-de-France Mobilités (Navigo pass pricing).
      </p>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
