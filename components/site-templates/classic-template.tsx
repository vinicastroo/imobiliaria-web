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
    <main className="flex min-h-screen flex-col bg-white">
      {/* ── Header: logo centrado + links ─────────────────────────────────── */}
      <header className="border-b border-gray-100 shadow-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Logo"
              width={160}
              height={56}
              className="h-12 w-auto object-contain"
              unoptimized
            />
          ) : (
            <div className="h-10 w-36 rounded bg-gray-100" />
          )}
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="transition-colors hover:text-gray-900">
              Início
            </Link>
            <Link href="/imoveis" className="transition-colors hover:text-gray-900">
              Imóveis
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Banner hero ────────────────────────────────────────────────────── */}
      <section
        className="px-6 py-20 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        }}
      >
        <p className="mb-3 text-sm font-semibold tracking-widest text-white/70 uppercase">
          Bem-vindo à nossa imobiliária
        </p>
        <h1 className="mb-6 text-3xl leading-tight font-bold md:text-5xl">
          O imóvel certo
          <br className="hidden md:block" /> está aqui
        </h1>
        <div className="mx-auto max-w-3xl">
          <HeroSearchForm primaryColor={primaryColor} />
        </div>
      </section>

      {/* ── Highlighted properties ─────────────────────────────────────────── */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Imóveis em Destaque</h2>
              <p className="mt-1 text-sm text-gray-500">Selecionados especialmente para você</p>
            </div>
            <Link
              href="/imoveis"
              className="rounded-md border px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-100"
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
