import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "getting-there";

export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const transit = linkedExperiences.find((e) => e.slug.includes("getting-to-sepang-circuit-klia"));
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
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
        No other circuit on the Formula 1 calendar sits where Sepang does — practically inside its own international
        airport. KLIA Terminal 2&apos;s transportation hub is a genuine one-minute walk from the circuit grounds,
        which means the usual &quot;how do I get from the airport to the track&quot; question barely applies here the
        way it does at Monza, Spa, or almost anywhere else on the calendar. If you&apos;re flying in for the weekend,
        your journey from touchdown to gates could realistically be under 20 minutes.
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

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Race-day shuttle</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A dedicated shuttle service has historically run directly between KLIA Terminal 2 and the circuit gates on
          race day, roughly 08:00 to 23:00, taking 20-30 minutes depending on traffic and dropping you within two
          minutes&apos; walk of the entrances. Pricing for past events has run around RM12 per trip. F1 hasn&apos;t
          published the exact 2026 shuttle arrangements for this relocated race yet — this is the pattern the circuit
          has run for MotoGP and previous F1 weekends, not a confirmed 2026 fact. Confirm via{" "}
          <a href="https://tickets.formula1.com/en/f1-83069-bahrain-in-malaysia" target="_blank" rel="noopener noreferrer" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            tickets.formula1.com
          </a>{" "}
          closer to race weekend.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Driving instead?</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sepang has built for it — designated parking bays numbered 1 through 17, first-come first-served, with a
          flat per-race-week entry fee that&apos;s run around RM20 for cars and RM10 for motorbikes at recent events
          (not a daily charge — historically levied once for the whole race week). Follow the marshals to your
          assigned bay rather than looking for street parking; vehicles left in unauthorised spots have been towed
          and ticketed at past events.
        </p>
      </div>

      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Whichever way you arrive, the story here isn&apos;t complicated logistics — it&apos;s the opposite. Sepang is
        one of the few Grand Prix venues in the world where &quot;getting to the circuit&quot; and &quot;getting off
        the plane&quot; are almost the same sentence.
      </p>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which terminal matters — a lot</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Fly into KLIA Terminal 2 if you can choose it — it&apos;s the one-minute walk. Terminal 1, by contrast, is
          close to an hour on foot from the circuit, so if you&apos;re flying into T1, plan on a taxi or the
          connecting shuttle to T2 rather than assuming both terminals are equally close.
        </p>
      </div>

      {transit?.whyItsSpecial && (
        <p className="text-sm text-[#A3A3A3] leading-7">
          {transit.whyItsSpecial.split("\n\n")[0]}
        </p>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: kliaekspres.com (official fares/timing), tickets.formula1.com, myrapid.com.my (official Journey
        Planner and PULSE app). Race-day shuttle and 2026 parking figures are a historical pattern from prior
        MotoGP/F1 events, not yet confirmed for this relocated race.
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
