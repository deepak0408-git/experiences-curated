"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function WelcomePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  // Preserves which spoke checkout was initiated from (see SpokeShell's
  // successUrl) so the magic link lands the buyer back where they were,
  // not always on the hub. Absent for hub-initiated purchases.
  const searchParams = useSearchParams();
  const spoke = searchParams.get("spoke");
  const nextPath = spoke ? `/event-pack/${slug}/${spoke}` : `/event-pack/${slug}`;

  useEffect(() => {
    import("@/lib/posthog-events").then(({ phEvent }) =>
      phEvent.purchaseCompleted({ eventSlug: slug })
    );
  }, [slug]);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMagicLink = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, next: nextPath }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to send link. Please try again.");
    } else {
      setSent(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <nav className="border-b border-[#2A2A2A] px-6 sm:px-8 py-4">
        <Link href="/" className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
          Experiences | Curated
        </Link>
      </nav>
      <div className="flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm text-center">
        {!sent ? (
          <>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">
              Purchase complete
            </p>
            <h1 className="text-3xl font-black text-white mb-3">
              Your pack is ready.
            </h1>
            <p className="text-[#A3A3A3] text-sm leading-6 mb-8">
              Enter the email you used at checkout. We&apos;ll send you a magic
              link — one click and you&apos;re in.
            </p>

            <form onSubmit={sendMagicLink} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-sm border border-[#2A2A2A] bg-[#141414] text-sm text-white placeholder-[#6A6A6A] focus:outline-none focus:border-[#AAFF00]/50 transition-colors"
              />
              {error && (
                <p className="text-xs text-red-400 text-left">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send access link"}
              </button>
            </form>

            {process.env.HIDE_PRO !== "true" && (
              <div className="mt-8 pt-7 border-t border-[#2A2A2A] text-left">
                <p className="text-xs font-semibold text-[#A3A3A3] mb-1">Get more from your pack</p>
                <p className="text-xs text-[#6A6A6A] leading-5 mb-3">
                  Pro adds booking contacts for the concierge picks, sell-out reminders, and unlimited trip boards.
                </p>
                <a
                  href="/pro"
                  className="inline-block text-xs font-semibold text-[#AAFF00] underline underline-offset-2 hover:text-[#BBFF33] transition-colors"
                >
                  See what's in Pro →
                </a>
              </div>
            )}

            <p className="mt-6 text-xs text-[#6A6A6A]">
              Questions?{" "}
              <a
                href="mailto:hello@experiences-curated.com"
                className="underline hover:text-[#AAFF00] transition-colors"
              >
                hello@experiences-curated.com
              </a>
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">
              Check your inbox
            </p>
            <h1 className="text-3xl font-black text-white mb-3">
              Magic link sent.
            </h1>
            <p className="text-[#A3A3A3] text-sm leading-6">
              We&apos;ve sent an access link to{" "}
              <span className="font-semibold text-white">{email}</span>.
              Click it to open your pack — no password needed.
            </p>
            <p className="mt-6 text-xs text-[#6A6A6A]">
              Didn&apos;t get it? Check your spam folder, or{" "}
              <button
                onClick={() => setSent(false)}
                className="underline hover:text-[#AAFF00] transition-colors"
              >
                try again
              </button>
              .
            </p>
          </>
        )}
      </div>
    </div>
    </main>
  );
}
