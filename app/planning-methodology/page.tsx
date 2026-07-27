import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Estimate Trip Costs — Experiences | Curated",
};

export default function PlanningMethodologyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
          >
            Experiences | Curated
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-16 space-y-10">
        <div>
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">Trip Planner</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">How we estimate trip costs</h1>
          <p className="text-[#A3A3A3] text-base">
            What goes into every number the Trip Planner shows you, where it comes from, and what it assumes.
          </p>
        </div>

        <section className="space-y-4 text-base text-[#A3A3A3] leading-7">
          <p>
            Every price in the Trip Planner is a real, researched estimate — never a guess or a placeholder. Our
            team researches each cost directly from real booking sites, official ticketing channels, and
            aggregated traveller spending data, then builds it into a realistic low–high range for your trip.
          </p>
          <p>
            These are starting-point estimates to help you plan and compare, not live quotes. Prices for flights,
            hotels, and tickets move — sometimes by a lot — so always confirm the current price directly with the
            airline, hotel, or official ticketing site before you book.
          </p>
          <p>
            All figures are in USD. If you&apos;re budgeting in another currency, convert your target budget to
            USD before you start — the Trip Planner doesn&apos;t convert or display any other currency.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Flights</p>
          <p className="text-base text-[#A3A3A3] leading-7">
            We research round-trip economy fares from your departure city for the dates around the event, using
            real flight search results rather than a formula. The range you see reflects typical fares we found —
            not the single cheapest fare that might exist on any given day, and not premium cabins or
            multi-stop routings. Flight prices are one of the more volatile parts of any trip budget, so treat
            this figure as a realistic ballpark to plan around, and search closer to your travel dates for the
            most accurate fare. We don&apos;t offer cost-saving optimizations on flights — pricing here is too
            volatile for a reliable tier-down suggestion, so the flights figure stays fixed in every scenario.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Hotel</p>
          <p className="text-base text-[#A3A3A3] leading-7">
            Hotel estimates are researched directly from real listings and reflect actual nightly rates for
            well-reviewed properties near the event, grouped into a Budget, Moderate, Splurge, or Luxury tier by
            each hotel&apos;s own official star rating. The default figure you see uses our Moderate tier —
            comparable to a real 3–4 star property, not a blended average — and scales with however many nights
            you tell us you&apos;re planning to stay. Hotel prices shift with demand and season, especially around
            major events, so confirm current rates directly with the hotel or your preferred booking site.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Tickets</p>
          <p className="text-base text-[#A3A3A3] leading-7">
            Event ticket prices are researched from official primary ticketing channels only — never resale or
            secondary marketplaces, which can be inflated or unreliable. We map each event&apos;s real ticket
            products into ordered tiers, from general admission through to premium hospitality, so what you see
            reflects an actual product you can buy, not a synthetic estimate. The default figure you see uses our
            standard reserved-seat tier — one step up from general admission, comparable to a regular grandstand
            seat rather than a premium or hospitality package. Where an event offers both single-day and multi-day
            ticket options, we always state clearly which one a price refers to, right next to the figure. Ticket
            availability and pricing can change quickly, particularly for popular events, so always check the
            official ticketing site for current prices and availability before you commit to travel plans.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Food &amp; local travel</p>
          <p className="text-base text-[#A3A3A3] leading-7">
            These day-to-day figures — meals and getting around once you&apos;re there — are drawn from
            aggregated, real traveller-reported spending for each destination, not a calculation we derive
            ourselves. They cover everyday food (casual and mid-range meals a typical traveller eats day to day —
            not fine dining or special-occasion meals) and local transit (buses, trains, taxis, rideshares) for
            the destination itself, scaled to your trip length. They don&apos;t include day trips, excursions, or
            activities beyond the event — those are a personal choice we leave out of the baseline estimate.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">How the &ldquo;how to make this fit&rdquo; suggestions work</p>
          <p className="text-base text-[#A3A3A3] leading-7">
            If a trip comes in over your stated budget, the Trip Planner looks for realistic ways to bring it back
            within reach — always starting with the smallest change first. It checks whether stepping down one
            hotel or ticket tier alone closes the gap before ever suggesting you compromise on both. Every
            suggestion shows the full, real breakdown behind the new number, so you can see exactly what changed
            and why — never just a smaller total with nothing to check it against. Where flights are concerned,
            we also offer general timing guidance (for example, whether to prioritise securing tickets before they
            sell out) — this is planning advice based on typical patterns, not a fare guarantee. We also surface
            practical tips for trimming your food and local travel costs where relevant.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">A note on scope</p>
          <p className="text-base text-[#A3A3A3] leading-7">
            The Trip Planner currently covers a curated set of major sporting events across tennis, cricket,
            Formula 1, and golf, and we&apos;re steadily expanding coverage. If an event isn&apos;t showing up in
            your results yet, it may not have complete cost data researched for it — rather than show you a
            guess, we simply leave it out until it&apos;s ready.
          </p>
        </section>

        <section className="pt-4 border-t border-[#2A2A2A]">
          <p className="text-sm text-[#6A6A6A]">
            Have a question about a specific estimate, or spotted something that looks off? Write to us at{" "}
            <a href="mailto:hello@experiences-curated.com" className="text-[#AAFF00] hover:underline">
              hello@experiences-curated.com
            </a>{" "}
            and we will work to get back at the earliest.
          </p>
        </section>
      </div>
    </div>
  );
}
