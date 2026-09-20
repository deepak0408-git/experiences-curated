import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

// "Melbourne's Coffee Culture" (reused, shared with Australian Open/NZ
// cricket) is the only dedicated dining experience in this pack, and it's
// coffee-only — no food content, and written around the CBD/Fitzroy corridor,
// not Albert Park. No dedicated Albert-Park/South-Melbourne/St-Kilda dining
// experience exists yet — an honest gap, not glossed over. This spoke's own
// free-text content is researched directly (never delegated), sourced to
// grandprix.com.au's own trackside vendor coverage for the "Inside the
// circuit" section (named vendors, real A$ menu prices) and Broadsheet/
// Sitchu/South Melbourne Market's own trader page for the South
// Melbourne/St Kilda picks — real, currently-operating businesses, not
// invented ones.
export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const coffeeGuide = linkedExperiences.find((e) => e.slug.includes("melbourne-coffee-food-culture-guide-bt5u1c"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Australian Grand Prix"
      status="teaser"
      h1="140 outlets trackside, Clarendon Street and the Market outside, St Kilda's beachfront a tram ride away"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The named trackside vendors and area picks above are free. Unlock the pack for our direct verdict on which one to book for each moment of the trip — which vendor for a quick between-sessions bite versus a proper sit-down, which St Kilda restaurant for a relaxed night versus an occasion dinner, and the one line (Charrd) and one booking trap (Chin Chin's fixed 45-minute slots) that catch first-timers every race weekend."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Eating at Albert Park splits into three real decisions: what to eat inside the circuit between sessions,
        where to eat once you&apos;re back in South Melbourne for the evening, and whether a St Kilda or CBD detour
        is worth the tram ride on a quieter day. Melbourne&apos;s food and coffee scene is a genuine draw in its own
        right — the city built its reputation on independent cafes and restaurants rather than chains, and race
        weekend is a real excuse to use it.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Inside the circuit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Race weekend runs 140 food outlets and 27 of Melbourne&apos;s own restaurants, bars, and eateries trackside
          — this isn&apos;t generic stadium catering, it&apos;s real local names running pop-ups for the weekend.
          Real, named picks:
        </p>
        <ul className="text-sm text-[#A3A3A3] leading-6 space-y-2 mb-4 list-disc pl-5">
          <li><span className="text-white font-bold">Chin Chin</span> (Melbourne Junction) — a 124-seat pop-up from the CBD Thai/South-East Asian icon, running a six-course tasting menu in 45-minute rotations.</li>
          <li><span className="text-white font-bold">Charrd</span> (Melbourne Junction) — the viral fried chicken sandwich burger joint, known for round-the-block lines; get in early.</li>
          <li><span className="text-white font-bold">Royal Stacks</span> (Melbourne Junction) — smash-burger chain, &quot;My Cousins VL&quot; double fried chicken burger.</li>
          <li><span className="text-white font-bold">Hochi Mama</span> (Melbourne Junction) — South Asian, Mama&apos;s Banh Mi with crispy pork belly, A$18; vegetarian option available.</li>
          <li><span className="text-white font-bold">Gelato Messina</span> (Melbourne Junction) — Grand Prix-exclusive &quot;Fast &amp; Frozen&quot; ice cream sandwich, A$14.</li>
          <li><span className="text-white font-bold">Lune Croissanterie</span> (Melbourne Junction) — Tim Tam pain au chocolat, from Melbourne&apos;s best-known croissant maker.</li>
          <li><span className="text-white font-bold">400 Gradi</span> (Motorsport Straight) — exclusive &quot;The Burning Fuel&quot; pizza, San Marzano tomato, hot salami, BBQ sauce, hot chilli oil.</li>
          <li><span className="text-white font-bold">All Things Equal</span> (Motorsport Straight) — social-enterprise cafe, pies, salads, &quot;The Grand Peach&quot; dessert, A$14.</li>
          <li><span className="text-white font-bold">Madeline&apos;s</span> (Motorsport Straight) — modern French, Shake Le Steak with frites and Café de Paris butter.</li>
          <li><span className="text-white font-bold">Grill Americano</span> (American Express Lounge) — Italian steakhouse pop-up, premium hospitality ticket holders only.</li>
        </ul>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Vendor names and locations are confirmed for a recent race weekend and typically return in similar form
          year to year, but the exact lineup is reconfirmed by the Grand Prix&apos;s own fan-zone coverage closer to
          each event — treat this as a strong guide to what&apos;s there, not a guarantee every named vendor repeats
          in 2027. Melbourne Junction and Motorsport Straight are the two real vendor clusters; eating during a
          practice session rather than the 20 minutes right after a headline session ends avoids the worst of the
          queues.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">South Melbourne — closest to the circuit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Clarendon Street, South Melbourne&apos;s main strip, sits a genuine walk from the circuit gates and
          carries a real local cafe and restaurant scene — a practical option for a pre- or post-session meal
          without needing the tram into the city. Real, named picks:
        </p>
        <ul className="text-sm text-[#A3A3A3] leading-6 space-y-2 mb-4 list-disc pl-5">
          <li><span className="text-white font-bold">Kirbie</span> (323 Clarendon Street) — European bistro and wine bar bringing London-caff energy to the strip, spinach-and-ricotta gnudi to rabbit ragù cavatelli.</li>
          <li><span className="text-white font-bold">Pondok Nasi Bakar</span> (179-181 Clarendon Street) — a few doors down, a solid Indonesian pick for something more casual than a sit-down bistro.</li>
          <li><span className="text-white font-bold">Mama Tran Dumpling</span> (South Melbourne Market, stall 35) — 16 varieties of freshly-made dumplings, BBQ pork buns, and dim sims, a genuine sit-down lunch rather than just a produce-market snack.</li>
        </ul>
        <p className="text-sm text-[#A3A3A3] leading-6">
          South Melbourne Market itself sits a few minutes further up Coventry Street from Clarendon Street and is
          worth the detour on its trading days (Wednesday, Friday-Sunday) — check opening days before planning a
          visit around it, since it&apos;s not a daily market.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">St Kilda — the beachfront detour</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          St Kilda sits a short tram ride from Albert Park and is a genuinely different scene — beachfront dining
          and Fitzroy Street&apos;s restaurant strip rather than a race-day food court. Real, named picks:
        </p>
        <ul className="text-sm text-[#A3A3A3] leading-6 space-y-2 mb-4 list-disc pl-5">
          <li><span className="text-white font-bold">Republica</span> (10-18 Jacka Boulevard, at St Kilda Sea Baths) — modern Australian menu directly overlooking Port Phillip Bay, a dog-friendly courtyard, weekend breakfast, live music.</li>
          <li><span className="text-white font-bold">Cafe Di Stasio</span> (31 Fitzroy Street) — one of Melbourne&apos;s most respected Italian restaurants, white-jacketed service and a genuinely theatrical dining room, cotoletta alla bolognese a signature.</li>
          <li><span className="text-white font-bold">Donovans</span> (40 Jacka Boulevard) — a long-running St Kilda institution, relaxed beach-house dining a short walk from Republica.</li>
        </ul>
        <p className="text-sm text-[#A3A3A3] leading-6">
          All three book out a week or more ahead for weekend dinners — this is a plan-ahead pick for one evening of
          the trip, not a walk-in option during race week itself.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Melbourne's coffee culture — worth the detour</p>
      {coffeeGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={coffeeGuide} isPro={isPro} hideProCtas />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How we&apos;d actually plan the food side of the trip</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Eat inside the circuit for the sessions themselves — Melbourne Junction is the stronger cluster of the
            two, with Chin Chin and Hochi Mama the standout picks; save Motorsport Straight&apos;s 400 Gradi for a
            quicker between-sessions pizza rather than a sit-down. Save a proper sit-down meal for South Melbourne
            on Clarendon Street after you&apos;ve left for the day — Kirbie is the better pick for an actual dinner,
            Pondok Nasi Bakar for something faster and cheaper. Reserve one evening for St Kilda: Republica is the
            right call for a relaxed, bay-view dinner that also works for breakfast the next morning if you&apos;re
            staying nearby, while Cafe Di Stasio is the pick if you want a genuine occasion meal rather than a
            casual one — both need booking well ahead of race week itself, not just the weekend it falls on.
            Reserve one morning (Thursday or Friday, when the circuit is quieter) for a CBD coffee detour rather
            than trying to fit it in on a full race day.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The booking detail that actually matters</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Charrd&apos;s round-the-block line is real, not exaggerated — go in the first hour of the day&apos;s
            session or skip it, since it doesn&apos;t thin out later. Chin Chin&apos;s 124-seat pop-up runs fixed
            45-minute rotations rather than open seating, so it&apos;s a bookable slot, not a walk-up queue — treat
            it like a restaurant reservation, not a food-court stall. For South Melbourne and St Kilda, book the
            moment your dates are fixed: Kirbie and Cafe Di Stasio in particular are small-format venues that sell
            out their prime dinner slots for a major race weekend well before the week itself arrives.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Coffee, done right</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Patricia Coffee Brewers is standing-room-only with no seats — treat it as a fast stop on the way
            somewhere else, not a sit-down destination. If you want an actual sit-down cafe morning, Industry Beans
            in Fitzroy is the better pick, but budget a proper half-morning for the tram ride there and back rather
            than squeezing it between sessions.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
