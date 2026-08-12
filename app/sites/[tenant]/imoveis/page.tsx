import { Suspense } from 'react'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { MenubarHome } from '@/components/menu-home'
import { getTenantIdentity } from '@/lib/tenant-info'
import { buildBreadcrumbJsonLd } from '@/lib/json-ld'

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')?.split(':')[0] ?? ''
  const { name } = await getTenantIdentity()
  const title = `Imóveis | ${name}`
  const description = `Busque e filtre imóveis à venda e para alugar com a ${name}.`

  return {
    title,
    description,
    alternates: { canonical: `https://${host}/imoveis` },
    openGraph:  { title, description, url: `https://${host}/imoveis`, type: 'website' },
  }
}
import { PropertyList } from '@/components/property-list'
import { HorizontalFilter } from '@/components/horizontal-filter'
import { SiteFooter } from '@/components/site-templates/site-footer'

export default async function TenantImoveisPage() {
  const host = (await headers()).get('host')?.split(':')[0] ?? ''
  const { name } = await getTenantIdentity()
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(`https://${host}`, [
    { name: 'Home', path: '' },
    { name: 'Imóveis', path: '/imoveis' },
  ])

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MenubarHome />

      <section className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-4">
          <Suspense fallback={<div className="h-12 bg-gray-100 animate-pulse rounded" />}>
            <HorizontalFilter />
          </Suspense>
        </div>
      </section>

      <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-6 py-8">
        <h1 className="sr-only">Imóveis à Venda e Aluguel — {name}</h1>

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
