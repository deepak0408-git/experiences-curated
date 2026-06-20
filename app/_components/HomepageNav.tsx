import Link from "next/link";
import SignInLink from "./SignInLink";
import SearchForm from "./SearchForm";

export default function HomepageNav({ email, showSearch = false, overlay = false }: { email: string | null; showSearch?: boolean; overlay?: boolean }) {
  return (
    <nav className={overlay ? "absolute top-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-sm" : "border-b border-[#2A2A2A] bg-[#0A0A0A]"}>
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className={`text-xs sm:text-sm font-black tracking-widest uppercase transition-colors whitespace-nowrap hover:text-[#AAFF00] ${overlay ? "text-white/80" : "text-[#6A6A6A]"}`}>
          Experiences | Curated
        </Link>
        <div className="flex items-center gap-6">
          {showSearch && (
            <>
              <SearchForm overlay={overlay} />
              <span className={`hidden sm:inline ${overlay ? "text-white/20" : "text-[#2A2A2A]"}`}>|</span>
            </>
          )}
          <Link href="/trip-board" className={`text-sm transition-colors whitespace-nowrap hover:text-[#AAFF00] ${overlay ? "text-white/80" : "text-[#6A6A6A]"}`}>
            Trip Board
          </Link>
          {email && (
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
