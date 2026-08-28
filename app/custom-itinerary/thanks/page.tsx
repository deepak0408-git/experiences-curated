import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thanks — Experiences | Curated",
};

export default function CustomItineraryThanksPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
      <div className="max-w-lg mx-auto px-3 py-20 text-center">
        <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">Payment received</p>
        <h1 className="text-3xl font-black leading-tight mb-4">You&apos;re in.</h1>
        <p className="text-[#A3A3A3] text-base leading-relaxed mb-8">
          Check your email for a short intake form — tell us your events, dates, and budget, and we&apos;ll take
          it from there. Delivery is within 5 business days of receiving your completed form.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
        >
          Back to Experiences | Curated
        </Link>
      </div>
    </main>
  );
}
