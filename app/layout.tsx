import type { Metadata } from 'next'
import { Montserrat, Sora } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTenantVisualConfig, getGoogleFontsUrl } from '@/lib/visual-config'
import { Providers } from '@/app/providers'
import { Toaster } from 'components/ui/sonner'
import './globals.css'

// Montserrat is the platform base font — loaded statically via next/font.
// It registers --font-montserrat CSS variable; globals.css body rule applies it
// via var(--font-body, var(--font-montserrat, system-ui)).
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

// Sora is the Scala platform font (admin + login, applied by <ScalaTheme />).
// preload: false so tenant public sites don't download it.
const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sora',
  display: 'swap',
  preload: false,
})

// Tenant favicon goes through metadata (not a raw <link>) so the admin and
// login layouts can override it with the Scala icon.
export async function generateMetadata(): Promise<Metadata> {
  const visualConfig = await getTenantVisualConfig()
  const icon = visualConfig.faviconUrl ?? visualConfig.iconUrl

  return {
    title: {
      template: '%s',
      default: 'Portal Imobiliário',
    },
    description: 'Portal imobiliário.',
    ...(icon ? { icons: { icon } } : {}),
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [session, visualConfig] = await Promise.all([
    getServerSession(authOptions),
    getTenantVisualConfig(),
  ])

  const fontLink = getGoogleFontsUrl(visualConfig.fontFamily)

  // CSS custom-property overrides injected before any component styles,
  // so --primary and --secondary are always resolved to the tenant's values.
  const tenantCssOverrides = [
    `--primary: ${visualConfig.primaryColor};`,
    `--secondary: ${visualConfig.secondaryColor};`,
    visualConfig.fontFamily !== 'Montserrat'
      ? `--font-body: '${visualConfig.fontFamily}', sans-serif;`
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    // montserrat.variable registers --font-montserrat without forcing it on body,
    // letting globals.css font-family fallback chain work correctly.
    <html lang="pt-BR" className={`${montserrat.variable} ${sora.variable}`}>
      <head>
        {fontLink && <link rel="preconnect" href="https://fonts.googleapis.com" />}
        {fontLink && (
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        )}
        {fontLink && <link rel="stylesheet" href={fontLink} />}
      </head>
      <body className="antialiased">
        {/* Tenant CSS variable overrides — rendered server-side, no layout shift */}
        {tenantCssOverrides && (
          <style dangerouslySetInnerHTML={{ __html: `:root { ${tenantCssOverrides} }` }} />
        )}

        <Providers session={session}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
