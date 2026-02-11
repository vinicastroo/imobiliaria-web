import { Metadata } from 'next'
import { HeroSection } from '@/components/hero-section'
import { RecentProperties } from '@/components/recent-properties'
import { ContactSection } from '@/components/contact-section'
import Footer from '@/components/footer'

export const metadata: Metadata = {
  title: 'Auros Corretora - Imobiliária em Rio do Sul e Balneário Camboriú',
  description:
    'A Auros Corretora Imobiliária oferece os melhores imóveis à venda em Rio do Sul e Balneário Camboriú. Apartamentos, casas, terrenos e salas comerciais com atendimento personalizado.',
  alternates: {
    canonical: 'https://aurosimobiliaria.com.br',
  },
  openGraph: {
    images: ['https://www.aurosimobiliaria.com.br/logo.png'],
  },
}

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <RecentProperties />
      <ContactSection />
      <Footer />
    </main>
  )
}