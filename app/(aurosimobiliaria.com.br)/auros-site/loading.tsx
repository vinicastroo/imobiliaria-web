export default function Loading() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative w-full h-screen flex flex-col p-4 overflow-hidden bg-[#17375F]/80">
        {/* Nav */}
        <div className="w-full max-w-[1200px] mx-auto flex justify-between items-center py-4">
          <div className="w-16 h-16 md:w-32 md:h-32 rounded bg-white/20 animate-pulse" />
          <div className="hidden md:flex gap-6">
            <div className="w-16 h-4 rounded bg-white/20 animate-pulse" />
            <div className="w-20 h-4 rounded bg-white/20 animate-pulse" />
            <div className="w-24 h-4 rounded bg-white/20 animate-pulse" />
          </div>
          <div className="md:hidden w-8 h-8 rounded bg-white/20 animate-pulse" />
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-[1200px] mx-auto">
          <div className="w-3/4 h-8 md:h-12 rounded bg-white/20 animate-pulse" />
          <div className="w-1/2 h-8 md:h-12 rounded bg-white/20 animate-pulse" />

          {/* Search Form Card */}
          <div className="w-full rounded-xl bg-white/10 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full h-12 md:h-14 rounded bg-white/20 animate-pulse" />
              <div className="w-full h-12 md:h-14 rounded bg-white/20 animate-pulse" />
              <div className="w-full h-12 md:h-14 rounded bg-white/20 animate-pulse" />
              <div className="w-full md:w-40 h-12 md:h-14 rounded bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Properties Skeleton */}
      <section className="w-full py-16 px-4 bg-zinc-50 flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="w-40 h-6 rounded bg-gray-200 animate-pulse mx-auto mb-2" />
          <div className="w-28 h-6 rounded bg-gray-300 animate-pulse mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1200px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col h-full border rounded-xl overflow-hidden bg-white">
              <div className="h-[275px] md:h-[300px] bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="border-t p-4 flex justify-between items-center">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-14 bg-[#17375F]/20 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section Skeleton */}
      <section className="w-full min-h-[600px] flex items-center justify-center p-4 bg-gradient-to-b from-[#fafafa] to-[#D0DEF8]">
        <div className="w-full max-w-[544px] rounded-xl bg-white/90 p-8 space-y-6 shadow-xl">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
          <div className="space-y-4">
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-[#17375F]/20 rounded animate-pulse" />
          </div>
        </div>
      </section>
    </main>
  )
}
