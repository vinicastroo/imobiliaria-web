import { Suspense } from 'react'
import { Metadata } from 'next'
import Footer from '../_components/footer'
import { PropertyListServer } from '@/components/property-list-server'
import { propertyListingUrl, type PropertySearchParams } from '@/lib/property-search'
import { MenubarHome } from '@/components/menu-home'
import { HorizontalFilter } from '@/components/horizontal-filter'
import { buildBreadcrumbJsonLd } from '@/lib/json-ld'

const baseMetadata: Metadata = {
  title: 'Auros Corretora Imobiliária | Imóveis',
  description:
    'Busque e filtre imóveis à venda em Rio do Sul e Balneário Camboriú. Apartamentos, casas, terrenos e muito mais com a Auros Corretora Imobiliária.',
  alternates: {
    canonical: 'https://aurosimobiliaria.com.br/imoveis',
  },
  openGraph: {
    title: 'Imóveis à Venda | Auros Corretora Imobiliária',
    description:
      'Busque e filtre imóveis à venda em Rio do Sul e Balneário Camboriú. Apartamentos, casas, terrenos e muito mais.',
    url: 'https://aurosimobiliaria.com.br/imoveis',
    type: 'website',
    images: [
      {
        url: 'https://aurosimobiliaria.com.br/logo.png',
        width: 1200,
        height: 630,
        alt: 'Auros Corretora Imobiliária - Imóveis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imóveis à Venda | Auros Corretora Imobiliária',
    description: 'Busque e filtre imóveis à venda em Rio do Sul e Balneário Camboriú.',
    images: ['https://aurosimobiliaria.com.br/logo.png'],
  },
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<PropertySearchParams>
}): Promise<Metadata> {
  const canonical = propertyListingUrl('https://aurosimobiliaria.com.br', await searchParams)
  return {
    ...baseMetadata,
    alternates: { canonical },
    openGraph: { ...baseMetadata.openGraph, url: canonical },
  }
}

const breadcrumbJsonLd = buildBreadcrumbJsonLd('https://aurosimobiliaria.com.br', [
  { name: 'Home', path: '' },
  { name: 'Imóveis', path: '/imoveis' },
])

export default function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<PropertySearchParams>
}) {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MenubarHome />

      <section className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-none">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-4 md:px-6">
          <Suspense fallback={<div className="h-12 animate-pulse rounded bg-gray-100" />}>
            <HorizontalFilter />
          </Suspense>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 md:px-6">
        <h1 className="sr-only">Imóveis à Venda em Rio do Sul e Balneário Camboriú</h1>

        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="h-[250px] animate-pulse rounded-xl bg-gray-200" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          }
        >
          <PropertyListServer searchParams={searchParams} />
        </Suspense>
      </div>

      <Footer />
    </main>
  )
}
