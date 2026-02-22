export default function PublicLoading() {
  return (
    <div className="min-h-[80vh] container mx-auto px-4 py-16 animate-pulse">
      {/* Hero skeleton */}
      <div className="w-full h-64 sm:h-80 rounded-2xl bg-muted mb-10" />

      {/* Title skeleton */}
      <div className="h-8 w-1/3 bg-muted rounded-lg mb-4 mx-auto" />
      <div className="h-4 w-2/3 bg-muted rounded-lg mb-10 mx-auto" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border bg-card">
            <div className="aspect-video bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
