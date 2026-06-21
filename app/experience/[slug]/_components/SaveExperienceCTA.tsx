"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { saveExperience, unsaveExperience } from "../actions";

export default function SaveExperienceCTA({
  experienceId,
  slug,
  isLoggedIn,
  isSaved: initialIsSaved,
}: {
  experienceId: string;
  slug: string;
  isLoggedIn: boolean;
  isSaved: boolean;
}) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [otpStatus, setOtpStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveExperience(experienceId, slug);
      if (result?.success) setIsSaved(true);
    });
  };

  const handleUnsave = () => {
    startTransition(async () => {
      const result = await unsaveExperience(experienceId, slug);
      if (result?.success) setIsSaved(false);
    });
  };

  const handleOtp = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setOtpStatus("loading");
    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), next: `/experience/${slug}` }),
    });
    setOtpStatus(res.ok ? "sent" : "error");
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        {isSaved ? (
          <>
            <span className="text-sm text-[#AAFF00] font-medium">✓ Saved to your Trip Board</span>
            <Link href="/trip-board" className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors underline underline-offset-2">
              View board
            </Link>
            <button
              onClick={handleUnsave}
              disabled={isPending}
              className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors underline underline-offset-2"
            >
              Remove
            </button>
          </>
        ) : (
          <button
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[#2A2A2A] text-sm font-medium text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors disabled:opacity-50"
          >
            <span>+</span> Save to Trip Board
          </button>
        )}
      </div>
    );
  }

  if (otpStatus === "sent") {
    return (
      <p className="text-sm text-[#A3A3A3]">
        Magic link sent to <span className="text-white font-medium">{email}</span>. Check your inbox.
      </p>
    );
  }

  if (showSignIn) {
    return (
      <form onSubmit={handleOtp} className="flex gap-2 items-start flex-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-sm border border-[#2A2A2A] bg-[#1A1A1A] text-sm text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors"
        />
        <button
          type="submit"
          disabled={otpStatus === "loading"}
          className="px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {otpStatus === "loading" ? "Sending…" : "Send sign-in link"}
        </button>
        {otpStatus === "error" && (
          <p className="w-full text-xs text-red-400">Something went wrong. Please try again.</p>
        )}
      </form>
    );
  }

  return (
    <button
      onClick={() => setShowSignIn(true)}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[#2A2A2A] text-sm font-medium text-[#6A6A6A] hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors"
    >
      <span>+</span> Save to your Trip Board
    </button>
  );
}
