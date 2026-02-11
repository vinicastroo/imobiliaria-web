import { Suspense } from 'react'
import { Metadata } from 'next'
import Footer from '@/components/footer'
import { PropertyList } from '@/components/property-list'
import { MenubarHome } from '@/components/menu-home'
import { HorizontalFilter } from '@/components/horizontal-filter'

export const metadata: Metadata = {
  title: 'Auros Corretora Imobiliária | Imóveis',
  description:
    'Busque e filtre imóveis à venda em Rio do Sul e Balneário Camboriú. Apartamentos, casas, terrenos e muito mais com a Auros Corretora Imobiliária.',
  alternates: {
    canonical: 'https://aurosimobiliaria.com.br/imoveis',
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://aurosimobiliaria.com.br",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Imóveis",
      item: "https://aurosimobiliaria.com.br/imoveis",
    },
  ],
}

export default function ImoveisPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MenubarHome />

      <section className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-none">
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-4">
          <Suspense fallback={<div className="h-12 bg-gray-100 animate-pulse rounded" />}>
            <HorizontalFilter />
          </Suspense>
        </div>
      </section>

      <div className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-6 py-8">
        <h1 className="sr-only">Imóveis à Venda em Rio do Sul e Balneário Camboriú</h1>

        <Suspense
          fallback={
            <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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

      <Footer />
    </main>
  )
}