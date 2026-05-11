"use client";

import { useState, useTransition } from "react";
import {
  publishExperience,
  archiveExperience,
  unpublishExperience,
  returnToDraft,
  submitForReview,
} from "../actions";

export function ReviewActions({
  id,
  status,
  slug,
}: {
  id: string;
  status: string;
  slug: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [returning, setReturning] = useState(false);
  const [notes, setNotes] = useState("");

  const btn =
    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40";

  function handleReturn() {
    startTransition(async () => {
      await returnToDraft(id, notes);
      setReturning(false);
      setNotes("");
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <a
          href={`/experience/${slug}`}
          target="_blank"
          className={`${btn} bg-neutral-100 text-neutral-600 hover:bg-neutral-200`}
        >
          Preview ↗
        </a>

        {status === "draft" && (
          <a
            href={`/curator/submit/${id}`}
            className={`${btn} bg-neutral-100 text-neutral-600 hover:bg-neutral-200`}
          >
            Edit
          </a>
        )}

        {status === "draft" && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => submitForReview(id))}
            className={`${btn} bg-blue-50 text-blue-700 hover:bg-blue-100`}
          >
            Submit for Review
          </button>
        )}

        {(status === "draft" || status === "in_review") && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => publishExperience(id))}
            className={`${btn} bg-green-50 text-green-700 hover:bg-green-100`}
          >
            Publish
          </button>
        )}

        {status === "in_review" && !returning && (
          <button
            disabled={isPending}
            onClick={() => setReturning(true)}
            className={`${btn} bg-amber-50 text-amber-700 hover:bg-amber-100`}
          >
            Return
          </button>
        )}

        {status === "published" && (
          <>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => unpublishExperience(id))}
              className={`${btn} bg-neutral-100 text-neutral-600 hover:bg-neutral-200`}
            >
              Unpublish
            </button>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => archiveExperience(id))}
              className={`${btn} bg-red-50 text-red-600 hover:bg-red-100`}
            >
              Archive
            </button>
          </>
        )}

        {(status === "draft" || status === "in_review") && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => archiveExperience(id))}
            className={`${btn} bg-red-50 text-red-600 hover:bg-red-100`}
          >
            Reject
          </button>
        )}
      </div>

      {/* Inline return-with-feedback form */}
      {returning && (
        <div className="w-80 bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-amber-800">
            Return to curator — what needs fixing?
          </p>
          <textarea
            autoFocus
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. The 'why it's special' section needs more personal detail. The getting there instructions are incomplete — which platform at Flinders Street?"
            rows={4}
            className="w-full text-xs rounded-lg border border-amber-300 bg-white px-3 py-2 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setReturning(false); setNotes(""); }}
              className={`${btn} bg-white border border-amber-200 text-neutral-600 hover:bg-amber-50`}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPending || !notes.trim()}
              onClick={handleReturn}
              className={`${btn} bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40`}
            >
              {isPending ? "Sending…" : "Send Return"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
