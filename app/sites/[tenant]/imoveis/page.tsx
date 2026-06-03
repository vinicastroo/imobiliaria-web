import { Suspense } from 'react'
import { MenubarHome } from '@/components/menu-home'
import { PropertyList } from '@/components/property-list'
import { HorizontalFilter } from '@/components/horizontal-filter'
import { SiteFooter } from '@/components/site-templates/site-footer'

export default function TenantImoveisPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <MenubarHome />

      <section className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-4">
          <Suspense fallback={<div className="h-12 bg-gray-100 animate-pulse rounded" />}>
            <HorizontalFilter />
          </Suspense>
        </div>
      </section>

      <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-6 py-8">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="h-[250px] bg-gray-200 rounded-xl animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          }
        >
          <PropertyList />
        </Suspense>
      </div>

      <SiteFooter />
    </main>
  )
}
