import type { Metadata } from 'next'
import { getTenantVisualConfig } from '@/lib/visual-config'
import type { ReactNode } from 'react'
import { WhatsAppFab } from './_components/whatsapp-fab'

export const metadata: Metadata = {
  title: {
    template: '%s | Imóveis Gilli',
    default: 'Imóveis Gilli - Imobiliária em Aurora e Região',
  },
  description: 'Encontre os melhores imóveis com a Imóveis Gilli. Compra, venda e locação em Aurora e região de Santa Catarina.',
  openGraph: {
    type: 'website',
    siteName: 'Imóveis Gilli',
    images: [{ url: 'https://imoveisgilli.com.br/og-image.png', width: 1200, height: 630, alt: 'Imóveis Gilli' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://imoveisgilli.com.br/og-image.png'],
  },
}

const gilliJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Imóveis Gilli',
  url: 'https://imoveisgilli.com.br',
  email: 'contato@imoveisgilli.com.br',
  telephone: '+55-47-99788-2496',
  identifier: 'CRECI/SC 8982-J',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'SC-350, N° 377',
    addressLocality: 'Aurora',
    addressRegion: 'SC',
    postalCode: '89186-000',
    addressCountry: 'BR',
  },
  sameAs: [
    'https://www.instagram.com/gilli_engenharia_e_imoveis/',
    'https://api.whatsapp.com/send?phone=5547997882496',
  ],
}

export default async function GilliSiteLayout({ children }: { children: ReactNode }) {
  const { primaryColor, secondaryColor } = await getTenantVisualConfig()
  return (
    <div
      style={{
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
      } as React.CSSProperties}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gilliJsonLd) }}
      />
      {children}
      <WhatsAppFab />
    </div>
  )
}
