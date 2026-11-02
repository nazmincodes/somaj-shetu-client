export function EventCardSkeleton() {
  return (
    <div className="card-soft overflow-hidden">
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton mt-4 h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton h-16 w-full" />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container-x py-16">
      <div className="skeleton mb-4 h-10 w-64" />
      <div className="skeleton mb-10 h-5 w-96 max-w-full" />
      <EventGridSkeleton count={3} />
    </div>
  );
}
