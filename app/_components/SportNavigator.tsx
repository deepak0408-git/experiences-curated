import Link from "next/link";
import Image from "next/image";

const SPORTS = [
  {
    label: "Cricket",
    href: "/search?sport=cricket",
    imageUrl:
      "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sports/cricket.jpg",
    kenburns: "kenburns-1",
  },
  {
    label: "Tennis",
    href: "/search?sport=tennis",
    imageUrl:
      "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sports/tennis.jpg",
    kenburns: "kenburns-2",
  },
  {
    label: "Golf",
    href: "/search?sport=golf",
    imageUrl:
      "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/Practice-Day-at-Royal-Birkdale.jpg",
    kenburns: "kenburns-3",
  },
  {
    label: "Formula 1",
    href: "/search?sport=formula_one",
    imageUrl:
      "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/Circuit%20de%20Spa-Francorchamps%20Track%20Experiences%20and%20Driving%20Days.jpg",
    kenburns: "kenburns-1",
  },
  {
    label: "Cycling",
    href: "/search?sport=cycling",
    imageUrl:
      "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sports/cycling.jpg",
    kenburns: "kenburns-2",
  },
];

export default function SportNavigator() {
  return (
    <section className="border-t border-neutral-100">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
          Browse by sport
        </p>
        <p className="text-sm text-neutral-500 mb-8">
          Find experiences for the events you follow.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SPORTS.map((sport) => (
            <Link
              key={sport.label}
              href={sport.href}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] sm:aspect-square block"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Label */}
              <span className="absolute bottom-3 left-3 right-3 text-white text-sm font-semibold leading-tight">
                {sport.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
