import Link from 'next/link'
import Image from 'next/image'

import { getTenantVisualConfig } from '@/lib/visual-config'
import { HighlightedPropertiesGrid } from '@/components/highlighted-properties'
import { HeroSearchForm } from '@/components/hero-search-form'
import { SiteFooter } from './site-footer'

interface ClassicTemplateProps {
  agencyId: string
}

export async function ClassicTemplate({ agencyId }: ClassicTemplateProps) {
  const { logoUrl, primaryColor, secondaryColor } = await getTenantVisualConfig()

  return (
    <main className="flex flex-col min-h-screen bg-white">

      {/* ── Header: logo centrado + links ─────────────────────────────────── */}
      <header className="border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          {logoUrl ? (
            <Image src={logoUrl} alt="Logo" width={160} height={56} className="object-contain h-12 w-auto" unoptimized />
          ) : (
            <div className="h-10 w-36 rounded bg-gray-100" />
          )}
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/"        className="hover:text-gray-900 transition-colors">Início</Link>
            <Link href="/imoveis" className="hover:text-gray-900 transition-colors">Imóveis</Link>
          </nav>
        </div>
      </header>

      {/* ── Banner hero ────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
      >
        <p className="text-sm uppercase tracking-widest font-semibold mb-3 text-white/70">
          Bem-vindo à nossa imobiliária
        </p>
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          O imóvel certo<br className="hidden md:block" /> está aqui
        </h1>
        <div className="max-w-3xl mx-auto">
          <HeroSearchForm primaryColor={primaryColor} />
        </div>
      </section>

      {/* ── Highlighted properties ─────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Imóveis em Destaque</h2>
              <p className="text-sm text-gray-500 mt-1">Selecionados especialmente para você</p>
            </div>
            <Link
              href="/imoveis"
              className="text-sm font-semibold border rounded-md px-4 py-2 transition-colors hover:bg-gray-100"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Ver todos
            </Link>
          </div>
          <div className="flex justify-center">
            <HighlightedPropertiesGrid agencyId={agencyId} />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
