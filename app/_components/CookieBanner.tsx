"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "ec_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-white border border-neutral-200 rounded-xl shadow-lg p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-xs text-neutral-600 leading-5 flex-1">
          We use strictly necessary cookies to keep you signed in, plus optional analytics cookies to improve search results. You can change your preferences at any time from{" "}
          <Link href="/profile" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">
            My Profile
          </Link>
          . See our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-neutral-900 transition-colors">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2"
          >
            Decline optional
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
