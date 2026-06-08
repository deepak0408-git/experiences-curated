import Link from "next/link";
import SignInLink from "./SignInLink";
import SearchForm from "./SearchForm";

export default function HomepageNav({ email, showSearch = false }: { email: string | null; showSearch?: boolean }) {
  return (
    <nav className="border-b border-neutral-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors whitespace-nowrap">
          Experiences | Curated
        </Link>
        <div className="flex items-center gap-6">
          {showSearch && (
            <>
              <SearchForm />
              <span className="hidden sm:inline text-neutral-200">|</span>
            </>
          )}
          <Link href="/trip-board" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors whitespace-nowrap">
            Trip Board
          </Link>
          {email && (
            <>
              <Link href="/my-travels" className="hidden sm:block text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                My Travels
              </Link>
            </>
          )}
          {email ? (
            <>
              <span className="hidden sm:inline text-neutral-200">|</span>
              <Link
                href="/profile"
                className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase flex-shrink-0"
                aria-label="Profile"
                title={email}
              >
                {email[0]}
              </Link>
            </>
          ) : (
            <SignInLink />
          )}
        </div>
      </div>
    </nav>
  );
}
