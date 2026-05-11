import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help & FAQ — Experiences | Curated",
  description: "Answers to common questions about Experiences | Curated — event packs, accounts, Trip Board, and more.",
};

const faqs = [
  {
    section: "Event packs",
    questions: [
      {
        q: "What is an event pack?",
        a: "An event pack is a curated guide built around a specific sporting event — Wimbledon, the US Open, and others. Each pack covers where to eat, stay, and spend time around the event, chosen by people who've actually been there. It's not a ticket — it's everything around the ticket.",
      },
      {
        q: "How do I access my pack after purchase?",
        a: "After payment, you'll get an email with a magic link. Click it and you're in. Your pack is tied to the email address you used at checkout, so you can always get back in by signing in with that email at the top of any event pack page.",
      },
      {
        q: "I didn't receive the email after purchase. What should I do?",
        a: "Check your spam folder first — magic links sometimes land there. If it's not there, go to the event pack page and use the sign-in form with your purchase email. Still stuck? Email us at hello@experiencescurated.com and we'll sort it out.",
      },
      {
        q: "Can I share my pack with someone else?",
        a: "Access is tied to one account. If you want to plan together, share your Trip Board link instead — that's designed for sharing.",
      },
      {
        q: "Can I get a refund?",
        a: "Event packs are digital products and access is immediate, so we don't offer refunds as a rule. If you think you were charged in error, email hello@experiencescurated.com within 14 days and we'll look into it.",
      },
    ],
  },
  {
    section: "Accounts",
    questions: [
      {
        q: "How do I sign in?",
        a: "We use magic links — you enter your email, we send you a link, you click it. No password to remember. The link expires after a few minutes, so use it when it arrives.",
      },
      {
        q: "Can I change my email address?",
        a: "Email us at hello@experiencescurated.com. Since your purchases and pack access are tied to your email, we handle these manually to make sure nothing gets lost.",
      },
      {
        q: "How do I delete my account?",
        a: "Email hello@experiencescurated.com with the subject 'Delete my account'. We'll remove your personal data within 30 days. Purchase records are kept for 7 years as required by Indian tax law.",
      },
    ],
  },
  {
    section: "Pro subscription",
    questions: [
      {
        q: "What does Pro include?",
        a: "Pro removes the 3-read limit on experience pages, unlocks booking contacts on concierge picks, and gives you unlimited Trip Boards. Free accounts get one board and 3 experience reads.",
      },
      {
        q: "How do I cancel my Pro subscription?",
        a: "Go to My Profile and click 'Manage subscription'. That opens the Paddle billing portal where you can cancel. Your Pro access continues until the end of the current billing period.",
      },
      {
        q: "I cancelled but still got charged. What do I do?",
        a: "Email hello@experiencescurated.com with your purchase email and we'll investigate. Billing is handled by Paddle, but we'll get it resolved.",
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
    section: "Content and curation",
    questions: [
      {
        q: "Who writes the guides?",
        a: "Each experience is written and verified by a named curator who has been there. We don't aggregate from other sites or generate content automatically. The curator's name appears at the bottom of each experience page.",
      },
      {
        q: "How often is the content updated?",
        a: "We verify experiences before each event season. That said, venues change — opening hours shift, prices move, places occasionally close. Always confirm the details directly with the venue before you travel.",
      },
      {
        q: "A venue in one of your guides is closed. What should I do?",
        a: "Email hello@experiencescurated.com with the experience name and what you found. We'll investigate and update or remove it. We'd rather know.",
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
            className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors"
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
            <a href="mailto:hello@experiencescurated.com" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">
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
                  <p className="text-sm text-neutral-600 leading-7">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-neutral-200 p-6">
          <p className="text-sm font-semibold text-neutral-900 mb-1">Still need help?</p>
          <p className="text-sm text-neutral-500 leading-6">
            Email{" "}
            <a href="mailto:hello@experiencescurated.com" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">
              hello@experiencescurated.com
            </a>
            . We aim to respond within one business day.
          </p>
        </div>
      </div>
    </div>
  );
}
