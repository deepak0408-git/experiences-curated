"use client";

import { useState } from "react";
import { deleteAccount } from "../actions";

export default function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500">Are you sure?</span>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            setLoading(true);
            await deleteAccount();
          }}
          disabled={loading}
          className="text-xs font-medium text-red-600 underline underline-offset-2 hover:text-red-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Deleting…" : "Yes, delete"}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-neutral-400 underline underline-offset-2 hover:text-red-600 transition-colors"
    >
      Delete account
    </button>
  );
}
