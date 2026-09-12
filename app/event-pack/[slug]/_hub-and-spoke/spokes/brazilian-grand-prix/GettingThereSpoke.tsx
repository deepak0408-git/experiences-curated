import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Real content sourced from the seeded Getting to Interlagos experience
// (brazilian-gp-getting-to-interlagos-mtx6udv3), 12 Sep 2026: Metrô Line 9
// (Esmeralda) to the Autódromo stop, ~500m walk to the gates; F1 Express
// shuttles Fri-Sun 6am-1pm from three fixed pickup points; a real driving
// warning (road closures, limited/expensive parking).
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettingThereGuide = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-getting-to-interlagos-"));
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
      status="public"
      h1="Metrô Line 9 to Autódromo — one line, no transfers, from most of race weekend's hotel base"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Interlagos sits inside a real, working city, reachable by regular public transit — a genuine advantage
        over circuits where the only practical option is an expensive, oversubscribed shuttle from one central
        point.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Metrô Line 9 (Esmeralda) — the official recommendation</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Get off at the Autódromo stop, roughly 500 metres from the circuit gates. This is the same commuter rail
          line that runs through Pinheiros, one of the city&apos;s main interchange stations — so if you&apos;re
          staying anywhere in Jardins, Itaim Bibi, or Pinheiros, it&apos;s one line with no transfers for most of the
          trip.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">F1 Express shuttle — three pickup points</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Official shuttle buses run Friday through Sunday of race weekend, departing between 6am and 1pm from three
          fixed pickup points, for anyone who&apos;d rather skip the metro entirely.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="República Express" value="Downtown pickup point" />
          <FactRow label="Jabaquara Express" value="Jabaquara metro station" />
          <FactRow label="Congonhas Airport" value="Direct pickup if you're flying in on race day" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Don't drive</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Road closures around Interlagos on every race-weekend session day create real, multi-kilometer backups
          that regular São Paulo commuters already route around — and parking near the venue is both limited and
          priced well above the city&apos;s normal rate. Metro or the F1 Express shuttle are both faster and
          cheaper than driving in.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">The official F1 Race Guide app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Covers every circuit on the calendar, including Interlagos — interactive circuit maps, real-time
              schedule alerts, and geotagged points for grandstands, food, and fan-zone activities. Worth
              downloading before you land.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Bilhete Único</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              São Paulo&apos;s transit card, needed for the metro (and standard fare on Line 9). Buy it at a quieter
              downtown or hotel-area metro station the day before race day, not at Autódromo or Pinheiros on the
              morning of — ticket-machine queues at the busier stations get genuinely long once race-weekend crowds
              build.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Uber and 99</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both are widely used, genuinely affordable, and the standard way locals and visitors get around after
              dark. Having both installed gives you a real fallback if one app is slow to find a driver — 99
              sometimes has shorter wait times or lower prices depending on the neighborhood and time of day.
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
            Take the metro over the F1 Express shuttle if you&apos;re staying anywhere near a Line 9-connected
            neighborhood — it&apos;s the same route the shuttle ultimately funnels toward, but on your own schedule
            rather than a fixed departure window. Buy your Bilhete Único the day before, at a quiet station, and
            you&apos;ve removed the one real friction point in an otherwise straightforward commute.
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
