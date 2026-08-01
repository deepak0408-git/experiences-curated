import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import { SPOKES, type SpokeStatus } from "../_lib/getSpokeData";

// Shared shell for every spoke page — real site header (HomepageNav, same
// as every live page), hero image, back-to-hub link, status badge
// (public/teaser/gated), H1 + buyer-question line. Each spoke page
// supplies its own <title> via generateMetadata and its own body content
// as children. heroImageUrl reuses the SAME photo as that spoke's tile on
// the hub grid (getSpokeImage(linkedExperiences, spoke.imageSlug)) —
// visual continuity between the tile a visitor clicks and the page they
// land on, rather than a second, different image choice.
export default async function SpokeShell({
  status,
  h1,
  question,
  ctaCopy,
  heroImageUrl,
  isUnlocked = false,
  unlockPreviewHref,
  children,
}: {
  status: SpokeStatus;
  h1: string;
  question: string;
  ctaCopy?: string;
  heroImageUrl?: string | null;
  isUnlocked?: boolean;
  // PILOT ONLY — points the CTA at this spoke's own ?unlocked=1 preview
  // instead of the real purchase page, so the actual unlocked content can
  // be reviewed before the real checkout-unlock mechanism (Operations
  // Checklist item #5) is built. Falls back to the real purchase page for
  // any spoke that doesn't have unlocked content built yet.
  unlockPreviewHref?: string;
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />

      {/* Hero — matches the real experience page pattern exactly
          (app/experience/[slug]/page.tsx): standalone photo, no gradient,
          no text overlay. H1 lives below as normal page content, not
          layered on top of the image. */}
      {heroImageUrl && (
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden bg-[#0A0A0A]">
          <Image src={heroImageUrl} alt="" fill className="object-cover opacity-90" sizes="100vw" priority />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Real breadcrumb nav, not just the small pilot-banner link — same
            pattern as the live experience page (Home · Destination ·
            Neighbourhood). Specific "N free guides" copy instead of generic
            "All guides" — a visitor landing here cold from a Google search
            has no idea this site has 12 real guides for this one event;
            the link needs to sell that, not just navigate. */}
        <nav className="flex items-center gap-2 text-xs text-[#6A6A6A] mb-6">
          <Link href="/event-pack-preview/italian-grand-prix" className="hover:text-[#AAFF00] transition-colors">
            ← All {SPOKES.length} free Italian Grand Prix planning guides
          </Link>
        </nav>

        <div className="mb-2">
          {isUnlocked ? (
            <span className="inline-block text-[10px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm bg-black/30 text-[#AAFF00] border-[#AAFF00]/50">
              ✓ Unlocked — you own this pack
            </span>
          ) : (
            <StatusBadge status={status} />
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{h1}</h1>
        <p className="text-xs text-[#6A6A6A] font-mono mb-8">&quot;{question}&quot;</p>

        {children}

        {status === "teaser" && !isUnlocked && (
          <div className="mt-10 rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-6">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Get the full picture</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              {ctaCopy ?? "The Event Pack adds our single curated recommendation and the tactical detail — booking lead times, contacts, and which option is actually worth it — not just the raw facts above."}
            </p>
            <Link
              href={unlockPreviewHref ?? "/event-pack/italian-gp-2026"}
              className="inline-flex items-center px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
            >
              {unlockPreviewHref ? "Preview: what unlocking shows →" : "Get the Event Pack →"}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

// Single source of truth for badge copy — was previously duplicated as a
// separate hardcoded string here vs. the hub's STATUS_LABEL map, which is
// exactly the class of bug (two places to update, one gets missed) flagged
// in feedback_avoid_hardcoded_per_entity_tables. Both now import from here.
export const STATUS_LABEL: Record<SpokeStatus, string> = {
  public: "Free",
  teaser: "Free · Pack unlocks more",
  gated: "Pack exclusive",
};

function StatusBadge({ status }: { status: SpokeStatus }) {
  const isTeaser = status === "teaser";
  return (
    <span
      className={`inline-block text-[10px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm bg-black/30 ${
        isTeaser ? "text-[#AAFF00] border-[#AAFF00]/50" : "text-white/70 border-white/20"
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
