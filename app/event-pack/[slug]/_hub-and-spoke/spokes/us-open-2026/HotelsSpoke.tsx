import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus, isRealAffiliateLink } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "hotels";

// where-to-stay-us-open is a real multi-venue experience covering 3 named
// hotels at 3 real tiers — Four Points by Sheraton Flushing (budget/
// convenience), Boro Hotel + Hilton Garden Inn LIC (moderate), Hyatt Grand
// Central New York (Manhattan/splurge) — restructured 6 Oct 2026 to
// actually surface that real tradeoff content in the spoke's own prose
// instead of leaving it buried in the linked card, same pattern as French
// Open's HotelsSpoke. Airbnb/hostel section researched fresh 6 Oct 2026 —
// NYC's Local Law 18 makes short-term rentals a genuinely different,
// mostly-closed-off situation from Paris's taxe de séjour, not a quick
// copy of the French Open framing. The Local NY hostel isn't part of the
// linked where-to-stay experience, so its real, founder-supplied Booking.com
// affiliate link lives inline here instead — spoke-only by explicit
// instruction, not written back to the experience row (same pattern as
// Chinese GP's Crowne Plaza/Suju Apartment inline links).
export default async function HotelsSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const whereToStay = linkedExperiences.find((e) => e.slug.includes("where-to-stay-us-open"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="US Open"
      status="teaser"
      h1="Manhattan vs. Queens — proximity vs. price"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="The honest proximity-vs-price tradeoff and real named picks are free above. Unlocking adds our actual verdict — why Long Island City beats Flushing for a dedicated trip and when Hyatt Grand Central is still worth the extra 40-minute commute — plus the real 3–6 month booking window, why Airbnb mostly isn't an option under Local Law 18, and our named budget pick for skipping a hotel entirely, with a direct booking link."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Hotels near Flushing Meadows fill months ahead of the tournament, and the real question isn&apos;t just
        which hotel but which neighborhood — Flushing itself, Long Island City two stops down the 7, or Manhattan
        proper. The honest answer depends on what you actually want from the trip.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Flushing &amp; Long Island City — near the venue</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Flushing is the most convenient base — Four Points by Sheraton Flushing is a 15-minute walk from the gates,
        and you&apos;re embedded in the food scene that makes this tournament distinctive, not just commuting to it.
        The tradeoff: the hotel stock here is functional rather than characterful, built for trade-show business
        travel, not a destination stay. Long Island City, two stops on the 7 with no transfer, is the sharper
        middle option — Boro Hotel and Hilton Garden Inn LIC are newer, more design-forward, and often better value
        than equivalent Manhattan rooms, with a more interesting, residential neighborhood around them. Either one
        pays off most on a late night-session day, when a short, predictable ride back matters more than the room
        itself.
      </p>
      <div className="mb-8">
        {whereToStay && <SpokeExperienceCard eventSlug={eventSlug} experience={whereToStay} isPro={isPro} />}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Staying in Manhattan instead</p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Hyatt Grand Central New York is the real pick if you&apos;re combining the US Open with a broader New York
        trip — it sits directly above Grand Central Terminal, on the same 7 train that runs straight to
        Mets-Willets Point with no transfer, 38–42 minutes door to gate. That&apos;s still around 80 minutes of
        transit for each full tournament day, which accumulates fast on a dedicated tennis trip, but it buys you
        Manhattan&apos;s much deeper hotel stock and a single direct ride rather than a connection. See the{" "}
        <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
          Getting There guide
        </a>{" "}
        for the real 7-train route and OMNY fare details.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually book</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine, dedicated US Open trip, Long Island City is the sharpest real booking — Boro Hotel or
            Hilton Garden Inn LIC beat Flushing&apos;s business-hotel character at a similar price, with a more
            interesting neighborhood and the same direct 7-train run. Hyatt Grand Central is worth the extra
            commute only when the US Open is one stop inside a longer New York trip, not the whole point of it — for
            two or three sessions plus real city time, the single direct ride outweighs the extra 40 minutes each
            way. For a two-week, tournament-only visit, that commute adds up fast enough to make LIC the better call
            even for visitors who&apos;d otherwise default to Manhattan.
          </p>

          <div className="flex flex-col gap-3 mb-8">
            <HotelBookingCard
              name="Boro Hotel &amp; Hilton Garden Inn — Long Island City"
              note="The sharpest real booking for a dedicated tennis trip — same direct 7-train run as Flushing, better value and character."
              links={(whereToStay?.bookingLinks as Array<{ platform: string; label?: string; url: string }> | undefined)?.filter((l) => l.label?.includes("Boro") || l.label?.includes("Hilton")) ?? []}
            />
            <HotelBookingCard
              name="Four Points by Sheraton — Flushing"
              note="The most convenient base, 15 minutes' walk from the gates, embedded in the food scene the tournament is known for."
              links={(whereToStay?.bookingLinks as Array<{ platform: string; label?: string; url: string }> | undefined)?.filter((l) => l.label?.includes("Four Points")) ?? []}
            />
            <HotelBookingCard
              name="Hyatt Grand Central — Manhattan"
              note="Worth the extra commute only when the US Open is one stop inside a longer New York trip."
              links={(whereToStay?.bookingLinks as Array<{ platform: string; label?: string; url: string }> | undefined)?.filter((l) => l.label?.includes("Hyatt")) ?? []}
            />
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Booking timing</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            US Open hotels — Flushing in particular — book out 3–6 months ahead of the tournament, with no
            shoulder-season discount to chase. If you&apos;re planning around the second week (quarterfinals
            onward), assume high demand and book the moment your dates are set, not once your ticket purchase is
            confirmed.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">If a hotel isn&apos;t the plan — Airbnb and hostels</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Airbnb in New York City is a genuinely different situation from most other Grand Slam cities, not just
            a pricier or cheaper version of the same option — Local Law 18 restricts short-term rentals under 30
            days to units where the host is physically present throughout the stay, caps occupancy at two guests,
            and bans renting an entire apartment outright. Every legal listing must carry a city registration
            number, which booking platforms are required to verify before processing a reservation; an unregistered
            listing is operating outside the law, not a loophole worth taking a chance on. In practice, this has cut
            NYC&apos;s active listings by roughly 70% since enforcement began, so a whole-apartment Airbnb near
            Flushing Meadows for tournament week genuinely isn&apos;t the honest budget move here the way it can be
            in other cities.
          </p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
            On the budget end, The Local NY, a real hostel in Long Island City (13-02 44th Avenue), is the better
            alternative — dorm beds and private queen rooms, both with en-suite bathrooms, plus a shared kitchen and
            a full bar on site. It sits near the Court Square station on the same E/M/G and 7 lines the rest of this
            guide already routes through, so the commute to Mets-Willets Point matches the Boro Hotel/Hilton Garden
            Inn pick above. Check live availability directly on the hostel&apos;s own site, since tournament-week
            beds go early.
          </p>
          <HotelBookingCard
            name="The Local NY — Long Island City"
            note="Dorm beds and private queen rooms, both en-suite, plus a shared kitchen and full bar."
            links={[
              {
                platform: "Booking.com",
                label: "The Local NY Hostel",
                url: "https://www.anrdoezrs.net/click-101774030-12937048?url=https%3A%2F%2Fwww.booking.com%2Fhotel%2Fus%2Fthe-local-hostel-nyc.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-a7259925-0682-46fc-b703-c48596029066%26sid%3D10739545d173fb9cf268f24fa0055875%26all_sr_blocks%3D54571603_398000202_0_0_0%26checkin%3D2027-08-30%26checkout%3D2027-09-03%26dest_id%3D545716%26dest_type%3Dhotel%26dist%3D0%26group_adults%3D2%26group_children%3D0%26hapos%3D1%26highlighted_blocks%3D54571603_398000202_0_0_0%26hpos%3D1%26matching_block_id%3D54571603_398000202_0_0_0%26no_rooms%3D1%26req_adults%3D2%26req_children%3D0%26room1%3DA%252CA%26sb_price_type%3Dtotal%26sr_order%3Dpopularity%26sr_pri_blocks%3D54571603_398000202_0_0_0__99640%26srepoch%3D1791298299%26srpvid%3D7726fe43b097ce73bbc30c0bd9390570%26type%3Dtotal%26ucfs%3D1%26",
              },
            ]}
          />
        </div>
      )}
    </SpokeShell>
  );
}

function HotelBookingCard({
  name,
  note,
  links = [],
}: {
  name: string;
  note: string;
  links?: Array<{ platform: string; label?: string; url: string }>;
}) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{name}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{note}</p>
      {links.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {links.map((link, i) => (
              <a
                key={link.url ?? i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors"
              >
                {link.label ?? link.platform} →
              </a>
            ))}
          </div>
          {links.some((link) => isRealAffiliateLink(link.url)) && (
            <p className="mt-2 text-xs text-[#6A6A6A]">Affiliate link — we may earn a small commission at no extra cost to you.</p>
          )}
        </div>
      )}
    </div>
  );
}
