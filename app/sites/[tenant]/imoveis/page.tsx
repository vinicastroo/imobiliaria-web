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
    openGraph: { title, description, url: `https://${host}/imoveis`, type: 'website' },
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
    <main className="flex min-h-screen flex-col bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MenubarHome />

      <section className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-4 md:px-6">
          <Suspense fallback={<div className="h-12 animate-pulse rounded bg-gray-100" />}>
            <HorizontalFilter />
          </Suspense>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 md:px-6">
        <h1 className="sr-only">Imóveis à Venda e Aluguel — {name}</h1>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="h-[250px] animate-pulse rounded-xl bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
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
