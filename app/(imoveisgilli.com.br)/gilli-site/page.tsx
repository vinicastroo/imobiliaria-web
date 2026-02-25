import { Metadata } from 'next'
import { headers } from 'next/headers'
import { HeroSection } from './_components/hero-section'
import { HighlightedPropertiesSection } from './_components/highlighted-properties-section'
import { RecentPropertiesSection } from './_components/recent-properties-section'
import { ContactSection } from './_components/contact-section'
import Footer from './_components/footer'

export const metadata: Metadata = {
  title: 'Imóveis Gilli - Imobiliária',
  description: 'Encontre os melhores imóveis com a Imóveis Gilli.',
  alternates: {
    canonical: 'https://imoveisgilli.com.br',
  },
  openGraph: {
    images: ['https://imoveisgilli.com.br/logo.png'],
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
