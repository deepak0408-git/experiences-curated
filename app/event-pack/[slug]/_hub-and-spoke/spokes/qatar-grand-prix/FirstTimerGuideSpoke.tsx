import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Real, sourced facts: Qatar's real conservative-culture dress norms and
// alcohol rules (a genuine orientation gap for a reader with zero
// prior Gulf-state context, per skill §2d), essential apps (§2g), and the
// real Pearl-Katara neighborhood card as this pack's "get oriented" pick.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const pearlKatara = linkedExperiences.find((e) => e.slug.includes("qatar-gp-pearl-katara-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="public"
      h1="Qatar is a conservative Gulf state — a few real norms are worth knowing before you land"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        For anyone whose only other F1 trips have been in Europe or the Americas, Qatar is a genuinely different
        kind of destination — modern, safe, and easy to navigate, but built around real cultural norms that are
        worth understanding before you arrive rather than discovering on the spot.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Dress and alcohol — the real rules, not guesswork</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Shoulders and knees covered is the safe default in public areas outside the circuit — malls, the souq,
          museums, and the street. Inside the circuit itself, standard race-day clothing (t-shirts, shorts) is fine;
          the norm applies to the wider city, not the race weekend crowd specifically.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Alcohol is legal and served, but only in licensed venues — hotel bars, restaurants inside major hotels, and
          select hospitality areas at the circuit. It isn&apos;t sold in supermarkets or casually available in
          public the way it might be at home, and public intoxication is taken seriously. Plan your evenings around
          hotel-based venues rather than expecting a normal high-street bar scene.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps and practical basics</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Karwa</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Qatar&apos;s own metered taxi app — the most reliable option for getting around Doha generally, and
              specifically the one that handles circuit departures after the race when Uber often can&apos;t.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Ooredoo or Vodafone Qatar (tourist SIM)</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both carriers sell short-term tourist SIMs at Hamad International Airport on arrival — worth doing
              immediately, since reliable data makes every other app on this list actually usable.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">The official F1 Race Guide app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Interactive circuit maps, real-time schedule alerts, and geotagged points for grandstands, food, and
              fan-zone activities at Lusail specifically. Download it before you land.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Money and payments</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Qatari Riyal (QAR) is the local currency, pegged to the US dollar at roughly 3.64 QAR per US$1 — a
          stable, predictable exchange rate, unlike destinations where the rate genuinely fluctuates during your
          trip. Cards are widely accepted at hotels, malls, and most restaurants; the souq and smaller vendors still
          favor cash, so carry some riyals for Souq Waqif specifically.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Get oriented — an evening walk beyond the circuit</p>
      {pearlKatara && (
        <div className="mb-8">
          <SpokeExperienceCard experience={pearlKatara} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do on arrival</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Buy a tourist SIM at the airport the moment you land — Karwa, the metro app, and the F1 app all need real
            data to be useful, and Hamad International&apos;s arrivals hall makes this a five-minute stop, not a
            hunt. If your flight lands with an afternoon or evening free before the race weekend starts, Pearl-Katara
            is the single best way to get oriented to the city&apos;s actual rhythm — a genuine, low-effort walk that
            tells you more about modern Doha than a guidebook can.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
