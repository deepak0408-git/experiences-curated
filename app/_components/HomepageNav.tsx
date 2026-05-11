import Link from "next/link";
import SignOutButton from "./SignOutButton";
import SignInLink from "./SignInLink";
import SearchForm from "./SearchForm";

export default function HomepageNav({ email, showSearch = false }: { email: string | null; showSearch?: boolean }) {
  return (
    <nav className="border-b border-neutral-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors">
          Experiences | Curated
        </Link>
        <div className="flex items-center gap-6">
          {showSearch && (
            <>
              <SearchForm />
              <span className="text-neutral-200">|</span>
            </>
          )}
          <Link href="/trip-board" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            {email ? "My Trip Board" : "Trip Board"}
          </Link>
          {email && (
            <>
              <Link href="/my-travels" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                My Travels
              </Link>
              <Link href="/profile" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                My Profile
              </Link>
            </>
          )}
          {email ? (
            <>
              <span className="text-neutral-200">|</span>
              <p className="text-xs text-neutral-400">{email}</p>
              <SignOutButton />
            </>
          ) : (
            <SignInLink />
          )}
        </div>
      </div>
    </nav>
  );
}
