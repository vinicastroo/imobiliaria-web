import { Metadata } from 'next'
import { headers } from 'next/headers'
import { HeroSection } from './_components/hero-section'
import { HighlightedPropertiesSection } from './_components/highlighted-properties-section'
import { RecentPropertiesSection } from './_components/recent-properties-section'
import { ContactSection } from './_components/contact-section'
import Footer from './_components/footer'

export const metadata: Metadata = {
  title: 'Imóveis Gilli - Imobiliária',
  description: 'Encontre os melhores imóveis com a Imóveis Gilli. Compra, venda e locação em Blumenau e região.',
  alternates: {
    canonical: 'https://imoveisgilli.com.br',
  },
  openGraph: {
    title: 'Imóveis Gilli - Imobiliária',
    description: 'Encontre os melhores imóveis com a Imóveis Gilli. Compra, venda e locação em Blumenau e região.',
    url: 'https://imoveisgilli.com.br',
    type: 'website',
    images: [{ url: 'https://imoveisgilli.com.br/og-image.png', width: 1200, height: 630, alt: 'Imóveis Gilli' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imóveis Gilli - Imobiliária',
    description: 'Encontre os melhores imóveis com a Imóveis Gilli.',
    images: ['https://imoveisgilli.com.br/og-image.png'],
  },
}

export default async function GilliHome() {
  const agencyId =
    (await headers()).get('x-tenant-id') ?? process.env.NEXT_PUBLIC_AGENCY_ID ?? ''

  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <HighlightedPropertiesSection agencyId={agencyId} />
      <RecentPropertiesSection agencyId={agencyId} />
      <ContactSection />
      <Footer />
    </main>
  )
}
