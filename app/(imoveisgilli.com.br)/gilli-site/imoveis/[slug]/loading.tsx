export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* MenubarHome Skeleton */}
      <header className="flex justify-center items-center bg-[#EE9020] w-full h-16">
        <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center px-4">
          <div className="w-24 h-8 rounded bg-white/20 animate-pulse" />
          <div className="hidden md:flex gap-6">
            <div className="w-16 h-4 rounded bg-white/20 animate-pulse" />
            <div className="w-20 h-4 rounded bg-white/20 animate-pulse" />
            <div className="w-24 h-4 rounded bg-white/20 animate-pulse" />
          </div>
          <div className="md:hidden w-8 h-8 rounded bg-white/20 animate-pulse" />
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto p-4 space-y-8 py-8 md:py-12">
        {/* Image Gallery Skeleton */}
        <div className="h-[350px] lg:h-[500px] bg-gray-200 rounded-xl animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="md:col-span-8 space-y-6">
            <div className="border border-gray-200 rounded-xl p-6 space-y-6">
              {/* Title + Location */}
              <div className="space-y-3">
                <div className="h-9 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Features */}
              <div className="space-y-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 w-24 bg-gray-100 rounded-md animate-pulse" />
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Description */}
              <div className="space-y-4">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-16 w-full bg-gray-100 rounded animate-pulse border-l-4 border-gray-300" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="border border-gray-200 rounded-xl p-6 space-y-6">
              {/* Price */}
              <div className="flex justify-between items-center border-b pb-4">
                <div className="h-8 w-16 bg-[#EE9020]/10 rounded animate-pulse" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Realtors */}
              <div className="space-y-4">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
