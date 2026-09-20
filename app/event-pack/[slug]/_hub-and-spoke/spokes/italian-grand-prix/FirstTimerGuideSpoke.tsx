import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Real content sourced from the seeded First-Timer's Guide to the Italian GP
// (italian-gp-first-timer-guide-mu7ckouk), The Tifosi — Ferrari's Red Army
// at Monza (the-tifosi-ferraris-red-army-mrbuads9), and Hotel de la Ville
// (Milan-vs-Monza staying trade-off) experiences, 19 Sep 2026: the track
// invasion after the chequered flag, the Tifosi's identity as specifically
// Ferrari fans (not a generic word for fans), ear protection, the Getting to
// the Circuit experience's train-then-park-walk logistics, weather figures
// from the Weather spoke, and the post-race crowd exit. Practical essentials
// checklist mirrors the structure of the Brazilian GP sibling spoke.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const firstTimerGuide = linkedExperiences.find((e) => e.slug.includes("italian-gp-first-timer-guide-"));
  const tifosi = linkedExperiences.find((e) => e.slug.includes("the-tifosi-ferraris-red-army-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Italian Grand Prix"
      status="public"
      h1="What happens the second the chequered flag drops — and why nobody warns you"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Most F1 races feel like a sporting event with a crowd attached. Monza feels like the crowd is the event,
        and the racing happens inside it. This is Ferrari&apos;s home race — the Tifosi (Ferrari&apos;s fans
        specifically, not a generic word for fans in general) treat the weekend as closer to a religious holiday
        than a ticketed sports fixture. Here&apos;s what genuinely trips up a first-time visitor.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The track invasion — decide in advance</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          At most circuits, the crowd files out after the race. At Monza, tens of thousands of fans flood directly
          onto the start/finish straight the moment the race ends, standing on the actual tarmac to watch the
          podium ceremony live. It&apos;s sanctioned by the circuit, not a security failure — if you don&apos;t
          know it&apos;s coming you&apos;ll either miss it trying to leave early or get swept into it by accident.
          Stay in your seat until the chequered flag and follow the marshals&apos; directions if you want to be
          part of it.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Grandstand over GA for a first visit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          General Admission at Monza means moving between viewing spots across a genuinely large park-forest site —
          a lot to navigate on your first visit without already knowing the ground. A grandstand along the
          start/finish straight puts you in the thickest part of the Tifosi atmosphere, arguably the actual point
          of a first Monza trip.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Bring ear protection</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Cars at Monza&apos;s front straight are louder at close range than most first-timers expect — genuinely
          uncomfortable without something in your ears. Foam plugs are cheap and widely sold at the circuit if you
          forget to pack your own.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Download before you lose signal</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Mobile networks slow down badly once tens of thousands of phones are competing for signal inside the
          park. The official F1 app for live timing and results, and Monza&apos;s own wayfinding app, both matter
          more here than at a purpose-built stadium circuit — download both before you leave your accommodation.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting out after the flag drops</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Once the track invasion clears, tens of thousands of people are funneling back through the same park
          paths toward Monza station at once — a genuinely slow, shuffling walk, not a quick exit. Don&apos;t plan
          a tight onward train or flight connection for race evening, and if you&apos;re staying at the circuit
          itself rather than commuting back to Milan, you skip this entirely.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Milan base, or stay at the circuit itself</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Most visitors stay in Milan — better train links, far more hotel choice, the city itself — and commute in
          on the S8/S9/S11 lines each session day. The trade-off is a real one: roughly 20 minutes each way by
          train plus the park walk at the Monza end, three times over a race weekend. Staying in Monza itself (Hotel
          de la Ville, opposite Villa Reale, is the standout option here) cuts that to a walk through the park
          straight to the gates, no train involved — at a real premium, and rooms sell out months ahead of
          September.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Weather that can turn without warning</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Early September in Lombardy runs warm — daytime highs commonly in the high 20s Celsius — but the region
          sees genuine late-summer thunderstorms that can move in fast on an otherwise clear morning. Monza is
          unusually permissive on umbrellas (a small one without a metal tip is allowed through the gate, unlike
          most F1 circuits), but a packable rain layer is still the safer call in an uncovered stand or GA section.
        </p>
      </div>

      {firstTimerGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={firstTimerGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      {tifosi && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={tifosi} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Practical essentials</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">The official F1 Race Guide app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Covers every circuit on the calendar, including Monza — interactive circuit maps, real-time schedule
              alerts, and geotagged points for grandstands, food, and fan-zone activities. Worth downloading before
              you land.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Ear protection</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Cars at Monza&apos;s front straight are louder at close range than most first-timers expect. Foam
              plugs are cheap and widely sold at the circuit if you forget to pack your own.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A packable rain layer</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Even with umbrellas allowed here, juggling one in a packed grandstand or GA crowd is its own kind of
              hassle — a jacket keeps both hands free and covers the genuine late-summer storm risk.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Sun protection</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Late-summer sun in Lombardy is still strong across a full day outdoors, especially in an uncovered GA
              section like Lesmo or Curva Grande.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Comfortable walking shoes, genuinely</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Monza sits inside a genuinely large park — grandstands, gates, and the Fan Zone are spread across real
              distance, more so than a purpose-built stadium circuit.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A reusable water bottle</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              A full race day at Monza means real hours outdoors between gates, grandstands, and the fan zone —
              treat hydration as part of the plan, not an afterthought.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Printed or app ticket — either works</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Monza accepts both a printed ticket and the mobile version in your ticketing app at the gate — just
              make sure whichever you&apos;re relying on is downloaded and accessible before you lose signal in the
              crowd near the entrance.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Recalibrate your expectations</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          If you&apos;ve been to other Grands Prix, the noise, the flag-waving, and the sheer density of red in
          every grandstand here is not typical F1 crowd energy — it&apos;s specific to this one. Ferrari&apos;s win
          record at its own home race is not actually that dominant on paper; it doesn&apos;t matter to the
          Tifosi, and it shouldn&apos;t change how you read the atmosphere either.
        </p>
      </div>

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What actually matters most, first time</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Book your ticket and hotel earlier than you&apos;d think necessary — this is Ferrari&apos;s home race,
          and several grandstands have a track record of selling out months ahead. Decide on the track invasion
          before race day, not in the moment. Everything else — the train-then-park-walk logistics, the ear
          protection, the layering for a warm day that can turn stormy — is manageable with the detail already in
          this pack.
        </p>
      </div>
    </SpokeShell>
  );
}
