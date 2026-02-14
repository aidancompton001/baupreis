export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
  );
}

export function SkeletonMaterialCard() {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-start justify-between mb-2">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-5 w-5 rounded-full" />
      </div>
      <SkeletonBlock className="h-6 w-20 mb-2" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <SkeletonBlock className="h-3 w-12" />
          <SkeletonBlock className="h-3 w-10" />
        </div>
        <div className="flex justify-between">
          <SkeletonBlock className="h-3 w-12" />
          <SkeletonBlock className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDashboardGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonMaterialCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonListRow() {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-3 w-48" />
      </div>
      <SkeletonBlock className="h-6 w-16 rounded-full" />
    </div>
  );
}

export function SkeletonPrognoseCard() {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
        <SkeletonBlock className="h-6 w-20 rounded-full" />
      </div>
      <SkeletonBlock className="h-16 w-full rounded-lg" />
    </div>
  );
}

export function SkeletonMaterialDetail() {
  return (
    <div>
      <div className="mb-6 space-y-2">
        <SkeletonBlock className="h-7 w-48" />
        <SkeletonBlock className="h-4 w-24" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border p-4 space-y-2">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-7 w-20" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-6">
        <SkeletonBlock className="h-5 w-24 mb-4" />
        <SkeletonBlock className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}
