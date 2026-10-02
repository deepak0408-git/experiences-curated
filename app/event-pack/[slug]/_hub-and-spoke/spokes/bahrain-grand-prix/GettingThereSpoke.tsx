import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const transit = linkedExperiences.find((e) => e.slug.includes("getting-to-sepang-circuit-klia"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Bahrain Grand Prix"
      status="public"
      h1="Getting to Sepang — the airport circuit"
      question="How do I get to Sepang Circuit, and how close is it really to KLIA?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Few circuits on the Formula 1 calendar sit as close to their airport as Sepang does. The circuit is about
        15.5km from KLIA Terminal 2 — roughly an 18-minute drive, or a similar time on the direct KLIA Ekspres-plus-
        shuttle combination — which is dramatically shorter than the airport transfers at Monza, Spa, or almost
        anywhere else on the calendar. It&apos;s a short, straightforward hop, not a walk: budget approximately 2
        hours touchdown to gates once you allow for immigration, baggage, and the final leg from the airport.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">By train — from central Kuala Lumpur</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm font-bold text-white mb-1">KLIA Ekspres</p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Non-stop between KL Sentral and KLIA, no intermediate stops, every 20 minutes from 05:00 to midnight. Covers
          the distance in 33 minutes flat — 30 minutes to Terminal 1, another 3 to Terminal 2.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Fare" value="RM55 one-way" />
          <FactRow label="Hours" value="Every 20 min, 05:00–00:00 daily" />
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Buy the race weekend pass instead</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          If you&apos;re making more than a couple of KLIA Ekspres runs, the Sepang Race Train Pass is the better
          deal: RM200 for 6 trips between KL Sentral and KLIA Terminal 2 (33 minutes each way), valid 2–4 October
          only — about RM130 cheaper than six single RM55 tickets. It&apos;s single-passenger, non-transferable, and
          non-refundable, and unused trips simply expire, so only buy as many as you&apos;ll actually use. Get it at{" "}
          <a href="https://kliaekspres.com" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            kliaekspres.com
          </a>{" "}
          or in the app ahead of time, or at station kiosks and counters from 2 October.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Plan your journey</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          For anything beyond the direct KLIA Ekspres run — connecting from an LRT/MRT station elsewhere in the city,
          or working out a bus leg — use the official journey planner rather than guessing at connections.
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">MyRapid Journey Planner</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Prasarana&apos;s official route planner for the Klang Valley — covers LRT, MRT, Monorail, and bus in one
              search.{" "}
              <a href="https://myrapid.com.my/journey-planner/" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
                myrapid.com.my/journey-planner
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">PULSE app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The official Rapid KL app — same journey planning on your phone, free on iOS and Android, plus live
              service info once you&apos;re en route.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">KLIA Ekspres app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Buy your KLIA Ekspres ticket and check live schedules directly — worth having installed before you land
              rather than queuing at a machine.
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Race-day shuttle — free, and confirmed for 2026</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Rapid KL is running 95 free shuttle buses to the circuit across all three days, every 10 to 15 minutes from
          7am to midnight — no ticket or booking needed, just turn up at one of the three pickup points below.
        </p>
        <div className="flex flex-col gap-3">
          <FactRow label="Pickup 1" value="KLIA Terminal 2, Level 1 bus hub" />
          <FactRow label="Pickup 2" value="Mitsui KLIA bus hub" />
          <FactRow label="Pickup 3" value="De-Village, Persiaran Millenia 2, Bandar Baru Enstek" />
          <FactRow label="Frequency" value="Every 10–15 min, 7am–midnight, all 3 race days" />
          <FactRow label="Cost" value="Free" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Driving instead?</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sepang has built for it — designated parking bays numbered 1 through 17, first-come first-served, with a
          flat per-race-week entry fee that&apos;s run around RM20 for cars at recent events (not a daily charge —
          historically levied once for the whole race week). Follow the marshals to your assigned bay rather than
          looking for street parking; vehicles left in unauthorised spots have been towed and ticketed at past
          events. <span className="text-white font-bold">There is no motorcycle parking at the circuit this year</span> — riders should park at
          one of the three shuttle pickup points above and take the free shuttle in.
        </p>
      </div>

      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Whichever way you arrive, the story here isn&apos;t complicated logistics — it&apos;s the opposite. Sepang is
        one of the few Grand Prix venues in the world where the airport and the circuit are close enough that a
        single train ticket or a short shuttle ride is genuinely all it takes.
      </p>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which terminal matters</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Fly into KLIA Terminal 2 if you can choose it — it&apos;s where the KLIA Ekspres and the race shuttle hub
          both depart from. Terminal 1 is a separate building several minutes away by the inter-terminal shuttle, so
          if you land at T1, budget that extra transfer before you can pick up the train or the race-day bus to the
          circuit.
        </p>
      </div>

      {transit && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={transit} isPro={isPro} />
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: kliaekspres.com (official fares, Race Train Pass terms and timing), Rapid KL (confirmed free
        shuttle schedule and pickup points), tickets.formula1.com, myrapid.com.my (official Journey Planner and
        PULSE app). Car parking fee is a historical pattern from prior MotoGP/F1 events, not yet reconfirmed for
        this relocated race.
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
