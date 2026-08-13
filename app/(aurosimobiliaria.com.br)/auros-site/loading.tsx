export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section Skeleton */}
      <section className="relative flex h-screen w-full flex-col overflow-hidden bg-[#17375F]/80 p-4">
        {/* Nav */}
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between py-4">
          <div className="h-16 w-16 animate-pulse rounded bg-white/20 md:h-32 md:w-32" />
          <div className="hidden gap-6 md:flex">
            <div className="h-4 w-16 animate-pulse rounded bg-white/20" />
            <div className="h-4 w-20 animate-pulse rounded bg-white/20" />
            <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded bg-white/20 md:hidden" />
        </div>

        {/* Hero Content */}
        <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center gap-8">
          <div className="h-8 w-3/4 animate-pulse rounded bg-white/20 md:h-12" />
          <div className="h-8 w-1/2 animate-pulse rounded bg-white/20 md:h-12" />

          {/* Search Form Card */}
          <div className="w-full rounded-xl bg-white/10 p-6">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="h-12 w-full animate-pulse rounded bg-white/20 md:h-14" />
              <div className="h-12 w-full animate-pulse rounded bg-white/20 md:h-14" />
              <div className="h-12 w-full animate-pulse rounded bg-white/20 md:h-14" />
              <div className="h-12 w-full animate-pulse rounded bg-white/30 md:h-14 md:w-40" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Properties Skeleton */}
      <section className="flex w-full flex-col items-center bg-zinc-50 px-4 py-16">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-2 h-6 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mx-auto h-6 w-28 animate-pulse rounded bg-gray-300" />
        </div>

        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex h-full flex-col overflow-hidden rounded-xl border bg-white"
            >
              <div className="h-[275px] animate-pulse bg-gray-200 md:h-[300px]" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
                <div className="flex gap-2">
                  <div className="h-7 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-7 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-7 w-16 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t p-4">
                <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-14 animate-pulse rounded bg-[#17375F]/20" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section Skeleton */}
      <section className="flex min-h-[600px] w-full items-center justify-center bg-gradient-to-b from-[#fafafa] to-[#D0DEF8] p-4">
        <div className="w-full max-w-[544px] space-y-6 rounded-xl bg-white/90 p-8 shadow-xl">
          <div className="mx-auto h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="space-y-4">
            <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full animate-pulse rounded bg-[#17375F]/20" />
          </div>
        </div>
      </section>
    </main>
  )
}
