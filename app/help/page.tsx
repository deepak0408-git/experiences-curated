import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help & FAQ — Experiences | Curated",
  description: "Answers to common questions about Experiences | Curated — event packs, accounts, Trip Board, Pro subscription, and more.",
};

const faqs = [
  {
    section: "Accounts",
    questions: [
      {
        q: "How do I sign in?",
        a: "We use magic links — you enter your email, we send you a link, you click it. No password to remember. The link expires after a few minutes, so use it when it arrives.",
      },
      {
        q: "My magic link expired. What do I do?",
        a: "Go back to the sign-in page and request a new one. Each link is single-use and expires after a few minutes — just enter your email again and you'll get a fresh link.",
      },
      {
        q: "Can I change my email address?",
        a: "Email us at hello@experiences-curated.com. Since your purchases and pack access are tied to your email, we handle these manually to make sure nothing gets lost.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to My Profile and scroll to the bottom — there's a 'Delete account' option that removes your data immediately. Purchase records are kept for 7 years as required by tax law, but your personal details are anonymised.",
      },
      {
        q: "What personal data do you hold and how is it used?",
        a: <>Our <Link href="/privacy" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">Privacy Policy</Link> covers this in full. In short: we hold your email address, purchase history, and any travel log entries or Trip Board content you create. We don't sell your data to third parties. We use it only to run the service — sending magic links, giving you access to your purchases, and improving the product.</>,
      },
    ],
  },
  {
    section: "Pro subscription",
    questions: [
      {
        q: "What does Pro include?",
        a: "Pro removes the 3-read limit on experience pages, unlocks detailed booking contacts on concierge picks, and gives you unlimited Trip Boards. Free accounts get one board and 3 experience reads.",
      },
      {
        q: "What is a travel archetype?",
        a: "When you sign up for Pro, you take a short quiz that identifies how you travel — whether you're a Connoisseur, Immersionist, Pilgrim, or First Pilgrim. Your archetype reorders the experiences in each pack to surface what's most relevant to you first. You can retake the quiz any time from your profile.",
      },
      {
        q: "How do I cancel my Pro subscription?",
        a: "Go to My Profile and click 'Manage subscription'. That opens the billing portal where you can cancel. Your Pro access continues until the end of the current billing period.",
      },
      {
        q: "I cancelled but still got charged. What do I do?",
        a: "Email hello@experiences-curated.com with your purchase email and we'll investigate and resolve it.",
      },
    ],
  },
  {
    section: "Content and curation",
    questions: [
      {
        q: "Who writes the guides?",
        a: "Each experience is written and verified by a curator who has been there. We don't aggregate from other sites or generate content automatically.",
      },
      {
        q: "Are your recommendations paid for or sponsored?",
        a: "No. Curators choose experiences on merit — no venue pays to be included. Some booking links are affiliate links, which means we may earn a small commission if you book through them. This never influences which experiences we recommend or what we write about them.",
      },
      {
        q: "How often is the content updated?",
        a: "We verify experiences before each event season. That said, venues change — opening hours shift, prices move, places occasionally close. Always confirm the details directly with the venue before you travel.",
      },
      {
        q: "A venue in one of your guides is closed. What should I do?",
        a: "Email hello@experiences-curated.com with the experience name and what you found. We'll investigate and update or remove it. We'd rather know.",
      },
    ],
  },
  {
    section: "Event packs",
    questions: [
      {
        q: "What is an event pack?",
        a: "An event pack is a curated guide built around a specific sporting event — Wimbledon, the US Open, and others. Each pack covers where to eat, stay, and spend time around the event, chosen by people who've actually been there. It's not a ticket — it's everything around the ticket.",
      },
      {
        q: "How do I access my pack after purchase?",
        a: "After payment, you'll get an email with a magic link. Click it and you're in. Your pack is tied to the email address you used at checkout, so you can always get back in by signing in with that email on the event pack page.",
      },
      {
        q: "I didn't receive the email after purchase. What should I do?",
        a: "Check your spam folder first — magic links sometimes land there. If it's not there, go to the event pack page and use the sign-in form with your purchase email. Still stuck? Email us at hello@experiences-curated.com and we'll sort it out.",
      },
      {
        q: "I bought a pack last year. Do I need to buy again?",
        a: "Yes — each pack is a new edition for a specific event year. The venues, recommendations, and pre-trip brief are updated for that season, so last year's pack is a different product. We don't currently offer returning-buyer discounts, but the price stays the same year to year.",
      },
      {
        q: "What is the pre-trip brief?",
        a: "A few days before the event, your pack gets a short live update — transport conditions, weather outlook, and one thing worth knowing right now. It goes live automatically once we've verified the information. You'll get an email when it's ready.",
      },
      {
        q: "Can I share my pack with someone else?",
        a: "Access is tied to one account. If you want to plan together, share your Trip Board link instead — that's designed for sharing.",
      },
      {
        q: "Can I get a refund?",
        a: "Event packs are digital products and access is immediate, so we don't offer refunds as a rule. If you think you were charged in error, email hello@experiences-curated.com within 14 days and we'll look into it.",
      },
    ],
  },
  {
    section: "Trip Board",
    questions: [
      {
        q: "What is the Trip Board?",
        a: "A personal planner for your trip. Save experiences you want to do, add notes, schedule them to specific days, and share the board with whoever you're travelling with. Free accounts get one board; Pro accounts get unlimited.",
      },
      {
        q: "How do I share my Trip Board?",
        a: "On your Trip Board page, click 'Share board'. It generates a link to the board you're currently viewing. Anyone with the link can see it — they don't need an account.",
      },
    ],
  },
  {
    section: "My Travels",
    questions: [
      {
        q: "What is My Travels?",
        a: "My Travels is your personal log of experiences you've done. After you attend an event, you can rate each experience (1–5 stars), add mood tags, and build up a record of your travels over time. Ratings feed into the site's community averages, which are shown on each experience page once enough people have reviewed it.",
      },
      {
        q: "I received a feedback email after the event. What is it?",
        a: "Two days after an event ends, we send a short email asking how it went. It links to My Travels where you can rate the experiences from your pack, and includes a one-click rating for the pack itself. It takes two minutes and genuinely helps us improve the next edition.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Experiences | Curated
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-14 space-y-12">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">Support</p>
          <h1 className="text-3xl font-bold text-neutral-900">Help & FAQ</h1>
          <p className="mt-3 text-sm text-neutral-500 leading-6">
            Can&apos;t find what you need?{" "}
            <a href="mailto:hello@experiences-curated.com" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">
              Email us
            </a>{" "}
            and we&apos;ll get back to you within one business day.
          </p>
        </div>

        {faqs.map((section) => (
          <div key={section.section}>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-6">
              {section.section}
            </h2>
            <div className="space-y-8">
              {section.questions.map((item) => (
                <div key={item.q}>
                  <p className="text-sm font-semibold text-neutral-900 mb-2">{item.q}</p>
                  <div className="text-sm text-neutral-600 leading-7">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-neutral-200 p-6">
          <p className="text-sm font-semibold text-neutral-900 mb-1">Still need help?</p>
          <p className="text-sm text-neutral-500 leading-6">
            Email{" "}
            <a href="mailto:hello@experiences-curated.com" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">
              hello@experiences-curated.com
            </a>
            . We aim to respond within one business day.
          </p>
        </div>
      </div>
    </div>
  );
}
