import Link from "next/link";
import SignInLink from "./SignInLink";
import SearchForm from "./SearchForm";

export default function HomepageNav({ email, showSearch = false, overlay = false }: { email: string | null; showSearch?: boolean; overlay?: boolean }) {
  return (
    <nav className={overlay ? "absolute top-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-sm" : "border-b border-neutral-100"}>
      <div className={`max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between ${overlay ? "" : ""}`}>
        <Link href="/" className={`text-xs sm:text-sm font-semibold tracking-widest uppercase transition-colors whitespace-nowrap ${overlay ? "text-white/90 hover:text-white" : "text-neutral-400 hover:text-neutral-600"}`}>
          Experiences | Curated
        </Link>
        <div className="flex items-center gap-6">
          {showSearch && (
            <>
              <SearchForm overlay={overlay} />
              <span className={`hidden sm:inline ${overlay ? "text-white/20" : "text-neutral-200"}`}>|</span>
            </>
          )}
          <Link href="/trip-board" className={`text-sm transition-colors whitespace-nowrap ${overlay ? "text-white/80 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}>
            Trip Board
          </Link>
          {email && (
            <>
              <Link href="/my-travels" className={`hidden sm:block text-sm transition-colors ${overlay ? "text-white/80 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}>
                My Travels
              </Link>
            </>
          )}
          {email ? (
            <>
              <span className={`hidden sm:inline ${overlay ? "text-white/20" : "text-neutral-200"}`}>|</span>
              <Link
                href="/profile"
                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-white text-xs font-bold uppercase flex-shrink-0 hover:bg-white/30 transition-colors"
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
