import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import CustomItineraryCheckout from "./_components/CustomItineraryCheckout";

export const metadata: Metadata = {
  title: "Custom Itinerary Planning — Experiences | Curated",
  description:
    "Tell us your sport, dates, and budget — we build a real, day-by-day travel itinerary around your trip, with the same research standard as our published event packs.",
};

const CHECK = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="flex-shrink-0 mt-0.5">
    <path d="M3 8l3.5 3.5L13 5" stroke="#AAFF00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CustomItineraryPage() {
  const successUrl =
    (process.env.NEXT_PUBLIC_APP_URL ?? "https://experiences-curated.com") + "/custom-itinerary/thanks";

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-3 py-4">
          <Link
            href="/"
            className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
          >
            Experiences | Curated
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#2A2A2A] py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-5">
            Custom Itinerary Planning
          </p>
          <h1 className="text-3xl sm:text-4xl font-black max-w-[34ch] leading-tight tracking-tight mb-3">
            Your dates, your sport, your budget —<br />
            <span className="text-[#AAFF00]">we build the whole trip around it.</span>
          </h1>
          <p className="text-[#A3A3A3] text-base mb-8">
            Every event pack we publish is researched the same way: real venues, real prices, real insider
            detail, no filler. This is that same research, aimed entirely at your trip — the events you
            actually want to attend, on your actual travel dates.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#pay"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-sm bg-[#AAFF00] text-black text-[15px] font-black hover:bg-[#BBFF33] transition-colors"
            >
              Start your itinerary
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10m0 0L9 4m4 4l-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <span className="font-mono text-[13px] text-[#6A6A6A]">
              One-time payment · <strong className="text-white font-bold">US$49</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Hero image grid */}
      <section className="border-b border-[#2A2A2A] bg-[#141414]">
        <div className="grid grid-cols-2 grid-rows-2 gap-[2px] bg-[#2A2A2A] w-full aspect-[21/6.3] sm:aspect-[21/6.3] max-[640px]:aspect-[4/3]">
          <div className="relative w-full h-full">
            <Image src="/custom-itinerary/hero-1.jpg" alt="Fans at a Formula 1 grand prix trackside" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative w-full h-full">
            <Image src="/custom-itinerary/hero-2.jpg" alt="US Open Fan Week crowd" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative w-full h-full">
            <Image src="/custom-itinerary/hero-3.jpg" alt="Bharat Army supporters at a cricket match" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="relative w-full h-full">
            <Image src="/custom-itinerary/hero-4.jpg" alt="BMW PGA Championship Celebrity Pro-Am" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-[#2A2A2A] py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-3.5">
            The problem with planning a multi-event trip yourself
          </p>
          <h2 className="text-2xl font-black leading-tight mb-5">
            Sports calendars don&apos;t cooperate with travel calendars.
          </h2>
          <div className="space-y-4">
            <p className="text-[#A3A3A3] text-base leading-relaxed">
              A Grand Slam runs two weeks, a Grand Prix runs one weekend, and the good hotels near either sell
              out on a schedule that has nothing to do with when you decided to book. Layer in domestic flights
              between host cities, ticket-tier tradeoffs you can&apos;t evaluate from a resale site, and the
              actual order of play — and a genuinely good trip takes real research, not an afternoon of
              tab-hopping.
            </p>
            <p className="text-[#A3A3A3] text-base leading-relaxed">
              That&apos;s the work our event packs already do, event by event. This service is the same
              standard, pointed at your specific trip instead of a published pack.
            </p>
          </div>
        </div>
      </section>

      {/* What's in it */}
      <section className="border-b border-[#2A2A2A] py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-3.5">
            What&apos;s actually in it
          </p>
          <h2 className="text-2xl font-black leading-tight mb-5">Not a template with your name on it.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8">
            {[
              {
                title: "Ticket strategy",
                desc: "Which tier is actually worth it for your priorities, which sessions to book around, and the presale windows that matter for your dates.",
              },
              {
                title: "Where to stay",
                desc: `Named hotels weighed against the real tradeoff — proximity to the venue vs. the city itself — not a generic "book early" note.`,
              },
              {
                title: "Getting between it all",
                desc: "Domestic flights, trains, and transit connections sequenced so you're never fighting your own itinerary to make a session.",
              },
              {
                title: "The days in between",
                desc: `Real day-trip and city options that fit the actual gaps in your schedule — not a padded list of "things to do nearby."`,
              },
              {
                title: "A day-by-day schedule",
                desc: "Hour-by-hour where it matters — arrival timing, gate opening, which entrance — loose where it doesn't.",
              },
              {
                title: "One real point of contact",
                desc: "Questions after delivery go to a person who built your itinerary, not a support queue.",
              },
            ].map((c) => (
              <div key={c.title} className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-5">
                <p className="font-extrabold text-[15px] text-white mb-2">{c.title}</p>
                <p className="text-sm text-[#A3A3A3] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-[#2A2A2A] py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-3.5">How it works</p>
          <h2 className="text-2xl font-black leading-tight mb-5">Four steps, start to delivery.</h2>
          <div className="flex flex-col mt-8">
            {[
              {
                num: "01",
                title: "Pay and tell us the trip",
                desc: "A short form after checkout — which event(s), your dates, your budget range, and anything you already know you want or want to avoid.",
              },
              {
                num: "02",
                title: "We research it properly",
                desc: "The same sourcing standard as our published packs — verified venues, current prices, real availability — built specifically around your dates.",
              },
              {
                num: "03",
                title: "You get a real itinerary",
                desc: "A day-by-day plan with named picks, booking links, and the reasoning behind each call — delivered within 5 business days of your intake form.",
              },
              {
                num: "04",
                title: "One round of revisions",
                desc: "Something doesn't fit once you see it laid out? One revision pass is included before it's final.",
              },
            ].map((step, i, arr) => (
              <div
                key={step.num}
                className={`grid grid-cols-[44px_1fr] gap-5 py-5 border-t border-[#2A2A2A] ${
                  i === arr.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="font-mono text-[15px] font-bold text-[#AAFF00] pt-0.5">{step.num}</span>
                <div>
                  <p className="font-extrabold text-[15px] text-white mb-1.5">{step.title}</p>
                  <p className="text-sm text-[#A3A3A3] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Is this for you */}
      <section className="border-b border-[#2A2A2A] py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-3.5">Is this for you</p>
          <h2 className="text-2xl font-black leading-tight mb-5">Built for a specific kind of trip.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#AAFF00] mb-3">
                A good fit if
              </p>
              <ul className="text-sm text-[#A3A3A3]">
                {[
                  "You're attending 2+ events, or one multi-day tournament",
                  "You want named hotels and real ticket-tier advice, not a checklist",
                  "Your dates are flexible enough to plan around, not locked to tomorrow",
                  "You'd rather pay once than spend a weekend researching",
                ].map((item, i, arr) => (
                  <li
                    key={item}
                    className={`relative pl-5 py-1.5 border-t border-[#2A2A2A] leading-relaxed ${
                      i === arr.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <span className="absolute left-0 text-[#AAFF00] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#6A6A6A] mb-3">
                Probably not, if
              </p>
              <ul className="text-sm text-[#A3A3A3]">
                <li className="relative pl-5 py-1.5 border-t border-[#2A2A2A] leading-relaxed">
                  <span className="absolute left-0 text-[#6A6A6A]">—</span>
                  You&apos;re going to an event we already publish a pack for —{" "}
                  <Link href="/#on-the-calendar" className="text-[#AAFF00] underline underline-offset-2 hover:text-[#BBFF33]">
                    buy that instead
                  </Link>
                </li>
                <li className="relative pl-5 py-1.5 border-t border-[#2A2A2A] leading-relaxed">
                  <span className="absolute left-0 text-[#6A6A6A]">—</span>
                  You need same-week planning (we can&apos;t rush good sourcing)
                </li>
                <li className="relative pl-5 py-1.5 border-t border-b border-[#2A2A2A] leading-relaxed">
                  <span className="absolute left-0 text-[#6A6A6A]">—</span>
                  You want us to also book and pay for everything on your behalf
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pay */}
      <section id="pay" className="border-b border-[#2A2A2A] py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-3.5">Get started</p>
          <h2 className="text-2xl font-black leading-tight mb-5">
            One flat price. No hourly rate, no surprise add-ons.
          </h2>
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm p-6 sm:p-10 mt-2">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5 pb-5 border-b border-[#2A2A2A]">
              <span className="font-extrabold text-[17px] text-white">Custom Itinerary Planning</span>
              <span className="font-mono text-[22px] font-bold text-[#AAFF00]">
                US$49 <span className="text-[13px] font-normal text-[#6A6A6A]">one-time</span>
              </span>
            </div>
            <ul className="flex flex-col gap-2.5 mb-7">
              {[
                "Full research and sourcing for your specific trip and dates",
                "Ticket-tier, hotel, transit, and day-trip recommendations, named and reasoned",
                "Day-by-day written itinerary, delivered within 5 business days",
                "One round of revisions included",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-[#A3A3A3] leading-relaxed">
                  {CHECK}
                  {item}
                </li>
              ))}
            </ul>
            <CustomItineraryCheckout
              successUrl={successUrl}
              buttonClassName="w-full inline-flex items-center justify-center px-6 py-3.5 rounded-sm bg-[#AAFF00] text-black text-[15px] font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-60"
            />
            <p className="text-xs text-[#6A6A6A] leading-relaxed mt-4">
              After payment, you&apos;ll get a short intake form by email to tell us about your trip. Planning
              begins once we have your details — turnaround starts from there, not from the payment date.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-3">
          <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-3.5">Questions</p>
          <h2 className="text-2xl font-black leading-tight mb-5">Before you book</h2>
          <div>
            {[
              {
                q: "Can this cover more than one event or city?",
                a: "Yes — this is the right service specifically when a trip spans multiple events, cities, or a long tournament window. Tell us the full scope in the intake form.",
              },
              {
                q: "Do you book anything for me, or buy tickets?",
                a: "No — you get named recommendations and direct booking links, but you make every booking yourself. We don't hold your payment details or purchase on your behalf.",
              },
              {
                q: "What if I already bought one of your event packs?",
                a: "This service picks up where a pack leaves off — sequencing multiple events, adding cities a single pack doesn't cover, or going deeper on personal preferences. Mention your existing pack in the intake form so we don't duplicate it.",
              },
              {
                q: "What's the turnaround?",
                a: "Delivery within 5 business days of us receiving your completed intake form. If your trip is genuinely urgent, note it in the form and we'll tell you honestly whether we can meet the date.",
              },
            ].map((item, i, arr) => (
              <div
                key={item.q}
                className={`py-5 border-t border-[#2A2A2A] ${i === arr.length - 1 ? "border-b" : ""}`}
              >
                <p className="font-extrabold text-[15px] text-white mb-2">{item.q}</p>
                <p className="text-sm text-[#A3A3A3] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#A3A3A3] mt-6 pt-6 border-t border-[#2A2A2A]">
            Questions beyond this? Write to us at{" "}
            <a
              href="mailto:hello@experiences-curated.com"
              className="text-[#AAFF00] underline underline-offset-2 hover:text-[#BBFF33]"
            >
              hello@experiences-curated.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
