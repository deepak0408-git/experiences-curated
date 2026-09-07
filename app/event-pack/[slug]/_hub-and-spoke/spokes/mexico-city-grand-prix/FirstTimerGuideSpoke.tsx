import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const venueGuide = linkedExperiences.find((e) => e.slug.includes("autodromo-hermanos-rodriguez-venue-"));
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
      h1="5 mistakes first-time visitors make at Mexico City"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Mexico City carries a genuinely different weight than most races on the calendar — a circuit named after two
        drivers who died racing, threaded through a converted baseball stadium, sitting higher above sea level than
        anywhere else F1 visits, in a city hosting one of its biggest cultural weekends of the year at the exact same
        time. Here&apos;s what genuinely trips up a first-time visitor, drawn from the real detail in this pack
        rather than generic advice.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — not knowing race day closes different Metro stations</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Ciudad Deportiva, Puebla, and Pantitlán stations actually close on race day itself to manage crowd flow —
          a genuine, planned closure, not a malfunction. Showing up expecting your usual gate-matched station to be
          open on Sunday, when it worked fine on Friday and Saturday, is a real and common way to get caught out.
          Velódromo stays open regardless of gate and is the reliable fallback.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — booking a hotel without accounting for Día de Muertos</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          2026 race weekend lands directly on the city&apos;s Día de Muertos Grand Parade weekend — one of the
          biggest tourism draws in Mexico City&apos;s entire calendar, entirely independent of the race. Booking a
          hotel on a normal race-weekend timeline, rather than the earlier window this specific overlap demands, is a
          real risk of ending up with worse availability or a higher rate than expected.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — packing for one temperature</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Daytime highs run a pleasant 18-22°C, but nights and early grandstand queues drop to 8-12°C — a real cold,
          not a mild cooling. Packing only for the daytime warmth means an uncomfortable early morning arrival;
          packing only for the evening chill means carrying dead weight through the warmest part of the day. Layer
          for both.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — underestimating the altitude</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          At over 2,200 meters, this is the highest-altitude circuit on the F1 calendar. Some visitors feel genuinely
          short of breath or more tired than expected in their first day or two — normal adjustment, not a medical
          concern, but worth pacing your first day&apos;s walking around rather than pushing through at your usual
          pace. The altitude also means UV exposure is stronger than the temperature suggests — sunscreen matters
          even on a mild-feeling day.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — trying to bring a seat cushion or full backpack</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Chairs and seat cushions are explicitly prohibited — genuinely enforced, and commonly confiscated at the
          gate. Bags face a real size limit too, with security screening that runs closer to an airport checkpoint
          than a typical sporting-event bag check. Pack light and expect a genuine search, not a quick wave-through.
        </p>
      </div>

      {venueGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={venueGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">How to use the three days</p>
      <div className="flex flex-col gap-3 mb-8">
        <DayCard day="Friday — Practice, Zócalo & historic center" summary="The lightest day on track — a good window to fit in the Zócalo/Cathedral/Templo Mayor loop in the city before race weekend gets busier." />
        <DayCard day="Saturday — Qualifying & the Día de Muertos parade" summary="Two real commitments on the same day this year — qualifying and the parade both need sequencing, not a casual approach." />
        <DayCard day="Sunday — Race day" summary="The busiest day by far, with several Metro stations closing to manage crowd flow. Arrive early and budget real buffer time." />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Practical essentials</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">The official F1 Race Guide app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Covers every circuit on the calendar, including Mexico City — interactive circuit maps, real-time
              schedule alerts, and geotagged points for grandstands, food, and Fan Zone activities. Worth
              downloading before you land.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">The Metro CDMX app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Worth downloading before you arrive — it&apos;s the fastest way to check real-time service alerts,
              including the race-day station closures above, before you leave your hotel rather than after you&apos;re
              already at the platform.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Uber or DiDi</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Both operate widely across the city and are genuinely useful for getting between neighborhoods and
              restaurants — just not for the final approach to the circuit itself on race weekend, when road
              closures keep them well short of the gates.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A reusable water bottle</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The altitude dehydrates faster than sea-level habits account for — treat hydration as a real part of
              managing the adjustment, not an afterthought.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Comfortable shoes, genuinely</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              The circuit sits inside a large public sports complex, not a purpose-built venue — expect real
              distance on foot between gates, grandstands, and the Fan Zone over a full day.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Sunscreen, even on a mild-feeling day</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Altitude means real UV exposure regardless of how warm the air actually feels — easy to underestimate
              on a day that doesn&apos;t feel hot.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The genuine first-timer trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Don&apos;t treat this as a generic race weekend layered on top of a generic city trip — the circuit&apos;s
          own history (named for two drivers who died racing), the stadium-through-track feature at Foro Sol, and
          the Día de Muertos overlap all make this a genuinely different kind of weekend than most other stops on the
          calendar. Build real time into your schedule for the city itself, not just the track.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What actually matters most, first time</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book your hotel and tickets earlier than you would for a typical Grand Prix — both the Día de Muertos
            overlap and this race&apos;s own history of selling out within a single day compound into a genuinely
            higher-stakes planning window than most other stops on the calendar. Everything else — the altitude
            adjustment, the packing layers, the Metro station logistics — is manageable with the detail already in
            this pack; the one irreversible mistake is waiting too long on the two things that can actually sell out
            entirely.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}

function DayCard({ day, summary }: { day: string; summary: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-sm font-bold text-white mb-1">{day}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{summary}</p>
    </div>
  );
}
