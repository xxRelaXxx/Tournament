export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-hx-card border border-hx-border rounded-2xl overflow-hidden"
        >
          {/* Image placeholder */}
          <div className="aspect-[4/3] skeleton" />

          {/* Content placeholders */}
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 rounded-lg w-4/5" />
            <div className="skeleton h-3.5 rounded-lg w-3/5" />
            <div className="flex items-center gap-3">
              <div className="skeleton h-3 rounded-full w-12" />
              <div className="skeleton h-3 rounded-full w-8" />
            </div>
            <div className="skeleton h-5 rounded-lg w-1/3" />
            <div className="skeleton h-9 rounded-lg w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}
