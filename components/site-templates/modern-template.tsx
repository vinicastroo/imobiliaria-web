import Link from 'next/link'
import Image from 'next/image'
import { Search } from 'lucide-react'

import { getTenantVisualConfig } from '@/lib/visual-config'
import { HighlightedPropertiesGrid } from '@/components/highlighted-properties'
import { HeroSearchForm } from '@/components/hero-search-form'
import { SiteFooter } from './site-footer'

interface ModernTemplateProps {
  agencyId: string
}

export async function ModernTemplate({ agencyId }: ModernTemplateProps) {
  const { logoUrl, primaryColor } = await getTenantVisualConfig()

  return (
    <main className="flex flex-col min-h-screen">

      {/* ── Hero: full-viewport with overlay ─────────────────────────────── */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
        <div className="absolute inset-0 -z-10 opacity-20"
          style={{ backgroundImage: 'url(/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />

        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-5 md:px-12">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={140} height={48} className="object-contain h-10 w-auto" unoptimized />
          ) : (
            <div className="h-8 w-32 rounded bg-white/20" />
          )}
          <Link
            href="/imoveis"
            className="text-sm text-white/90 hover:text-white transition-colors font-medium"
          >
            Ver imóveis
          </Link>
        </nav>

        {/* Headline + search */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 pb-24 text-center">
          <h1 className="text-white text-3xl md:text-5xl font-light leading-tight max-w-2xl drop-shadow-lg">
            Encontre o imóvel<br className="hidden md:block" /> dos seus sonhos
          </h1>
          <div className="w-full max-w-3xl">
            <HeroSearchForm primaryColor={primaryColor} />
          </div>
        </div>
      </section>

      {/* ── Highlighted properties ────────────────────────────────────────── */}
      <section className="w-full py-16 px-4 bg-zinc-50 flex flex-col items-center gap-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-1">Seleção especial</p>
          <h2 className="text-3xl font-bold text-(--primary-color,#17375F)">Imóveis em Destaque</h2>
        </div>
        <HighlightedPropertiesGrid
          agencyId={agencyId}
          renderCTA={(hasData) =>
            hasData ? (
              <Link
                href="/imoveis"
                className="mt-4 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                <Search size={16} /> Ver todos os imóveis
              </Link>
            ) : null
          }
        />
      </section>

      <SiteFooter />
    </main>
  )
}
