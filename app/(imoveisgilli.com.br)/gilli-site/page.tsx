import { Metadata } from 'next'
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

export default function GilliHome() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <HighlightedProperties />
      <RecentProperties />
      <ContactSection />
      <Footer />
    </main>
  )
}
