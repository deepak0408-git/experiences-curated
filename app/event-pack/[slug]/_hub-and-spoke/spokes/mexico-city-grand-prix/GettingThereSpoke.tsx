import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettingThereGuide = linkedExperiences.find((e) => e.slug.includes("mexico-city-gp-getting-there-"));
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
      status="public"
      h1="Metro Line 9 is the answer — but race day closes different stations than practice days"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Metro is the reliable way in for both locals and visitors, and knowing the gate-to-station matching before
        you leave your hotel avoids an unnecessary walk around the venue perimeter.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Metro Line 9 — three stations, by gate</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Three Line 9 stations serve the circuit, each matched to different gates: Velódromo for Gate 1, Ciudad
          Deportiva for Gates 4-7, and Puebla for Gates 8, 9, and 12. Check your ticket for your assigned gate before
          you travel — Ciudad Deportiva tends to get named as &quot;the&quot; circuit station, but it&apos;s only the
          right choice for about half the gates.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Velódromo" value="Gate 1" />
          <FactRow label="Ciudad Deportiva" value="Gates 4, 5, 6, 7" />
          <FactRow label="Puebla" value="Gates 8, 9, 12" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Race day closes different stations</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          On race day specifically, several Line 9 and Metrobús stations actually close — including Ciudad Deportiva,
          Puebla, and Pantitlán — a genuine, planned closure to manage crowd flow, not a malfunction. If
          you&apos;re travelling on race day itself, Velódromo becomes the reliable fallback regardless of your
          gate, since it stays open. Practice and qualifying days don&apos;t carry the same closures — the
          direct gate-matched station works fine on those days.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The rideshare trap</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Uber and DiDi cannot get anywhere near the actual circuit gates on race weekend — road closures block them
          out entirely. Expect a driver to drop you several blocks short, with the final approach a slow walk
          through heavy foot traffic. If you use rideshare at all, plan the drop-off point in advance and budget
          real extra time for the walk-in.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">Metro CDMX (official app)</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Real-time service alerts including the race-day closures above — check before you leave your hotel,
              not after you&apos;re already at the platform.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Uber or DiDi</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both operate widely across the city and are genuinely useful for getting between neighborhoods and
              restaurants — just not for the final approach to the circuit itself on race weekend.
            </p>
          </div>
        </div>
      </div>

      {gettingThereGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={gettingThereGuide} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            On race day specifically, head straight to Velódromo regardless of your actual gate assignment — it&apos;s
            the one station guaranteed to stay open, and the extra walk from there is a smaller cost than discovering
            your usual station is closed once you&apos;re already underway. On Friday and Saturday, use your real
            gate-matched station and don&apos;t overthink it.
          </p>
        </div>
      )}
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
