import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "first-timer-guide";

// Real content sourced from the seeded First-Timer's Guide to São Paulo
// (brazilian-gp-first-timer-guide-mtx7ldx9) and Getting There
// (brazilian-gp-getting-to-interlagos-mtx6udv3) experiences, 12 Sep 2026:
// rideshare over street taxis, Bilhete Único, no-GA circuit structure,
// road closures/parking making driving to the circuit a mistake. The
// Interlagos venue overview card (interlagos-autodromo-jose-carlos-pace-
// venue-mtx6m894) was removed from this spoke 12 Sep 2026 — it's already
// linked in MapSpoke, and didn't need to appear in two spokes.
export default async function FirstTimerGuideSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const firstTimerGuide = linkedExperiences.find((e) => e.slug.includes("brazilian-gp-first-timer-guide-"));
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
      h1="5 mistakes first-time visitors make in São Paulo"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        São Paulo is enormous — genuinely one of the largest cities in the world by metro population — racing at a
        circuit with no General Admission tier and its own real weather pattern. Here&apos;s what genuinely trips
        up a first-time visitor, drawn from the real detail in this pack rather than generic advice.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 1 — hailing a street taxi</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Rigged meters and inflated flat-fare scams are a real, well-documented issue specifically with unregulated
          street taxis in São Paulo — rideshare apps exist precisely to avoid this problem. Stick to Uber or 99
          rather than hailing anything on the street, even one that looks official.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 2 — assuming there's a General Admission fallback</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Interlagos sells no GA ticket at all — every seat is a fixed, reserved grandstand letter for the whole
          weekend. Buying without checking the Ticket Guide first means you can't relocate or upgrade once
          you're there, unlike circuits with a GA wristband option.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 3 — bringing an umbrella instead of a rain jacket</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Umbrellas are explicitly banned from the circuit grounds. With a 48% daily chance of rain in November, a
          packable rain jacket is the only real in-venue option if you're seated in an uncovered stand.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 4 — underestimating the city's scale</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          "Central São Paulo" doesn't mean one compact area the way it might in a smaller city. Staying in one of
          the well-connected, well-established neighborhoods — Jardins, Itaim Bibi, Pinheiros, Vila Madalena, or
          right on Avenida Paulista — matters more here than in most cities this pack covers.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Mistake 5 — renting a car and driving to the circuit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-10">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Road closures around Interlagos on every race-weekend session day create real, multi-kilometer backups
          that regular São Paulo commuters already route around, and parking near the venue is both limited and
          priced well above the city&apos;s normal rate. Metrô Line 9 or the F1 Express shuttle are both faster and
          cheaper than driving in.
        </p>
      </div>

      {firstTimerGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={firstTimerGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Practical essentials</p>
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
            <p className="text-sm font-bold text-white mb-1">Uber and 99</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Download both before you land — 99 sometimes has shorter wait times or lower prices depending on the
              neighborhood and time of day, and having both gives you a genuine fallback if one is slow to find a
              driver.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Bilhete Único</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Buy this transit card on your first day even if you're mostly using rideshare — it's the fastest way
              onto Metrô Line 9 for Interlagos, and loading it once beats a ticket-machine queue on race morning.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Confirm the license plate before getting in</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              A basic safety habit worth making automatic — check the plate on your rideshare app matches the car
              before you get in, the same standard practice as any large city.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">A reusable water bottle</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              A full race day at Interlagos means real hours outdoors between gates, grandstands, and the fan zone —
              treat hydration as part of the plan, not an afterthought.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Comfortable shoes, genuinely</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Interlagos is a large circuit and São Paulo itself is enormous — expect real distance on foot both
              inside the venue and around whichever neighborhood you're staying in.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">The rain jacket, packed every day</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              With a 48% daily chance of rain in November and umbrellas banned from the circuit, a packable rain
              jacket earns its space in the bag even on a morning that starts clear.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Printed or app ticket — either works</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Interlagos accepts both a printed ticket and the mobile version in your ticketing app at the gate —
              just make sure whichever you're relying on is downloaded and accessible before you lose signal in the
              crowd near the entrance.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The genuine first-timer trap</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          A trip built around Jardins, Itaim Bibi, Vila Madalena, and Interlagos itself — which is exactly what
          this pack covers — sits well within the city's most straightforward, well-connected areas. Don't let
          generic "is São Paulo safe" anxiety about the wider metro area change how you plan a trip that never
          actually leaves those neighborhoods.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What actually matters most, first time</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book your ticket and hotel earlier than you'd think necessary — several grandstands, including Turn
            1's Grandstand M, have sold out months ahead of the 2026 race, and there's no GA fallback if your first
            choice sells out. Everything else — the rideshare habits, the rain-jacket-not-umbrella rule, the
            neighborhood choice — is manageable with the detail already in this pack.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
