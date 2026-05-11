"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

export default function WelcomePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMagicLink = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/event-pack/${slug}`,
      },
    });

    setLoading(false);
    if (otpError) {
      setError(otpError.message);
    } else {
      setSent(true);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-neutral-100 px-6 sm:px-8 py-4">
        <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors">
          Experiences | Curated
        </Link>
      </nav>
      <div className="flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm text-center">
        {!sent ? (
          <>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              Purchase complete
            </p>
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Your pack is ready.
            </h1>
            <p className="text-neutral-500 text-sm leading-6 mb-8">
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
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
              />
              {error && (
                <p className="text-xs text-red-600 text-left">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send access link"}
              </button>
            </form>

            <div className="mt-8 pt-7 border-t border-neutral-100 text-left">
              <p className="text-xs font-semibold text-neutral-500 mb-1">Get more from your pack</p>
              <p className="text-xs text-neutral-400 leading-5 mb-3">
                Pro adds booking contacts for the concierge picks, sell-out reminders, and unlimited trip boards.
              </p>
              <a
                href="/pro"
                className="inline-block text-xs font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors"
              >
                See what's in Pro →
              </a>
            </div>

            <p className="mt-6 text-xs text-neutral-400">
              Questions?{" "}
              <a
                href="mailto:hello@experiencescurated.com"
                className="underline hover:text-neutral-600 transition-colors"
              >
                hello@experiencescurated.com
              </a>
            </p>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">
              Check your inbox
            </p>
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Magic link sent.
            </h1>
            <p className="text-neutral-500 text-sm leading-6">
              We&apos;ve sent an access link to{" "}
              <span className="font-medium text-neutral-700">{email}</span>.
              Click it to open your pack — no password needed.
            </p>
            <p className="mt-6 text-xs text-neutral-400">
              Didn&apos;t get it? Check your spam folder, or{" "}
              <button
                onClick={() => setSent(false)}
                className="underline hover:text-neutral-600 transition-colors"
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
