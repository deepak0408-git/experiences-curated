import Link from "next/link";
import Image from "next/image";

const SPORTS = [
  {
    label: "Tennis",
    href: "/search?sport=tennis",
    imageUrl:
      "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sports/tennis-v2.jpg",
    kenburns: "kenburns-1",
  },
  {
    label: "Golf",
    href: "/search?sport=golf",
    imageUrl:
      "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/Practice-Day-at-Royal-Birkdale.jpg",
    kenburns: "kenburns-2",
  },
  {
    label: "Formula 1",
    href: "/search?sport=formula_one",
    imageUrl:
      "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sports/formula1-v2.jpg",
    kenburns: "kenburns-3",
  },
  {
    label: "Cricket",
    href: "/search?sport=cricket",
    imageUrl:
      "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sports/cricket-v2.jpg",
    kenburns: "kenburns-1",
  },
];

export default function SportNavigator() {
  return (
    <section className="bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">
          Browse by sport
        </p>
        <p className="text-sm text-[#A3A3A3] mb-8">
          Find experiences for the events you follow.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SPORTS.map((sport) => (
            <Link
              key={sport.label}
              href={sport.href}
              className="group relative overflow-hidden rounded-sm aspect-[3/4] sm:aspect-square block border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors duration-300"
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={sport.imageUrl}
                  alt={sport.label}
                  fill
                  className={`object-cover ${sport.kenburns} group-hover:scale-110 transition-transform duration-500`}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                />
              </div>
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              {/* Label */}
              <span className="absolute bottom-3 left-3 right-3 text-[#AAFF00] text-sm font-black tracking-wide leading-tight group-hover:text-white transition-colors">
                {sport.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
