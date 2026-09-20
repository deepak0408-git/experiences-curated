import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Real content sourced from the seeded Getting to the Circuit experience
// (getting-to-the-circuit-monza-mqz786l4), 19 Sep 2026: S8/S9/S11 suburban
// trains from Porta Garibaldi, ~20 minutes to Monza station, then a walk
// through Parco di Monza — a genuine part of the arrival experience, not
// just a transit detail, since the circuit sits inside a royal park.
// Gate-matching detail added 20 Sep 2026 per founder request: gate letters
// and which side of the park each arrival route lands on are sourced from
// the seeded Arrival & Queue Guide experience (seed-italian-gp-arrival-queue.mjs)
// and grandstand experiences' own gettingThere fields (Gate D serves Lesmo/
// Curva Grande GA and grandstands; Gate A/B serves the start/finish straight
// stands; Gate G serves the Fan Zone/Mirabello end, where the Black Line
// shuttle drops). Grandstand 22 and 26 callout added same day, per founder
// follow-up that the pack's two focus stands weren't covered: Grandstand
// 22's own gettingThere field states Gate G directly (seed-italian-gp-
// grandstand-22.mjs). Grandstand 26 has no gate letter in its own seed
// script, but sits on the same start/finish straight as Grandstand 1 and 5,
// both of which explicitly cite Gate A/B in their gettingThere fields
// (seed-italian-gp-grandstand-1.mjs, seed-italian-gp-grandstand-5.mjs) —
// Gate A/B is inferred for Grandstand 26 from that shared location, not
// independently confirmed for Grandstand 26 by name.
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettingThereGuide = linkedExperiences.find((e) => e.slug.includes("getting-to-the-circuit-monza-"));
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
      h1="Train from Porta Garibaldi, then a walk through the royal park that's already part of the day"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Monza sits inside Parco di Monza, a genuine royal park north of Milan — reaching the circuit is a
        straightforward train-then-walk journey, and the walk itself, through parkland rather than a car park or
        industrial approach road, is part of what makes arriving at Monza different from most other F1 venues.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">S8 / S9 / S11 suburban trains — the standard route</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          From Milan&apos;s Porta Garibaldi station, the S8, S9, and S11 suburban lines all reach Monza in roughly
          20 minutes. From Monza station, it&apos;s a walk into Parco di Monza and on to the circuit — budget real
          time for this, since the park is large and the walk is genuinely part of the arrival experience, not a
          quick five-minute stroll from a station exit. Walking the whole way is about 4.2km and takes 50–55
          minutes.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Which gate you end up at matters</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Most fans arriving by train do one of two things: walk the whole way through the park, or take the Black
          Line shuttle partway. Each option lands you at a different side of the circuit, so it&apos;s worth
          matching your route to your actual grandstand or GA section before you set off — Monza&apos;s perimeter
          is large enough that walking round to the wrong gate on a packed race day costs real time.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Walking the full route from Monza station through Parco di Monza brings you in on the Lesmo / Curva
          Grande side of the circuit, near Gate D — the closest entrance for the Lesmo-Ascari general admission
          areas and the Curva Grande grandstands. If your ticket is for the start/finish straight instead
          (Grandstand 1, Grandstand 5, Grandstand 26), Gate A or Gate B is your entrance, and it&apos;s a longer
          walk round from this side.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          The Black Line shuttle (Linea Nera) runs from the station&apos;s Piazza Castello exit over the race
          weekend, roughly 7:00am–8:30pm Friday to Sunday, and drops at the Viale Cavriga / Viale Mirabello
          junction — the Mirabello / Parabolica end of the park, closer to Gate G and the Fan Zone, still a
          15–20 minute walk from the gates itself but well short of the full 50–55 minute walk. A return ticket is
          €5 booked online in advance or €6 on the day; a combined train + shuttle ticket from any Milan station is
          also available for around €10. For general admission especially, where you&apos;ll likely be on your feet
          moving between viewing spots all day, it&apos;s worth deciding which side of the park you actually need
          to be on before choosing whether to walk or take the shuttle.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          For this pack&apos;s two focus grandstands specifically: <strong className="text-white">Grandstand 22</strong>{" "}
          (the Parabolica) is a Gate G stand — the Black Line shuttle side, not the long walk-through route — and
          sits about five minutes on foot from the Fan Zone.{" "}
          <strong className="text-white">Grandstand 26</strong> (pit lane, grid & podium, on the start/finish
          straight) is served by Gate A or Gate B, the same entrance as Grandstand 1 and Grandstand 5 — coming from
          the Black Line shuttle drop point means walking the long way round the outside of the circuit instead.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Don't drive</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Road access around the circuit gets genuinely congested on every session day of race weekend, and
          parking near the venue is both limited and priced well above what you&apos;d pay in Milan on a normal
          day. The train from Porta Garibaldi is faster and simpler than driving in for almost every visitor&apos;s
          starting point.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
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
            <p className="text-sm font-bold text-white mb-1">Trenord</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The operator behind the S8/S9/S11 suburban lines — download the app or buy paper tickets at Porta
              Garibaldi before race morning, when ticket-machine queues at the station build fast as the crowd
              grows.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A Milan transit app (ATM or similar)</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Useful for getting to Porta Garibaldi itself from wherever you&apos;re staying in Milan, and for
              getting around the city on non-session days.
            </p>
          </div>
        </div>
      </div>

      {gettingThereGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={gettingThereGuide} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Buy your Trenord ticket the day before at a quieter Milan station rather than at Porta Garibaldi on race
          morning, and build extra time into the walk from Monza station through the park — it&apos;s genuinely
          part of the day, not a formality to rush through, and arriving a little early beats a stressed walk
          against a crowd heading the same direction. And check your gate against your seat before you leave the
          hotel, especially if you&apos;re on general admission — Gate D for Lesmo/Curva Grande, Gate A/B for the
          start/finish straight (including Grandstand 26), Gate G for the Fan Zone end and Grandstand 22. Walking
          round the wrong way on a packed race day is a genuinely long detour.
        </p>
      </div>
    </SpokeShell>
  );
}
