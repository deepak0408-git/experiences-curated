"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToNewsletter } from "../actions";

export function NewsletterForm({ source }: { source: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [outcome, setOutcome] = useState<"new" | "alreadyMember" | "alreadySubscribed">("new");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const result = await subscribeToNewsletter(email, source);
    if (result.ok) {
      setOutcome(
        result.alreadyMember ? "alreadyMember" : result.alreadySubscribed ? "alreadySubscribed" : "new"
      );
      setStatus("done");
      setTimeout(() => router.push("/"), 2000);
    } else {
      setStatus("error");
      setError(result.error ?? "Something went wrong — please try again.");
    }
  }

  if (status === "done") {
    const heading =
      outcome === "alreadyMember"
        ? "You're already part of Experiences | Curated."
        : outcome === "alreadySubscribed"
          ? "You're already subscribed."
          : "You're in.";
    const body =
      outcome === "alreadyMember"
        ? "Taking you to the site — sign in to pick up where you left off."
        : outcome === "alreadySubscribed"
          ? "No need to sign up twice — we've got you."
          : "Look out for the next event guide in your inbox.";

    return (
      <div className="rounded-sm bg-[#141414] border border-[#2A2A2A] p-6">
        <p className="text-sm font-medium text-[#AAFF00]">{heading}</p>
        <p className="mt-1 text-sm text-[#A3A3A3]">{body}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 min-w-0 rounded-sm bg-[#141414] border border-[#2A2A2A] px-4 py-3 text-sm text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-sm bg-[#AAFF00] text-black text-sm font-black px-6 py-3 hover:bg-[#BBFF33] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Joining..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 sm:absolute sm:mt-14">{error}</p>
      )}
    </form>
  );
}
