"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMessage(null);
    import("@/lib/posthog-events").then(({ phEvent }) => phEvent.signInStarted({ next }));

    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), next }),
    });

    if (!res.ok) {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  if (status === "sent") {
    return (
      <div className="text-center">
        <p className="text-base font-black text-white mb-2">Check your inbox</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          We sent a sign-in link to <span className="text-white">{email}</span>.
          <br />Click it to continue.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        autoFocus
        className="w-full px-4 py-3 rounded-sm border border-[#2A2A2A] bg-[#141414] text-sm text-white placeholder:text-[#3A3A3A] focus:outline-none focus:border-[#AAFF00] transition-colors"
      />
      {errorMessage && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-4 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] disabled:opacity-50 transition-colors"
      >
        {status === "loading" ? "Sending…" : "Send sign-in link"}
      </button>
      <p className="text-xs text-[#6A6A6A] text-center pt-1">
        No password. Just a magic link to your inbox.
      </p>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A] px-6 py-4">
        <Link
          href="/"
          className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
        >
          Experiences | Curated
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2 text-center">
            Sign in
          </p>
          <h1 className="text-2xl font-black text-white text-center mb-8">
            Welcome back
          </h1>
          <Suspense>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
