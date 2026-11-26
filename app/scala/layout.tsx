import type { Metadata } from 'next'
import { ScalaTheme } from '@/components/scala-theme'

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? 'scalamob.com.br'

export const metadata: Metadata = {
  title: 'Scala | Site, imóveis e CRM para imobiliárias',
  description:
    'Site com domínio próprio, gestão de imóveis e CRM num só lugar. A plataforma para imobiliárias e corretores que querem vender mais.',
  metadataBase: new URL(`https://${PLATFORM_DOMAIN}`),
  alternates: { canonical: '/' },
  icons: { icon: '/brand/favicon.svg', apple: '/brand/scala-app-icon.svg' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Scala',
    title: 'Scala | Sua imobiliária em outra escala',
    description: 'Site com domínio próprio, gestão de imóveis e CRM num só lugar.',
  },
  robots: { index: true, follow: true },
}

export default function ScalaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScalaTheme />
      {children}
    </>
  )
}
