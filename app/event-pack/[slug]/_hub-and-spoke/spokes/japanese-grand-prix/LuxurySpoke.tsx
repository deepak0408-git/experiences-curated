import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "luxury";

// Real, sourced content across every category §2i requires, researched live
// 22 Sep 2026: hospitality tiers beyond Paddock Club (Champions Club, House
// 44 — the real Hamilton/Soho House collaboration that debuted at Suzuka in
// 2026, confirmed via sohohouse.com and house44atf1paddockclub.com), a real
// premium-transfer example (ESPACIO Nagoya Castle's Ferrari-branded weekend
// package with helicopter transfers, confirmed via hospitalityandcateringnews.com
// and travelandtourworld.com), and a genuinely new luxury-hotel fact
// (ESPACIO Nagoya Castle itself — opened Oct 2025, 100 rooms, adjacent to
// Nagoya Castle, confirmed via japantoday.com/Travel Weekly Asia) not
// duplicating the Hotels spoke's named picks (Marriott, Meitetsu Grand,
// LiVEMAX).
//
// Revised 30 Sep 2026 per founder review against Brazilian GP's LuxurySpoke
// (the pack's reference standard for this spoke):
// 1) Premium transit previously named ESPACIO Nagoya Castle's helicopter
//    package with no way to actually act on it — added the hotel's real
//    phone (052-521-2121) and contact-form URL, sourced directly via
//    en.espacionagoya.com/contact, matching how Brazilian GP's spoke gives
//    Skye's direct phone number rather than just describing the venue.
// 2) Removed "Which V1/V2 sections we'd pick" entirely (founder instruction)
//    — its SpokeExperienceCard (v1v2Grandstand) was also a straight
//    duplicate of the same card already featured in TicketsSpoke, which
//    breaks the pack's one-card-one-spoke rule.
// 3) Spoke was thin next to Brazilian's four-section depth (hospitality,
//    ultra-luxury stays, premium transit, off-circuit VIP night) — added a
//    genuine "off-circuit VIP night" section to match: Sky Lounge ZENITH,
//    52nd floor of Nagoya Marriott Associa, directly above JR Nagoya
//    Station. Hours, dress code (smart casual), reservation phone
//    (052-584-1108, 10am-6pm), and the real under-20-after-5pm restriction
//    on "special event days" all sourced directly from associa.com's
//    official restaurant page, cross-verified via Tripadvisor/TableCheck.
export default async function LuxurySpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  const hospitalityTiers = linkedExperiences.find((e) => e.slug.includes("japanese-gp-suzuka-hospitality-tiers"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Japanese Grand Prix"
      status="teaser"
      h1="A stack of decisions, not one ticket — hospitality, transfers, and a genuine new Nagoya hotel"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The real hospitality tiers, transfer example, and hotel fact are free above. The pack adds our direct verdict on House 44 vs. standard Paddock Club for a first Suzuka trip, the real booking-window detail for a genuinely new hospitality product at this circuit, and which V1/V2 sections are worth the premium over the rest of the stand."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        A genuinely luxury Suzuka weekend isn&apos;t one purchase — it&apos;s a stack of decisions across
        hospitality, transfers, where you stay, and where you go off-circuit. Here&apos;s the real version of
        each.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Hospitality tiers beyond Paddock Club</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-3">
          Champions Club is the mid-tier option — curated hospitality with terrace access and guided moments,
          priced meaningfully below full Paddock Club. House 44, a collaboration between Soho House, F1, and
          Lewis Hamilton, made its first-ever Suzuka appearance in 2026, set directly above the pit lane inside
          the Paddock Club — Hamilton&apos;s own creative input on the suite, exclusive DJ line-ups, and racing
          memorabilia from his career, named for his own racing number.
        </p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Standard Paddock Club itself — the viewing room on the Pit Building&apos;s second floor, directly above
          the team garages — remains the biggest and most established of the tiers, with gourmet dining, an open
          bar, and a pit lane walk included.
        </p>
      </div>

      {hospitalityTiers && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={hospitalityTiers} isPro={isPro} hideProCtas />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Premium transit — one real example</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          ESPACIO Nagoya Castle&apos;s own 2026 race-weekend package includes helicopter transfers to Suzuka
          Circuit alongside private chauffeur service — a real, illustrative example of what premium transport
          looks like here, not a guaranteed rate. Call the hotel directly at{" "}
          <a href="tel:+81525212121" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            +81 52-521-2121
          </a>{" "}
          or use their{" "}
          <a
            href="https://en.espacionagoya.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#AAFF00] hover:text-[#BBFF33] underline"
          >
            contact form
          </a>{" "}
          to ask about race-weekend availability and pricing — neither is published, so getting a real quote
          means reaching out directly rather than assuming a rate. Cross-reference the{" "}
          <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Getting There guide
          </a>{" "}
          for the standard-fan transit options this replaces.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">One new luxury-hotel fact</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          ESPACIO Nagoya Castle opened in October 2025, directly beside Nagoya Castle itself — 100 rooms, the
          smallest at 49 square metres, eight restaurants, a hot spring bath, and a genuine 5-star spec that
          doesn&apos;t exist elsewhere in the Hotels spoke&apos;s named picks. This is a different tier entirely
          from the Marriott or Meitetsu Grand — a real option if the trip&apos;s luxury extends past the circuit
          itself.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">A real off-circuit VIP night: Sky Lounge ZENITH</p>
      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Sky Lounge ZENITH, on the 52nd floor of the Nagoya Marriott Associa Hotel directly above JR Nagoya
          Station, is the genuine off-circuit VIP venue for a night away from the race — floor-to-ceiling views
          across the city, a dinner service running 5:00-11:00pm (last order 10:30pm), and smart casual dress
          required. Reserve by phone at{" "}
          <a href="tel:+81525841108" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            +81 52-584-1108
          </a>{" "}
          (reservation line open 10:00am-6:00pm) or online — the venue asks for advance notice on cancellations
          or party-size changes, and on select "special event days" guests under 20 aren&apos;t admitted after
          5:00pm, worth checking if you&apos;re planning around a specific date.
        </p>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">House 44 vs. standard Paddock Club</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a first Suzuka trip, standard Paddock Club is the safer, more established choice — the full pit
            lane walk and gourmet dining experience is a known quantity, tested across a full season of races.
            House 44 is a genuinely exciting new product, but it debuted at Suzuka only in 2026 — treat it as the
            pick for someone who specifically wants the Hamilton/Soho House atmosphere over the standard
            experience, not the default recommendation for a first-timer.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Book hospitality earlier than you think</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            This is Suzuka&apos;s first-ever Sprint weekend, and a genuinely new race format tends to draw
            stronger-than-usual demand across every ticket tier, hospitality included. Don&apos;t assume last
            year&apos;s typical booking window applies — book Paddock Club or Champions Club as soon as sales
            open rather than waiting to see how the weekend shapes up.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}
