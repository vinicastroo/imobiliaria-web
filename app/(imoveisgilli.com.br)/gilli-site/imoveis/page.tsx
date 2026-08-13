import { Suspense } from 'react'
import { Metadata } from 'next'
import Footer from '../_components/footer'
import { PropertyList } from '@/components/property-list'
import { MenubarHome } from '@/components/menu-home'
import { buildBreadcrumbJsonLd } from '@/lib/json-ld'

const GILLI_SOCIAL = {
  whatsappUrl: 'https://api.whatsapp.com/send?phone=5547997882496&&text=Ol%C3%A1',
  instagramUrl: 'https://www.instagram.com/gilli_engenharia_e_imoveis/',
}
import { HorizontalFilter } from '@/components/horizontal-filter'

export const metadata: Metadata = {
  title: 'Imóveis Gilli | Imóveis',
  description:
    'Busque e filtre imóveis com a Imóveis Gilli. Compra, venda e locação em Aurora e região.',
  alternates: {
    canonical: 'https://imoveisgilli.com.br/imoveis',
  },
  openGraph: {
    title: 'Imóveis Gilli | Imóveis',
    description:
      'Busque e filtre imóveis com a Imóveis Gilli. Compra, venda e locação em Aurora e região.',
    url: 'https://imoveisgilli.com.br/imoveis',
    type: 'website',
    images: [
      {
        url: 'https://imoveisgilli.com.br/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Imóveis Gilli',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imóveis Gilli | Imóveis',
    description: 'Busque e filtre imóveis com a Imóveis Gilli.',
    images: ['https://imoveisgilli.com.br/og-image.png'],
  },
}

const breadcrumbJsonLd = buildBreadcrumbJsonLd('https://imoveisgilli.com.br', [
  { name: 'Home', path: '' },
  { name: 'Imóveis', path: '/imoveis' },
])

export default function GilliImoveisPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <MenubarHome socialLinks={GILLI_SOCIAL} />

      <section className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-none">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-4 md:px-6">
          <Suspense fallback={<div className="h-12 animate-pulse rounded bg-gray-100" />}>
            <HorizontalFilter />
          </Suspense>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 md:px-6">
        <h1 className="sr-only">Imóveis Gilli</h1>

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
          <PropertyList />
        </Suspense>
      </div>

      <Footer />
    </main>
  )
}
