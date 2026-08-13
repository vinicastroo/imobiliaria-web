export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* MenubarHome Skeleton */}
      <header className="flex h-16 w-full items-center justify-center bg-[#EE9020]">
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

      <div className="mx-auto max-w-[1200px] space-y-8 p-4 py-8 md:py-12">
        {/* Image Gallery Skeleton */}
        <div className="h-[350px] animate-pulse rounded-xl bg-gray-200 lg:h-[500px]" />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Main Column */}
          <div className="space-y-6 md:col-span-8">
            <div className="space-y-6 rounded-xl border border-gray-200 p-6">
              {/* Title + Location */}
              <div className="space-y-3">
                <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Features */}
              <div className="space-y-4">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 w-24 animate-pulse rounded-md bg-gray-100" />
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Description */}
              <div className="space-y-4">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-16 w-full animate-pulse rounded border-l-4 border-gray-300 bg-gray-100" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:col-span-4">
            <div className="space-y-6 rounded-xl border border-gray-200 p-6">
              {/* Price */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="h-8 w-16 animate-pulse rounded bg-[#EE9020]/10" />
                <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
              </div>

              {/* Realtors */}
              <div className="space-y-4">
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                      <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
