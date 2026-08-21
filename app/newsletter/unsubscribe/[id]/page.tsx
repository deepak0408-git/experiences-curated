import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/schema/database";

export const metadata = { title: "Unsubscribed — Experiences | Curated" };

// A UUID column throws a Postgres error on any non-UUID string, so a
// mangled or truncated id (seen live 21 Aug 2026 — an email client/link
// scanner rewrote a real UUID into a short base64-looking fragment) must be
// validated before it ever reaches the query, not after. Regardless of how
// a bad id arrives, this page should never crash — worst case, it just
// can't find a matching row to delete, which is functionally identical to
// "already unsubscribed" from the visitor's point of view.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (UUID_RE.test(id)) {
    try {
      await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
    } catch (err) {
      console.error("[newsletter/unsubscribe] delete failed for id", id, err);
    }
  } else {
    console.warn("[newsletter/unsubscribe] non-UUID id received, skipping delete:", id);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">
          Experiences | Curated
        </p>
        <h1 className="text-2xl font-black text-white leading-snug mb-3">
          You&apos;ve been unsubscribed.
        </h1>
        <p className="text-sm text-[#A3A3A3] leading-relaxed">
          You won&apos;t hear from us again unless you sign up separately.
        </p>
      </div>
    </div>
  );
}
