export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* MenubarHome Skeleton */}
      <header className="flex h-16 w-full items-center justify-center bg-[#17375F]">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4">
          <div className="h-8 w-24 animate-pulse rounded bg-white/20" />
          <div className="hidden gap-6 md:flex">
            <div className="h-4 w-16 animate-pulse rounded bg-white/20" />
            <div className="h-4 w-20 animate-pulse rounded bg-white/20" />
            <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded bg-white/20 md:hidden" />
        </div>
      </header>

      {/* Filter Bar Skeleton */}
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-4 md:px-6">
          <div className="flex gap-3 overflow-hidden">
            <div className="h-10 w-32 shrink-0 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-28 shrink-0 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-36 shrink-0 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-24 shrink-0 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Property Grid Skeleton */}
      <div className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex h-full flex-col overflow-hidden rounded-xl border bg-white"
            >
              <div className="h-[250px] animate-pulse bg-gray-200" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 flex gap-2">
                  <div className="h-7 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-7 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-7 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between border-t p-4">
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-14 animate-pulse rounded bg-[#17375F]/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
