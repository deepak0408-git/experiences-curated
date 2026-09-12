import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "day-trips";

// Combines São Paulo's 4 real in-city sightseeing experiences (Ibirapuera
// Park, Avenida Paulista & MASP, Beco do Batman, Feira da Liberdade) with
// the 3 genuine out-of-city day trips (São Roque wine route, Santos &
// Guarujá, Campos do Jordão) into one spoke with two clearly labelled
// sections — per founder decision, 12 Sep 2026, since São Paulo is the host
// city itself, not a satellite town, so "day trips" naturally covers both
// same-city sightseeing and true excursions.
export default async function DayTripsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const ibirapuera = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-ibirapuera-park-"));
  const paulistaMasp = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-paulista-masp-"));
  const becoDoBatman = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-beco-do-batman-"));
  const feiraLiberdade = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-feira-da-liberdade-"));
  const saoRoque = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-sao-roque-wine-route-"));
  const santosGuaruja = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-santos-guaruja-daytrip-"));
  const camposDoJordao = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-campos-do-jordao-daytrip-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Brazilian Grand Prix"
      status="teaser"
      h1="A car-free Sunday avenue in the city, or a mountain town two hours out"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every site and travel time above is real and free. The pack adds the actual day-by-day sequencing we'd run across a 3-day race weekend — which day to do a true out-of-city excursion, and the one combination that genuinely doesn't fit."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        São Paulo is the destination here, not a satellite town near the circuit — so the real question is how to
        use race-weekend downtime well. That spans genuine in-city sightseeing you can fit around a session day,
        and three real excursions worth a full day away from the track.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">In the city — a half-day at a time</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {ibirapuera && <SpokeExperienceCard experience={ibirapuera} isPro={isPro} hideProCtas />}
        {paulistaMasp && <SpokeExperienceCard experience={paulistaMasp} isPro={isPro} hideProCtas />}
        {becoDoBatman && <SpokeExperienceCard experience={becoDoBatman} isPro={isPro} hideProCtas />}
        {feiraLiberdade && <SpokeExperienceCard experience={feiraLiberdade} isPro={isPro} hideProCtas />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3 mt-8">Out of the city — real day trips</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {saoRoque && <SpokeExperienceCard experience={saoRoque} isPro={isPro} hideProCtas />}
        {santosGuaruja && <SpokeExperienceCard experience={santosGuaruja} isPro={isPro} hideProCtas />}
        {camposDoJordao && (
          <div className="sm:col-span-2">
            <SpokeExperienceCard experience={camposDoJordao} isPro={isPro} hideProCtas />
          </div>
        )}
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8 mt-4">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The honest logistics</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Ibirapuera Park, Avenida Paulista/MASP, Beco do Batman, and Feira da Liberdade are all genuine half-day
          stops you can fit around a session day — the market and the car-free avenue are both weekend-only,
          though, so check the day of week before planning around either. São Roque and Santos & Guarujá are both
          full-day commitments (roughly 7-8 hours including transit) — Campos do Jordão is the longest at around 12
          hours round trip given the 2-hour drive each way. None of the three out-of-city trips should be paired
          with a track session on the same day.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How we&apos;d actually sequence it</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a standard Friday-Sunday race weekend, reserve a rest day before or after the sessions for whichever
            out-of-city trip matters most to you — Campos do Jordão if you want the mountain-town contrast, Santos
            & Guarujá if football history and a beach afternoon appeal more, São Roque if a relaxed countryside day
            with wine is the priority. Fit Avenida Paulista and MASP in on a Sunday morning if your schedule allows,
            since the car-free avenue only runs 7am-4pm on Sundays — that's the one stop in this spoke genuinely
            tied to a specific day of the week. Beco do Batman and Ibirapuera both work well as a Friday or Saturday
            morning stop before track action.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            The one combination that genuinely doesn&apos;t fit: don&apos;t try to pair Campos do Jordão with
            Feira da Liberdade on the same trip logic — the mountain town&apos;s 12-hour round trip already
            consumes a full day, and the market only runs weekends, so if your one free weekend day is spoken for
            by Campos do Jordão, the market has to wait for a future trip or a weekday substitute like the
            Liberdade ramen shops instead.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
