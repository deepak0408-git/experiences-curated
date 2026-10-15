import Link from "next/link";
import SignInLink from "./SignInLink";
import SearchForm from "./SearchForm";

export default function HomepageNav({
  email,
  showSearch = false,
  overlay = false,
  secondaryLink,
  hideSecondaryLink = false,
  hideMyTravels = false,
}: {
  email: string | null;
  showSearch?: boolean;
  overlay?: boolean;
  // Overrides the "Trip Board" link — Trip Board doesn't make sense in the
  // context of the Planner's own pages, which need their own contextual
  // link (e.g. Planning Methodology) instead. Defaults to Trip Board
  // everywhere else so no other page's nav changes. mobileLabel is optional
  // — on narrow screens "Planning Methodology" collided with the "Experiences
  // | Curated" logo link, so the Planner pages pass a shorter mobile-only
  // label ("Planning Method") while desktop keeps the full name. Fixed 26
  // Jul 2026 from a live mobile screenshot.
  secondaryLink?: { href: string; label: string; mobileLabel?: string };
  // F1 Cockpit, Trip Intelligence and Ticket Intelligence pages only
  // (founder request, 15 Oct 2026) — Trip Board isn't a useful nav shortcut
  // there since the Cockpit's own Card 4 modal already surfaces "Continue
  // my Trip Board". Defaults false so no other page changes.
  hideSecondaryLink?: boolean;
  // Same pages, same request — "My Travels" (logged trip history) isn't a
  // relevant shortcut on these F1-planning-focused pages either. Defaults
  // false so no other page changes.
  hideMyTravels?: boolean;
}) {
  const secondary = secondaryLink ?? { href: "/trip-board", label: "Trip Board" };
  return (
    <nav className={overlay ? "absolute top-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-sm" : "border-b border-[#2A2A2A] bg-[#0A0A0A]"}>
      <div className="max-w-5xl mx-auto px-3 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className={`text-xs sm:text-sm font-black tracking-widest uppercase transition-colors whitespace-nowrap hover:text-[#AAFF00] ${overlay ? "text-white/80" : "text-[#6A6A6A]"}`}>
          Experiences | Curated
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          {showSearch && (
            <>
              <SearchForm overlay={overlay} />
              <span className={`hidden sm:inline ${overlay ? "text-white/20" : "text-[#2A2A2A]"}`}>|</span>
            </>
          )}
          {!hideSecondaryLink && (
            <Link href={secondary.href} className={`text-xs sm:text-sm transition-colors whitespace-nowrap hover:text-[#AAFF00] ${overlay ? "text-white/80" : "text-[#6A6A6A]"}`}>
              {secondary.mobileLabel ? (
                <>
                  <span className="sm:hidden">{secondary.mobileLabel}</span>
                  <span className="hidden sm:inline">{secondary.label}</span>
                </>
              ) : (
                secondary.label
              )}
            </Link>
          )}
          {email && !hideMyTravels && (
            <Link href="/my-travels" className={`hidden sm:block text-sm transition-colors hover:text-[#AAFF00] ${overlay ? "text-white/80" : "text-[#6A6A6A]"}`}>
              My Travels
            </Link>
          )}
          {email ? (
            <>
              <span className={`hidden sm:inline ${overlay ? "text-white/20" : "text-[#2A2A2A]"}`}>|</span>
              <Link
                href="/profile"
                className="flex items-center justify-center w-7 h-7 rounded-sm bg-[#AAFF00] text-black text-xs font-black uppercase flex-shrink-0 hover:bg-[#BBFF33] transition-colors"
                aria-label="Profile"
                title={email}
              >
                {email[0]}
              </Link>
            </>
          ) : (
            <SignInLink overlay={overlay} />
          )}
        </div>
      </div>
    </nav>
  );
}
