"use client";

import { useState } from "react";

export default function TripBoardSignIn() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setErrorMessage(null);

    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), next: "/trip-board" }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrorMessage(data.error ?? "Failed to send link. Please try again.");
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
          <br />Click it to open your Trip Board.
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
    </form>
  );
}
