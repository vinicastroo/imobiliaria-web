import { Metadata } from 'next'
import { headers } from 'next/headers'
import { HeroSection } from './_components/hero-section'
import { HighlightedProperties } from '@/components/highlighted-properties'
import { RecentProperties } from '@/components/recent-properties'
import { ContactSection } from '@/components/contact-section'
import Footer from './_components/footer'

export const metadata: Metadata = {
  title: 'Auros Corretora - Imobiliária em Rio do Sul e Balneário Camboriú',
  description:
    'A Auros Corretora Imobiliária oferece os melhores imóveis à venda em Rio do Sul e Balneário Camboriú. Apartamentos, casas, terrenos e salas comerciais com atendimento personalizado.',
  alternates: {
    canonical: 'https://aurosimobiliaria.com.br',
  },
  openGraph: {
    images: ['https://aurosimobiliaria.com.br/logo.png'],
  },
}

export default async function Home() {
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