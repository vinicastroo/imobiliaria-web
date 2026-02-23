export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="flex justify-center items-center bg-[#17375F] w-full h-16">
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

      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-4">
          <div className="flex gap-3 overflow-hidden">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse shrink-0" />
            <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse shrink-0" />
            <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse shrink-0" />
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse shrink-0" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col h-full border rounded-xl overflow-hidden bg-white">
              <div className="h-[250px] bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-2 mt-2">
                  <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="border-t p-4 flex justify-between items-center mt-auto">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-14 bg-[#17375F]/20 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
