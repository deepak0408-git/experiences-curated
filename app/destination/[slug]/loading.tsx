export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[45vh] min-h-[300px] bg-neutral-100 animate-pulse" />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-5 bg-neutral-100 rounded animate-pulse w-3/4" />
            <div className="h-5 bg-neutral-100 rounded animate-pulse" />
            <div className="h-5 bg-neutral-100 rounded animate-pulse w-5/6" />
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-neutral-200 overflow-hidden">
                  <div className="h-40 bg-neutral-100 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-neutral-100 rounded animate-pulse w-1/3" />
                    <div className="h-4 bg-neutral-100 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3 bg-neutral-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
