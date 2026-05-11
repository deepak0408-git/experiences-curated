export default function Loading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="h-[50vh] bg-neutral-100" />
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">
        <div className="h-4 bg-neutral-100 rounded w-32" />
        <div className="h-10 bg-neutral-100 rounded w-3/4" />
        <div className="h-5 bg-neutral-100 rounded w-1/2" />
        <div className="space-y-3 pt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-neutral-100 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
