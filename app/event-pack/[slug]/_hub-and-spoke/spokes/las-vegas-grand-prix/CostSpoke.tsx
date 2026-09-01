import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import { formatMoneyRange } from "@/app/planner/_lib/mockEvents";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "cost";
const TRIP_NIGHTS = 3;

// Hotel + local travel + food are real, seeded data (planner_hotel_tier_cost
// + planner_destination_bands for Las Vegas). Ticket tiers are real, seeded
// planner_ticket_tier_cost rows: tier1 Flamingo GA ($807 flat), tier2 West
// Harmon/Turn 3 ($1,047-1,499), tier3 Main Grandstand ($1,499-2,076), tier4
// Paddock Club ($5,489-21,268). Paired budget-to-ticket-tier same pattern as
// Bahrain GP's Cost spoke.
export default async function CostSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences, hotels, tickets, destinationBand, flights, costDataVerifiedAt } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const offStrip = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-off-strip-hotels"));
  const trackside = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-trackside-hotels"));

  const budgetHotel = hotels.find((h) => h.tier === "budget");
  const moderateHotel = hotels.find((h) => h.tier === "moderate");
  const splurgeHotel = hotels.find((h) => h.tier === "splurge");
  const luxuryHotel = hotels.find((h) => h.tier === "luxury");

  const tier1 = tickets.find((t) => t.tier === "tier1");
  const tier2 = tickets.find((t) => t.tier === "tier2");
  const tier3 = tickets.find((t) => t.tier === "tier3");
  const tier4 = tickets.find((t) => t.tier === "tier4");

  const stayTotal = (hotel: typeof moderateHotel) => {
    if (!hotel) return null;
    const low = Number(hotel.costLow) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelLow) + Number(destinationBand.foodPerDayLow)) * TRIP_NIGHTS : 0);
    const high = Number(hotel.costHigh) * TRIP_NIGHTS + (destinationBand ? (Number(destinationBand.localTravelHigh) + Number(destinationBand.foodPerDayHigh)) * TRIP_NIGHTS : 0);
    return { low: Math.round(low), high: Math.round(high) };
  };

  const tripTotal = (hotel: typeof moderateHotel, ticket: typeof tier1) => {
    const stay = stayTotal(hotel);
    if (!stay || !ticket) return null;
    return {
      low: stay.low + Math.round(Number(ticket.costLow)),
      high: stay.high + Math.round(Number(ticket.costHigh)),
    };
  };

  const moderateTotal = tripTotal(moderateHotel, tier2);

  const profiles = [
    { label: "Budget", hotel: budgetHotel, ticket: tier1, hotelNote: "Off-Strip value base, Circa or similar", ticketNote: "Flamingo Zone GA" },
    { label: "Moderate", hotel: moderateHotel, ticket: tier2, hotelNote: "Mid-range Strip hotel, easy walk or Monorail to grandstands", ticketNote: "West Harmon / Turn 3 Grandstand" },
    { label: "Splurge", hotel: splurgeHotel, ticket: tier3, hotelNote: "Upscale Strip hotel, real proximity to the circuit", ticketNote: "Main Grandstand" },
    { label: "Luxury", hotel: luxuryHotel, ticket: tier4, hotelNote: "Track-view room at Bellagio, Aria, or Paris Las Vegas", ticketNote: "Paddock Club" },
  ].filter((p) => p.hotel);

  // Scoped to North American origins — a global blended range would
  // understate the genuine difference between a domestic and a long-haul
  // international fare for this specific event, same reasoning as Bahrain
  // GP's Cost spoke. Philadelphia excluded as a seed-data outlier ($415-702
  // vs. every other NA market topping out at $458) — flagged, not fixed at
  // the source per founder direction 1 Sep 2026.
  const naFlights = flights.filter((f) => f.region === "North America" && f.originMarket !== "Philadelphia");
  const flightRange = naFlights.length
    ? {
        low: Math.min(...naFlights.map((f) => Number(f.costLow))),
        high: Math.max(...naFlights.map((f) => Number(f.costHigh))),
      }
    : null;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="teaser"
      h1="Hotel, ticket, and daily-spend numbers for race weekend"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Every number above is real and free — the pack doesn't unlock more prices, it unlocks the decision. Given your budget, which hotel and which ticket tier we'd actually pick for a first Las Vegas GP, plus the booking-timing detail that matters most on a circuit where track-view rooms sell out months ahead."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Las Vegas is not a cheap city to visit during race weekend — hotel rates on the Strip spike hard for the
        Grand Prix, and ticket prices run well above most other Grands Prix on the calendar. The numbers below
        cover a genuine full-trip estimate — hotel, food, local transport, and a ticket — not just the parts that
        were easy to price.
      </p>

      {moderateTotal && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Typical {TRIP_NIGHTS}-night trip</p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {formatMoneyRange(moderateTotal.low, moderateTotal.high)}
          </p>
          <p className="text-xs text-[#6A6A6A] mt-1">
            A mid-range Strip hotel, food, local transport, and a West Harmon/Turn 3 grandstand ticket, for {TRIP_NIGHTS} nights.{" "}
            <span className="text-[#AAFF00]">Excludes flights</span>,{" "}
            <a href="#flights" className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              see why ↓
            </a>
          </p>
          {costDataVerifiedAt && (
            <p className="text-xs text-[#6A6A6A] mt-1">
              Prices verified {costDataVerifiedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} — not real-time
            </p>
          )}
        </div>
      )}

      {profiles.length > 0 && (
        <>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Four ways to do this trip</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {profiles.map((p) => {
              const total = tripTotal(p.hotel, p.ticket);
              return (
                <div key={p.label} className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
                  <p className="text-xs font-black tracking-widest uppercase text-white mb-1">{p.label}</p>
                  <p className="text-lg font-black text-[#AAFF00]">
                    {total ? formatMoneyRange(total.low, total.high) : "—"}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• {p.hotelNote}</li>
                    <li className="text-xs text-[#6A6A6A] pl-3 -indent-3">• {p.ticketNote}</li>
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">Where the money goes</p>
      <p className="text-xs text-[#6A6A6A] mb-3">For the Moderate trip above — mid-range Strip hotel, West Harmon/Turn 3 ticket.</p>
      <div className="flex flex-col gap-2 mb-8">
        {tier2 && (
          <CategoryRow label="Ticket (West Harmon / Turn 3)" low={Math.round(Number(tier2.costLow))} high={Math.round(Number(tier2.costHigh))} unit="3-day" />
        )}
        {moderateHotel && (
          <CategoryRow label="Hotel" low={Number(moderateHotel.costLow) * TRIP_NIGHTS} high={Number(moderateHotel.costHigh) * TRIP_NIGHTS} unit={`for ${TRIP_NIGHTS} nights`} />
        )}
        {destinationBand && (
          <>
            <CategoryRow label="Local travel" low={Number(destinationBand.localTravelLow) * TRIP_NIGHTS} high={Number(destinationBand.localTravelHigh) * TRIP_NIGHTS} unit={`for ${TRIP_NIGHTS} days`} />
            <CategoryRow label="Food" low={Number(destinationBand.foodPerDayLow) * TRIP_NIGHTS} high={Number(destinationBand.foodPerDayHigh) * TRIP_NIGHTS} unit={`for ${TRIP_NIGHTS} days`} />
          </>
        )}
      </div>

      {destinationBand?.localTravelNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Getting around, cheaply</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.localTravelNote}</p>
        </div>
      )}
      {destinationBand?.foodNote && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">A local money-saving trick</p>
          <p className="text-sm text-[#A3A3A3] leading-6">{destinationBand.foodNote}</p>
        </div>
      )}

      <div id="flights" className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 scroll-mt-20">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What about flights?</p>
        {flightRange && (
          <p className="text-sm text-white font-bold mb-2">
            Roughly {formatMoneyRange(flightRange.low, flightRange.high)}{" "}
            round-trip, economy, if you&apos;re traveling from North America.
          </p>
        )}
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Flying in from further afield — Europe, Asia — costs meaningfully more, so we&apos;re not folding every
          region into one misleading blended number here. Tell the Planner where you&apos;re starting from and
          it&apos;ll give you a real range for your actual route.
        </p>
        <a
          href="/planner"
          className="inline-flex items-center px-4 py-2 rounded-sm border border-[#AAFF00] text-[#AAFF00] text-xs font-black hover:bg-[#AAFF00] hover:text-black transition-colors"
        >
          Check flight costs from your city →
        </a>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which ticket tier we&apos;d pick</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            For a genuine first Las Vegas GP, the Main Grandstand ({tier3 && formatMoneyRange(Math.round(Number(tier3.costLow)), Math.round(Number(tier3.costHigh)))}) is the strongest single seat on the circuit — start/finish, pit lane views, the full ceremony. If watching real racing matters more than proximity to the ceremony, West Harmon or Turn 3 ({tier2 && formatMoneyRange(Math.round(Number(tier2.costLow)), Math.round(Number(tier2.costHigh)))}) is the sharper pick for the price. Flamingo Zone GA ({tier1 && formatMoneyRange(Math.round(Number(tier1.costLow)), Math.round(Number(tier1.costHigh)))}) is the honest budget option — standing room, real racing view, a fraction of any grandstand&apos;s price. The full stand-by-stand comparison lives in the{" "}
            <a href={`/event-pack/${eventSlug}/tickets`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Ticket Guide
            </a>
            .
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d spend the hotel budget</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            If a track-view room is the priority, that premium is worth paying at Bellagio, Aria, or Paris Las
            Vegas — nowhere else on the Strip lets a hotel room double as a grandstand seat. If budget matters more
            than the view, Circa downtown or Virgin Hotels off-Strip deliver real savings without sacrificing an
            easy ride into race weekend via the 24/7 Monorail.
          </p>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-4 mb-8">
            <p className="text-sm font-bold text-white mb-1.5">Book track-view hotel rooms early — genuinely months ahead</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Track-view room categories at Bellagio, Aria, and Paris Las Vegas have a documented history of
              selling out months before race weekend — book the room before the ticket if a track-view stay
              matters to you.
            </p>
            <a
              href={`/event-pack/${eventSlug}/hotels`}
              className="inline-block mt-2 text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              Where to Stay Guide →
            </a>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Booking windows &amp; contacts</p>
          <div className="flex flex-col gap-3">
            {trackside?.practicalInfo?.bookingMethod && (
              <AreaBookingCard title="Trackside hotels (Bellagio, Aria, Paris LV)" detail={trackside.practicalInfo.bookingMethod} websites={trackside.practicalInfo.website} />
            )}
            {offStrip?.practicalInfo?.bookingMethod && (
              <AreaBookingCard title="Off-Strip value bases (Circa, Virgin Hotels)" detail={offStrip.practicalInfo.bookingMethod} websites={offStrip.practicalInfo.website} />
            )}
          </div>
        </div>
      )}
    </SpokeShell>
  );
}

function AreaBookingCard({ title, detail, websites }: { title: string; detail: string; websites?: string }) {
  const links = websites ? websites.split(",").map((w) => w.trim()).filter(Boolean) : [];
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-sm font-bold text-white mb-1.5">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
      {links.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {links.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline"
            >
              {new URL(url).hostname.replace("www.", "")} →
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryRow({ label, low, high, unit }: { label: string; low: number; high: number; unit: string }) {
  return (
    <div className="flex items-center justify-between rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <span className="text-sm font-bold text-white">{label}</span>
      <span className="text-sm text-[#A3A3A3] font-mono">
        {formatMoneyRange(low, high)} {unit}
      </span>
    </div>
  );
}
