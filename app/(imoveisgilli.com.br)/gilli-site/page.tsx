import { Metadata } from 'next'
import { headers } from 'next/headers'
import { HeroSection } from './_components/hero-section'
import { HighlightedProperties } from '@/components/highlighted-properties'
import { RecentProperties } from '@/components/recent-properties'
import { ContactSection } from '@/components/contact-section'
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
      <HighlightedProperties agencyId={agencyId} />
      <RecentProperties agencyId={agencyId} />
      <ContactSection />
      <Footer />
    </main>
  )
}
