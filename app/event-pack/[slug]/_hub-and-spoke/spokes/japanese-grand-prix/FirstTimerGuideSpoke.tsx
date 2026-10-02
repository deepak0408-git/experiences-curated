import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Real content sourced from the seeded First-Timer's Guide
// (japanese-gp-suzuka-first-timer-guide), Ticket Guide
// (japanese-gp-suzuka-ticket-guide), and Getting to Suzuka
// (japanese-gp-suzuka-getting-there) experiences, 30 Sep 2026 — rebuilt to
// match the "5 mistakes" + "Practical essentials" format used on Brazilian
// GP's FirstTimerGuideSpoke, which this spoke was previously missing
// entirely (thematic sections instead). Every mistake below traces to a
// whatToAvoid/insiderTips claim already sourced in one of those three
// scripts — no new claims introduced.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const firstTimerGuide = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-first-timer-guide"));
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
      eventName="Japanese Grand Prix"
      status="public"
      h1="5 mistakes first-time visitors make at Suzuka"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Suzuka isn&apos;t a straightforward first Grand Prix — it&apos;s remote by circuit standards, it doesn&apos;t
        sit inside a major city the way Singapore or Melbourne do, and 2027 adds a genuine wrinkle: Suzuka&apos;s
        first-ever Sprint weekend. Here&apos;s what genuinely trips up a first-time visitor, drawn from the real
        detail in this pack rather than generic advice.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — expecting a standard three-practice weekend</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Friday covers Practice 1 and Sprint Qualifying only — there&apos;s no FP2 or FP3 this year. Saturday
          carries both the Sprint race and qualifying for Sunday&apos;s Grand Prix, so it isn&apos;t a day to
          treat as optional. Two real, competitive sessions inside three days is a genuinely different rhythm
          from the weekend most returning fans expect.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — trying to book a hotel in Suzuka itself</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Suzuka, Tsu, and Yokkaichi&apos;s limited hotel stock gets taken by teams and media early. Base
          yourself in Nagoya instead — it&apos;s the established pattern for a reason, and its rail connection
          to the circuit is well established for race weekend.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — assuming GA gets you into every grandstand on Friday</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          General Admission grants Friday-only access to every grandstand except V1 and V2 — a genuinely useful
          way to scout two or three stands before committing to one for the weekend, unless one of those two is
          the stand you actually want to try.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — cutting race-day travel time close</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Every train and shuttle on the Nagoya-Suzuka route runs at capacity during the Grand Prix weekend. A
          missed connection on a day with a fixed session start is a real risk, not a remote one — leave earlier
          than feels necessary, especially on Sunday.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — buying a grandstand seat by name alone</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Roughly a dozen individually priced grandstands split into real tiers by seat type, not just price —
          most use bench or bleacher seating, some of the newer temporary stands (G3, G4, G5, M, P, O) are bare
          concrete or gravel terraces, and only the premium stands (A2, Q2, V1, V2) use bucket seats with
          headrests. A hard bench for three consecutive days is a real comfort tradeoff worth checking before
          you buy.
        </p>
      </div>

      {firstTimerGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={firstTimerGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Practical essentials</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">A Suica IC card, loaded before you land</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Works nationally including the Nagoya region, covers trains, buses, and most convenience store
              purchases. Load it onto Apple Pay or Google Wallet before you land to skip a ticket-machine queue
              on your first day.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">The GO app, not Uber</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              GO is the widely used ride-hailing app in Japan with a genuine footprint near Suzuka. Uber operates
              in the country but with limited coverage outside major cities — don&apos;t assume it&apos;ll be
              your fallback everywhere.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Check for the Suzuka Grand Prix limited express</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              This joint JR/Ise Railway direct service runs during the Grand Prix and cuts the Nagoya-to-circuit
              journey to about an hour with no transfers — a genuine improvement over the standard connecting
              route, when it&apos;s running on your travel day.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Read the Ticket Guide before you buy</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The tier structure here rewards understanding it up front more than at almost any other circuit on
              the calendar.{" "}
              <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
                Full breakdown here
              </a>
              .
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Plan Friday around the fan zones</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              GP Square and the West Fanzone run free programming — driver appearances, sim racing — all
              weekend, filling the real gaps a Sprint weekend&apos;s lighter Friday schedule leaves open.
              Motopia, the Honda motorsport museum attached to the circuit, is worth a slot too.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Book earlier than feels necessary</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Suzuka&apos;s premium grandstands and hospitality packages have historically sold out well before
              race week once sales open — waiting until close to the event is a real risk for anything above
              general admission.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The genuine first-timer trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          None of this is complicated once it&apos;s laid out — it&apos;s just genuinely different from a
          standard three-day race weekend. A first Suzuka trip built on assumptions from other circuits runs
          into real friction; one built on the detail already in this pack doesn&apos;t.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What actually matters most, first time</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Read the Ticket Guide before you buy and base yourself in Nagoya, not Suzuka — those two calls shape
          everything else. The rest — the Suica card, the GO app, the fan zones filling Friday&apos;s downtime —
          is manageable with the detail already in this pack.
        </p>
      </div>
    </SpokeShell>
  );
}
