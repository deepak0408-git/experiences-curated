export default function IdentityStrip() {
  const pillars = [
    {
      heading: "HANDPICKED",
      body: "Every experience researched and written by someone who's been there.",
    },
    {
      heading: "BUILT FOR SPORT",
      body: "Wimbledon. The Open Championships. Belgian GP. World Cup Cricket. And more.",
    },
    {
      heading: "TRIP-READY",
      body: "Save experiences, arrange by day, share with whoever's coming.",
    },
  ];

  return (
    <div className="border-b border-neutral-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
        {pillars.map((p) => (
          <div key={p.heading}>
            <p className="text-xs font-bold tracking-widest uppercase text-neutral-900 mb-2">
              {p.heading}
            </p>
            <p className="text-sm text-neutral-500 leading-6">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
