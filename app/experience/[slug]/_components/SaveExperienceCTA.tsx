"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
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
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/experience/${slug}`,
      },
    });
    setOtpStatus(error ? "error" : "sent");
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        {isSaved ? (
          <>
            <span className="text-sm text-neutral-900 font-medium">✓ Saved to your Trip Board</span>
            <Link href="/trip-board" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-2">
              View board
            </Link>
            <button
              onClick={handleUnsave}
              disabled={isPending}
              className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2"
            >
              Remove
            </button>
          </>
        ) : (
          <button
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 text-sm font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors disabled:opacity-50"
          >
            <span>+</span> Save to Trip Board
          </button>
        )}
      </div>
    );
  }

  if (otpStatus === "sent") {
    return (
      <p className="text-sm text-neutral-500">
        Magic link sent to <span className="text-neutral-900 font-medium">{email}</span>. Check your inbox.
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
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
        />
        <button
          type="submit"
          disabled={otpStatus === "loading"}
          className="px-5 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-700 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {otpStatus === "loading" ? "Sending…" : "Send sign-in link"}
        </button>
        {otpStatus === "error" && (
          <p className="w-full text-xs text-red-500">Something went wrong. Please try again.</p>
        )}
      </form>
    );
  }

  return (
    <button
      onClick={() => setShowSignIn(true)}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 text-sm font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
    >
      <span>+</span> Save to your Trip Board
    </button>
  );
}
