import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const luxuryHospitality = linkedExperiences.find((e) => e.slug.includes("atp-finals-luxury-hospitality"));
  const luxuryHotels = linkedExperiences.find((e) => e.slug.includes("atp-finals-luxury-hotels"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Nitto ATP Finals"
      status="teaser"
      h1="Chauffeurs, rooftop dining, and three real hospitality tiers"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real hospitality tiers, hotel picks, and off-circuit venues are all free above. The Event Pack adds the actual per-person pricing for all four tiers — Break, Smash, Ace, and ATP No. 1 Club — plus our verdict on which one is genuinely worth the price jump, and how to sequence a luxury day around the tournament's own session schedule."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Luxury at the ATP Finals is a stack of decisions, not one purchase — the hospitality ticket is only one part
        of it. Here's what actually goes into a genuinely upscale week in Turin, before we get to the seating tier
        itself.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-6">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Transfeero publishes real fixed fares for Turin Caselle Airport to the city centre: a First Class transfer
          (Mercedes S-Class or BMW 7 Series class) starts from €130.07, including tolls, low-emission-zone fees,
          meet-and-greet, and 60 minutes' free wait for flight delays. A Standard Sedan (Mercedes E-Class/BMW 5
          Series) starts from €72.26 if you want the fixed-rate convenience without the top-tier car. Italy
          Chauffeur Service also runs an E-Class/S-Class fleet in Turin, but prices per vehicle on request rather
          than publishing a rate — get a quote directly if you want to compare. Worth booking specifically for arena
          transfers on hospitality days, since it removes any tram-connection planning entirely (see the{" "}
          <Link href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Getting There guide
          </Link>{" "}
          for the standard route).
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Off-circuit luxury venues</p>
      <div className="flex flex-col gap-3 mb-6">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Piano35</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A cocktail bar on the 35th floor of the Intesa San Paolo skyscraper, 167.25 metres up — floor-to-ceiling
            windows, real panoramic views over the entire city and out to the Alps. Turin's genuine high-altitude
            luxury venue.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">La Pista</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A rooftop restaurant built on the former Fiat test track at Lingotto, transformed into a landscaped
            garden by architect Benedetto Camerana — 360-degree views taking in Monviso, the Alps, and the Mole
            Antonelliana. A genuinely distinctive Turin story, not a generic rooftop.
          </p>
        </div>
      </div>

      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Principi di Piemonte's top-floor rooms carry the same Alpine-arch views that make Piano35 worth visiting.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {luxuryHotels && <SpokeExperienceCard experience={luxuryHotels} isPro={isPro} />}
        {luxuryHospitality && <SpokeExperienceCard experience={luxuryHospitality} isPro={isPro} />}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Real hospitality pricing, four tiers</p>
          <div className="overflow-x-auto rounded-sm border border-[#2A2A2A] mb-2">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1A1A1A] text-left">
                  <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00]">Tier</th>
                  <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00]">Includes</th>
                  <th className="px-4 py-3 text-xs font-black tracking-widest uppercase text-[#AAFF00]">Price per person, per session</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: "Break", includes: "Lower bowl seat, dedicated lounge with open bar for the full session, exclusive entrance, guest accompaniment", price: "€377 – €1,749" },
                  { tier: "Smash", includes: "Lower bowl seat, signature dining + open bar at an exclusive restaurant, fast-track entry, cloakroom, welcome gift", price: "€784 – €4,697" },
                  { tier: "Ace", includes: "Courtside seat, access to the practice court inside the arena, gourmet dining + open bar, welcome gift, guest services", price: "€1,008 – €5,734" },
                  { tier: "ATP No. 1 Club", includes: "New for 2026. Single-day access, reserved lower-bowl corner ticket, dedicated lounge, signature restaurant, behind-the-scenes tour, meet-and-greets with former World No. 1 players, on-court photo experience.", price: "enquiry", link: "https://atptourexperiences.com/atp-finals-2026" },
                ].map((row, i) => (
                  <tr key={row.tier} className={i % 2 === 0 ? "bg-[#141414]" : "bg-[#0A0A0A]"}>
                    <td className="px-4 py-3 text-white font-semibold align-top whitespace-nowrap">{row.tier}</td>
                    <td className="px-4 py-3 text-[#A3A3A3] align-top">{row.includes}</td>
                    <td className="px-4 py-3 text-[#A3A3A3] align-top whitespace-nowrap">
                      {row.link ? (
                        <a
                          href={row.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#AAFF00] hover:text-[#BBFF33] underline"
                        >
                          Not published — enquire via ATP Experiences →
                        </a>
                      ) : (
                        row.price
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#6A6A6A] mb-8">
            Real, published 2026 prices from nittoatpfinals.com/hospitality — the low end is a Tuesday/Wednesday
            group-stage day session, the high end is the Sunday final. ATP No. 1 Club is genuinely new for 2026 with
            no prior-year price to compare against; we won't estimate one.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which hospitality tier we'd pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Break is the real entry point most first-timers overlook — from €377 for a group-stage day session, it
            gets you a lower-bowl seat and a full-session open bar without Smash or Ace's price jump. Ace is worth
            the step up specifically for the courtside seating and practice-court access — it's the one thing
            genuinely unavailable at any other price point, official or resold. Smash sits in between: better value
            than Ace if your priority is the full dining experience across multiple sessions rather than the closest
            possible seat. The new ATP No. 1 Club, booked via{" "}
            <a
              href="https://atptourexperiences.com/atp-finals-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              ATP Experiences
            </a>{" "}
            rather than the tournament's own hospitality page, is the right call if you only want one standout day
            with direct access to a former World No. 1 rather than a multi-day hospitality commitment — enquire
            directly since pricing isn't published, and check both booking channels since they're listed separately.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A luxury day, sequenced</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Book a private chauffeur for your hospitality-day arrival, giving yourself real margin before the
            session. Afterward, La Pista suits a celebratory dinner if your day included a big singles match — its
            distinctiveness as a former Fiat test track makes it a genuine story to tell, not just a nice meal.
            Piano35 works better as a pre-session cocktail stop, given its central location relative to most hotel
            districts.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: transfeero.com (private transfer pricing), nittoatpfinals.com/hospitality (Break/Smash/Ace
        pricing), atptourexperiences.com and ATP Tour's official ATP No. 1 Club announcement (product detail;
        pricing not published). Verified 7 Aug 2026 — reconfirm hospitality pricing closer to the event, since
        published tiers can shift.
      </p>
    </SpokeShell>
  );
}
